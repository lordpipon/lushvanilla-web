import { createConnection } from "node:net";
import { resolveSrv } from "node:dns/promises";

import { siteConfig } from "@/lib/site";

/**
 * Minimal implementation of the Minecraft "Server List Ping" protocol
 * (handshake -> status request -> JSON status response) over raw TCP.
 *
 * Works against vanilla Paper/Spigot servers as well as BungeeCord/Velocity
 * proxies, and does not depend on any third-party Minecraft API.
 */

/** `0` marks an unspecified protocol version, which servers accept on ping. */
const UNSPECIFIED_PROTOCOL = -1;

/** A single status packet is never anywhere near this large. */
const MAX_PACKET_BYTES = 4 * 1024 * 1024;

const CONNECT_TIMEOUT_MS = 5_000;
const READ_TIMEOUT_MS = 5_000;

/** How long a successful response is considered fresh. */
const CACHE_TTL_MS = 15_000;

/** How long we will keep serving a stale-but-good response after errors. */
const STALE_MAX_AGE_MS = 5 * 60_000;

export type ServerStatus = {
  host: string;
  port: number;
  /** Players currently connected. */
  online: number;
  /** Server slot capacity. */
  max: number;
  /** Flattened, colour-code-free MOTD. */
  motd: string;
  /** Round-trip time of the ping in milliseconds. */
  latencyMs: number;
  /** ISO timestamp of when this data was collected. */
  queriedAt: string;
  /**
   * `true` when the live ping failed and this is the last known good result
   * being served from cache so the UI can stay honest without going blank.
   */
  stale: boolean;
};

export type StatusResult =
  | { ok: true; data: ServerStatus }
  | { ok: false; error: string };

/* -------------------------------------------------------------------------- */
/*                              VarInt primitives                             */
/* -------------------------------------------------------------------------- */

/** Encode a number as a Minecraft VarInt (LEB128, 7 bits per byte). */
function encodeVarInt(value: number): Buffer {
  let remaining = value >>> 0;
  const bytes: number[] = [];

  do {
    let byte = remaining & 0x7f;
    remaining >>>= 7;
    if (remaining !== 0) byte |= 0x80;
    bytes.push(byte);
  } while (remaining !== 0);

  return Buffer.from(bytes);
}

/** Encode a UTF-8 string as a length-prefixed Minecraft string. */
function encodeString(value: string): Buffer {
  const bytes = Buffer.from(value, "utf8");
  return Buffer.concat([encodeVarInt(bytes.length), bytes]);
}

/**
 * Read a VarInt from the front of `buffer` without consuming it.
 * Returns `null` when the buffer does not yet hold the whole VarInt.
 */
function peekVarInt(buffer: Buffer): { value: number; size: number } | null {
  let value = 0;
  let shift = 0;
  let index = 0;

  while (index < buffer.length) {
    const byte = buffer[index];
    index += 1;
    value |= (byte & 0x7f) << shift;

    if ((byte & 0x80) === 0) return { value, size: index };

    shift += 7;
    if (shift > 35) throw new Error("VarInt is too large");
  }

  return null;
}

/**
 * Attempt to pull a complete status packet out of `buffer`.
 * Returns `null` while more bytes are still needed.
 */
function parseStatusPacket(buffer: Buffer): Record<string, unknown> | null {
  const header = peekVarInt(buffer);
  if (header === null) return null;

  if (header.value < 1 || header.value > MAX_PACKET_BYTES) {
    throw new Error("Status packet has an implausible length");
  }

  const totalLength = header.size + header.value;
  if (buffer.length < totalLength) return null;

  // Packet body: packet id, then a length-prefixed JSON string.
  const body = buffer.subarray(header.size, totalLength);

  const packetId = peekVarInt(body);
  if (packetId === null) throw new Error("Truncated packet id");
  if (packetId.value !== 0x00) {
    throw new Error(`Unexpected packet id 0x${packetId.value.toString(16)}`);
  }

  const rest = body.subarray(packetId.size);
  const stringLength = peekVarInt(rest);
  if (stringLength === null) throw new Error("Truncated payload length");

  const start = stringLength.size;
  const end = start + stringLength.value;
  if (rest.length < end) throw new Error("Truncated payload");

  const json = rest.toString("utf8", start, end);
  return JSON.parse(json) as Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*                              Payload coercion                              */
/* -------------------------------------------------------------------------- */

/**
 * Chat components can be a plain string, a single object, or an array of them.
 * This flattens any of those shapes into plain text.
 */
function flattenMotd(node: unknown): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(flattenMotd).join("");

  if (typeof node === "object") {
    const component = node as { text?: unknown; extra?: unknown; translate?: unknown };
    let out = typeof component.text === "string" ? component.text : "";
    if (Array.isArray(component.extra)) {
      out += component.extra.map(flattenMotd).join("");
    }
    if (out === "" && typeof component.translate === "string") {
      out = component.translate;
    }
    return out;
  }

  return "";
}

/** Strip legacy `§x` formatting codes and tidy up whitespace. */
function cleanMotd(text: string): string {
  return text.replace(/\u00a7[0-9a-fk-or]/gi, "").replace(/\s+/g, " ").trim();
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/* -------------------------------------------------------------------------- */
/*                                  The ping                                   */
/* -------------------------------------------------------------------------- */

/**
 * Perform a single Server List Ping against `host:port`.
 * Rejects with a human readable message on any failure.
 */
function ping(host: string, port: number): Promise<ServerStatus> {
  return new Promise<ServerStatus>((resolve, reject) => {
    const startedAt = Date.now();

    // Packet 0x00 — handshake, next state = 1 (status).
    const handshakePayload = Buffer.concat([
      encodeVarInt(0x00),
      encodeVarInt(UNSPECIFIED_PROTOCOL),
      encodeString(host),
      (() => {
        const portBytes = Buffer.alloc(2);
        portBytes.writeUInt16BE(port, 0);
        return portBytes;
      })(),
      encodeVarInt(1),
    ]);

    const handshake = Buffer.concat([
      encodeVarInt(handshakePayload.length),
      handshakePayload,
    ]);

    // Packet 0x00 — status request (empty body).
    const statusRequest = Buffer.from([0x01, 0x00]);

    let buffer: Buffer = Buffer.alloc(0);
    let settled = false;

    const socket = createConnection({ host, port });

    const finish = (error: Error | null, status?: ServerStatus) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (error) reject(error);
      else resolve(status as ServerStatus);
    };

    const timeout = setTimeout(() => {
      finish(new Error("Timed out waiting for the server to respond"));
    }, READ_TIMEOUT_MS);

    socket.setTimeout(CONNECT_TIMEOUT_MS, () => {
      clearTimeout(timeout);
      finish(new Error("Timed out connecting to the server"));
    });

    socket.on("error", (error: NodeJS.ErrnoException) => {
      clearTimeout(timeout);
      finish(new Error(describeSocketError(error)));
    });

    socket.on("close", () => {
      clearTimeout(timeout);
      finish(new Error("The server closed the connection unexpectedly"));
    });

    socket.on("connect", () => {
      socket.setTimeout(READ_TIMEOUT_MS);
      socket.write(handshake);
      socket.write(statusRequest);
    });

    socket.on("data", (chunk: Buffer) => {
      buffer = buffer.length === 0 ? chunk : Buffer.concat([buffer, chunk]);

      if (buffer.length > MAX_PACKET_BYTES) {
        clearTimeout(timeout);
        finish(new Error("Server sent an oversized status response"));
        return;
      }

      try {
        const payload = parseStatusPacket(buffer);
        if (payload === null) return; // Need more bytes.

        clearTimeout(timeout);

        const players = (payload.players ?? {}) as { online?: unknown; max?: unknown };

        resolve({
          host,
          port,
          online: readNumber(players.online),
          max: readNumber(players.max),
          motd: cleanMotd(flattenMotd(payload.description)),
          latencyMs: Date.now() - startedAt,
          queriedAt: new Date().toISOString(),
          stale: false,
        });
      } catch (error) {
        clearTimeout(timeout);
        finish(
          error instanceof Error ? error : new Error("Could not read the server status"),
        );
      }
    });
  });
}

/** Turn opaque socket errors into something a player can act on. */
function describeSocketError(error: NodeJS.ErrnoException): string {
  switch (error.code) {
    case "ENOTFOUND":
      return "The server address could not be resolved";
    case "ECONNREFUSED":
      return "The server refused the connection — it may be restarting";
    case "EHOSTUNREACH":
    case "ENETUNREACH":
      return "The server is unreachable from the public internet";
    case "ETIMEDOUT":
      return "Timed out connecting to the server";
    default:
      return error.message || "The server status could not be read";
  }
}

/**
 * Minecraft clients resolve `_minecraft._tcp.<host>` first. If the direct
 * address stops working, try whatever the SRV record points at before failing.
 */
async function pingWithSrvFallback(): Promise<ServerStatus> {
  const { host, port } = siteConfig;

  try {
    return await ping(host, port);
  } catch (directError) {
    let target: { name: string; port: number } | null = null;

    try {
      const records = await resolveSrv(`_minecraft._tcp.${host}`);
      if (records.length > 0) {
        const best = records[0];
        target = { name: best.name.replace(/\.$/, ""), port: best.port };
      }
    } catch {
      // No SRV record — nothing else to try.
    }

    if (
      target === null ||
      (target.name === host && target.port === port)
    ) {
      throw directError;
    }

    return ping(target.name, target.port);
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Caching                                   */
/* -------------------------------------------------------------------------- */

type CacheEntry = {
  storedAt: number;
  result: StatusResult;
};

/**
 * Module-level cache. Survives across requests within a single server process
 * so a burst of visitors does not translate into a burst of pings.
 */
let cache: CacheEntry | null = null;

/** Deduplicates concurrent misses so we only ever have one ping in flight. */
let inFlight: Promise<StatusResult> | null = null;

async function query(): Promise<StatusResult> {
  try {
    return { ok: true, data: await pingWithSrvFallback() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get the current server status, cached for {@link CACHE_TTL_MS}.
 *
 * On failure the last known good result is served (marked `stale`) for up to
 * {@link STALE_MAX_AGE_MS}, so the counter degrades gracefully instead of
 * blanking out when the game server hiccups.
 */
export async function getServerStatus(): Promise<StatusResult> {
  const now = Date.now();

  if (cache !== null && now - cache.storedAt < CACHE_TTL_MS) {
    return cache.result;
  }

  if (inFlight === null) {
    inFlight = query().finally(() => {
      inFlight = null;
    });
  }

  const result = await inFlight;

  if (result.ok) {
    cache = { storedAt: now, result };
    return result;
  }

  // The live ping failed. Fall back to a recent good result if we have one.
  if (cache !== null && cache.result.ok && now - cache.storedAt < STALE_MAX_AGE_MS) {
    return {
      ok: true,
      data: { ...cache.result.data, stale: true },
    };
  }

  cache = { storedAt: now, result };
  return result;
}

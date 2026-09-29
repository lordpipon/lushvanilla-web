import type { ServerStatus } from "@/lib/mc-status";

export type { ServerStatus };

/** Shape returned by `GET /api/status`. */
export type StatusResponse =
  | {
      server: {
        host: string;
        port: number;
        address: string;
        discord: string;
      };
      ok: true;
      data: ServerStatus;
    }
  | {
      server: {
        host: string;
        port: number;
        address: string;
        discord: string;
      };
      ok: false;
      error: string;
    };

/** How often the browser re-checks the player count. */
export const POLL_INTERVAL_MS = 15_000;

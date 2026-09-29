"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ServerStatus, StatusResponse } from "@/lib/status-types";
import { POLL_INTERVAL_MS } from "@/lib/status-types";
import { cn } from "@/lib/utils";

type LiveStatusProps = {
  className?: string;
};

type State =
  | { phase: "loading" }
  | { phase: "ready"; status: ServerStatus }
  | { phase: "error"; message: string };

/**
 * Polls `/api/status` and renders the live player count and latency.
 *
 * Renders an intentionally stable placeholder while loading so the hero does
 * not jump once real data arrives.
 */
export function LiveStatus({ className }: LiveStatusProps) {
  const [state, setState] = useState<State>({ phase: "loading" });
  const controller = useRef<AbortController | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    try {
      const response = await fetch("/api/status", {
        signal,
        cache: "no-store",
      });
      const payload = (await response.json()) as StatusResponse;

      if (payload.ok) {
        setState({ phase: "ready", status: payload.data });
      } else {
        setState({ phase: "error", message: payload.error });
      }
    } catch (error) {
      if (signal.aborted) return;
      setState({
        phase: "error",
        message:
          error instanceof Error ? error.message : "Could not reach the server",
      });
    }
  }, []);

  useEffect(() => {
    const run = () => {
      controller.current?.abort();
      const next = new AbortController();
      controller.current = next;
      void load(next.signal);
    };

    run();
    const timer = setInterval(run, POLL_INTERVAL_MS);

    return () => {
      clearInterval(timer);
      controller.current?.abort();
    };
  }, [load]);

  const loading = state.phase === "loading";

  if (state.phase === "error") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm text-destructive",
          className,
        )}
        title={state.message}
      >
        <WifiOff className="size-4 shrink-0" aria-hidden />
        <span className="font-medium">Server status unavailable</span>
      </div>
    );
  }

  const online = loading ? null : state.status.online;
  const max = loading ? null : state.status.max;
  const latency = loading ? null : state.status.latencyMs;
  const stale = !loading && state.status.stale;

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border bg-card/60 px-3 py-1.5 text-sm backdrop-blur",
        stale ? "border-amber-500/40" : "border-border",
        className,
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span className="relative flex size-2" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        {online === null ? (
          <span className="text-muted-foreground">Connecting…</span>
        ) : (
          <span className="font-medium tabular-nums">
            {online}
            <span className="text-muted-foreground"> / {max}</span>
          </span>
        )}
        <span className="sr-only">players online</span>
      </span>

      <span
        className="hidden h-3.5 w-px bg-border sm:block"
        aria-hidden
      />

      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <Wifi className="size-3.5" aria-hidden />
        {latency === null ? (
          <span className="tabular-nums">—</span>
        ) : (
          <span className="tabular-nums">{latency}ms</span>
        )}
        <span className="sr-only">ping latency</span>
      </span>
    </div>
  );
}

/**
 * Standalone online-player figure for the hero, showing the number prominently.
 */
export function LivePlayerCount({ className }: { className?: string }) {
  const [state, setState] = useState<State>({ phase: "loading" });
  const controller = useRef<AbortController | null>(null);

  const load = useCallback(async (signal: AbortSignal) => {
    try {
      const response = await fetch("/api/status", {
        signal,
        cache: "no-store",
      });
      const payload = (await response.json()) as StatusResponse;

      if (payload.ok) {
        setState({ phase: "ready", status: payload.data });
      } else {
        setState({ phase: "error", message: payload.error });
      }
    } catch (error) {
      if (signal.aborted) return;
      setState({
        phase: "error",
        message:
          error instanceof Error ? error.message : "Could not reach the server",
      });
    }
  }, []);

  useEffect(() => {
    const run = () => {
      controller.current?.abort();
      const next = new AbortController();
      controller.current = next;
      void load(next.signal);
    };

    run();
    const timer = setInterval(run, POLL_INTERVAL_MS);

    return () => {
      clearInterval(timer);
      controller.current?.abort();
    };
  }, [load]);

  if (state.phase === "error") {
    return (
      <div className={cn("flex flex-col items-start", className)}>
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <WifiOff className="size-4" aria-hidden />
          Status offline
        </span>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground/80">
          {state.message}
        </p>
      </div>
    );
  }

  if (state.phase === "loading") {
    return (
      <div className={cn("flex flex-col gap-2", className)} aria-hidden>
        <span className="h-12 w-40 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const { online, max, latencyMs, stale } = state.status;
  const fill = max > 0 ? Math.min(100, (online / max) * 100) : 0;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-end gap-3">
        <span className="text-5xl font-semibold leading-none tabular-nums tracking-tight">
          {online}
        </span>
        <span className="pb-1 text-lg text-muted-foreground tabular-nums">
          / {max}
        </span>
        <span className="pb-1.5 ml-1 text-sm text-muted-foreground">
          players online
        </span>
      </div>

      <div
        className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuenow={online}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label="Server capacity in use"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${fill}%` }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="tabular-nums">{latencyMs}ms</span> ping
        {stale ? " · last known reading" : " · updated live"}
      </p>
    </div>
  );
}

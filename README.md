# LushVanilla — Website

Marketing site for the **LushVanilla** Minecraft server, a free-to-play
DonutSMP-style survival network.

| | |
| --- | --- |
| Server address | `lushvanilla.net:27548` |
| Discord | <https://discord.gg/aVAbXWxUHQ> |
| Supported versions | Minecraft Java 1.21 – 26.3 |

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) on Radix primitives
- [lucide-react](https://lucide.dev) icons
- [next-themes](https://github.com/pacocoursey/next-themes) for light / dark / system

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npx tsc --noEmit` | Type check |
| `npm run lint` | Lint (ESint flat config) |

> `next lint` was removed in Next.js 16, so linting runs through the ESLint CLI
> directly.

## Editing content

Almost everything editable lives in `src/content/` and `src/lib/site.ts`.

| What | Where |
| --- | --- |
| Server address, port, Discord, versions | `src/lib/site.ts` |
| Feature list, icons and commands | `src/content/features.ts` |
| Store catalogue | `src/content/store.ts` |
| Rules | `src/content/rules.ts` |

A feature only lists a command when there is one. `Selectable Crates` has no
command because the crates are physical blocks at spawn, so it uses `where:
"At spawn"` instead and the card renders that in place of a command chip.

Store prices are the advertised catalogue. **The in-game shop is the source of
truth** — update `src/content/store.ts` when the real prices change.

## Live player counter

The player count and latency are **real**, not mocked. There is no third-party
Minecraft status API involved.

1. `src/lib/mc-status.ts` speaks the [Minecraft Server List Ping][slp]
   protocol directly over TCP: VarInt handshake → status request → JSON
   response. It reports only the player count, max slots, MOTD and latency.
2. `src/app/api/status/route.ts` exposes that as `GET /api/status`.
3. `src/components/live-status.tsx` polls it every 15 seconds.

Robustness details:

- Results are cached server-side for 15 s, and concurrent misses are
  de-duplicated, so a traffic spike does not turn into a ping flood.
- If the live ping fails, the last known good reading is served for up to
  5 minutes with `stale: true`, and the UI labels it "last known reading"
  instead of silently showing an old number as live.
- If `lushvanilla.net:27548` ever fails, the code falls back to the
  `_minecraft._tcp.lushvanilla.net` SRV record.
- When the game server is genuinely unreachable, the counter renders a clear
  "status unavailable" state rather than a fake number.

The endpoint returns `503` with `ok: false` and an `error` string when there is
no usable reading at all, so a monitor or a health check can tell the
difference between "0 players online" and "we could not reach the server".

[slp]: https://minecraft.wiki/w/Java_Edition_protocol/Packets#Server_List_Ping

**Deployment note:** the route needs the Node.js runtime (it opens a TCP
socket). It is already declared as `export const runtime = "nodejs"`. Do not
move it to the Edge runtime, and make sure the host permits outbound TCP to
port 27548.

## Theming

Light / dark / system is available from the header. The dark theme is the
default.

Colours live as CSS custom properties in `src/app/globals.css`, defined once
per theme under `:root` and `.dark`. The brand hue is the `--brand` variable;
`--glow` drives the emerald light bleeding in behind the hero.

shadcn/ui components are initialised with the neutral base, so change the
values in `:root` / `.dark` rather than expecting green presets.

## Routes

| Route | Notes |
| --- | --- |
| `/` | Landing page with the live player counter |
| `/features` | All 13 features with their commands |
| `/store` | Ranks, keys and cosmetics |
| `/rules` | Server rules |
| `/api/status` | Live status JSON |

Only Home, Features and Rules are in the top navigation. Store is reached from
the homepage and the footer.

There is deliberately no `/crates` page. The crates are physical blocks at
spawn and the site does not publish an invented catalogue of crate names and
drop tables, so crates are described as a feature only.

## Deploying

Deploys anywhere Next.js runs. The one requirement is a **Node.js runtime** for
`/api/status`.

```bash
npm run build
npm run start
```

For a container, use a Node 20.9+ base image. The server list ping opens an
outbound TCP connection, so the platform's firewall must allow port 27548
outbound.

## Notes

- Not affiliated with Mojang Studios or Microsoft.
- `AGENTS.md` / `CLAUDE.md` are managed by `next dev` and point AI agents at
  the version-matched Next.js docs bundled in `node_modules/next/dist/docs/`.
  Do not delete them.

/**
 * Central place for every piece of server/brand configuration used across the
 * site. Change the values here and the whole site follows.
 */
export const siteConfig = {
  name: "LushVanilla",
  tagline: "A free-to-play survival network with real progression.",
  description:
    "LushVanilla is a free-to-play DonutSMP-style Minecraft survival network. " +
    "Crates, auctions, orders, kits, ranks and more — all earned in-game, no pay-to-win required. " +
    "Crates are at spawn.",

  /** Address players type into Minecraft. */
  host: "lushvanilla.net",
  port: 27548,

  /** Public invite link. */
  discord: "https://discord.gg/aVAbXWxUHQ",

  /** Used to build the `minecraft://` deep link that opens the game directly. */
  get address() {
    return `${this.host}:${this.port}`;
  },

  /**
   * The Minecraft versions this server supports, as a range. Shown on the join
   * instructions so players know which client to launch.
   */
  versions: {
    min: "1.21",
    max: "26.3",
  },

  get versionRange() {
    return `${this.versions.min} – ${this.versions.max}`;
  },

  get edition() {
    return `Java ${this.versionRange}`;
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Prefixes the top navigation bar. */
export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/rules", label: "Rules" },
] as const;

/** Every indexable route, including the ones only linked from the home page. */
export const allRoutes = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/store", label: "Store" },
  { href: "/rules", label: "Rules" },
] as const;

export const footerNav = [
  {
    heading: "Server",
    links: allRoutes.filter((item) => item.href !== "/"),
  },
  {
    heading: "Community",
    links: [
      { href: siteConfig.discord, label: "Discord", external: true },
      { href: "/rules", label: "Rules" },
    ],
  },
  {
    heading: "Server address",
    links: [
      { href: "/", label: siteConfig.host, copy: siteConfig.address },
      { href: "/", label: `Port ${siteConfig.port}` },
      { href: "/", label: siteConfig.edition },
    ],
  },
] as const;

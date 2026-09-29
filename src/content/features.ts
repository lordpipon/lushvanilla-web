import {
  Anvil,
  ChartNoAxesColumn,
  ClipboardList,
  Coins,
  Compass,
  Gift,
  Gavel,
  MessageSquare,
  Navigation,
  PackageOpen,
  ShoppingCart,
  Tag,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  name: string;
  icon: LucideIcon;
  /** The in-game command that drives the feature, when there is one. */
  command?: string;
  /** Where to find it in-game, for features you walk to instead of typing. */
  where?: string;
  summary: string;
  detail: string;
};

export const features: Feature[] = [
  {
    name: "Teleport Requests",
    icon: Compass,
    command: "/tpa",
    summary: "Ask a friend to bring you to them.",
    detail:
      "Send a teleport request to anyone online. They get a prompt to accept, and you can set a warmup so nobody can yank you mid-fight.",
  },
  {
    name: "Random Teleport",
    icon: Navigation,
    command: "/rtp",
    summary: "Jump somewhere you have never been.",
    detail:
      "Teleport out to a random unexplored part of the world. Handy for finding untouched terrain, rare biomes, and a base away from everyone else.",
  },
  {
    name: "Player Shop",
    icon: ShoppingCart,
    command: "/shop",
    summary: "Buy and sell with in-game money.",
    detail:
      "A rotating shop stocked with blocks, tools, food and farming supplies. Prices are fixed, stock refreshes on a timer, and everything is paid for with money you earn in-game.",
  },
  {
    name: "Player Auctions",
    icon: Gavel,
    command: "/ah",
    summary: "List items for other players to buy.",
    detail:
      "List anything you are holding on the auction house, set your own price and duration, and let the rest of the network bid for it.",
  },
  {
    name: "Player Orders",
    icon: ClipboardList,
    command: "/order",
    summary: "Commission items you cannot find yourself.",
    detail:
      "Post a request for materials you need, name your reward, and let other players deliver. Great for that one biome you have been hunting for.",
  },
  {
    name: "Free Kits",
    icon: Gift,
    command: "/kit",
    summary: "Free gear to get you started.",
    detail:
      "Claim a starter kit when you first join, then come back for free daily kits. No purchase needed to play at full speed.",
  },
  {
    name: "Selectable Crates",
    icon: PackageOpen,
    where: "At spawn",
    summary: "You choose the crate. Free-to-play keys included.",
    detail:
      "Head to the crates at spawn and open the one you actually want — there is no mystery box involved. Free-to-play keys are handed out regularly, and every crate lists its full contents.",
  },
  {
    name: "Points",
    icon: Coins,
    command: "/points",
    summary: "Earn points on top of your money.",
    detail:
      "Points are a second currency earned from play, events and votes. Spend them on cosmetics, crate keys and upgrades without touching real money.",
  },
  {
    name: "Money",
    icon: MessageSquare,
    command: "/balance",
    summary: "A full in-game economy.",
    detail:
      "Earn money from selling, orders, events and crate drops, then spend it in the shop and on the auction house. Deep pockets should mean something.",
  },
  {
    name: "Stats",
    icon: ChartNoAxesColumn,
    command: "/stats",
    summary: "Your whole career, tracked.",
    detail:
      "Blocks mined, mobs killed, distance travelled, crates opened, playtime and more — all viewable any time and compared against other players.",
  },
  {
    name: "Tags",
    icon: Tag,
    command: "/tags",
    summary: "A prefix that says who you are.",
    detail:
      "Earn tags from ranks, crates and events, then show the ones you like in front of your name in chat and on the tab list.",
  },
  {
    name: "Chat Colours",
    icon: MessageSquare,
    command: "/color",
    summary: "Make chat look like yours.",
    detail:
      "Unlock colours and formatting for your name and messages. Cosmetic only — it changes how you look, never what you can do.",
  },
  {
    name: "Spawners",
    icon: Anvil,
    command: "/spawners",
    summary: "Own your spawners.",
    detail:
      "Place, upgrade and collect from mob spawners you own. Better spawners drop more and rarer loot, and sell the drops for money.",
  },
];

/** Highlighted on the homepage. Keep this list short. */
export const featuredFeatureNames = [
  "Selectable Crates",
  "Player Shop",
  "Teleport Requests",
  "Player Orders",
  "Free Kits",
  "Player Auctions",
] as const;

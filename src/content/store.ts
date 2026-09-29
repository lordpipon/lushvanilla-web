export type StoreItem = {
  name: string;
  price: string;
  /** Short note on how it is obtained. */
  note: string;
  perks: string[];
  /** Highlights the top recommendation. */
  featured?: boolean;
};

export type StoreGroup = {
  title: string;
  description: string;
  items: StoreItem[];
};

/**
 * Store catalogue.
 *
 * These are the advertised packages only — the in-game shop is the source of
 * truth for exact prices, and anything here can be changed without touching
 * any component code.
 */
export const storeGroups: StoreGroup[] = [
  {
    title: "Ranks",
    description:
      "Permanent perks attached to your account. Ranks are cosmetic and QoL — they never sell raw combat power.",
    items: [
      {
        name: "VIP",
        price: "Free",
        note: "Earned in-game, no purchase required.",
        perks: [
          "VIP tag in chat",
          "1 home / 3 homes",
          "Extra daily kit claim",
          "Join and leave messages",
        ],
      },
      {
        name: "Premium",
        price: "$4.99",
        note: "One-time purchase.",
        perks: [
          "Everything in VIP",
          "Premium tag with colour",
          "5 homes",
          "/nick and /capslock support",
          "Priority crate rolls",
        ],
        featured: true,
      },
      {
        name: "Elite",
        price: "$9.99",
        note: "One-time purchase.",
        perks: [
          "Everything in Premium",
          "Elite tag with animated colour",
          "10 homes",
          "Custom join messages",
          "Extra crate key every day",
        ],
      },
    ],
  },
  {
    title: "Crate keys",
    description:
      "Bought keys for the selectable crates. Free keys are handed out regularly, so this is a shortcut rather than a requirement.",
    items: [
      {
        name: "Starter Key",
        price: "Free",
        note: "Available to every player daily.",
        perks: ["One Starter Crate key per day"],
      },
      {
        name: "Explorer Key",
        price: "Free",
        note: "Earned through exploration streaks.",
        perks: ["One Explorer Crate key per streak milestone"],
      },
      {
        name: "Miner Key",
        price: "Free",
        note: "Drops from mining milestones.",
        perks: ["One Miner Crate key per milestone"],
      },
      {
        name: "Bulk Key Pack",
        price: "$2.99",
        note: "Ten keys, any single crate type.",
        perks: [
          "10 keys of your chosen crate",
          "Bonus Lucky Crate key",
        ],
      },
    ],
  },
  {
    title: "Cosmetics",
    description:
      "Purely visual items. They change how you look and nothing else.",
    items: [
      {
        name: "Chat Colours",
        price: "Points",
        note: "Bought with in-game points.",
        perks: ["Full colour palette", "Formatting options", "Per-channel colours"],
      },
      {
        name: "Tag Bundle",
        price: "Points",
        note: "Bought with in-game points.",
        perks: ["Prefix shown in chat", "Tab list colour", "Animated variants"],
      },
      {
        name: "Particle Trails",
        price: "Points",
        note: "Bought with in-game points.",
        perks: ["Trail styles for walking", "Join and leave effects"],
      },
    ],
  },
];

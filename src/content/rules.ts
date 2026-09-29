export type RuleGroup = {
  title: string;
  description: string;
  rules: string[];
};

export const ruleGroups: RuleGroup[] = [
  {
    title: "Gameplay & client",
    description: "What you run, and what you do with it, in game.",
    rules: [
      "No hack clients",
      "No movement mods",
      "No inventory mods",
      "No minimap",
      "No freecam (fair play allowed)",
      "No auto place",
      "No easy place",
      "No macros or scripts",
      "No bug abusing",
      "No duping",
      "No real money trading",
      "No cross-server trading",
      "No use of seed",
      "No crafting modifications",
      "No external gambling",
      "Max. 20 AFK accounts per player",
      "No ban evasion",
      "VPNs are used at your own risk",
      "No refunds for hacked accounts, you are responsible for it",
      "Items dropped at spawn are your own risk - no refunds",
    ],
  },
  {
    title: "Chat & conduct",
    description: "How you treat everyone else on the server.",
    rules: [
      "No spamming",
      "No harassment",
      "No advertising (unless it is about this server)",
      "No discrimination or hate speech",
      "No death threats",
      "No doxing (sharing private info)",
      "No impersonation",
      "No ban evasion",
      "Do not lie to staff members",
      "No mute evading",
      "Report all bugs and cheaters",
    ],
  },
];

export const appeals = {
  title: "Banned? Appeal here",
  body: "Ban appeals are handled in Discord, not in game. Include your username and the reason you were given, and someone will take a look.",
  action: "Open Discord",
} as const;

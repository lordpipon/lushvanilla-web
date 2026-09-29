import type { Metadata } from "next";
import { MessageSquareWarning, ShieldCheck } from "lucide-react";

import { DiscordButton } from "@/components/join-buttons";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { Card } from "@/components/ui/card";
import { appeals, ruleGroups } from "@/content/rules";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "The LushVanilla rules: allowed and banned clients and modifications, trading, AFK limits, and the chat and conduct rules every player has to follow.",
};

export default function RulesPage() {
  return (
    <>
      <PageHero
        eyebrow="Rules"
        title="The rules"
        description="Short and to the point. Read them once and you will never have to think about them again."
        showActions={false}
      />

      <Section spacing="tight">
        <div className="grid gap-4 lg:grid-cols-2">
          {ruleGroups.map((group) => (
            <Card
              key={group.title}
              className="gap-0 border-border/70 bg-card/50 py-6"
            >
              <div className="space-y-5 px-6">
                <div className="space-y-1">
                  <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                    <MessageSquareWarning
                      className="size-4 text-primary"
                      aria-hidden
                    />
                    {group.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {group.description}
                  </p>
                </div>

                <ul className="space-y-2">
                  {group.rules.map((rule) => (
                    <li
                      key={rule}
                      className="flex items-start gap-2.5 text-sm text-foreground/90"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Appeals */}
      <Section spacing="tight" className="border-t border-border/70 bg-muted/30">
        <Card className="gap-0 border-primary/25 bg-card/60 py-6">
          <div className="flex flex-col items-start gap-5 px-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4 text-primary" aria-hidden />
                {appeals.title}
              </h2>
              <p className="text-sm text-muted-foreground">{appeals.body}</p>
            </div>

            <DiscordButton className="shrink-0">{appeals.action}</DiscordButton>
          </div>
        </Card>
      </Section>
    </>
  );
}

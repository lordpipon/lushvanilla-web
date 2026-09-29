import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";

import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { storeGroups } from "@/content/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Ranks, crate keys and cosmetics on LushVanilla. Ranks are permanent perks, keys are optional shortcuts, and cosmetics never affect gameplay.",
};

export default function StorePage() {
  return (
    <>
      <PageHero
        eyebrow="Store"
        title="Ranks, keys and cosmetics"
        description="Everything sold on LushVanilla in one place. Ranks give permanent perks, keys shorten the crate grind, and cosmetics are purely visual. Nothing here sells combat power."
      />

      {storeGroups.map((group) => (
        <Section key={group.title} spacing="tight">
          <div className="space-y-10">
            <SectionHeading
              align="left"
              eyebrow={group.title}
              title={group.title}
              description={group.description}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Card
                  key={item.name}
                  className={cn(
                    "relative gap-0 overflow-hidden border-border/70 bg-card/50 py-6",
                    item.featured
                      ? "border-primary/40 ring-1 ring-primary/20"
                      : "hover:border-primary/30",
                  )}
                >
                  {item.featured ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/15 to-transparent"
                      aria-hidden
                    />
                  ) : null}

                  <div className="relative flex h-full flex-col space-y-5 px-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {item.name}
                      </h3>

                      <span className="inline-flex items-center gap-1.5">
                        {item.featured ? (
                          <Badge className="gap-1">
                            <Sparkles className="size-3" aria-hidden />
                            Popular
                          </Badge>
                        ) : null}
                        <span className="text-sm font-semibold tabular-nums text-primary">
                          {item.price}
                        </span>
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">{item.note}</p>

                    <ul className="flex-1 space-y-2">
                      {item.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 text-sm">
                          <Check
                            className="mt-0.5 size-3.5 shrink-0 text-primary"
                            aria-hidden
                          />
                          <span className="text-muted-foreground">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      ))}

      <Section spacing="tight" className="border-t border-border/70">
        <Card className="gap-0 border-border/70 bg-muted/40 py-6">
          <div className="space-y-2 px-6">
            <h2 className="text-sm font-semibold">A note on pricing</h2>
            <p className="text-sm text-muted-foreground">
              Prices and rewards can change and may differ by region or
              promotion. The in-game shop is always the source of truth. Every
              rank and crate on this page can also be earned for free through
              normal play.
            </p>
          </div>
        </Card>
      </Section>
    </>
  );
}

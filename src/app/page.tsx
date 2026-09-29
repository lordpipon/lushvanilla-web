import { Sparkles } from "lucide-react";
import Link from "next/link";

import { FeatureGridWithLink } from "@/components/feature-card";
import { DiscordButton, ServerAddress } from "@/components/join-buttons";
import { LivePlayerCount, LiveStatus } from "@/components/live-status";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { features } from "@/content/features";
import { siteConfig } from "@/lib/site";

/** `minecraft://` deep link that asks the launcher to add/join the server. */
const joinDeepLink = `minecraft://?addExternalServer=${encodeURIComponent(
  siteConfig.name,
)}|${encodeURIComponent(siteConfig.address)}`;

const pillars = [
  {
    title: "Free to play, properly",
    body: "Crates, kits and ranks are all earnable in-game. Spending money is a shortcut, never a requirement.",
  },
  {
    title: "A real economy",
    body: "Money, points, shops, auctions and player orders mean what you collect actually matters to other people.",
  },
  {
    title: "No pay-to-win",
    body: "Ranks and crates hand out cosmetics, QoL and tags. Combat power comes from playing, not paying.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative isolate overflow-hidden">
        <div className="cave-glow absolute inset-0 -z-10" aria-hidden />
        <div className="cave-grid absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" aria-hidden />

        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-7">
              <LiveStatus className="w-fit" />

              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Survival with{" "}
                  <span className="text-primary">something to grind for</span>
                </h1>

                <p className="text-balance max-w-xl text-lg text-muted-foreground">
                  {siteConfig.name} is a free-to-play survival network built
                  around crates, auctions, orders and a working player economy.
                  Play for free, or buy a shortcut if you would rather not wait.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-11 px-6">
                  <a href={joinDeepLink}>Join the Server</a>
                </Button>

                <DiscordButton size="lg" className="h-11 px-6" />

                <ServerAddress className="h-11" />
              </div>

              <p className="text-sm text-muted-foreground">
                Minecraft Java {siteConfig.versionRange}
              </p>
            </div>

            {/* Live player count */}
            <Card className="gap-0 border-primary/20 bg-card/60 p-6 backdrop-blur-sm sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Players online
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                  Live
                </span>
              </div>

              <LivePlayerCount className="mt-5" />

              <div className="mt-6 border-t border-border/70 pt-5">
                <p className="text-xs text-muted-foreground">
                  Live readings straight from {siteConfig.host}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ------------------------------ Pillars ----------------------------- */}
      <Section spacing="tight" className="border-y border-border/70 bg-muted/30">
        <div className="grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-primary" aria-hidden />
                {pillar.title}
              </h3>
              <p className="text-sm text-muted-foreground">{pillar.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------ Features ---------------------------- */}
      <Section id="features">
        <div className="space-y-12">
          <SectionHeading
            eyebrow="Features"
            title="Everything a survival network should have"
            description={`All ${features.length} of them, on one server and one economy. Dig, trade, auction and level up without ever setting foot off LushVanilla.`}
          />

          <FeatureGridWithLink />
        </div>
      </Section>

      {/* ------------------------------- Crates ----------------------------- */}
      <Section className="border-y border-border/70 bg-muted/30">
        <div className="space-y-12">
          <SectionHeading
            eyebrow="Selectable crates"
            title="You pick the crate. Not the mystery box."
            description="Head over to the crates at spawn and open exactly the one you want. Free keys are handed out regularly, and every crate's contents are listed in-game."
          />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/store">Ranks, keys and cosmetics</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* -------------------------------- CTA ------------------------------- */}
      <Section>
        <Card className="relative overflow-hidden border-primary/25 bg-gradient-to-b from-primary/10 to-transparent">
          <div className="relative flex flex-col items-center gap-6 py-4 text-center">
            <div className="space-y-3">
              <h2 className="text-balance text-3xl font-semibold tracking-tight">
                The server is open
              </h2>
              <p className="text-balance max-w-lg text-muted-foreground">
                Copy the address, launch Minecraft, and you are in. Claim a free
                starter kit with <code className="font-mono text-xs">/kit</code>{" "}
                when you arrive.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-11 px-6">
                <a href={joinDeepLink}>Join {siteConfig.name}</a>
              </Button>
              <DiscordButton size="lg" className="h-11 px-6" />
            </div>

            <ServerAddress className="h-11" />
          </div>
        </Card>
      </Section>
    </>
  );
}

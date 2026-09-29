import type { Metadata } from "next";

import { FeatureCard } from "@/components/feature-card";
import { PageHero } from "@/components/page-hero";
import { Section, SectionHeading } from "@/components/section";
import { features } from "@/content/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Every system running on LushVanilla: teleport requests, random teleport, shops, auctions, orders, free kits, selectable crates, points, money, stats, tags, chat colours and spawners.",
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything running on the server"
        description={`All ${features.length} systems share one economy and one account. Pick any feature to see what it does and the command that drives it.`}
      />

      <Section>
        <div className="space-y-12">
          <SectionHeading
            align="left"
            title="All features"
            description="Every one of these is available to every player from the moment they join."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.name} feature={feature} detailed />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

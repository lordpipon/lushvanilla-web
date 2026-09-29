import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { featuredFeatureNames, features } from "@/content/features";
import { cn } from "@/lib/utils";

export function FeatureCard({
  feature,
  className,
  detailed = false,
}: {
  feature: (typeof features)[number];
  className?: string;
  /** Also render the longer description — used on the full features page. */
  detailed?: boolean;
}) {
  const Icon = feature.icon;

  return (
    <Card
      className={cn(
        "group gap-0 border-border/70 bg-card/50 py-6 transition-colors hover:border-primary/40 hover:bg-card",
        className,
      )}
    >
      <div className="flex items-start gap-4 px-6">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="size-5" aria-hidden />
        </span>

        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="text-base font-semibold tracking-tight">
            {feature.name}
          </h3>
          <p className="text-sm text-muted-foreground">{feature.summary}</p>
        </div>
      </div>

      {detailed ? (
        <p className="mt-4 px-6 text-sm text-muted-foreground">
          {feature.detail}
        </p>
      ) : null}

      {feature.command || feature.where ? (
        <div className="mt-5 px-6">
          {feature.command ? (
            <code className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
              {feature.command}
            </code>
          ) : (
            <span className="inline-block rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {feature.where}
            </span>
          )}
        </div>
      ) : null}
    </Card>
  );
}

export function FeatureGrid({
  limit,
  className,
}: {
  limit?: number;
  className?: string;
}) {
  const list =
    limit === undefined
      ? features
      : featuredFeatureNames
          .map((name) => features.find((feature) => feature.name === name))
          .filter((feature): feature is (typeof features)[number] => Boolean(feature));

  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {list.map((feature) => (
        <FeatureCard key={feature.name} feature={feature} />
      ))}
    </div>
  );
}

/** Compact grid used on the homepage, with a link through to the full list. */
export function FeatureGridWithLink() {
  return (
    <div className="space-y-8">
      <FeatureGrid limit={featuredFeatureNames.length} />

      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/features">
            See all {features.length} features
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </div>
  );
}

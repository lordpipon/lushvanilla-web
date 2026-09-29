import { DiscordButton, ServerAddress } from "@/components/join-buttons";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  /** Show the copy-IP and Discord buttons under the description. */
  showActions?: boolean;
};

const joinDeepLink = `minecraft://?addExternalServer=${encodeURIComponent(
  siteConfig.name,
)}|${encodeURIComponent(siteConfig.address)}`;

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  showActions = true,
}: PageHeroProps) {
  return (
    <section
      className={cn("relative isolate overflow-hidden border-b border-border/70", className)}
    >
      <div className="cave-glow absolute inset-0 -z-10" aria-hidden />
      <div
        className="cave-grid absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </span>

        <h1 className="text-balance mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>

        <p className="text-balance mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>

        {showActions ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ServerAddress className="h-11" />
            <DiscordButton size="lg" className="h-11 px-6" />
            <a
              href={joinDeepLink}
              className="sr-only focus:not-sr-only focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              Join the server
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

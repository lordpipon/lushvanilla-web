import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Discord's brand colour, kept as an explicit class because it has no
 * Tailwind equivalent.
 */
const DISCORD_CLASS =
  "bg-[#5865F2] text-white hover:bg-[#4752c4] dark:bg-[#5865F2] dark:hover:bg-[#4752c4]";

type DiscordButtonProps = {
  className?: string;
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
};

export function DiscordButton({
  className,
  size = "default",
  children,
}: DiscordButtonProps) {
  return (
    <Button asChild size={size} className={cn(DISCORD_CLASS, className)}>
      <a href={siteConfig.discord} target="_blank" rel="noreferrer noopener">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className="size-4"
        >
          <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.644-1.873.891a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
        </svg>
        {children ?? "Join Discord"}
      </a>
    </Button>
  );
}

type ServerAddressProps = {
  className?: string;
  /** Copy button styling, e.g. `variant="outline"`. */
  buttonClassName?: string;
  showPort?: boolean;
};

/**
 * The canonical "here is the address, copy it" block used on every page.
 */
export function ServerAddress({
  className,
  buttonClassName,
  showPort = true,
}: ServerAddressProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-card/70 p-1 pl-4 backdrop-blur",
        className,
      )}
    >
      <span className="font-mono text-sm font-medium tracking-tight sm:text-base">
        {siteConfig.host}
        {showPort ? (
          <span className="text-muted-foreground">:{siteConfig.port}</span>
        ) : null}
      </span>
      <CopyButton
        value={siteConfig.address}
        label={`Copy server address ${siteConfig.address}`}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
          buttonClassName,
        )}
      />
      <span className="sr-only" aria-live="polite">
        {siteConfig.address} copied
      </span>
    </div>
  );
}

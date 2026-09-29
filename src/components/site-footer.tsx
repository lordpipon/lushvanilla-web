import Link from "next/link";

import { DiscordButton } from "@/components/join-buttons";
import { Logo, Wordmark } from "@/components/logo";
import { CopyButton } from "@/components/copy-button";
import { footerNav, siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/70 bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Logo />
              <Wordmark />
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
            <DiscordButton size="sm" />
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <h2 className="text-sm font-semibold">{group.heading}</h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => {
                  const href = "external" in link && link.external ? link.href : link.href;
                  const isExternal = "external" in link && link.external;
                  const copyValue = "copy" in link ? link.copy : undefined;

                  return (
                    <li key={link.label}>
                      {copyValue ? (
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <span className="font-mono">{link.label}</span>
                          <CopyButton
                            value={copyValue}
                            label={`Copy ${copyValue}`}
                            className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                          />
                        </span>
                      ) : isExternal ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {siteConfig.name}. Not affiliated with Mojang or
            Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}

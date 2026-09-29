import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** Constrain the inner width. */
  width?: "default" | "narrow" | "wide";
  /** Add the page-wide vertical rhythm. */
  spacing?: "default" | "tight" | "loose";
};

const widths = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  wide: "max-w-7xl",
} as const;

const spacings = {
  tight: "py-12 sm:py-16",
  default: "py-16 sm:py-24",
  loose: "py-20 sm:py-28",
} as const;

export function Section({
  id,
  className,
  children,
  width = "default",
  spacing = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("px-4 sm:px-6", spacings[spacing], className)}
    >
      <div className={cn("mx-auto w-full", widths[width])}>{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  /** Small pill above the title, e.g. `Features`. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  /** `center` for standalone pages, `left` for in-page sections. */
  align?: "center" | "left";
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "center",
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase">
          {eyebrow}
        </span>
      ) : null}

      <h2
        id={id}
        className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "text-balance text-base text-muted-foreground",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

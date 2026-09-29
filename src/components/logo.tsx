import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The LushVanilla mark. Sourced from `public/lushvanilla.png` with the
 * transparent padding trimmed, so the artwork fills the box.
 *
 * The mark has a black outline, so it reads best on the light surface of the
 * header rather than on a dark background.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/lushvanilla.png"
      alt=""
      width={256}
      height={145}
      className={cn("h-auto w-10 shrink-0", className)}
      preload
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-base font-semibold tracking-tight", className)}>
      Lush<span className="text-primary">Vanilla</span>
    </span>
  );
}

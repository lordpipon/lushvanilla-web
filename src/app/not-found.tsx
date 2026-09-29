import Link from "next/link";

import { DiscordButton, ServerAddress } from "@/components/join-buttons";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:px-6">
      <p className="font-mono text-sm tracking-widest text-muted-foreground">
        404
      </p>

      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        This cave does not exist
      </h1>

      <p className="text-balance max-w-md text-muted-foreground">
        The page you were looking for is not here. The server still is.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Back to the homepage</Link>
        </Button>
        <DiscordButton size="lg" />
        <ServerAddress className="h-11" />
      </div>
    </div>
  );
}

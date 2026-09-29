"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Clipboard helper that degrades gracefully.
 *
 * `navigator.clipboard` is only available in secure contexts, so on plain
 * `http://` (or a LAN IP) we fall back to a hidden textarea + execCommand.
 */
async function writeToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const succeeded = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
}

type CopyButtonProps = {
  /** The text placed on the clipboard. */
  value: string;
  className?: string;
  /** Accessible label, e.g. `Copy server address`. */
  label: string;
  children?: React.ReactNode;
  onCopied?: (value: string) => void;
};

/** A button that copies `value` and briefly confirms it did. */
export function CopyButton({
  value,
  className,
  label,
  children,
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const succeeded = await writeToClipboard(value);
    if (!succeeded) return;

    setCopied(true);
    onCopied?.(value);

    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 2000);
  }, [onCopied, value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={label}
      className={className}
    >
      {children}
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} — copied` : ""}
      </span>
      {copied ? (
        <Check className="size-4 text-primary" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </button>
  );
}

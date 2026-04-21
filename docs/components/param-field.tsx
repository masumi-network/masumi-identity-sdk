import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Mintlify-style `<ParamField>` for documenting function / method parameters.
 *
 * Accepts any of Mintlify's three label conventions — `name`, `path`, or
 * `body` — so MDX authored against the Mintlify ParamField spec renders
 * correctly without rewriting every call site.
 *
 * Usage:
 *   <ParamField name="endpoints" type="MasumiIdentityEndpoints" required>
 *     Credential-server + KERIA URLs.
 *   </ParamField>
 */
export function ParamField({
  name,
  path,
  body,
  query,
  header,
  type,
  required,
  default: defaultValue,
  children,
  className,
}: {
  name?: string;
  path?: string;
  body?: string;
  query?: string;
  header?: string;
  type?: string;
  required?: boolean;
  default?: string;
  children: ReactNode;
  className?: string;
}) {
  const label = name ?? path ?? body ?? query ?? header ?? "";
  return (
    <div
      className={cn(
        "my-3 rounded-md border border-fd-border bg-fd-card/50 p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-2 mb-2">
        <code className="text-sm font-semibold text-fd-foreground">{label}</code>
        {type && (
          <code className="text-xs text-fd-muted-foreground">{type}</code>
        )}
        {required && (
          <span className="rounded-sm bg-fd-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fd-primary">
            required
          </span>
        )}
        {defaultValue && (
          <code className="text-xs text-fd-muted-foreground">
            default: {defaultValue}
          </code>
        )}
      </div>
      <div className="text-sm text-fd-muted-foreground prose-sm [&_p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

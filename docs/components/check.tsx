import type { ReactNode } from "react";
import { CheckIcon } from "lucide-react";

/** Checkmark list item for requirements / verified items. */
export function Check({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 my-1">
      <CheckIcon
        className="mt-0.5 size-4 shrink-0 text-green-600 dark:text-green-500"
        aria-hidden
      />
      <span>{children}</span>
    </div>
  );
}

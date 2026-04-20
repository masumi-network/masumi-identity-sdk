import React from "react";
import clsx from "clsx";

/**
 * Grid wrapper for <Card /> elements. Mirrors Mintlify's <CardGroup cols={N}>
 * so we can keep authored MDX mostly unchanged.
 */
export function Cards({
  cols = 2,
  children,
}: {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}): React.ReactElement {
  return <div className={clsx("m-cards", `m-cards--cols-${cols}`)}>{children}</div>;
}

export default Cards;

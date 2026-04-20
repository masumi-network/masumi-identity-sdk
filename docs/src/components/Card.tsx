import React from "react";
import Link from "@docusaurus/Link";

export function Card({
  title,
  href,
  children,
}: {
  title: string;
  /** Icon name preserved for API-compat with the Mintlify source, but not rendered. */
  icon?: string;
  href?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const body = (
    <>
      <div className="m-card__title">{title}</div>
      {children ? <div className="m-card__description">{children}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link to={href} className="m-card">
        {body}
      </Link>
    );
  }
  return <div className="m-card">{body}</div>;
}

export default Card;

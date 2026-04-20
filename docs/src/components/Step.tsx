import React from "react";

export function Step({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <li className="m-step">
      <div className="m-step__title">{title}</div>
      {children}
    </li>
  );
}

export default Step;

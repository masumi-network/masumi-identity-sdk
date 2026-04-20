import React from "react";

export function Check({ children }: { children?: React.ReactNode }): React.ReactElement {
  return <div className="m-check">{children}</div>;
}

export default Check;

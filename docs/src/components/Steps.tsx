import React from "react";

export function Steps({ children }: { children: React.ReactNode }): React.ReactElement {
  return <ol className="m-steps">{children}</ol>;
}

export default Steps;

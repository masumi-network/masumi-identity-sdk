import React from "react";

/**
 * Renders an API parameter row with name, type, required badge, default, and
 * description. Accepts either `body` or `path` as the parameter name, matching
 * Mintlify's API, so migrated MDX keeps working.
 */
export function ParamField({
  body,
  path,
  type,
  required,
  default: defaultValue,
  children,
}: {
  body?: string;
  path?: string;
  type?: string;
  required?: boolean;
  default?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const name = body ?? path ?? "";
  return (
    <div className="m-param">
      <div className="m-param__header">
        {name ? <span className="m-param__name">{name}</span> : null}
        {type ? <span className="m-param__type">{type}</span> : null}
        {required ? <span className="m-param__required">required</span> : null}
        {defaultValue !== undefined ? (
          <span className="m-param__default">default: {defaultValue}</span>
        ) : null}
      </div>
      {children ? <div className="m-param__description">{children}</div> : null}
    </div>
  );
}

export default ParamField;

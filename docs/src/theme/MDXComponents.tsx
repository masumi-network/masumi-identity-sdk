import React from "react";
import MDXComponents from "@theme-original/MDXComponents";
import Admonition from "@theme/Admonition";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

import { Cards } from "@site/src/components/Cards";
import { Card } from "@site/src/components/Card";
import { Steps } from "@site/src/components/Steps";
import { Step } from "@site/src/components/Step";
import { ParamField } from "@site/src/components/ParamField";
import { Check } from "@site/src/components/Check";

/**
 * Map the Mintlify-flavored component set the MDX was authored against onto
 * Docusaurus / custom components, so the migrated content renders unchanged.
 *
 * Naming stays 1:1 with Mintlify:
 *   <CardGroup> / <Card>                    → custom grid + link card
 *   <Steps> / <Step>                        → custom numbered list
 *   <Note> / <Warning> / <Tip>              → Docusaurus <Admonition>
 *   <Check>                                 → custom checkmark row
 *   <Tabs> / <Tab>                          → Docusaurus <Tabs> / <TabItem>
 *                                             (Tab props `title` → label)
 *   <Tooltip>                               → pass-through
 *   <ParamField>                            → custom parameter row
 */

const Note = ({ children }: { children?: React.ReactNode }) => (
  <Admonition type="note">{children}</Admonition>
);
const Warning = ({ children }: { children?: React.ReactNode }) => (
  <Admonition type="warning">{children}</Admonition>
);
const Tip = ({ children }: { children?: React.ReactNode }) => (
  <Admonition type="tip">{children}</Admonition>
);
const Info = ({ children }: { children?: React.ReactNode }) => (
  <Admonition type="info">{children}</Admonition>
);

const Tooltip = ({ children }: { tip?: string; children?: React.ReactNode }) => (
  <>{children}</>
);

// Mintlify's <Tab title="X">  ⇔  Docusaurus <TabItem value="x" label="X">
const Tab = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => (
  <TabItem value={title.toLowerCase().replace(/\s+/g, "-")} label={title}>
    {children}
  </TabItem>
);

export default {
  ...MDXComponents,
  CardGroup: Cards,
  Cards,
  Card,
  Steps,
  Step,
  Note,
  Warning,
  Tip,
  Info,
  Check,
  Tooltip,
  Tabs,
  TabItem,
  Tab,
  ParamField,
};

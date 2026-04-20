import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: ["introduction", "quickstart", "concepts"],
    },
    {
      type: "category",
      label: "Tutorials",
      collapsed: false,
      items: [
        "tutorials/link-agent-to-aid",
        "tutorials/verify-vc-a2a",
      ],
    },
    {
      type: "category",
      label: "Examples",
      collapsed: false,
      items: ["examples/template-agent"],
    },
    {
      type: "category",
      label: "API Reference",
      collapsed: false,
      items: [
        "api-reference/masumi-identity",
        "api-reference/agent-linking",
        "api-reference/credentials",
        "api-reference/signature-verification",
        "api-reference/utilities",
        "api-reference/constants",
        "api-reference/types",
      ],
    },
    "troubleshooting",
  ],
};

export default sidebars;

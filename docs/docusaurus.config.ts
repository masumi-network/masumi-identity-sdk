import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

/**
 * Docs site for @masumi_network/identity-sdk.
 *
 * Deploys to GitHub Pages at:
 *   https://masumi-network.github.io/masumi-identity-sdk/
 */
const config: Config = {
  title: "Masumi Identity SDK",
  tagline:
    "TypeScript SDK for decentralized agent identity on Masumi — KERI AIDs, Verifiable Credentials, and A2A verification.",
  favicon: "img/favicon.svg",

  url: "https://masumi-network.github.io",
  baseUrl: "/masumi-identity-sdk/",

  organizationName: "masumi-network",
  projectName: "masumi-identity-sdk",
  trailingSlash: false,

  onBrokenLinks: "warn",
  onBrokenAnchors: "warn",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "content",
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/masumi-network/masumi-identity-sdk/tree/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/logo/light.svg",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Masumi Identity SDK",
      logo: {
        alt: "Masumi Identity SDK",
        src: "img/favicon.svg",
      },
      items: [
        {
          to: "/introduction",
          label: "Docs",
          position: "left",
        },
        {
          to: "/api-reference/masumi-identity",
          label: "API Reference",
          position: "left",
        },
        {
          href: "https://www.npmjs.com/package/@masumi_network/identity-sdk",
          label: "npm",
          position: "right",
        },
        {
          href: "https://github.com/masumi-network/masumi-identity-sdk",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Introduction", to: "/introduction" },
            { label: "Quickstart", to: "/quickstart" },
            { label: "Concepts", to: "/concepts" },
            { label: "API Reference", to: "/api-reference/masumi-identity" },
          ],
        },
        {
          title: "Community",
          items: [
            { label: "GitHub", href: "https://github.com/masumi-network" },
            { label: "Masumi Network", href: "https://masumi.network" },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "npm package",
              href: "https://www.npmjs.com/package/@masumi_network/identity-sdk",
            },
            {
              label: "Template agent",
              href: "https://github.com/masumi-network/masumi-identity-sdk/tree/main/examples/template-agent",
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Masumi Network. MIT licensed.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "typescript"],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import tailwindPlugin from "./src/plugins/tailwind-config.js";

const config: Config = {
  title: "React Typed Date",
  tagline: "A keyboard-friendly date input field with segment navigation",
  favicon: "img/react_typed_date_background.svg",

  url: "https://cyberstefnef.github.io",
  baseUrl: "/react-typed-date/",

  organizationName: "CyberStefNef",
  projectName: "react-typed-date",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  plugins: [tailwindPlugin],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./src/sidebars.ts",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },

          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/react_typed_date_background.svg",
    navbar: {
      title: "React Typed Date",
      logo: {
        alt: "React Typed Date Logo",
        src: "img/react_typed_date.svg",
        srcDark: "img/react_typed_date_dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://github.com/CyberStefNef/react-typed-date",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} React Typed Date`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

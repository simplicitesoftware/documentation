import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Simplicité Documentation",
  favicon: "img/favicon.svg",

  // Set the production url of your site here
  url: "https://docsnew.simplicite.io/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  // GitHub pages deployment config.
  organizationName: "simplicitesoftware", // Usually your GitHub org/user name.
  projectName: "documentation", // Usually your repo name.
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  onBrokenAnchors: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          showLastUpdateTime: true
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
      },
      navbar: {
        logo: {
          alt: "Simplicité logo",
          src: "img/Simplicite_Logo_Black.svg",
          srcDark: "img/Simplicite_Logo_White.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          {
            type: 'dropdown',
            label: 'Documentation',
            position: 'left',
            items: [
              {
                sidebarId:"platformSidebar",
                type: "docSidebar",
                label: "Platform",
              },
              {
                sidebarId:"documentationSidebar",
                type: "docSidebar",
                label: "More",
              },
            ],
          },
          {
            to: "/docs/versions/versioning/",
            label: "Versions",
            position: "left",
          },
          {
            to: "https://platform.simplicite.io/",
            label: "JavaDoc etc.",
            position: "left",
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'bash'],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "PW7VWIQKZH",
        // Public API key: it is safe to commit it
        apiKey: "5ad2cefc4513ad22c97c009ca4511e6a",
        indexName: "simplicite_docs",
        contextualSearch: true,
        // Optional: Algolia search parameters
        searchParameters: {},
        searchPagePath: "search",
        insights: false,
      },
    }),
};

export default config;

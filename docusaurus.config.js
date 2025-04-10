import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Simplicité Documentation",
  favicon: "img/simplicite_favicon.png",

  // Set the production url of your site here
  url: "https://docs.simplicite.io/",
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
          showLastUpdateTime: true,
          routeBasePath: '/'
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],
  plugins: [
    require.resolve('docusaurus-plugin-image-zoom')
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
            type: "docSidebar",
            sidebarId: "platformSidebar",
            position: "left",
            label: "Make",
          },
          {
            type: 'docSidebar',
            label: 'Docs',
            sidebarId:"documentationSidebar",
            position: 'left'
          },
          {
            to: "/versions/versioning/",
            label: "Versions",
            sidebarId:"versionSidebar",
            position: "left",
          },
          {
            to: "/resources/platform_resources/",
            label: "JavaDoc etc.",
            sidebarId:"resourceSidebar",
            position: "left",
            css: "./src/css/platformBlocks.css",
          },
          {
            href: 'https://github.com/simplicitesoftware/documentation',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          }
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
      zoom: {
        selector: '.markdown :not(em) > img',
        background: {
            light: 'rgb(255, 255, 255)',
            dark: 'rgb(50, 50, 50)'
        },
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        }
      }
    })
};

export default config;

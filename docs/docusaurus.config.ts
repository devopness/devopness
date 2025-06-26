import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { resolve } from "path";
import introContentPlugin from "./src/plugins/intro-content-plugin";
import mentionPostPlugin from "./src/plugins/mention-post-plugin";
import relatedLinksPlugin from "./src/plugins/related-links-plugin";
import staticContentLinksEscapePlugin from "./src/plugins/static-content-links-escape-plugin";
import requiredPermissionsPlugin from "./src/plugins/required-permissions-plugin";
/**
 * Docusaurus Configuration
 * @see https://docusaurus.io/docs/configuration
 */
const config: Config = {
  // 1. Essential Site Configuration
  // These are the core settings that define your website
  title: "Devopness Docs",
  url: "https://www.devopness.com",
  baseUrl: "/",
  favicon: `${process.env.DEVOPNESS_URL_IMAGES}/favicon-devopness-site-512x512.png`,
  // Static files are copied to the output folder directly
  staticDirectories: ["static"],

  // 2. Internationalization (i18n)
  // Language and localization settings
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // 3. Presets and Themes
  // Core functionality and appearance
  presets: [
    [
      "classic",
      {
        docs: {
          exclude: ["README.md"],
          sidebarPath: resolve(__dirname, "sidebars.ts"),
          remarkPlugins: [
            introContentPlugin,
            requiredPermissionsPlugin,
            relatedLinksPlugin,
            staticContentLinksEscapePlugin,
            mentionPostPlugin, // Must be last to process after other plugins modify content
          ],
          // Source Provider URL to documentation repo
          editUrl: `${process.env.DEVOPNESS_URL_DOCS_REPO}/edit/main/`,
        },
        theme: {
          customCss: resolve(__dirname, "src", "theme", "docusaurus.css"),
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: ["@easyops-cn/docusaurus-search-local"],

  // 4. Theme Configuration
  // Customize the appearance and behavior of your site
  themeConfig: {
    colorMode: {
      // We're assuming here that most people reading our docs on the website are technical users,
      // so we enable dark mode in the documentation by default. Human friendly for those setting
      // up Devopness for the first time late at night, 3am, where a white theme can really hurt.
      // We're devs, we love dark mode <3
      defaultMode: "dark",
    },
    navbar: {
      logo: {
        alt: "Devopness Logo",
        src: `${process.env.DEVOPNESS_URL_IMAGES}/logo-devopness-primary.svg`,
        /**
         * "The `pathname://` protocol is useful for referencing any content in the static folder"
         *
         * @see {https://docusaurus.io/docs/advanced/routing#escaping-from-spa-redirects}
         */
        href: "pathname:///",
        target: "_self",
      },
      /**
       * Check "Docusaurus Docs - Navbar items" to see available types and expected params
       *
       * @see {https://docusaurus.io/docs/next/api/themes/configuration#navbar-items | Docusaurus Docs - Navbar items}
       */
      items: [
        {
          label: "Documentation",
          position: "left",
          type: "docSidebar",
          sidebarId: "documentation",
        },
        {
          label: "Blog",
          position: "left",
          to: "blog",
        },
        {
          label: "Pricing",
          position: "left",
          to: "pathname:///pricing",
          target: "_self",
        },
        {
          label: "Careers",
          position: "left",
          to: "pathname:///careers",
          target: "_self",
        },
        {
          label: "Sign In",
          position: "right",
          href: process.env.DEVOPNESS_URL_WEB_APP,
        },
        {
          label: "Sign Up",
          position: "right",
          href: process.env.DEVOPNESS_URL_SIGNUP,
        },
      ],
      hideOnScroll: true,
    },
    footer: {
      style: "dark",
      links: [
        {
          items: [
            {
              label: "Documentation",
              to: "/docs",
            },
            {
              label: "Pricing",
              to: "pathname:///pricing",
              target: "_self",
            },
            {
              label: "Careers",
              to: "pathname:///careers",
              target: "_self",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: process.env.DEVOPNESS_GITHUB_CONTACT,
            },
            {
              label: "Linkedin",
              href: "https://www.linkedin.com/company/devopness",
            },
            {
              label: "YouTube",
              href: "https://www.youtube.com/@devopness",
            },
          ],
        },
      ],
    },
  } satisfies Preset.ThemeConfig,

  // 5. Content Processing
  // How Markdown and other content is handled
  markdown: {
    format: "md",
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);

      type FrontMatter = {
        links?: {
          next: string | null;
          previous: string | null;
        };
      };
      const frontMatter = {
        ...result.frontMatter,
        description:
          result.frontMatter.description ?? result.frontMatter.intro ?? "",
        pagination_next:
          result.frontMatter.pagination_next ??
          (result.frontMatter as FrontMatter).links?.next,
        pagination_prev:
          result.frontMatter.pagination_prev ??
          (result.frontMatter as FrontMatter).links?.previous,
      };

      return {
        ...result,
        frontMatter,
      };
    },
  },

  // 6. Error Handling
  // How to handle broken links and other issues
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  // 7. Custom Configuration
  // Site-specific settings and extensions
  customFields: {
    communitySupportUrl: process.env.DEVOPNESS_COMMUNITY_SUPPORT,
    buildTimestamp: Date.now(),
  },

  // 8. External Resources
  // Third-party resources and assets
  stylesheets: ["https://fonts.googleapis.com/icon?family=Material+Icons"],
};

export default config;

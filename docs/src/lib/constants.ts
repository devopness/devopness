const githubDocsRepo = 'https://github.com/devopness/devopness';
const githubDocsRawHost =
  'https://raw.githubusercontent.com/devopness/devopness';
const githubDocsBranch = 'main';
const githubDocsContentPath = 'docs/docs';
const githubDocsEditPathPrefix = `${githubDocsRepo}/blob/${githubDocsBranch}/${githubDocsContentPath}`;
const githubDocsRawPathPrefix = `${githubDocsRawHost}/${githubDocsBranch}/${githubDocsContentPath}`;

export const siteConfig = {
  title: 'Devopness Docs',
  tagline: 'DevOps Happiness: for AI Agents & Humans',
  // The main Devopness website (used for navigation links: logo, MCP, etc.)
  url: process.env.NEXT_PUBLIC_DEVOPNESS_URL_SITE!,
  // The public URL where the docs are served (used for metadataBase, OG images, canonical URLs)
  // Docs are served under /docs/ on the main site (e.g. devopness.com/docs/)
  docsUrl: `${process.env.NEXT_PUBLIC_DEVOPNESS_URL_SITE}/docs`,

  assets: {
    icons: process.env.NEXT_PUBLIC_DEVOPNESS_URL_ICONS!,
    logo: `${process.env.NEXT_PUBLIC_DEVOPNESS_URL_IMAGES}/logo-devopness-primary.svg`,
    favicon: `${process.env.NEXT_PUBLIC_DEVOPNESS_URL_IMAGES}/favicon-devopness-site-512x512.png`,
  },

  links: {
    webApp: process.env.NEXT_PUBLIC_DEVOPNESS_URL_WEB_APP!,
    signUp: process.env.NEXT_PUBLIC_DEVOPNESS_URL_SIGNUP!,
    discord: process.env.NEXT_PUBLIC_DEVOPNESS_URL_DISCORD!,
    github: process.env.NEXT_PUBLIC_DEVOPNESS_GITHUB_CONTACT!,
    linkedin: process.env.NEXT_PUBLIC_DEVOPNESS_URL_LINKEDIN!,
    youtube: process.env.NEXT_PUBLIC_DEVOPNESS_URL_YOUTUBE!,
  },

  githubDocsRepo,
  githubDocsBranch,
  githubDocsEditPathPrefix,
  githubDocsRawPathPrefix,
};

export function getGithubDocsEditUrl(pagePath: string) {
  return `${siteConfig.githubDocsEditPathPrefix}/${pagePath}`;
}

export function getGithubDocsRawUrl(pagePath: string) {
  return `${siteConfig.githubDocsRawPathPrefix}/${pagePath}`;
}

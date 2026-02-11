export const siteConfig = {
  title: 'Devopness Docs',
  tagline: 'DevOps Happiness: for AI Agents & Humans',
  url: process.env.NEXT_PUBLIC_DEVOPNESS_URL_SITE!,

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
};

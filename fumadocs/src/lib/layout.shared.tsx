import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { siteConfig } from './constants';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <img
          src={siteConfig.assets.logo}
          alt="Devopness Logo"
          style={{ height: 28 }}
        />
      ),
      url: '/',
    },
    githubUrl: siteConfig.links.github,
    links: [
      {
        text: 'Documentation',
        url: '/docs',
        active: 'nested-url',
      },
      {
        text: 'Blog',
        url: '/blog',
        external: true,
      },
      {
        text: 'Pricing',
        url: '/pricing',
        external: true,
      },
      {
        text: 'Careers',
        url: '/careers',
        external: true,
      },
      {
        type: 'button',
        text: 'Get Started',
        url: siteConfig.links.webApp,
        external: true,
      },
    ],
  };
}

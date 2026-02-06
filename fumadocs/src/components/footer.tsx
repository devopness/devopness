import { siteConfig } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="border-t py-8 text-sm text-fd-muted-foreground">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href="/docs" className="hover:text-fd-foreground transition-colors">
            Documentation
          </a>
          <a href="/pricing" className="hover:text-fd-foreground transition-colors">
            Pricing
          </a>
          <a href="/careers" className="hover:text-fd-foreground transition-colors">
            Careers
          </a>
        </div>
        <div className="flex items-center gap-x-6">
          <span className="font-medium text-fd-foreground">Community</span>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fd-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fd-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fd-foreground transition-colors"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}

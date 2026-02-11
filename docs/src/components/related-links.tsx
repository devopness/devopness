import { source } from '@/lib/source';
import Link from 'next/link';

interface RelatedLinksProps {
  links: string[];
}

/**
 * Renders a related links section for documentation pages.
 * Reads the `links.related` frontmatter field and resolves each doc path
 * to its title and URL using the Fumadocs source loader.
 */
export function RelatedLinks({ links }: RelatedLinksProps) {
  const valid = links.filter((l) => typeof l === 'string' && l.trim() !== '');
  if (valid.length === 0) return null;

  const resolved = valid
    .map((docPath) => {
      // Resolve the doc path to a page in the source
      const slugs = docPath.replace(/\/index$/, '').split('/');
      const page = source.getPage(slugs);
      if (!page) return null;
      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
      };
    })
    .filter((item) => item !== null);

  if (resolved.length === 0) return null;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">Related</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {resolved.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            className="block rounded-lg border p-4 no-underline hover:no-underline transition-colors hover:bg-fd-accent"
          >
            <p className="font-medium text-[#786efd]">{item.title}</p>
            {item.description && (
              <p className="mt-1 text-sm text-fd-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

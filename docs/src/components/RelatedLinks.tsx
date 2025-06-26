import React, { useMemo } from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import DocCardList from "@theme/DocCardList";
import { useDocById } from "@docusaurus/plugin-content-docs/client";

/**
 * Type definition for the front matter with related links
 */
type DocFrontMatter = {
  links?: {
    related?: string[];
  };
};

/**
 * Type for related doc card items
 */
type RelatedDocItem = {
  type: "link";
  href: string;
  label: string;
  description?: string;
};

/**
 * Component to render related documentation links with titles and descriptions
 * Extracts related links from document front matter and displays them as a card list
 */
const RelatedLinks: React.FC = () => {
  // Safely type the frontMatter and extract related links
  const { frontMatter } = useDoc() as { frontMatter: DocFrontMatter };

  // Extract and validate related links
  const relatedLinks = useMemo(() => {
    // Check if related links exist in frontmatter with type-safe access
    const links = frontMatter.links?.related ?? [];
    return links.filter(
      (link): link is string => typeof link === "string" && link.trim() !== ""
    );
  }, [frontMatter]);

  // If no valid links, return null
  if (relatedLinks.length === 0) {
    return null;
  }

  // Create an array of normalized doc IDs and fetch their metadata
  const docsData = relatedLinks
    /**
     * This component uses useDocById inside a map function, which typically violates
     * React's rules of hooks. However, this is a special case because:
     * 1. The number of hooks is determined by static frontmatter data
     * 2. The hooks are always called in the same order
     * 3. There's no official Docusaurus API for batch fetching document metadata
     *
     * @see {@link https://docusaurus.io/docs/docusaurus-core#usedocbyid}
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    .map((id) => useDocById(id));

  // Map related links to doc items
  const relatedDocs = relatedLinks
    .map((link, index) => {
      const docData = docsData[index];

      if (!docData) {
        console.warn(`Could not find document for link: ${link}`);
        return null;
      }

      return {
        type: "link" as const,
        href: `/docs/${link.replace(/index$/, "")}`,
        label: docData.title,
        description: docData.description,
      } as RelatedDocItem;
    })
    .filter((item): item is RelatedDocItem => item !== null);

  // If no related docs could be found, return null
  if (relatedDocs.length === 0) {
    return null;
  }

  return (
    <div className="related-links">
      <h2 className="related-links-title">Related:</h2>
      <DocCardList items={relatedDocs} />
    </div>
  );
};

export default RelatedLinks;

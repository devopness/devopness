import { Node } from "unist";

// Define structure for MDX AST nodes
interface MDXNode extends Node {
  type: string;
  value?: string;
  children?: MDXNode[];
}

/**
 * Plugin that automatically adds related links section to MDX documents
 * Injects the RelatedLinks component if no manual section exists
 */
export default function relatedLinksPlugin() {
  return (tree: MDXNode) => {
    // Check if document already has a manual related links section
    const hasRelatedLinksSection = tree.children?.some(
      (child) =>
        child.type === "heading" &&
        (child.children?.[0] as MDXNode)?.value === "Related Links"
    );

    // Skip if manual section exists
    if (hasRelatedLinksSection) {
      return tree;
    }

    // Add import statement for RelatedLinks component
    tree.children?.unshift({
      type: "mdxjsEsm",
      value: "import RelatedLinks from '@site/src/components/RelatedLinks';",
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ImportDeclaration",
              source: {
                type: "Literal",
                value: "@site/src/components/RelatedLinks",
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: {
                    type: "Identifier",
                    name: "RelatedLinks",
                  },
                },
              ],
            },
          ],
        },
      },
    });

    // Append RelatedLinks component at end of document
    tree.children?.push({
      type: "mdxJsxFlowElement",
      // @ts-expect-error name is a valid property for mdxJsxFlowElement, but not typed in the plugin
      name: "RelatedLinks",
      attributes: [],
      children: [],
      data: {
        _mdxExplicitJsx: true,
      },
    });
  };
}

import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

interface TextNode extends Node {
  type: 'text';
  value: string;
}

/**
 * Remark plugin that converts mention syntax `[/docs/path/to/page]` or `[/path/to/page]`
 * into standard markdown links with auto-generated titles.
 *
 * This syntax (originally from the previous docs setup) is preserved for backwards
 * compatibility and maintainability. The plugin converts these mentions to standard
 * markdown links, which Fumadocs renders natively with `createRelativeLink`.
 *
 * The plugin automatically removes the `/docs` prefix if present (since Next.js basePath adds it).
 * It generates link text from the slug by converting hyphens to spaces and capitalizing.
 *
 * Examples:
 * - `[/docs/credentials/add-credential]` → `[Add credential](/credentials/add-credential)`
 * - `[/credentials/add-credential]` → `[Add credential](/credentials/add-credential)`
 */
export function remarkMentionLink() {
  return (tree: Node) => {
    visit(tree, 'text', (node: TextNode, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined || !node.value) return;

      // Match both [/docs/path] and [/path] patterns
      const regex = /\[(\/(?:docs\/)?[^\]]+)\]/g;
      if (!regex.test(node.value)) return;
      regex.lastIndex = 0;

      const parts: Node[] = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          } as TextNode);
        }

        // Remove /docs prefix if present (since basePath adds it)
        const docPath = match[1].replace(/^\/docs\//, '/');
        const slug = docPath.split('/').pop() ?? docPath;
        const label = slug
          .replace(/^index$/, docPath.split('/').at(-2) ?? slug)
          .replaceAll('-', ' ')
          .replace(/^\w/, (c) => c.toUpperCase());

        parts.push({
          type: 'link',
          url: docPath,
          children: [{ type: 'text', value: label } as TextNode],
        } as Node);

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < node.value.length) {
        parts.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        } as TextNode);
      }

      if (parts.length > 0) {
        parent.children.splice(index, 1, ...parts);
      }
    });
  };
}

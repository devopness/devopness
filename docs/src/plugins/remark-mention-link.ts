import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

interface TextNode extends Node {
  type: 'text';
  value: string;
}

/**
 * Remark plugin that converts Docusaurus-style mention syntax `[/docs/path/to/page]`
 * into standard markdown links.
 *
 * In the Docusaurus setup, these were converted to `<MentionPost>` JSX components
 * that resolved page titles via hooks. Here we convert them to plain links, which
 * Fumadocs renders natively with `createRelativeLink`.
 *
 * Example: `follow the guide [/docs/credentials/add-credential]`
 * becomes: `follow the guide [Add credential](/docs/credentials/add-credential)`
 */
export function remarkMentionLink() {
  return (tree: Node) => {
    visit(tree, 'text', (node: TextNode, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined || !node.value) return;

      const regex = /\[(\/docs\/[^\]]+)\]/g;
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

        const docPath = match[1];
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

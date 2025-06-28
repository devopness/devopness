import { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

interface MdxNode extends Node {
  value?: string;
  type: string;
  children?: MdxNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, string>;
  };
}

interface MdxTree extends Parent {
  data?: {
    hName?: string;
    hProperties?: Record<string, string>;
  };
}

/**
 * Plugin that finds markdown reference links with /docs/path/to/post content
 * and replaces it with a link to the post, using the MentionPost JSX component.
 *
 * @returns A transformer function that modifies the MDX syntax tree
 */
export default function mentionPostPlugin() {
  return (tree: MdxTree) => {
    visit(tree, "text", (node: MdxNode, index: number, parent: Parent) => {
      if (!node.value) return;

      const regex = /\[(\/docs\/[^\]]+)\]/g;

      if (regex.test(node.value)) {
        regex.lastIndex = 0;

        const parts: MdxNode[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(node.value)) !== null) {
          // Add text before the match
          if (match.index > lastIndex) {
            parts.push({
              type: "text",
              value: node.value.slice(lastIndex, match.index),
            });
          }

          // Create MDX JSX element
          parts.push({
            type: "mdxJsxFlowElement",
            name: "MentionPost",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "path",
                value: match[1],
              },
            ],
            children: [
              {
                type: "text",
                value: match[1],
              },
            ],
            data: {
              // @ts-expect-error _mdxExplicitJsx is a valid property for mdxJsxFlowElement, but not typed in the plugin
              _mdxExplicitJsx: true,
            },
          });

          lastIndex = regex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < node.value.length) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex),
          });
        }

        // Replace node with parts
        if (parts.length > 0) {
          parent.children.splice(index, 1, ...parts);
          return index + parts.length;
        }
      }
    });
  };
}

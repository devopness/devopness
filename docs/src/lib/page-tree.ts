// Normalize page-tree labels before Fumadocs renders the sidebar.
//
// Fumadocs can split acronym names like `SSH` into `S S H` when they are
// derived from IDs or folder names. That makes the sidebar hard to read, so
// this plugin fixes only that broken spacing and leaves manual titles alone.
// We need this step because both the docs tree and the API tree use the same
// sidebar renderer, and without it the same acronym bug would show up in both
// places.

import type { Folder, Item, Node, Root, Separator } from "fumadocs-core/page-tree";
import type { LoaderPlugin } from "fumadocs-core/source";

/**
 * Collapse spaced acronyms in automatically generated page-tree labels.
 *
 * Fumadocs can split labels like `SSH` into `S S H` when they come from IDs
 * or folder names. We only fix that broken form so manual titles stay exactly
 * as written in the source files.
 */
function normalizeAcronymSpacing(value: string): string {
  const words = value.split(" ");

  const normalizedWords: string[] = [];

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];

    if (/^[A-Z]$/.test(word)) {
      let acronym = word;
      let cursor = index;

      while (cursor + 1 < words.length && /^[A-Z]$/.test(words[cursor + 1])) {
        acronym += words[cursor + 1];
        cursor += 1;
      }

      if (acronym.length > 1) {
        normalizedWords.push(acronym);
        index = cursor;
        continue;
      }
    }

    normalizedWords.push(word);
  }

  return normalizedWords.join(" ");
}

/**
 * Normalize a page-tree node name only when Fumadocs gave us plain text.
 *
 * Some nodes already carry richer data. We leave those untouched because the
 * label is either computed elsewhere or intentionally not a raw string.
 */
function normalizeNodeName<T extends { name?: unknown }>(node: T): T {
  if (typeof node.name !== "string") {
    return node;
  }

  return {
    ...node,
    name: normalizeAcronymSpacing(node.name),
  };
}

/**
 * Recursively normalize generated page-tree labels.
 *
 * The tree can be nested, so a one-level pass would miss labels inside child
 * folders. We walk every node to keep the sidebar consistent.
 */
function normalizePageTreeNode(node: Root | Node): Root | Node {
  const normalizedNode = normalizeNodeName(node);

  if (!("children" in normalizedNode)) {
    return normalizedNode;
  }

  return {
    ...normalizedNode,
    children: normalizedNode.children.map((child) => normalizePageTreeNode(child as Node) as Node),
  };
}

/**
 * Page-tree transformer shared by the docs and API trees.
 *
 * We reuse the same normalization in both places so acronym labels render the
 * same way across the whole site instead of depending on the route.
 */
export const acronymSpacingPlugin: LoaderPlugin = {
  name: "normalize-acronym-spacing",
  transformPageTree: {
    // Fumadocs calls each node type separately, so we keep the same
    // normalization path for every shape it can send us.
    root(node) {
      return normalizePageTreeNode(node) as Root;
    },
    folder(node) {
      return normalizePageTreeNode(node) as Folder;
    },
    file(node) {
      return normalizePageTreeNode(node) as Item;
    },
    separator(node) {
      return normalizePageTreeNode(node) as Separator;
    },
  },
};

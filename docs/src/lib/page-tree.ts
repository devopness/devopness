import type { Folder, Item, Node, Root, Separator } from "fumadocs-core/page-tree";
import type { LoaderPlugin } from "fumadocs-core/source";

/**
 * Collapse spaced acronyms in automatically generated page-tree labels.
 *
 * Fumadocs turns names like `SSH` into `S S H` when they come from IDs or
 * folder names. We only normalize the broken spaced form and keep explicit
 * titles untouched.
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
 * Normalize a page-tree node name if it is a simple string.
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
 */
export const acronymSpacingPlugin: LoaderPlugin = {
  name: "normalize-acronym-spacing",
  transformPageTree: {
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

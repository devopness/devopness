import { Node } from "unist";

// Define the structure of MDX nodes in the syntax tree
interface MDXNode extends Node {
  type: string;
  value?: string;
  children?: MDXNode[];
  data?: {
    frontMatter?: {
      intro?: string;
    };
  };
}

/**
 * Plugin that extracts intro text from MDX documents and adds it as a paragraph
 * at the beginning of the content.
 *
 * This is used to automatically create intro paragraphs from frontmatter.
 */
export default function introContentPlugin() {
  return (tree: MDXNode) => {
    // Get the first child node from the MDX tree
    const firstChild = tree.children?.at(0);
    if (!firstChild?.value) return;

    // Use regex to extract intro text that matches pattern "intro: some text"
    const introMatch = firstChild.value.match(/intro: (.*)/);
    // Get the captured intro text from the regex match
    const introText = introMatch?.at(1);

    if (introText) {
      // Create a new paragraph node containing the intro text
      const introParagraph = {
        type: "paragraph",
        children: [{ type: "text", value: introText }],
      };

      // Add the intro paragraph to the beginning of the document
      tree.children?.unshift(introParagraph);
    }
  };
}

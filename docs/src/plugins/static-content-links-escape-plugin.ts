import { Node } from "unist";
import { visit } from "unist-util-visit";
import debug from "debug";

/**
 * Create a namespaced debug logger
 *
 * The DEBUG environment variable is then used to
 * enable these based on space or comma-delimited names.
 *
 * @see {https://github.com/debug-js/debug#readme}
 */
const log = debug("docusaurus:plugin:static-content-links-escape");

// Define the structure of MDX nodes in the syntax tree
interface MDXNode extends Node {
  type: string;
  url?: string;
  children?: MDXNode[];
  data?: {
    hProperties?: {
      target?: string;
    };
  };
}

/**
 * Plugin to escape Docusaurus SPA redirects on links to static folder content
 *
 * This allows us to use Next.js routes as links in the docs without
 * Docusaurus throwing errors about broken links or using SPA redirects.
 *
 * @see {https://docusaurus.io/docs/advanced/routing#escaping-from-spa-redirects}
 */
export default function staticContentLinksEscapePlugin() {
  return (tree: MDXNode) => {
    visit(tree, "link", (node: MDXNode) => {
      if (
        node.url &&
        /**
         * We only want to escape links that are within the static folder
         * and not within the docs folder.
         *
         * This way we can limit use of SPA redirects to navigate between
         * docs pages.
         */
        node.url.startsWith("/") &&
        !node.url.startsWith("/docs")
      ) {
        log("Escaping link to: %s", node.url);
        node.url = `pathname://${node.url}`;
        // Add target="_self" to pathname links
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.target = "_self";
      }
    });
  };
}

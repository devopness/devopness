import { Node } from "unist";

// Define structure for MDX AST nodes
interface MDXNode extends Node {
  type: string;
  value?: string;
  children?: MDXNode[];
}

/**
 * Plugin that automatically adds required permissions section to MDX documents
 */
export default function requiredPermissionsPlugin() {
  return (tree: MDXNode) => {
    // Check if document already has a manual required permissions section
    const hasRequiredPermissionsSection = tree.children?.some(
      (child) =>
        child.type === "heading" &&
        (child.children?.[0] as MDXNode)?.value === "Required Permissions"
    );

    // Skip if manual section exists
    if (hasRequiredPermissionsSection) {
      return tree;
    }

    // Add import statement for RequiredPermissions component
    tree.children?.unshift({
      type: "mdxjsEsm",
      value:
        "import RequiredPermissions from '@site/src/components/RequiredPermissions';",
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ImportDeclaration",
              source: {
                type: "Literal",
                value: "@site/src/components/RequiredPermissions",
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: {
                    type: "Identifier",
                    name: "RequiredPermissions",
                  },
                },
              ],
            },
          ],
        },
      },
    });

    // Append RequiredPermissions component at end of document
    tree.children?.push({
      type: "mdxJsxFlowElement",
      // @ts-expect-error name is a valid property for mdxJsxFlowElement, but not typed in the plugin
      name: "RequiredPermissions",
      attributes: [],
      children: [],
      data: {
        _mdxExplicitJsx: true,
      },
    });

    return tree;
  };
}

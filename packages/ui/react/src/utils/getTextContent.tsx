import {
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react'

import { isDefined } from 'src/components/type-guards'

/**
 * Extracts text content from a React node or component.
 *
 * @param node - Any valid React node (element, string, number, array of nodes, etc.)
 * @returns The combined text content of the node and its children
 *
 * @example
 * // Simple text
 * getTextContent("Hello") // Returns: "Hello"
 *
 * // React element with children
 * getTextContent(<div>Hello <span>World</span></div>) // Returns: "Hello World"
 *
 * // Array of elements
 * getTextContent([<span>Hello</span>, " ", <span>World</span>]) // Returns: "Hello World"
 */
export const getTextContent = (node: ReactNode): string => {
  // Handle falsy values (null, undefined, false)
  if (!isDefined(node)) return ''

  // Handle primitive types
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (typeof node === 'boolean') return String(node)

  // Handle arrays of React nodes (e.g. multiple children)
  if (Array.isArray(node)) {
    return node.map(getTextContent).join('')
  }

  // Handle React elements (components, DOM elements)
  if (isValidElement(node)) {
    // First try to get text from children, as this is more common
    const element = node as ReactElement<
      PropsWithChildren<{ value?: ReactNode }>
    >
    const { children, value } = element.props
    if (isDefined(children)) {
      return getTextContent(children)
    }
    // Fallback to value prop if children don't exist
    // This is useful for form elements like <input value="text" />
    if (isDefined(value)) {
      return getTextContent(value)
    }
  }

  // Handle any other cases (objects, functions, etc.)
  return ''
}

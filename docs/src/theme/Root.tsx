import { useEffect } from "react";

/**
 * Root theme component that wraps the entire Docusaurus application
 * Handles special behavior for embedded documentation mode
 */
export default function Root({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  useEffect(() => {
    // Check if we're in embedded documentation mode
    if (document.documentElement.hasAttribute("data-embed")) {
      // Find all anchors that should open in new tab
      const anchors = document.querySelectorAll(
        'a:not([target="_blank"]):not([href^="#"]):not([download])'
      );

      // Add appropriate attributes for external links
      anchors.forEach((anchor) => {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
      });

      // Set up observer for dynamically added content
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Process any new anchors added to the DOM
              const element = node as Element;
              const newAnchors = element.querySelectorAll(
                'a:not([target="_blank"]):not([href^="#"]):not([download])'
              );
              newAnchors.forEach((anchor) => {
                anchor.setAttribute("target", "_blank");
                anchor.setAttribute("rel", "noopener noreferrer");
              });
            }
          });
        });
      });

      // Start observing DOM changes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Clean up observer on unmount
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return <>{children}</>;
}

import React from "react";
import Footer from "@theme-original/DocItem/Footer";
import MDXComponents from "../../MDXComponents";
import { WrapperProps } from "@docusaurus/types";

/**
 * FooterWrapper extends the default Docusaurus footer component
 * by adding the CommunitySupport component below the standard footer content
 *
 * @param props - Original footer component props
 * @returns Enhanced footer with community support link
 */
export default function FooterWrapper(props: WrapperProps<typeof Footer>) {
  return (
    <>
      <Footer {...props} />
      <MDXComponents.CommunitySupport />
    </>
  );
}

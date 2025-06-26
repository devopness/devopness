import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Icon from "@mui/material/Icon";

/**
 * CommunitySupport component renders a link to the community support forum
 * This component is hidden by default and can be shown dynamically when needed
 * It's typically used in the documentation footer to provide easy access to community help
 *
 * @returns A styled anchor element with a forum icon and "Community support" text
 */
export default function CommunitySupport() {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  return (
    <a
      id="community-support-link"
      href={customFields?.communitySupportUrl as string}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "none", // Hidden initially - can be shown via JavaScript/CSS when needed
        flexDirection: "row",
        alignItems: "center",
        gap: "0.5rem",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
      }}
    >
      <Icon style={{ color: "var(--ifm-link-color)" }}>forum</Icon>
      Community support
    </a>
  );
}

import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { baseOptions, layoutTabs } from "@/lib/layout.config";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    // TODO: Restore the top bar. When `tabs` are enabled on `DocsLayout`, the top bar is replaced
    // and its links are merged into the navbar/sidebar pattern, which is not what we want.
    <DocsLayout tabs={layoutTabs} tree={source.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}

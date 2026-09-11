import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { baseOptions, layoutTabs } from "@/lib/layout.config";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tabMode="navbar"
      tabs={layoutTabs}
      tree={source.pageTree}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}

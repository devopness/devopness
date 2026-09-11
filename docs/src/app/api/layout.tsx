import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

import { baseOptions, layoutTabs } from "@/lib/layout.config";
import { getApiReferenceSource } from "@/lib/openapi";

export default async function Layout({ children }: { children: ReactNode }) {
  const apiSource = await getApiReferenceSource();

  return (
    <DocsLayout
      tabMode="navbar"
      tabs={layoutTabs}
      tree={apiSource.pageTree}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}

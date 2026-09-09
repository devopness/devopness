import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { baseOptions, layoutTabs } from "@/lib/layout.config";
import { getApiReferenceSource } from "@/lib/openapi";

export default async function Layout({ children }: { children: ReactNode }) {
  const apiSource = await getApiReferenceSource();

  return (
    <DocsLayout
      tabs={layoutTabs}
      tree={apiSource.pageTree}
      {...baseOptions({ includeCustomLinks: false })}
    >
      {children}
    </DocsLayout>
  );
}

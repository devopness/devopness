import { source } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const lines: string[] = [];
  lines.push('# Documentation');
  lines.push('');
  for (const page of source.getPages()) {
    const description = page.data.description ?? '';
    const descriptionSuffix = description ? `: ${description}` : '';
    lines.push(`- [${page.data.title}](${page.url})${descriptionSuffix}`);
  }
  return new Response(lines.join('\n'));
}

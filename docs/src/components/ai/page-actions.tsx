'use client';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';

export function LLMCopyButton({
  markdown,
}: {
  markdown: string;
}) {
  const [checked, onClick] = useCopyButton(() => {
    navigator.clipboard.writeText(markdown);
  });

  return (
    <button
      className={cn(
        buttonVariants({
          color: 'secondary',
          size: 'sm',
          className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
        }),
      )}
      onClick={onClick}
    >
      {checked ? <Check /> : <Copy />}
      Copy Markdown
    </button>
  );
}

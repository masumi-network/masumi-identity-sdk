import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { source } from '@/lib/source';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions()}
      nav={{ ...baseOptions().nav, mode: 'top' }}
      tabMode="navbar"
    >
      {children}
    </DocsLayout>
  );
}

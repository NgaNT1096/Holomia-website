import { Head } from '@inertiajs/react';
import App from '@/App';
import { EditorProvider } from '@/lib/editor';
import type { AppRoute } from '@/types/holomia';

export default function Site({ route, title }: { route: AppRoute; title: string }) {
  // Header and footer are editable on every page; home sections on the home page.
  return (
    <EditorProvider>
      <Head title={title} />
      <App route={route} />
    </EditorProvider>
  );
}

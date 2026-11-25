import App from '@/App';
import { EditorProvider } from '@/lib/editor';
import type { AppRoute } from '@/types/holomia';

export default function Site({ route }: { route: AppRoute }) {
  // Header and footer are editable on every page; home sections on the home page.
  return (
    <EditorProvider>
      <App route={route} />
    </EditorProvider>
  );
}

import { router } from '@inertiajs/react';
import type { LeadModalType } from '../types/holomia';
import { useEditor } from './editor';
import { usePaths } from './locale';

/** Follows an editor-defined link. Does nothing while editing so clicks never leave the page. */
export function useFollow(onOpenModal?: (type: LeadModalType) => void) {
  const { editing } = useEditor();
  const { localize } = usePaths();
  return (link: string | null) => {
    if (editing || !link) return;
    if (link.startsWith('modal:')) onOpenModal?.(link.slice(6) as LeadModalType);
    else if (link.startsWith('/')) router.visit(localize(link));
    else if (/^https?:/i.test(link)) window.open(link, '_blank', 'noopener,noreferrer');
    else if (/^(mailto|tel):/i.test(link)) window.location.href = link;
  };
}

/** Current page as its Vietnamese path, whatever the language. */
export function useCurrentPath(): string {
  return usePaths().canonical;
}

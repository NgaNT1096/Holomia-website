import { router, usePage } from '@inertiajs/react';
import type { LeadModalType } from '../types/holomia';
import { useEditor } from './editor';

/** Follows an editor-defined link. Does nothing while editing so clicks never leave the page. */
export function useFollow(onOpenModal?: (type: LeadModalType) => void) {
  const { editing } = useEditor();
  return (link: string | null) => {
    if (editing || !link) return;
    if (link.startsWith('modal:')) onOpenModal?.(link.slice(6) as LeadModalType);
    else if (link.startsWith('/')) router.visit(link);
    else if (/^https?:/i.test(link)) window.open(link, '_blank', 'noopener,noreferrer');
    else if (/^(mailto|tel):/i.test(link)) window.location.href = link;
  };
}

export function useCurrentPath(): string {
  const path = usePage().url.split(/[?#]/)[0];
  return path === '/en' ? '/' : path;
}

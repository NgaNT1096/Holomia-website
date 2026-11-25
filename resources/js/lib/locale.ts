import { usePage } from '@inertiajs/react';
import { useEditor } from './editor';

export type Paths = { vi: string; en: string }[];

/** Hardcoded interface strings (errors, units…): `tr('Tiếng Việt', 'English')`. */
export function useTr() {
  const { locale } = useEditor();
  return (vi: string, en: string) => (locale === 'en' ? en : vi);
}

export function useNumberLocale(): string {
  const { locale } = useEditor();
  return locale === 'en' ? 'en-US' : 'vi-VN';
}

/** Path helpers based on the language of the current URL. */
export function usePaths() {
  const page = usePage<{ paths: Paths; locale: 'vi' | 'en' }>();
  const { paths, locale } = page.props;
  const [path] = page.url.split(/[?#]/);
  const current = path === '' ? '/' : path;
  /** The Vietnamese path identifies a page in links and menu highlighting. */
  const canonical = paths.find((p) => p.en === current)?.vi ?? current;

  const localize = (link: string, to: 'vi' | 'en' = locale) => {
    const [, base, rest] = link.match(/^([^?#]*)(.*)$/)!;
    const found = paths.find((p) => p.vi === base || p.en === base);
    return found ? found[to] + rest : link;
  };

  return { locale, canonical, localize };
}

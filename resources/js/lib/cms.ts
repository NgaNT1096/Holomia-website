import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import type { CaseStudy, CmsImage, EventPackage, InsightArticle } from '../types/holomia';
import { resolve, useEditor } from './editor';
import { usedImages, usedTexts } from './registry';

export interface CmsData {
  caseStudies: CaseStudy[];
  eventPackages: EventPackage[];
  insights: InsightArticle[];
}

/** All page copy (sections "text.*") in the active language. */
function useTexts(): Record<string, string> {
  const { sections, locale } = useEditor();
  return useMemo(() => {
    const out: Record<string, string> = {};
    for (const section of sections) {
      if (!section.template.startsWith('text.')) continue;
      for (const [key, value] of Object.entries(section.fields)) out[key] = resolve(value, locale, '');
    }
    return out;
  }, [sections, locale]);
}

export function useCms() {
  const cms = usePage<{ cms: CmsData }>().props.cms;
  const { sections, locale } = useEditor();
  const texts = useTexts();
  const images = sections.find((s) => s.template === 'images')?.images ?? {};

  const slot = (key: string): CmsImage | undefined => {
    const image = images[key];
    if (!image) return undefined;
    usedImages.add(key);
    return { ...image, alt: image.alts?.[locale] || image.alts?.vi || image.alt };
  };

  return {
    ...cms,
    /** A single image position. */
    img: slot,
    /** An ordered set of images ("<key>.0", "<key>.1", …). */
    imgs: (key: string): CmsImage[] => {
      const out: CmsImage[] = [];
      for (let i = 0; images[`${key}.${i}`]; i++) out.push(slot(`${key}.${i}`)!);
      return out;
    },
    /** Plain string (attributes, expressions). For visible JSX text use <Tx k d />. */
    t: (key: string, fallback: string) => {
      if (key in texts) usedTexts.add(key);
      return texts[key] ?? fallback;
    },
  };
}

export function xsrf(): string {
  const m = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export async function submitLead(data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-XSRF-TOKEN': xsrf(),
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function walk(v: any, path: string, texts: Record<string, string>): any {
  if (typeof v === 'string') {
    if (!(path in texts)) return v;
    usedTexts.add(path);
    return texts[path];
  }
  if (Array.isArray(v)) return v.map((x, i) => walk(x, `${path}.${i}`, texts));
  if (v && typeof v === 'object') {
    const out: any = {};
    for (const k of Object.keys(v)) out[k] = walk(v[k], `${path}.${k}`, texts);
    return out;
  }
  return v;
}

/** Returns `data` with every string replaced by its CMS override (key = data.<name>.<path>). */
export function useLocalized<T>(data: T, name: string): T {
  const texts = useTexts();
  return useMemo(() => walk(data, `data.${name}`, texts), [data, name, texts]);
}

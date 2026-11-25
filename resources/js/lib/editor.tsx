import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Eye, EyeOff, History, ImagePlus, Link2, Pencil, Plus, Trash2, Undo2 } from 'lucide-react';
import type { CmsImage } from '../types/holomia';
import { xsrf } from './cms';
import { usedImages, usedTexts } from './registry';
import { ResilientImage } from '../components/ResilientImage';

export type Locale = 'vi' | 'en';

type LocalizedText = Partial<Record<Locale, string>> & { removed?: boolean };
export type SectionImage = CmsImage & { path?: string; alts?: LocalizedText };

/** Anything that owns editable text and images: a section or one of its items. */
interface Scope {
  /** Guests get resolved strings; editors get every language. */
  fields: Record<string, string | LocalizedText>;
  images: Record<string, SectionImage>;
}

export interface ItemData extends Scope {
  id: number;
  kind: string;
  active: boolean;
  link: string | null;
  icon: string | null;
}

export interface SectionData extends Scope {
  id: number;
  page: string;
  template: string;
  active: boolean;
  hiddenLocales: Locale[];
  items: ItemData[];
}

interface EditorState {
  editing: boolean;
  locale: Locale;
  sections: SectionData[];
  update: (id: number, patch: (s: SectionData) => SectionData) => void;
  /** Move a section among the sections of the same page. */
  move: (id: number, delta: -1 | 1) => void;
}

const EditorContext = createContext<EditorState | null>(null);
const SectionContext = createContext<SectionData | null>(null);
const ScopeContext = createContext<{ scope: Scope; change: (patch: (s: Scope) => Scope) => void; isItem: boolean } | null>(null);

export function useEditor(): EditorState {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('EditorProvider missing');
  return ctx;
}

function headers(extra: Record<string, string> = {}) {
  return { Accept: 'application/json', 'X-XSRF-TOKEN': xsrf(), ...extra };
}

let tempId = -1;

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const props = usePage<{ sections: SectionData[]; locale: Locale; canEdit: boolean }>().props;
  const [sections, setSections] = useState(props.sections);
  const [locale, setLocale] = useState<Locale>(props.locale);
  const [editing, setEditing] = useState(
    () => props.canEdit && new URLSearchParams(window.location.search).has('edit')
  );
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
  const [panel, setPanel] = useState(false);

  useEffect(() => {
    setSections(props.sections);
    setDirty(false);
  }, [props.sections]);
  useEffect(() => setLocale(props.locale), [props.locale]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    const off = router.on('before', (e) => {
      if (e.detail.visit.only.length === 0 && !window.confirm('Có thay đổi chưa lưu. Rời trang?')) {
        e.preventDefault();
      }
    });
    return () => {
      window.removeEventListener('beforeunload', warn);
      off();
    };
  }, [dirty]);

  const touch = () => {
    setDirty(true);
    setStatus('');
  };

  const value = useMemo<EditorState>(
    () => ({
      editing,
      locale,
      sections,
      update: (id, patch) => {
        setSections((list) => list.map((s) => (s.id === id ? patch(s) : s)));
        touch();
      },
      move: (id, delta) => {
        setSections((list) => {
          const i = list.findIndex((s) => s.id === id);
          let j = i + delta;
          while (list[j] && list[j].page !== list[i].page) j += delta;
          if (i < 0 || !list[j]) return list;
          const next = [...list];
          [next[i], next[j]] = [next[j], next[i]];
          return next;
        });
        touch();
      },
    }),
    [editing, locale, sections]
  );

  const save = async () => {
    setStatus('Đang lưu…');
    const res = await fetch('/editor/sections', {
      method: 'PUT',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ sections }),
    }).catch(() => null);
    if (!res?.ok) {
      const body = res?.status === 422 ? await res.json().catch(() => null) : null;
      setStatus(res?.status === 401 || res?.status === 419 ? 'Phiên đăng nhập hết hạn' : body?.message ?? 'Lưu không thành công');
      return;
    }
    setDirty(false);
    setStatus('Đã lưu');
    router.reload({ only: ['sections', 'cms'] });
  };

  const discard = () => {
    setSections(props.sections);
    setDirty(false);
    setStatus('');
  };

  const btn = 'px-3 py-1.5 rounded-md text-sm font-semibold cursor-pointer disabled:opacity-40';

  return (
    <EditorContext.Provider value={value}>
      {children}
      {editing && panel && <HiddenPanel onClose={() => setPanel(false)} />}
      {props.canEdit && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-xl bg-white text-slate-900 shadow-2xl border border-slate-300 px-3 py-2 whitespace-nowrap">
          <button type="button" className={`${btn} ${editing ? 'bg-slate-900 text-white' : 'bg-amber-400'}`} onClick={() => setEditing(!editing)}>
            <Pencil className="inline w-3.5 h-3.5 mr-1" />
            {editing ? 'Xem thử' : 'Chỉnh sửa trang'}
          </button>
          {editing && (
            <>
              {(['vi', 'en'] as Locale[]).map((l) => (
                <button key={l} type="button" className={`${btn} ${locale === l ? 'bg-sky-600 text-white' : 'bg-slate-100'}`} onClick={() => setLocale(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
              <button type="button" className={`${btn} bg-emerald-600 text-white`} disabled={!dirty} onClick={save}>
                Lưu
              </button>
              <button type="button" className={`${btn} bg-slate-100`} disabled={!dirty} onClick={discard}>
                Huỷ
              </button>
              <button type="button" className={`${btn} ${panel ? 'bg-sky-600 text-white' : 'bg-slate-100'}`} onClick={() => setPanel(!panel)}>
                Chữ & ảnh khác
              </button>
              <a href="/admin/content-changes" target="_blank" rel="noreferrer" className={`${btn} bg-slate-100`}>
                <History className="inline w-3.5 h-3.5 mr-1" />
                Lịch sử
              </a>
              <span className="text-xs text-slate-500">{status || (dirty ? 'Chưa lưu' : '')}</span>
            </>
          )}
        </div>
      )}
    </EditorContext.Provider>
  );
}

/** Texts and images the page uses as plain values, which cannot be clicked on. */
function HiddenPanel({ onClose }: { onClose: () => void }) {
  const { sections, locale, update } = useEditor();
  const textSections = sections.filter((s) => s.template.startsWith('text.'));
  const imageSection = sections.find((s) => s.template === 'images');
  const texts = [...usedTexts].sort().flatMap((key) => {
    const section = textSections.find((s) => key in s.fields);
    return section ? [{ key, section }] : [];
  });

  return (
    <aside className="fixed top-0 right-0 bottom-0 z-[90] w-96 max-w-full overflow-y-auto bg-white text-slate-900 shadow-2xl border-l border-slate-300 p-4 pb-24 text-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold !text-base">Chữ & ảnh khác ({locale.toUpperCase()})</h2>
        <button type="button" className="px-2 py-1 rounded bg-slate-100 cursor-pointer" onClick={onClose}>
          Đóng
        </button>
      </div>
      <div className="text-xs text-slate-500 mb-4">Chỉ liệt kê nội dung trang này đang dùng. Nhớ bấm Lưu.</div>

      {imageSection &&
        [...usedImages].sort().map((key) => (
          <div key={key} className="mb-4 border border-slate-200 rounded-lg p-2">
            <div className="text-xs font-semibold text-slate-500 mb-1">{key}</div>
            <img src={imageSection.images[key]?.src} alt="" className="h-24 w-full object-cover rounded mb-1" />
            <SectionScope section={imageSection}>
              <ImageControl k={key} label="Đổi ảnh" className="relative" />
            </SectionScope>
          </div>
        ))}

      {texts.map(({ key, section }) => {
        const value = section.fields[key] as LocalizedText;
        return (
          <label key={key} className="block mb-3">
            <span className="block text-xs text-slate-500 mb-1 truncate">{value.vi}</span>
            <textarea
              rows={(value[locale] ?? '').length > 60 ? 3 : 1}
              value={value[locale] ?? ''}
              placeholder={locale === 'vi' ? '' : value.vi}
              maxLength={2000}
              className="w-full border border-slate-300 rounded px-2 py-1"
              onChange={(e) => {
                const next = e.target.value;
                update(section.id, (s) => ({ ...s, fields: { ...s.fields, [key]: { ...(s.fields[key] as LocalizedText), [locale]: next } } }));
              }}
            />
          </label>
        );
      })}
    </aside>
  );
}

/** Visible page text stored in the shared "text.*" sections, editable in place. */
export function Tx({ k, d }: { k: string; d: string }) {
  const { sections } = useEditor();
  const section = sections.find((s) => s.template.startsWith('text.') && k in s.fields);
  if (!section) return <>{d}</>;
  return (
    <SectionScope section={section}>
      <T k={k} d={d} />
    </SectionScope>
  );
}

function SectionScope({ section, children }: { section: SectionData; children: React.ReactNode }) {
  const { update } = useEditor();
  const change = (patch: (s: Scope) => Scope) => update(section.id, (s) => patch(s) as SectionData);
  return (
    <SectionContext.Provider value={section}>
      <ScopeContext.Provider value={{ scope: section, change, isItem: false }}>{children}</ScopeContext.Provider>
    </SectionContext.Provider>
  );
}

/** Header / footer: shared by every page, no ordering toolbar. Renders nothing if hidden or missing. */
export function GlobalSection({ template, children }: { template: string; children: (section: SectionData) => React.ReactNode }) {
  const { editing, sections } = useEditor();
  const section = sections.find((s) => s.template === template);
  if (!section || (!editing && !section.active)) return null;
  return <SectionScope section={section}>{children(section)}</SectionScope>;
}

/** Wraps one page block: ordering / visibility toolbar in edit mode, nothing extra otherwise. */
export function SectionFrame({ section, index, count, children }: { section: SectionData; index: number; count: number; children: React.ReactNode }) {
  const { editing, locale, update, move } = useEditor();
  const hiddenHere = section.hiddenLocales.includes(locale);
  const hidden = !section.active || hiddenHere;

  if (!editing && hidden) return null;

  const tool = 'p-1.5 rounded hover:bg-slate-200 cursor-pointer disabled:opacity-30';

  return (
    <SectionScope section={section}>
      {editing ? (
        <div className="relative outline-1 outline-dashed outline-amber-400/60">
          <div className="absolute top-2 right-2 z-40 flex items-center gap-1 rounded-lg bg-white text-slate-900 shadow-lg px-2 py-1 text-xs font-semibold">
            <span className="px-1 uppercase text-slate-500">{section.template}</span>
            <button type="button" title="Đưa lên" className={tool} disabled={index === 0} onClick={() => move(section.id, -1)}>
              <ArrowUp className="w-4 h-4" />
            </button>
            <button type="button" title="Đưa xuống" className={tool} disabled={index === count - 1} onClick={() => move(section.id, 1)}>
              <ArrowDown className="w-4 h-4" />
            </button>
            <button type="button" title={section.active ? 'Ẩn section' : 'Hiện section'} className={tool} onClick={() => update(section.id, (s) => ({ ...s, active: !s.active }))}>
              {section.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-600" />}
            </button>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={hiddenHere}
                onChange={() =>
                  update(section.id, (s) => ({
                    ...s,
                    hiddenLocales: hiddenHere ? s.hiddenLocales.filter((l) => l !== locale) : [...s.hiddenLocales, locale],
                  }))
                }
              />
              Ẩn ở bản {locale.toUpperCase()}
            </label>
          </div>
          {hidden && (
            <div className="absolute top-2 left-2 z-40 rounded-md bg-red-600 text-white text-xs font-bold px-2 py-1">Đang ẩn</div>
          )}
          <div className={hidden ? 'opacity-35' : undefined}>{children}</div>
        </div>
      ) : (
        children
      )}
    </SectionScope>
  );
}

/* ---------- repeatable items ---------- */

/** Items of one kind that should be rendered (editors also see hidden ones while editing). */
export function useItems(section: SectionData | undefined, kind: string): ItemData[] {
  const { editing } = useEditor();
  return (section?.items ?? []).filter((i) => i.kind === kind && (editing || i.active));
}

/**
 * Makes `<T>` / `<ImageControl>` inside refer to this item and, while editing, adds its toolbar
 * (reorder, hide, delete, link). `inline` suits horizontal lists such as menus and logos.
 */
export function Item({
  item,
  children,
  inline = false,
  linkable = false,
  imageKey,
  imageClassName = 'relative mt-1 mx-1 mb-1',
  className = '',
}: {
  item: ItemData;
  children: React.ReactNode;
  inline?: boolean;
  linkable?: boolean;
  imageKey?: string;
  imageClassName?: string;
  className?: string;
}) {
  const section = useContext(SectionContext)!;
  const { editing, update } = useEditor();

  const setItems = (fn: (items: ItemData[]) => ItemData[]) => update(section.id, (s) => ({ ...s, items: fn(s.items) }));
  const change = (patch: (s: Scope) => Scope) => setItems((items) => items.map((i) => (i.id === item.id ? (patch(i) as ItemData) : i)));
  const move = (delta: -1 | 1) =>
    setItems((items) => {
      const i = items.findIndex((x) => x.id === item.id);
      let j = i + delta;
      while (items[j] && items[j].kind !== item.kind) j += delta;
      if (!items[j]) return items;
      const next = [...items];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const scope = <ScopeContext.Provider value={{ scope: item, change, isItem: true }}>{children}</ScopeContext.Provider>;
  if (!editing) return className ? <div className={className}>{scope}</div> : scope;

  const tool = 'p-1 rounded hover:bg-slate-200 cursor-pointer';
  const Prev = inline ? ArrowLeft : ArrowUp;
  const Next = inline ? ArrowRight : ArrowDown;

  return (
    <ScopeContext.Provider value={{ scope: item, change, isItem: true }}>
      <div className={`group/item relative outline-1 outline-dashed outline-fuchsia-400/60 ${className}`}>
        <div className={item.active ? 'h-full' : 'h-full opacity-35'}>{children}</div>
        <div
          className="absolute z-50 right-0 top-0 -translate-y-full hidden group-hover/item:flex group-focus-within/item:flex items-center gap-0.5 rounded-md bg-white text-slate-900 shadow-xl border border-slate-300 p-0.5 text-xs whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" title="Đưa lên / sang trái" className={tool} onClick={() => move(-1)}>
            <Prev className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Đưa xuống / sang phải" className={tool} onClick={() => move(1)}>
            <Next className="w-3.5 h-3.5" />
          </button>
          <button type="button" title={item.active ? 'Ẩn mục' : 'Hiện mục'} className={tool} onClick={() => change((s) => ({ ...s, active: !item.active }) as Scope)}>
            {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-600" />}
          </button>
          {linkable && (
            <button
              type="button"
              title={`Đường dẫn: ${item.link ?? '(chưa có)'}`}
              className={tool}
              onClick={() => {
                const next = window.prompt(
                  'Đường dẫn (ví dụ /du-an, https://…, mailto:…, tel:…, modal:pitch-deck)',
                  item.link ?? ''
                );
                if (next !== null) change((s) => ({ ...s, link: next.trim() }) as Scope);
              }}
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            title="Xoá mục"
            className={tool}
            onClick={() => window.confirm('Xoá mục này?') && setItems((items) => items.filter((x) => x.id !== item.id))}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </button>
        </div>
        {imageKey && (
          <ImageControl k={imageKey} label={item.images[imageKey] ? 'Đổi ảnh' : 'Thêm ảnh'} className={imageClassName} removable />
        )}
      </div>
    </ScopeContext.Provider>
  );
}

/** Makes `<T>` / `<ImageControl>` refer to an item without adding any markup (table rows, slides). */
export function ItemScope({ item, children }: { item: ItemData; children: React.ReactNode }) {
  const section = useContext(SectionContext)!;
  const { update } = useEditor();
  const change = (patch: (s: Scope) => Scope) =>
    update(section.id, (s) => ({ ...s, items: s.items.map((i) => (i.id === item.id ? (patch(i) as ItemData) : i)) }));
  return <ScopeContext.Provider value={{ scope: item, change, isItem: true }}>{children}</ScopeContext.Provider>;
}

/** Always-visible reorder / hide / delete buttons for an item. */
export function ItemTools({ item }: { item: ItemData }) {
  const section = useContext(SectionContext)!;
  const { editing, update } = useEditor();
  if (!editing) return null;

  const setItems = (fn: (items: ItemData[]) => ItemData[]) => update(section.id, (s) => ({ ...s, items: fn(s.items) }));
  const move = (delta: -1 | 1) =>
    setItems((items) => {
      const i = items.findIndex((x) => x.id === item.id);
      let j = i + delta;
      while (items[j] && items[j].kind !== item.kind) j += delta;
      if (!items[j]) return items;
      const next = [...items];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const tool = 'p-1 rounded hover:bg-slate-200 cursor-pointer';

  return (
    <span className="inline-flex items-center gap-0.5 rounded-md bg-white text-slate-900 shadow border border-slate-300 p-0.5" onClick={(e) => e.stopPropagation()}>
      <button type="button" title="Đưa lên" className={tool} onClick={() => move(-1)}>
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button type="button" title="Đưa xuống" className={tool} onClick={() => move(1)}>
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
      <button type="button" title={item.active ? 'Ẩn mục' : 'Hiện mục'} className={tool} onClick={() => setItems((items) => items.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i)))}>
        {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-600" />}
      </button>
      <button type="button" title="Xoá mục" className={tool} onClick={() => window.confirm('Xoá mục này?') && setItems((items) => items.filter((x) => x.id !== item.id))}>
        <Trash2 className="w-3.5 h-3.5 text-red-600" />
      </button>
    </span>
  );
}

export function AddItem({ kind, fields, link = null, label, className = '' }: {
  kind: string;
  fields: Record<string, string>;
  link?: string | null;
  label: string;
  className?: string;
}) {
  const section = useContext(SectionContext)!;
  const { editing, update } = useEditor();
  if (!editing) return null;

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1 rounded-md border border-dashed border-fuchsia-400 bg-white text-slate-900 px-2 py-1 text-xs font-semibold cursor-pointer whitespace-nowrap ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        const item: ItemData = {
          id: tempId--,
          kind,
          active: true,
          link,
          icon: null,
          fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, { vi: v }])),
          images: {},
        };
        update(section.id, (s) => ({ ...s, items: [...s.items, item] }));
      }}
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

/* ---------- text and images ---------- */

export function resolve(value: string | LocalizedText | undefined, locale: Locale, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (value.removed) return '';
  // An emptied VI text stays empty (same as the public page); an empty translation falls back to VI.
  return value[locale] || (value.vi ?? fallback);
}

/** Plain value of a field in the current scope (for hrefs, numbers, attributes). */
export function useField(): (k: string, d?: string) => string {
  const ctx = useContext(ScopeContext);
  const { locale } = useEditor();
  return (k, d = '') => resolve(ctx?.scope.fields[k], locale, d);
}

/** A piece of text, editable in place. `d` is the in-code default. */
export function T({ k, d = '' }: { k: string; d?: string }) {
  const ctx = useContext(ScopeContext);
  const { editing, locale } = useEditor();
  const ref = useRef<HTMLSpanElement>(null);
  const raw = ctx?.scope.fields[k];
  const text = resolve(raw, locale, d);
  const removed = typeof raw === 'object' && !!raw.removed;
  // Editors receive objects; a missing key on an item can still be filled in.
  const editable = editing && ctx !== null && (typeof raw === 'object' || (raw === undefined && ctx.isItem));
  const missing = editable && locale !== 'vi' && !(raw as LocalizedText | undefined)?.[locale];

  useEffect(() => {
    if (editable && ref.current && document.activeElement !== ref.current) ref.current.textContent = text;
  }, [editable, text, locale, removed]);

  // Nothing at all (not even a text node) so that empty headings/paragraphs collapse.
  if (!editable) return text ? <>{text}</> : null;

  const stop = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Commit while typing so "Lưu" always sees the latest text.
  const commit = (next: string) => {
    if (next === text) return;
    ctx!.change((s) => ({
      ...s,
      fields: { ...s.fields, [k]: { ...(s.fields[k] as LocalizedText), [locale]: next } },
    }));
  };

  const setRemoved = (value: boolean) =>
    ctx!.change((s) => ({
      ...s,
      fields: { ...s.fields, [k]: { ...((s.fields[k] as LocalizedText) ?? { vi: d }), removed: value } },
    }));

  // Spans with role="button": text often sits inside a real <button>, which cannot nest another.
  if (removed) {
    const original = (raw as LocalizedText)[locale] || (raw as LocalizedText).vi || d;
    return (
      <span
        role="button"
        tabIndex={0}
        title={`Đã xoá: “${original}” — bấm để khôi phục`}
        className="inline-flex items-center gap-1 rounded border border-dashed border-red-400 bg-red-500/15 px-1.5 text-xs font-medium text-red-400 line-through cursor-pointer align-middle max-w-48"
        onClick={(e) => {
          stop(e);
          setRemoved(false);
        }}
      >
        <Undo2 className="w-3 h-3 shrink-0" />
        <span className="truncate">{original}</span>
      </span>
    );
  }

  return (
    <span className="relative group/t">
    <span
      ref={ref}
      data-k={k}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck={false}
      title={missing ? `Thiếu bản ${locale.toUpperCase()} — đang hiện tiếng Việt` : 'Bấm để sửa'}
      className={`cursor-text rounded-sm ${text ? '' : 'inline-block min-w-12'} outline-1 outline-dashed focus:outline-2 focus:outline-solid focus:outline-sky-400 ${missing ? 'outline-red-400' : 'outline-sky-400/50'}`}
      onClick={stop}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        } else if (e.key === ' ') {
          // Inside a <button>, space would "click" the button instead of typing.
          e.preventDefault();
          document.execCommand('insertText', false, ' ');
        }
      }}
      onKeyUp={(e) => e.key === ' ' && stop(e)}
      onInput={(e) => commit(e.currentTarget.textContent ?? '')}
      onBlur={(e) => commit(e.currentTarget.textContent ?? '')}
    />
      <span
        role="button"
        title="Xoá đoạn chữ này"
        className="absolute -top-2.5 -right-2.5 z-50 hidden group-hover/t:flex group-focus-within/t:flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white shadow cursor-pointer"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => {
          stop(e);
          setRemoved(true);
        }}
      >
        <Trash2 className="w-3 h-3" />
      </span>
    </span>
  );
}

/** Renders its children only while at least one of the texts still exists (always while editing). */
export function IfText({ k, children }: { k: string | string[]; children: React.ReactNode }) {
  const field = useField();
  const { editing } = useEditor();
  const keys = Array.isArray(k) ? k : [k];
  // A key that was never stored falls back to its in-code default, so it counts as present.
  return editing || keys.some((key) => field(key, ' ') !== '') ? <>{children}</> : null;
}

/** "Change image" + alt controls for an image of the current scope. Renders nothing outside edit mode. */
export function ImageControl({ k, label, className = 'absolute top-2 left-2', removable = false }: {
  k: string;
  label: string;
  className?: string;
  removable?: boolean;
}) {
  const ctx = useContext(ScopeContext);
  const { editing, locale } = useEditor();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const image = ctx?.scope.images[k];

  if (!editing || !ctx) return null;

  const upload = async (file: File) => {
    setBusy(true);
    setError('');
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/editor/upload', { method: 'POST', headers: headers(), body }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setError('Tải ảnh lỗi (jpg/png/webp, tối đa 5MB)');
      return;
    }
    const uploaded = await res.json();
    ctx.change((s) => ({
      ...s,
      images: { ...s.images, [k]: { ...uploaded, alts: s.images[k]?.alts ?? {}, alt: s.images[k]?.alt ?? '' } },
    }));
  };

  return (
    <div className={`${className} z-30 flex flex-col gap-1 rounded-lg bg-white/95 text-slate-900 shadow-lg p-2 text-xs`} onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-1 font-semibold cursor-pointer">
          <ImagePlus className="w-4 h-4" />
          {busy ? 'Đang tải…' : label}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = '';
            }}
          />
        </label>
        {removable && image && (
          <button
            type="button"
            title="Bỏ ảnh"
            className="cursor-pointer"
            onClick={() => ctx.change((s) => ({ ...s, images: Object.fromEntries(Object.entries(s.images).filter(([key]) => key !== k)) }))}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </button>
        )}
      </div>
      {image && (
        <input
          type="text"
          value={image.alts?.[locale] ?? ''}
          placeholder={`Mô tả ảnh (alt) ${locale.toUpperCase()}`}
          maxLength={200}
          className="border border-slate-300 rounded px-1.5 py-0.5 w-full min-w-0"
          onChange={(e) => {
            const alt = e.target.value;
            ctx.change((s) => ({
              ...s,
              images: { ...s.images, [k]: { ...s.images[k], alts: { ...s.images[k].alts, [locale]: alt } } },
            }));
          }}
        />
      )}
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}

/** An image of the current scope, with the alt text for the active language. */
export function SectionImg({ k, alt, className }: { k: string; alt: string; className?: string }) {
  const ctx = useContext(ScopeContext);
  const { locale } = useEditor();
  const image = ctx?.scope.images[k];
  const src = image && { ...image, alt: image.alts?.[locale] || image.alts?.vi || image.alt };
  return <ResilientImage src={src} alt={alt} className={className} />;
}

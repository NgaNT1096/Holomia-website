import React from 'react';
import { AddItem, Item, ItemData, SectionImg, T, useEditor, useField, useItems, GlobalSection } from '../lib/editor';

interface PartnerLogosProps {
  variant?: 'dark' | 'light';
}

const stroke = { stroke: 'currentColor', strokeWidth: 1.8, strokeLinejoin: 'round' as const };

/** Built-in line marks; an uploaded logo replaces the mark and the text. */
const MARKS: Record<string, { box: string; size: string; node: React.ReactNode }> = {
  meta: {
    box: '0 0 36 22',
    size: 'w-7 h-4',
    node: <path d="M10.5 3C6.5 3 3 7.4 3 12.2C3 16 5.2 19 8.4 19C11.3 19 13.4 16.5 16.3 11.4L18 8.4L19.7 11.4C22.6 16.5 24.7 19 27.6 19C30.8 19 33 16 33 12.2C33 7.4 29.5 3 25.5 3C22.5 3 20.3 5.2 18 8.4C15.7 5.2 13.5 3 10.5 3Z" {...stroke} strokeWidth={2.4} />,
  },
  vov: {
    box: '0 0 28 24',
    size: 'w-6 h-5',
    node: (
      <>
        <circle cx="14" cy="12" r="9.5" {...stroke} />
        <path d="M9 12C9 9.2 11.2 7 14 7M19 12C19 14.8 16.8 17 14 17" {...stroke} strokeLinecap="round" />
        <circle cx="14" cy="12" r="2" fill="currentColor" />
      </>
    ),
  },
  oxalis: { box: '0 0 28 24', size: 'w-6 h-5', node: <path d="M3 19L10.5 6L16 14.5L19.5 9.5L25 19H3Z" {...stroke} /> },
  svw: {
    box: '0 0 26 24',
    size: 'w-6 h-5',
    node: (
      <>
        <path d="M13 3C8.5 3 5 6.8 5 11.5C5 16.8 9.2 20.5 13 21C16.8 20.5 21 16.8 21 11.5C21 6.8 17.5 3 13 3Z" {...stroke} />
        <path d="M13 7V17M9.5 11.5L13 14.5L16.5 11.5" {...stroke} strokeWidth={1.6} strokeLinecap="round" />
      </>
    ),
  },
  landmark: { box: '0 0 24 26', size: 'w-5 h-5', node: <path d="M8 23V9L12 2L16 9V23M5 23V14L8 12M19 23V14L16 12" {...stroke} /> },
  lotte: {
    box: '0 0 24 24',
    size: 'w-5 h-5',
    node: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" {...stroke} />
        <path d="M9 8V16H15" {...stroke} strokeWidth={2} strokeLinecap="round" />
      </>
    ),
  },
  t20: {
    box: '0 0 26 24',
    size: 'w-6 h-5',
    node: (
      <>
        <path d="M3 19C3 11.8 7.5 6 13 6C18.5 6 23 11.8 23 19H3Z" {...stroke} />
        <path d="M13 10V19" {...stroke} strokeWidth={1.6} />
      </>
    ),
  },
};

function Logo({ item, tone }: { item: ItemData; tone: string }) {
  const { editing } = useEditor();
  const field = useField();
  const mark = item.icon ? MARKS[item.icon] : undefined;
  const name = field('name');

  if (item.images.logo) {
    return (
      <div className="flex items-center justify-center h-10" title={name}>
        <SectionImg k="logo" alt={name} className="max-h-10 w-auto max-w-full object-contain" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-2 min-h-10 transition-colors ${tone}`} title={name}>
      {mark && (
        <svg viewBox={mark.box} className={`${mark.size} shrink-0`} fill="none" aria-hidden="true">
          {mark.node}
        </svg>
      )}
      <div className="leading-none">
        <div className="font-display font-bold text-sm tracking-tight whitespace-nowrap">
          <T k="name" />
        </div>
        {(editing || field('sub')) && (
          <div className="text-[9px] tracking-widest opacity-75 mt-0.5">
            <T k="sub" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Partner list of the home "partners" section, also reused on the About page. */
export const PartnerList: React.FC<PartnerLogosProps & { items: ItemData[] }> = ({ variant = 'dark', items }) => {
  const tone = variant === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-[#0B0F19]';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 items-center">
      {items.map((item) => (
        <Item key={item.id} item={item} inline imageKey="logo">
          <Logo item={item} tone={tone} />
        </Item>
      ))}
    </div>
  );
};

/** Inside the home partners section (editable in place). */
export const HomePartners: React.FC<{ section: Parameters<typeof useItems>[0] }> = ({ section }) => {
  const items = useItems(section, 'partner');
  return (
    <>
      <PartnerList items={items} />
      <AddItem kind="partner" label="Thêm đối tác" className="mt-4" fields={{ name: 'Đối tác mới', sub: '' }} />
    </>
  );
};

/** Read from the shared home section on other pages. */
export const PartnerLogos: React.FC<PartnerLogosProps> = ({ variant = 'dark' }) => (
  <GlobalSection template="partners">
    {(section) => <PartnerList variant={variant} items={section.items.filter((i) => i.kind === 'partner' && i.active)} />}
  </GlobalSection>
);

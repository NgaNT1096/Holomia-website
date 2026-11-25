import { useNumberLocale } from '../lib/locale';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { HomePartners } from './PartnerLogos';
import { AddItem, IfText, Item, ItemData, SectionData, SectionImg, T, useEditor, useField, useItems } from '../lib/editor';
import { useFollow } from '../lib/links';

/* ---------- partners + counters ---------- */

function Counter({ progress }: { progress: number }) {
  const { editing } = useEditor();
  const field = useField();
  const numberLocale = useNumberLocale();
  const value = field('value');
  const target = Number(value.replace(/[^0-9]/g, ''));
  // Animate plain numbers only; anything else is shown as typed.
  const animated = /^[0-9.,]+$/.test(value) ? Math.max(1, Math.round(target * progress)).toLocaleString(numberLocale) : value;

  return (
    <div className="bg-[#0F172A]/70 border border-white/10 rounded-xl px-5 py-4 h-full">
      <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-[#00E5FF] tracking-tight whitespace-nowrap">
        {editing ? <T k="value" /> : animated}
        {/* "100 Kính" has a space, "2.000+" does not. */}
        {/^\p{L}/u.test(field('suffix')) && ' '}
        <T k="suffix" />
      </div>
      <p className="text-xs sm:text-sm text-slate-300 mt-1 whitespace-nowrap truncate">
        <T k="label" />
      </p>
    </div>
  );
}

export function PartnersBlock({ section }: { section: SectionData }) {
  const counters = useItems(section, 'counter');
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done) return;
        done = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, Math.max(0, (now - start) / 850));
          setProgress(1 - Math.pow(1 - p, 3));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#0B0F19] border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="pb-8 border-b border-white/10">
          <HomePartners section={section} />
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {counters.map((item) => (
            <Item key={item.id} item={item} inline>
              <Counter progress={progress} />
            </Item>
          ))}
        </div>
        <AddItem kind="counter" label="Thêm số liệu" className="mt-4" fields={{ value: '100', suffix: '+', label: 'Số liệu mới' }} />
      </div>
    </section>
  );
}

/* ---------- solution cards ---------- */

function PillarCard({ item, number }: { item: ItemData; number: number }) {
  const { editing } = useEditor();
  const field = useField();
  const follow = useFollow();
  const bullets = ['bullet1', 'bullet2', 'bullet3', 'bullet4'].filter((k) => editing || field(k));

  return (
    <div
      onClick={() => follow(item.link)}
      className="group h-full bg-[#0B0F19] border border-white/12 hover:border-[#00E5FF]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-colors cursor-pointer"
    >
      <div>
        <div className="h-44 overflow-hidden relative border-b border-white/10">
          <SectionImg k="image" alt={field('title')} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/30 to-transparent" />
          <div className="absolute bottom-3.5 left-5 right-5">
            <span className="text-xs font-mono-num font-bold text-[#00E5FF]">{String(number).padStart(2, '0')}</span>
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              <T k="title" />
            </h3>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            <T k="description" />
          </p>
          <div className="pt-4 border-t border-white/10 space-y-3">
            {bullets.map((k) => (
              <div key={k} className="flex items-start gap-2.5 text-sm text-slate-200 leading-snug">
                <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>
                  <T k={k} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <IfText k="linkLabel">
      <div className="px-5 sm:px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3 text-sm font-semibold text-[#00E5FF] group-hover:text-white transition-colors">
        <span>
          <T k="linkLabel" />
        </span>
        <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
      </IfText>
    </div>
  );
}

export function PillarsBlock({ section }: { section: SectionData }) {
  const cards = useItems(section, 'card');

  return (
    <section className="bg-[#0E1422] py-18 lg:py-20 border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-9">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            <T k="home.014" d="Ba mô hình" />{' '}
            <span className="text-[#00E5FF]">
              <T k="home.015" d="triển khai" />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((item, i) => (
            <Item key={item.id} item={item} inline linkable imageKey="image" imageClassName="absolute top-2 left-2 right-2">
              <PillarCard item={item} number={i + 1} />
            </Item>
          ))}
        </div>
        <AddItem
          kind="card"
          label="Thêm mô hình"
          link="/"
          className="mt-6"
          fields={{ title: 'Mô hình mới', description: 'Mô tả', bullet1: 'Ý chính', bullet2: '', bullet3: '', bullet4: '', linkLabel: 'Xem thêm' }}
        />
      </div>
    </section>
  );
}

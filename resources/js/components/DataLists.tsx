import React, { useState } from 'react';
import { AddItem, GlobalSection, ImageControl, Item, ItemScope, ItemTools, SectionData, SectionImg, T, useEditor, useField, useItems } from '../lib/editor';
import { resolve, Tx } from '../lib/editor';

/* ---------- floor-plan sizes ---------- */

const Footprints: React.FC<{ section: SectionData }> = ({ section }) => {
  const { locale } = useEditor();
  const items = useItems(section, 'footprint');
  const [selected, setSelected] = useState<number | null>(null);
  const active = items.find((i) => i.id === selected) ?? items[1] ?? items[0];
  const area = (i: (typeof items)[number]) => resolve(i.fields.area, locale, '');

  const stat = (k: string, valueClass: string, label: React.ReactNode) => (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className={valueClass}>
        <T k={k} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0B0F19] border border-white/10 rounded-xl w-fit">
        {items.map((fp) => (
          <button
            key={fp.id}
            type="button"
            onClick={() => setSelected(fp.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono-num transition-colors cursor-pointer ${
              active?.id === fp.id ? 'bg-[#00E5FF] text-[#0B0F19]' : 'text-slate-300 hover:text-white'
            }`}
          >
            {area(fp)}
          </button>
        ))}
        <AddItem kind="footprint" label="Thêm cỡ" fields={{ area: '200 m²', players: '', power: '', throughput: '', idealFor: '' }} />
      </div>

      {active && (
        <Item key={active.id} item={active}>
          <div className="bg-[#0B0F19] border border-white/12 rounded-2xl p-6 space-y-4">
            <div className="text-xs font-semibold text-[#00E5FF]">
              <SectionHeading section={section} /> · <T k="area" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {stat('players', 'text-lg font-bold font-mono-num text-white mt-0.5', <Label k="platform.008" d="Số lượng kính" />)}
              {stat('throughput', 'text-lg font-bold font-mono-num text-[#00E5FF] mt-0.5', <Label k="platform.009" d="Công suất phục vụ" />)}
              {stat('power', 'text-lg font-bold font-mono-num text-white mt-0.5', <Label k="platform.010" d="Điện năng" />)}
              {stat('idealFor', 'text-sm font-medium text-slate-200 mt-1', <Label k="platform.011" d="Phù hợp" />)}
            </div>
          </div>
        </Item>
      )}
    </div>
  );
};

// Texts that belong to the section / page while rendering inside an item.
const Label: React.FC<{ k: string; d: string }> = ({ k, d }) => <Tx k={k} d={d} />;
const SectionHeading: React.FC<{ section: SectionData }> = ({ section }) => (
  <GlobalSection template={section.template}>{() => <T k="heading" d="Cấu hình đề xuất" />}</GlobalSection>
);

export const FootprintConfigurator: React.FC = () => (
  <GlobalSection template="footprints">{(section) => <Footprints section={section} />}</GlobalSection>
);

/* ---------- hardware specs ---------- */

const Specs: React.FC<{ section: SectionData; className: string }> = ({ section, className }) => {
  const items = useItems(section, 'spec');
  return (
    <div>
      <div className={className}>
        {items.map((item) => (
          <Item key={item.id} item={item} inline>
            <div className="h-full p-3.5 rounded-xl bg-[#0B0F19] border border-white/10">
              <div className="text-xs text-slate-400">
                <T k="label" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-0.5 font-mono-num">
                <T k="value" />
              </div>
            </div>
          </Item>
        ))}
      </div>
      <AddItem kind="spec" label="Thêm thông số" className="mt-2" fields={{ label: 'Thông số', value: '0' }} />
    </div>
  );
};

export const SpecGrid: React.FC<{ className?: string }> = ({ className = 'grid grid-cols-2 gap-3' }) => (
  <GlobalSection template="specs">{(section) => <Specs section={section} className={className} />}</GlobalSection>
);

/* ---------- shift report ---------- */

const Report: React.FC<{ section: SectionData; multiplier: number }> = ({ section, multiplier }) => {
  const { editing, locale } = useEditor();
  const rows = useItems(section, 'shift');
  const num = (v: string) => Number(v.replace(/[^0-9]/g, '')) || 0;
  const value = (row: (typeof rows)[number], k: string) => resolve(row.fields[k], locale, '');
  const visible = rows.filter((r) => r.active);
  const total = (k: string) => (visible.reduce((sum, r) => sum + num(value(r, k)), 0) * multiplier).toLocaleString('vi-VN');
  // While editing show the stored daily figure; visitors see it multiplied for the chosen period.
  const cell = (row: (typeof rows)[number], k: string) =>
    editing ? <T k={k} /> : (num(value(row, k)) * multiplier).toLocaleString('vi-VN');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500">
            <Tx k="platform.018" d="Tổng lượt khách" />
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-[#0B0F19] mt-1">{total('guests')}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">
            <Tx k="platform.019" d="Số phiên đã chạy" />
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-[#0284C7] mt-1">{total('sessions')}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">
            <Tx k="platform.020" d="Xoay vòng trung bình" />
          </div>
          <div className="text-3xl font-extrabold font-mono-num text-[#0B0F19] mt-1">
            <Tx k="platform.021" d="42 giây" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
              <th className="py-3 pr-4"><Tx k="platform.022" d="Ca trực" /></th>
              <th className="py-3 px-4"><Tx k="platform.023" d="Chế độ" /></th>
              <th className="py-3 px-4 text-right"><Tx k="platform.024" d="Số phiên" /></th>
              <th className="py-3 px-4 text-right"><Tx k="platform.025" d="Lượt khách" /></th>
              <th className="py-3 pl-4 text-right"><Tx k="platform.026" d="Ổn định" /></th>
              {editing && <th />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {rows.map((row) => (
              <ItemScope key={row.id} item={row}>
                <tr className={row.active ? undefined : 'opacity-35'}>
                  <td className="py-3.5 pr-4 font-medium text-slate-900"><T k="shift" /></td>
                  <td className="py-3.5 px-4 text-slate-600"><T k="mode" /></td>
                  <td className="py-3.5 px-4 text-right font-mono-num">{cell(row, 'sessions')}</td>
                  <td className="py-3.5 px-4 text-right font-mono-num font-semibold text-[#0284C7]">{cell(row, 'guests')}</td>
                  <td className="py-3.5 pl-4 text-right font-mono-num text-emerald-700 font-medium"><T k="uptime" /></td>
                  {editing && (
                    <td className="pl-3">
                      <ItemTools item={row} />
                    </td>
                  )}
                </tr>
              </ItemScope>
            ))}
          </tbody>
        </table>
      </div>
      <AddItem kind="shift" label="Thêm ca" fields={{ shift: 'Ca mới', mode: 'Holomia Journey', sessions: '0', guests: '0', uptime: '100%' }} />
    </div>
  );
};

export const ShiftReport: React.FC<{ multiplier: number }> = ({ multiplier }) => (
  <GlobalSection template="report">{(section) => <Report section={section} multiplier={multiplier} />}</GlobalSection>
);

/* ---------- Holomia Custom cards ---------- */

const CustomCard: React.FC = () => {
  const field = useField();
  return (
    <div className="h-full bg-[#0B0F19] border border-white/12 rounded-2xl overflow-hidden">
      <div className="h-52 relative">
        <SectionImg k="image" alt={field('title')} className="w-full h-full object-cover" />
        <ImageControl k="image" label="Đổi ảnh" className="absolute top-2 left-2 right-2" />
      </div>
      <div className="p-6 space-y-2">
        <div className="text-xs font-semibold text-[#00E5FF]">
          <T k="tag" />
        </div>
        <h3 className="text-xl font-bold text-white">
          <T k="title" />
        </h3>
        <p className="text-sm text-slate-300">
          <T k="description" />
        </p>
      </div>
    </div>
  );
};

const Customs: React.FC<{ section: SectionData }> = ({ section }) => {
  const items = useItems(section, 'card');
  return (
    <div className="max-w-[1200px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Item key={item.id} item={item} inline>
            <CustomCard />
          </Item>
        ))}
      </div>
      <AddItem kind="card" label="Thêm thẻ" className="mt-6" fields={{ tag: 'Nhóm', title: 'Tiêu đề', description: 'Mô tả' }} />
    </div>
  );
};

export const CustomCards: React.FC = () => (
  <GlobalSection template="custom">{(section) => <Customs section={section} />}</GlobalSection>
);

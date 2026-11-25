import { Tx } from '../lib/editor';
import React, { useState } from 'react';
import { useCms, useLocalized  } from '../lib/cms';
import { Compass, Crosshair, Clock, Users, RefreshCw } from 'lucide-react';
import { IMAGES, VENUE_MODES as VENUE_MODES_RAW } from '../data/holomiaData';
import { PlatformModeId } from '../types/holomia';
import { ResilientImage } from './ResilientImage';

export const VenueDualModeShowcase: React.FC = () => {
  const { t } = useCms();
  const VENUE_MODES = useLocalized(VENUE_MODES_RAW, 'VENUE_MODES');
  const [mode, setMode] = useState<PlatformModeId>('journey');
  const active = VENUE_MODES[mode];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      {/* Left: Time-of-day Strategy & Interactive Cards */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-wider text-[#00E5FF]">
            <Tx k="venue.001" d={"KHAI THÁC THEO KHUNG GIỜ"} />
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            <Tx k="venue.002" d={"Một mặt bằng, hai cách khai thác"} />
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            <Tx k="venue.003" d={"Đón khách khám phá di sản với Holomia Journey và tổ chức phiên giải trí nhóm với Omega Arena trên cùng mặt bằng tương thích."} />
          </p>
        </div>

        {/* 2 Clickable Day-Part Cards */}
        <div className="space-y-3">
          {(['journey', 'arena'] as const).map((key) => {
            const item = VENUE_MODES[key];
            const isSelected = mode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                  isSelected
                    ? key === 'journey'
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF]'
                      : 'bg-[#F59E0B]/10 border-[#F59E0B]'
                    : 'bg-[#0B0F19]/60 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      key === 'journey' ? 'text-[#00E5FF]' : 'text-[#F59E0B]'
                    }`}
                  >
                    {item.timeSlot}
                  </span>
                  <span className="text-xs font-bold text-white">{item.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
                  {item.targetAudience} · {item.sessionCycle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Mode Panel matching Reference + Full Operational Detail */}
      <div className="lg:col-span-7">
        <div className="bg-[#0F172A] border border-white/15 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              <Tx k="venue.004" d={"Bảng điều khiển mô phỏng · Chọn chế độ"} />
            </span>
            <span className="text-xs font-medium text-slate-300 font-mono-num">
              {active.timeSlot}
            </span>
          </div>

          {/* Mode Tabs */}
          <div
            role="tablist"
            aria-label={t('venue.010', "Chuyển đổi cách khai thác mặt bằng")}
            className="inline-flex items-center gap-2"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'journey'}
              onClick={() => setMode('journey')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                mode === 'journey'
                  ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                  : 'bg-[#0B0F19] border-white/15 text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span><Tx k="venue.005" d={"Holomia Journey"} /></span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mode === 'arena'}
              onClick={() => setMode('arena')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                mode === 'arena'
                  ? 'bg-[#F59E0B]/15 border-[#F59E0B] text-[#F59E0B]'
                  : 'bg-[#0B0F19] border-white/15 text-slate-300 hover:text-white'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span><Tx k="venue.006" d={"Omega Arena"} /></span>
            </button>
          </div>

          {/* Visual Showcase Card */}
          <div className="relative rounded-xl overflow-hidden border border-white/15 min-h-[210px]">
            <ResilientImage
              key={active.id}
              src={active.image}
              alt={active.imageAlt}
              className="w-full h-56 object-cover"
            />
            <div
              className={`absolute inset-0 ${
                mode === 'journey'
                  ? 'bg-gradient-to-r from-[#061824]/95 via-[#072030]/80 to-[#0B0F19]/40'
                  : 'bg-gradient-to-r from-[#241407]/95 via-[#22150B]/80 to-[#0B0F19]/40'
              }`}
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-center max-w-lg">
              <div
                className={`text-xs font-bold tracking-wider ${
                  mode === 'journey' ? 'text-[#00E5FF]' : 'text-[#F59E0B]'
                }`}
              >
                {active.kicker}
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">
                {active.title}
              </h3>
              <p className="text-sm text-slate-200 mt-2 leading-relaxed">
                {active.description}
              </p>
            </div>
          </div>

          {/* 3 Core Parameters */}
          <div className="grid grid-cols-3 gap-4 pt-1">
            {active.metrics.map((m) => (
              <div key={m.label}>
                <div
                  className={`text-lg sm:text-xl font-extrabold font-mono-num ${
                    mode === 'journey' ? 'text-[#00E5FF]' : 'text-[#F59E0B]'
                  }`}
                >
                  {m.value}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Complete Operational Breakdown */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span><Tx k="venue.007" d={"Tệp khách chính"} /></span>
              </div>
              <div className="text-slate-200 font-medium">{active.targetAudience}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span><Tx k="venue.008" d={"Nhịp vận hành"} /></span>
              </div>
              <div className="text-slate-200 font-medium">{active.sessionCycle}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <RefreshCw className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span><Tx k="venue.009" d={"Chuyển đổi chế độ"} /></span>
              </div>
              <div className="text-slate-200 font-medium">{active.switchTime}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

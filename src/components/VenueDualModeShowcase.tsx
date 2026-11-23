import React, { useState } from 'react';
import { Compass, Crosshair, Clock, Users, RefreshCw } from 'lucide-react';
import { IMAGES } from '../data/holomiaData';
import { PlatformModeId } from '../types/holomia';
import { ResilientImage } from './ResilientImage';

const VENUE_MODES: Record<
  PlatformModeId,
  {
    id: PlatformModeId;
    tabLabel: string;
    kicker: string;
    title: string;
    description: string;
    timeSlot: string;
    targetAudience: string;
    sessionCycle: string;
    switchTime: string;
    image: string;
    imageAlt: string;
    metrics: { value: string; label: string }[];
  }
> = {
  journey: {
    id: 'journey',
    tabLabel: 'Holomia Journey',
    kicker: 'DI SẢN · TUYẾN TRẢI NGHIỆM',
    title: 'Holomia Journey',
    description:
      'Chia nhóm theo tuyến, đồng bộ nội dung và chuyển chặng theo kịch bản.',
    timeSlot: 'Ban ngày · 09:00 – 17:00',
    targetAudience: 'Gia đình, học sinh & khách tham quan',
    sessionCycle: '5–8 phút / lượt · Xoay vòng liên tục',
    switchTime: '1 chạm trên Tablet · Giữ nguyên sàn đấu',
    image: IMAGES.caseSonDoong,
    imageAlt: 'Trải nghiệm di sản Holomia Journey theo tuyến',
    metrics: [
      { value: '100', label: 'Giới hạn thiết bị' },
      { value: 'Theo tuyến', label: 'Điều phối phiên' },
      { value: 'Tablet', label: 'Điểm điều khiển' },
    ],
  },
  arena: {
    id: 'arena',
    tabLabel: 'Omega Arena',
    kicker: 'GIẢI TRÍ · SÀN CHƠI NHÓM',
    title: 'Omega Arena',
    description:
      'Chọn nội dung giải trí, tổ chức đội và khởi chạy phiên chơi trên cùng mặt bằng.',
    timeSlot: 'Buổi tối & Cuối tuần · 17:30 – 22:00',
    targetAudience: 'Nhóm bạn trẻ, đồng nghiệp & game thủ',
    sessionCycle: '12 phút / trận · Bảng điểm trực tiếp',
    switchTime: '1 chạm trên Tablet · Không tháo lắp phần cứng',
    image: IMAGES.caseLandmark,
    imageAlt: 'Đấu trường nhóm không dây Omega Arena tại trung tâm thương mại',
    metrics: [
      { value: '100', label: 'Giới hạn thiết bị' },
      { value: 'Theo đội', label: 'Điều phối phiên' },
      { value: 'Tablet', label: 'Điểm điều khiển' },
    ],
  },
};

export const VenueDualModeShowcase: React.FC = () => {
  const [mode, setMode] = useState<PlatformModeId>('journey');
  const active = VENUE_MODES[mode];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      {/* Left: Time-of-day Strategy & Interactive Cards */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-wider text-[#00E5FF]">
            KHAI THÁC THEO KHUNG GIỜ
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
            Một mặt bằng, hai cách khai thác
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Đón khách khám phá di sản với Holomia Journey và tổ chức phiên giải trí nhóm với Omega Arena trên cùng mặt bằng tương thích.
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
              Bảng điều khiển mô phỏng · Chọn chế độ
            </span>
            <span className="text-xs font-medium text-slate-300 font-mono-num">
              {active.timeSlot}
            </span>
          </div>

          {/* Mode Tabs */}
          <div
            role="tablist"
            aria-label="Chuyển đổi cách khai thác mặt bằng"
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
              <span>Holomia Journey</span>
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
              <span>Omega Arena</span>
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
                <span>Tệp khách chính</span>
              </div>
              <div className="text-slate-200 font-medium">{active.targetAudience}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Nhịp vận hành</span>
              </div>
              <div className="text-slate-200 font-medium">{active.sessionCycle}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <RefreshCw className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Chuyển đổi chế độ</span>
              </div>
              <div className="text-slate-200 font-medium">{active.switchTime}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

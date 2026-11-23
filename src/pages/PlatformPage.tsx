import React, { useState } from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { PlatformVideoShowcase } from '../components/PlatformVideoShowcase';
import { ResilientImage } from '../components/ResilientImage';
import { HARDWARE_SPECS, IMAGES, VENUE_FOOTPRINTS } from '../data/holomiaData';
import { AppRoute, LeadModalType } from '../types/holomia';

interface PlatformPageProps {
  onNavigate: (route: AppRoute) => void;
  onOpenModal: (type: LeadModalType) => void;
}

const SHIFT_LOGS = [
  { shift: 'Ca sáng (09:00 – 13:00)', mode: 'Holomia Journey', sessions: 28, guests: 382, uptime: '100%' },
  { shift: 'Ca chiều (13:30 – 17:30)', mode: 'Holomia Journey', sessions: 34, guests: 468, uptime: '100%' },
  { shift: 'Ca tối (18:00 – 22:00)', mode: 'Omega Arena', sessions: 22, guests: 246, uptime: '100%' },
];

export const PlatformPage: React.FC<PlatformPageProps> = ({
  onNavigate,
  onOpenModal,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week'>('today');
  const [selectedFootprint, setSelectedFootprint] = useState<string>('standard');
  const multiplier = selectedPeriod === 'today' ? 1 : 7;

  const activeFootprint =
    VENUE_FOOTPRINTS.find((f) => f.id === selectedFootprint) || VENUE_FOOTPRINTS[1];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0E1E2E] to-[#0B0F19] border-b border-white/10 py-14">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs sm:text-sm font-semibold text-[#00E5FF]">Holomia Platform</p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              1 Tablet điều khiển đồng thời 100 kính
            </h1>
            <p className="text-base text-slate-300">
              Không dây · Không ba lô · Triển khai linh hoạt mọi mặt bằng.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('showroom')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] text-sm font-semibold cursor-pointer"
              >
                <span>Thử Tablet tại Showroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenModal('pitch-deck')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/25 hover:bg-white/5 text-white text-sm font-semibold cursor-pointer"
              >
                <span>Tải Pitch Deck</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-white/15 h-[280px] sm:h-[340px]">
              <ResilientImage
                src={IMAGES.hardwareKit}
                alt="Bộ thiết bị kính VR và Tablet Holomia Platform"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FuninVR-style Scalable Floorplan & Specs Strip */}
      <section className="bg-[#0E1422] py-16 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#00E5FF] mb-1.5">
                Quy mô mặt bằng & Cấu hình
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tùy biến linh hoạt từ 50 m² đến 300 m²
              </h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#0B0F19] border border-white/10 rounded-xl w-fit">
              {VENUE_FOOTPRINTS.map((fp) => (
                <button
                  key={fp.id}
                  type="button"
                  onClick={() => setSelectedFootprint(fp.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono-num transition-colors cursor-pointer ${
                    selectedFootprint === fp.id
                      ? 'bg-[#00E5FF] text-[#0B0F19]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {fp.area}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/15 bg-[#0B0F19] min-h-[260px]">
              <ResilientImage
                src={IMAGES.floorplanBlueprint}
                alt="Sơ đồ mặt bằng sàn đấu VR không dây chuẩn Holomia"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="bg-[#0B0F19] border border-white/12 rounded-2xl p-6 space-y-4">
                <div className="text-xs font-semibold text-[#00E5FF]">
                  Cấu hình đề xuất · {activeFootprint.area}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-xs text-slate-400">Số lượng kính</div>
                    <div className="text-lg font-bold font-mono-num text-white mt-0.5">
                      {activeFootprint.players}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Công suất phục vụ</div>
                    <div className="text-lg font-bold font-mono-num text-[#00E5FF] mt-0.5">
                      {activeFootprint.throughput}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Điện năng</div>
                    <div className="text-lg font-bold font-mono-num text-white mt-0.5">
                      {activeFootprint.power}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Phù hợp</div>
                    <div className="text-sm font-medium text-slate-200 mt-1">
                      {activeFootprint.idealFor}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {HARDWARE_SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/10"
                  >
                    <div className="text-xs text-slate-400">{spec.label}</div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-0.5 font-mono-num">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo + Tablet Simulator */}
      <section className="bg-[#0B0F19] py-16 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Xem video vận hành Journey & Arena
            </h2>
            <p className="text-sm text-slate-400">
              Chuyển nhanh giữa hai luồng video hoặc bấm thử giao diện Tablet.
            </p>
          </div>
          <div className="lg:col-span-7">
            <PlatformVideoShowcase />
          </div>
        </div>
      </section>

      {/* White Analytics Section */}
      <section className="bg-[#F8FAFC] text-slate-900 py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0284C7] mb-1.5">
                <BarChart3 className="w-4 h-4" />
                <span>Báo cáo Vận hành</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
                Minh bạch từng lượt khách theo ca
              </h2>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setSelectedPeriod('today')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  selectedPeriod === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Theo ngày
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('week')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  selectedPeriod === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                7 ngày qua
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-500">Tổng lượt khách</div>
                <div className="text-3xl font-extrabold font-mono-num text-[#0B0F19] mt-1">
                  {(1096 * multiplier).toLocaleString('vi-VN')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Số phiên đã chạy</div>
                <div className="text-3xl font-extrabold font-mono-num text-[#0284C7] mt-1">
                  {(84 * multiplier).toLocaleString('vi-VN')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Xoay vòng trung bình</div>
                <div className="text-3xl font-extrabold font-mono-num text-[#0B0F19] mt-1">
                  42 giây
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-3 pr-4">Ca trực</th>
                    <th className="py-3 px-4">Chế độ</th>
                    <th className="py-3 px-4 text-right">Số phiên</th>
                    <th className="py-3 px-4 text-right">Lượt khách</th>
                    <th className="py-3 pl-4 text-right">Ổn định</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {SHIFT_LOGS.map((row) => (
                    <tr key={row.shift}>
                      <td className="py-3.5 pr-4 font-medium text-slate-900">{row.shift}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.mode}</td>
                      <td className="py-3.5 px-4 text-right font-mono-num">
                        {(row.sessions * multiplier).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-num font-semibold text-[#0284C7]">
                        {(row.guests * multiplier).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 pl-4 text-right font-mono-num text-emerald-700 font-medium">
                        {row.uptime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

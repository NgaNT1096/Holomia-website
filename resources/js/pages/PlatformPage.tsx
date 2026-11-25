import { FootprintConfigurator, ShiftReport, SpecGrid } from '../components/DataLists';
import { Tx } from '../lib/editor';
import React, { useState } from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { PlatformVideoShowcase } from '../components/PlatformVideoShowcase';
import { ResilientImage } from '../components/ResilientImage';
import { IMAGES } from '../data/holomiaData';
import { AppRoute, LeadModalType } from '../types/holomia';

interface PlatformPageProps {
  onNavigate: (route: AppRoute) => void;
  onOpenModal: (type: LeadModalType) => void;
}

export const PlatformPage: React.FC<PlatformPageProps> = ({
  onNavigate,
  onOpenModal,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week'>('today');
  const multiplier = selectedPeriod === 'today' ? 1 : 7;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0E1E2E] to-[#0B0F19] border-b border-white/10 py-14">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs sm:text-sm font-semibold text-[#00E5FF]"><Tx k="platform.001" d={"Holomia Platform"} /></p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              <Tx k="platform.002" d={"1 Tablet điều khiển đồng thời 100 kính"} />
            </h1>
            <p className="text-base text-slate-300">
              <Tx k="platform.003" d={"Không dây · Không ba lô · Triển khai linh hoạt mọi mặt bằng."} />
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('showroom')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] text-sm font-semibold cursor-pointer"
              >
                <span><Tx k="platform.004" d={"Thử Tablet tại Showroom"} /></span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenModal('pitch-deck')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/25 hover:bg-white/5 text-white text-sm font-semibold cursor-pointer"
              >
                <span><Tx k="platform.005" d={"Tải Pitch Deck"} /></span>
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
                <Tx k="platform.006" d={"Quy mô mặt bằng & Cấu hình"} />
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                <Tx k="platform.007" d={"Tùy biến linh hoạt từ 50 m² đến 300 m²"} />
              </h2>
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
              <FootprintConfigurator />
              <SpecGrid />
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo + Tablet Simulator */}
      <section className="bg-[#0B0F19] py-16 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              <Tx k="platform.012" d={"Xem video vận hành Journey & Arena"} />
            </h2>
            <p className="text-sm text-slate-400">
              <Tx k="platform.013" d={"Chuyển nhanh giữa hai luồng video hoặc bấm thử giao diện Tablet."} />
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
                <span><Tx k="platform.014" d={"Báo cáo Vận hành"} /></span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
                <Tx k="platform.015" d={"Minh bạch từng lượt khách theo ca"} />
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
                <Tx k="platform.016" d={"Theo ngày"} />
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('week')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                  selectedPeriod === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Tx k="platform.017" d={"7 ngày qua"} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <ShiftReport multiplier={multiplier} />
          </div>
        </div>
      </section>
    </div>
  );
};

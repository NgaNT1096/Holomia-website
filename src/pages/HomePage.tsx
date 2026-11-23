import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Download, Play } from 'lucide-react';
import {
  CASE_STUDIES,
  IMAGES,
  SOLUTION_PILLARS,
  TRUST_COUNTERS,
} from '../data/holomiaData';
import { AppRoute, LeadModalType } from '../types/holomia';
import { ResilientImage } from '../components/ResilientImage';
import { PartnerLogos } from '../components/PartnerLogos';
import { PlatformVideoShowcase } from '../components/PlatformVideoShowcase';
import { RoiCalculator } from '../components/RoiCalculator';
import { LivingLabForm } from '../components/LivingLabForm';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
  onOpenModal: (type: LeadModalType, summary?: string) => void;
  onScrollToLivingLab: () => void;
}

const HERO_SCENES = [
  { id: 'hanoi-post', label: 'Bưu điện Hà Nội', image: IMAGES.caseVov },
  { id: 'lotte-arena', label: 'Lotte Center · Omega Arena', image: IMAGES.heroArena },
  { id: 'tablet-sync', label: 'Điều phối Tablet', image: IMAGES.platformVideoTablet },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenModal,
  onScrollToLivingLab,
}) => {
  const [activeHeroScene, setActiveHeroScene] = useState<number>(2);
  const [countersStarted, setCountersStarted] = useState(false);
  const [counts, setCounts] = useState<number[]>([100, 2000, 10, 63]);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroScene((prev) => (prev + 1) % HERO_SCENES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          setCountersStarted(true);
          const targets = TRUST_COUNTERS.map((c) => c.numericTarget);
          const duration = 850;
          const startTime = performance.now();

          const tick = (now: number) => {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts(targets.map((t) => Math.max(1, Math.round(t * eased))));
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [countersStarted]);

  const currentScene = HERO_SCENES[activeHeroScene];

  return (
    <div>
      {/* KHỐI 1: HERO SECTION — HIGH-CONTRAST FOCAL POINT & PUNCHY 2-LINE HEADLINE */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden border-b border-white/10">
        {/* Bright, Unobstructed Looping Visual Backdrop on Right */}
        <div className="absolute inset-0">
          <ResilientImage
            key={currentScene.id}
            src={currentScene.image}
            alt={currentScene.label}
            className="w-full h-full object-cover object-center transition-opacity duration-700 scale-[1.02]"
          />
          {/* Left-focused scrim keeping the right 55% bright & vivid */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]/25" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.08] text-white [text-wrap:balance]">
                Hạ tầng VR{' '}
                <span className="text-[#00E5FF] block mt-1">
                  Đa người dùng
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 font-medium">
                1 Tablet · 100 thiết bị · 2.000 lượt khách/ngày
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={onScrollToLivingLab}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] font-bold text-sm sm:text-base transition-colors whitespace-nowrap cursor-pointer shadow-lg shadow-[#F59E0B]/20"
                >
                  <span>Đặt lịch Showroom</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenModal('pitch-deck')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-white/30 bg-[#0B0F19]/60 backdrop-blur-sm hover:bg-white/10 text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#00E5FF]" />
                  <span>Tải Pitch Deck</span>
                </button>
              </div>
            </div>

            {/* Right Bottom Focal Switcher: Visual Thumbnail Reel */}
            <div className="lg:col-span-5 flex lg:justify-end">
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-md bg-[#0B0F19]/80 backdrop-blur-md p-2 rounded-xl border border-white/15">
                {HERO_SCENES.map((scene, idx) => {
                  const active = activeHeroScene === idx;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setActiveHeroScene(idx)}
                      className={`group relative rounded-lg overflow-hidden text-left transition-all cursor-pointer border ${
                        active
                          ? 'border-[#00E5FF] ring-1 ring-[#00E5FF]/50'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="h-14">
                        <ResilientImage
                          src={scene.image}
                          alt={scene.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1">
                        <Play className={`w-2.5 h-2.5 shrink-0 ${active ? 'text-[#00E5FF]' : 'text-white'}`} />
                        <span className="text-[10px] font-semibold text-white truncate">
                          {scene.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KHỐI 2: DẢI LOGO ĐỐI TÁC & 4 CHỈ SỐ 1 DÒNG SẮC NÉT */}
      <section className="bg-[#0B0F19] border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="pb-8 border-b border-white/10">
            <PartnerLogos variant="dark" />
          </div>

          <div
            ref={counterRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
          >
            {TRUST_COUNTERS.map((item, idx) => {
              const formattedNum =
                item.id === 'guests'
                  ? counts[idx].toLocaleString('vi-VN')
                  : counts[idx];
              return (
                <div
                  key={item.id}
                  className="bg-[#0F172A]/70 border border-white/10 rounded-xl px-5 py-4"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-[#00E5FF] tracking-tight whitespace-nowrap">
                    {formattedNum}
                    {item.suffix}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 whitespace-nowrap truncate">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* KHỐI 3: HOLOMIA PLATFORM — 3 BƯỚC BÊN TRÁI + VIDEO DEMO BÊN PHẢI */}
      <section className="bg-[#0B0F19] py-20 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left column matching user reference */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <p className="text-xs sm:text-sm font-bold tracking-wider text-[#00E5FF] mb-3">
                  Holomia Platform
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15] [text-wrap:balance]">
                  Từ đón khách đến điều phối từng phiên
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-l border-[#00E5FF]/40 pl-5 space-y-1.5">
                  <h3 className="text-base font-bold text-white">
                    Chuẩn bị nhóm và thiết bị
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Chia lượt khách, giao kính và kiểm tra trạng thái trước khi bắt đầu.
                  </p>
                </div>

                <div className="border-l border-[#00E5FF]/40 pl-5 space-y-1.5">
                  <h3 className="text-base font-bold text-white">
                    Điều phối nhiều phiên
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Khởi chạy nội dung theo nhóm, theo dõi phiên đang chạy và chuẩn bị lượt kế tiếp.
                  </p>
                </div>

                <div className="border-l border-[#00E5FF]/40 pl-5 space-y-1.5">
                  <h3 className="text-base font-bold text-white">
                    Chuyển giao cho đội ngũ tại điểm
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Cấu hình theo mặt bằng, hướng dẫn nhân sự và chuẩn hóa quy trình để có thể triển khai lại ở địa điểm khác.
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onNavigate('platform')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#00E5FF] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Khám phá nền tảng</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right column: Video Demo Showcase */}
            <div className="lg:col-span-7">
              <PlatformVideoShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* KHỐI 4: 3 MÔ HÌNH TRIỂN KHAI */}
      <section className="bg-[#0E1422] py-18 lg:py-20 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-9">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ba mô hình <span className="text-[#00E5FF]">triển khai</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SOLUTION_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                onClick={() => onNavigate(pillar.route)}
                className="group bg-[#0B0F19] border border-white/12 hover:border-[#00E5FF]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="h-44 overflow-hidden relative border-b border-white/10">
                    <ResilientImage
                      src={pillar.image}
                      alt={pillar.imageAlt}
                      fallbackTitle={pillar.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/30 to-transparent" />
                    <div className="absolute bottom-3.5 left-5 right-5 flex items-end justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono-num font-bold text-[#00E5FF]">
                          {pillar.number}
                        </span>
                        <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-5">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {pillar.description}
                    </p>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      {pillar.bullets.map((bullet) => (
                        <div key={bullet} className="flex items-start gap-2.5 text-sm text-slate-200 leading-snug">
                          <Check className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3 text-sm font-semibold text-[#00E5FF] group-hover:text-white transition-colors">
                  <span>{pillar.linkLabel}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KHỐI 5: DỰ ÁN BIỂU TƯỢNG (BENTO GRID THUẦN HÌNH ẢNH + CHỈ SỐ) */}
      <section className="bg-[#0B0F19] py-18 lg:py-20 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Dự án <span className="text-[#00E5FF]">biểu tượng</span>
            </h2>

            <button
              type="button"
              onClick={() => onNavigate('case-studies')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00E5FF] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Tất cả dự án</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {CASE_STUDIES.map((cs, index) => {
              const colSpan =
                index === 0 || index === 3 ? 'md:col-span-7' : 'md:col-span-5';
              return (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => onNavigate('case-studies')}
                  className={`${colSpan} group relative min-h-[280px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-white/12 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]`}
                >
                  <ResilientImage
                    src={cs.image}
                    alt={cs.imageAlt}
                    fallbackTitle={cs.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/35 to-transparent" />

                  <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-200 bg-[#0B0F19]/75 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/15">
                        {cs.categoryLabel}
                      </span>
                      <span className="text-xs font-bold font-mono-num text-[#0B0F19] bg-[#F59E0B] px-3 py-1 rounded-md">
                        {cs.headlineMetric}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {cs.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                        {cs.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* KHỐI 6: DỰ PHÓNG ROI (NỀN TRẮNG TƯƠNG PHẢN) */}
      <section className="bg-[#F8FAFC] text-slate-900 py-18 lg:py-20 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                Holomia Venue
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight leading-tight [text-wrap:balance]">
                Dự phóng doanh thu mặt bằng
              </h2>

              <div className="rounded-xl overflow-hidden border border-slate-200 h-44">
                <ResilientImage
                  src={IMAGES.floorplanBlueprint}
                  alt="Sơ đồ mặt bằng Holomia Venue"
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => onNavigate('solutions-venue')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0284C7] hover:text-[#0B0F19] transition-colors cursor-pointer"
              >
                <span>Mô hình Rev-share 70/30</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-7">
              <RoiCalculator
                onRequestExcel={(summary) => onOpenModal('roi-excel', summary)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* KHỐI 7: SHOWROOM MẪU */}
      <section
        id="living-lab-booking"
        className="bg-gradient-to-br from-[#0B1E2D] via-[#0B0F19] to-[#0B0F19] py-18 lg:py-20"
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
                Trải nghiệm 30 phút tại <span className="text-[#00E5FF]">Showroom</span>
              </h2>

              <div className="rounded-2xl overflow-hidden border border-white/15 h-56">
                <ResilientImage
                  src={IMAGES.showroomLab}
                  alt="Showroom Mẫu Holomia Living Lab"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-white">Hà Nội</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Viwaseen Tower, 48 Tố Hữu
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-white">TP.HCM</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Living Lab B2B, Quận 1
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <LivingLabForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

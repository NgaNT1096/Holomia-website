import { useCms } from '../lib/cms';
import { IfText, ImageControl, resolve, SectionFrame, SectionImg, T, useEditor } from '../lib/editor';
import React, { useEffect, useState } from 'react';
import { ArrowRight, Download, Play } from 'lucide-react';
import { IMAGES } from '../data/holomiaData';
import { AppRoute, CmsImage, LeadModalType } from '../types/holomia';
import { ResilientImage } from '../components/ResilientImage';
import { PartnersBlock, PillarsBlock } from '../components/HomeSections';
import { PlatformVideoShowcase } from '../components/PlatformVideoShowcase';
import { RoiCalculator } from '../components/RoiCalculator';
import { LivingLabForm } from '../components/LivingLabForm';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
  onOpenModal: (type: LeadModalType, summary?: string) => void;
  onScrollToLivingLab: () => void;
}

const HERO_SCENE_DEFAULTS = [
  { id: 'hanoi-post', label: 'Bưu điện Hà Nội', image: IMAGES.caseVov },
  { id: 'lotte-arena', label: 'Lotte Center · Omega Arena', image: IMAGES.heroArena },
  { id: 'tablet-sync', label: 'Điều phối Tablet', image: IMAGES.platformVideoTablet },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenModal,
  onScrollToLivingLab,
}) => {
  const { caseStudies: CASE_STUDIES } = useCms();
  const { editing, locale, sections } = useEditor();
  // Hero slider: image + label of each scene come from the hero section.
  const pageSections = sections.filter((x) => x.page === 'home');
  const hero = pageSections.find((x) => x.template === 'hero');
  const HERO_SCENES = HERO_SCENE_DEFAULTS.map((d, i) => ({
    ...d,
    label: resolve(hero?.fields[`hero.scene${i}`], locale, d.label),
    image: (hero?.images[`hero.scene${i}`] ?? d.image) as string | CmsImage,
  }));
  const [activeHeroScene, setActiveHeroScene] = useState<number>(2);
  useEffect(() => {
    if (editing) return; // keep the slide still while it is being edited
    const timer = setInterval(() => {
      setActiveHeroScene((prev) => (prev + 1) % HERO_SCENES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [editing]);

  const currentScene = HERO_SCENES[activeHeroScene];

  const blocks: Record<string, React.ReactNode> = {
    hero: (
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden border-b border-white/10">
        {/* Bright, Unobstructed Looping Visual Backdrop on Right */}
        <div className="absolute inset-0">
          <ResilientImage
            key={currentScene.id}
            src={currentScene.image}
            priority
            alt={currentScene.label}
            className="w-full h-full object-cover object-center transition-opacity duration-700 scale-[1.02]"
          />
          {/* Left-focused scrim keeping the right 55% bright & vivid */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]/25" />
        </div>

        <ImageControl k={`hero.scene${activeHeroScene}`} label="Đổi ảnh cảnh đang xem" className="absolute top-3 left-3" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.08] text-white [text-wrap:balance]">
                <T k="hero.title" d="Hạ tầng VR" />{' '}
                <span className="text-[#00E5FF] block mt-1">
                  <T k="home.001" d={"Đa người dùng"} />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 font-medium">
                <T k="home.002" d={"1 Tablet · 100 thiết bị · 2.000 lượt khách/ngày"} />
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <IfText k="home.003">
                <button
                  type="button"
                  onClick={onScrollToLivingLab}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] font-bold text-sm sm:text-base transition-colors whitespace-nowrap cursor-pointer shadow-lg shadow-[#F59E0B]/20"
                >
                  <span><T k="home.003" d={"Đặt lịch Showroom"} /></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                </IfText>

                <IfText k="home.004">
                <button
                  type="button"
                  onClick={() => onOpenModal('pitch-deck')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-white/30 bg-[#0B0F19]/60 backdrop-blur-sm hover:bg-white/10 text-white font-semibold text-sm sm:text-base transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#00E5FF]" />
                  <span><T k="home.004" d={"Tải Pitch Deck"} /></span>
                </button>
                </IfText>
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
                          <T k={`hero.scene${idx}`} d={scene.label} />
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
    ),
    platform: (
      <section className="bg-[#0B0F19] py-20 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left column matching user reference */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <p className="text-xs sm:text-sm font-bold tracking-wider text-[#00E5FF] mb-3">
                  <T k="home.005" d={"Holomia Platform"} />
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-[1.15] [text-wrap:balance]">
                  <T k="home.006" d={"Từ đón khách đến điều phối từng phiên"} />
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-l border-[#00E5FF]/40 pl-5 space-y-1.5">
                  <h3 className="text-base font-bold text-white">
                    <T k="home.007" d={"Chuẩn bị nhóm và thiết bị"} />
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <T k="home.008" d={"Chia lượt khách, giao kính và kiểm tra trạng thái trước khi bắt đầu."} />
                  </p>
                </div>

                <div className="border-l border-[#00E5FF]/40 pl-5 space-y-1.5">
                  <h3 className="text-base font-bold text-white">
                    <T k="home.009" d={"Điều phối nhiều phiên"} />
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <T k="home.010" d={"Khởi chạy nội dung theo nhóm, theo dõi phiên đang chạy và chuẩn bị lượt kế tiếp."} />
                  </p>
                </div>

                <div className="border-l border-[#00E5FF]/40 pl-5 space-y-1.5">
                  <h3 className="text-base font-bold text-white">
                    <T k="home.011" d={"Chuyển giao cho đội ngũ tại điểm"} />
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    <T k="home.012" d={"Cấu hình theo mặt bằng, hướng dẫn nhân sự và chuẩn hóa quy trình để có thể triển khai lại ở địa điểm khác."} />
                  </p>
                </div>
              </div>

              <div>
                <IfText k="home.013">
                <button
                  type="button"
                  onClick={() => onNavigate('platform')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#00E5FF] hover:text-white transition-colors cursor-pointer"
                >
                  <span><T k="home.013" d={"Khám phá nền tảng"} /></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                </IfText>
              </div>
            </div>

            {/* Right column: Video Demo Showcase */}
            <div className="lg:col-span-7">
              <PlatformVideoShowcase />
            </div>
          </div>
        </div>
      </section>
    ),
    cases: (
      <section className="bg-[#0B0F19] py-18 lg:py-20 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              <T k="cases.title" d="Dự án" />{' '}<span className="text-[#00E5FF]"><T k="home.016" d={"biểu tượng"} /></span>
            </h2>

            <IfText k="home.017">
            <button
              type="button"
              onClick={() => onNavigate('case-studies')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00E5FF] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
            >
              <span><T k="home.017" d={"Tất cả dự án"} /></span>
              <ArrowRight className="w-4 h-4" />
            </button>
            </IfText>
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
                    src={cs.images?.[0]}
                    alt={cs.images?.[0]?.alt || cs.title}
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
    ),
    roi: (
      <section className="bg-[#F8FAFC] text-slate-900 py-18 lg:py-20 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                <T k="home.018" d={"Holomia Venue"} />
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight leading-tight [text-wrap:balance]">
                <T k="home.019" d={"Dự phóng doanh thu mặt bằng"} />
              </h2>

              <div className="relative rounded-xl overflow-hidden border border-slate-200 h-44">
                <SectionImg k="roi.image" alt="Sơ đồ mặt bằng Holomia Venue" className="w-full h-full object-cover" />
                <ImageControl k="roi.image" label="Đổi ảnh" />
              </div>

              <IfText k="home.020">
              <button
                type="button"
                onClick={() => onNavigate('solutions-venue')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0284C7] hover:text-[#0B0F19] transition-colors cursor-pointer"
              >
                <span><T k="home.020" d={"Mô hình Rev-share 70/30"} /></span>
                <ArrowRight className="w-4 h-4" />
              </button>
              </IfText>
            </div>

            <div className="lg:col-span-7">
              <RoiCalculator
                onRequestExcel={(summary) => onOpenModal('roi-excel', summary)}
              />
            </div>
          </div>
        </div>
      </section>
    ),
    showroom: (
      <section
        id="living-lab-booking"
        className="bg-gradient-to-br from-[#0B1E2D] via-[#0B0F19] to-[#0B0F19] py-18 lg:py-20"
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
                <T k="home.021" d={"Trải nghiệm 30 phút tại"} /> <span className="text-[#00E5FF]"><T k="home.022" d={"Showroom"} /></span>
              </h2>

              <div className="relative rounded-2xl overflow-hidden border border-white/15 h-56">
                <SectionImg k="showroom.image" alt="Showroom Mẫu Holomia Living Lab" className="w-full h-full object-cover" />
                <ImageControl k="showroom.image" label="Đổi ảnh" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-white"><T k="home.023" d={"Hà Nội"} /></div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    <T k="home.024" d={"Viwaseen Tower, 48 Tố Hữu"} />
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="font-semibold text-white"><T k="home.025" d={"TP.HCM"} /></div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    <T k="home.026" d={"Living Lab B2B, Quận 1"} />
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
    ),
  };

  return (
    <div>
      {pageSections.map((section, index) => (
        <SectionFrame key={section.id} section={section} index={index} count={pageSections.length}>
          {section.template === 'partners' ? (
            <PartnersBlock section={section} />
          ) : section.template === 'pillars' ? (
            <PillarsBlock section={section} />
          ) : (
            blocks[section.template]
          )}
        </SectionFrame>
      ))}
    </div>
  );
};

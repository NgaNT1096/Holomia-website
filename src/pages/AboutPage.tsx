import React, { useState } from 'react';
import { ArrowRight, X, CheckCircle2 } from 'lucide-react';
import {
  ABOUT_MILESTONES,
  IMAGES,
  INSIGHT_ARTICLES,
} from '../data/holomiaData';
import { AppRoute, InsightArticle } from '../types/holomia';
import { PartnerLogos } from '../components/PartnerLogos';
import { ResilientImage } from '../components/ResilientImage';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

const INSIGHT_THUMBS = [IMAGES.caseVov, IMAGES.caseLandmark, IMAGES.caseSonDoong];

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

  return (
    <div>
      <section className="bg-gradient-to-b from-[#0E1E2E] to-[#0B0F19] border-b border-white/10 py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-[#00E5FF]">Về Holomia</p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Hơn 10 năm phát triển công nghệ XR tại Việt Nam
            </h1>
            <p className="text-base text-slate-300">
              Phát triển nền tảng thực tế ảo đa người dùng cho sự kiện, thương mại và di sản.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-white/15 h-[260px] sm:h-[300px]">
              <ResilientImage
                src={IMAGES.showroomLab}
                alt="Holomia Living Lab & R&D Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-slate-900 py-16 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F19] tracking-tight">
                Từ R&D đến vận hành thực tế
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Tập trung vào tính ổn định khi đón hàng nghìn lượt khách mỗi ngày và tối ưu hiệu quả đầu tư cho đối tác.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('case-studies')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0284C7] hover:text-[#0B0F19] cursor-pointer"
              >
                <span>Xem dự án thực tế</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ABOUT_MILESTONES.map((m) => (
                <div
                  key={m.year}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="text-xs font-bold font-mono-num text-[#0284C7]">{m.year}</div>
                  <h3 className="text-base font-bold text-[#0B0F19]">{m.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600">{m.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200">
            <PartnerLogos variant="light" />
          </div>
        </div>
      </section>

      <section className="bg-[#0B0F19] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-8">
            Góc nhìn ngành XR
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INSIGHT_ARTICLES.map((article, idx) => (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="group bg-[#0F172A] border border-white/12 hover:border-[#00E5FF]/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="h-44 overflow-hidden border-b border-white/10">
                    <ResilientImage
                      src={INSIGHT_THUMBS[idx] || IMAGES.heroArena}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 pb-4">
                    <div className="text-xs text-slate-400 mb-2">
                      {article.category} · {article.readTime}
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug">{article.title}</h3>
                    <p className="text-sm text-slate-400 mt-2">{article.summary}</p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/10">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00E5FF] group-hover:text-white">
                    <span>Đọc bài viết</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#111827] border border-white/15 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              aria-label="Đóng bài viết"
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-medium text-[#00E5FF] mb-2">
              {activeArticle.category} · {activeArticle.date}
            </div>
            <h2 className="text-2xl font-extrabold text-white pr-8">{activeArticle.title}</h2>

            <div className="mt-5 p-4 rounded-xl bg-[#0B0F19] border border-white/10 space-y-2">
              {activeArticle.keyTakeaways.map((item) => (
                <div key={item} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              {activeArticle.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

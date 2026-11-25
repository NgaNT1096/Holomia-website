import { Tx } from '../lib/editor';
import { useCms, useLocalized  } from '../lib/cms';
import { FILTERS as FILTERS_RAW } from '../data/holomiaData';
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppRoute, CaseCategory } from '../types/holomia';
import { ResilientImage } from '../components/ResilientImage';

interface CaseStudiesPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({ onNavigate }) => {
  const { t } = useCms();
  const FILTERS = useLocalized(FILTERS_RAW, 'FILTERS');
  const { caseStudies: CASE_STUDIES } = useCms();
  const [filter, setFilter] = useState<CaseCategory>('all');

  const visibleCases =
    filter === 'all'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((cs) => cs.category === filter);

  return (
    <div>
      <section className="bg-[#0B0F19] border-b border-white/10 py-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-[#00E5FF]"><Tx k="cases.001" d={"Dự án Thực chiến"} /></p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              <Tx k="cases.002" d={"Công trình đã kiểm chứng"} />
            </h1>
          </div>

          <div
            role="tablist"
            aria-label={t('cases.007', "Lọc dự án theo ngành")}
            className="mt-7 inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-[#111827] border border-white/10 rounded-xl"
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  filter === f.id ? 'bg-[#00E5FF] text-[#0B0F19]' : 'text-slate-300 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0E1422] py-16">
        <div className="max-w-[1200px] mx-auto px-6 space-y-8">
          {visibleCases.map((cs) => (
            <article
              key={cs.id}
              className="bg-[#0B0F19] border border-white/12 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              <div className="lg:col-span-5 relative min-h-[240px]">
                <ResilientImage
                  src={cs.images?.[0]}
                  alt={cs.images?.[0]?.alt || cs.title}
                  fallbackTitle={cs.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-xs font-medium text-[#00E5FF]">
                    {cs.categoryLabel} · {cs.location}
                  </div>
                  <div className="text-xl font-bold font-mono-num text-white mt-0.5">
                    {cs.headlineMetric}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">{cs.title}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{cs.subtitle}</p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-white/10">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 mb-1.5"><Tx k="cases.003" d={"Bài toán"} /></h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{cs.problem}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-[#00E5FF] mb-1.5"><Tx k="cases.004" d={"Giải pháp Holomia"} /></h3>
                      <p className="text-sm text-slate-300 leading-relaxed">{cs.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xs font-semibold text-white mb-2.5"><Tx k="cases.005" d={"Kết quả"} /></h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {cs.results.map((res) => (
                      <div key={res} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => onNavigate('showroom')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] font-semibold text-sm cursor-pointer"
            >
              <span><Tx k="cases.006" d={"Đặt lịch Showroom"} /></span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

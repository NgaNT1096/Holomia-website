import { useTr } from '../lib/locale';
import { CustomCards, SpecGrid } from '../components/DataLists';
import { Tx } from '../lib/editor';
import { useCms  } from '../lib/cms';
import React from 'react';
import { ArrowRight, FileText, Building2, Sparkles, MapPin } from 'lucide-react';
import { IMAGES } from '../data/holomiaData';
import { AppRoute, LeadModalType } from '../types/holomia';
import { RoiCalculator } from '../components/RoiCalculator';
import { ResilientImage } from '../components/ResilientImage';
import { VenueDualModeShowcase } from '../components/VenueDualModeShowcase';

interface SolutionsPageProps {
  activeBranch: 'solutions-event' | 'solutions-venue' | 'solutions-custom';
  onNavigate: (route: AppRoute) => void;
  onOpenModal: (type: LeadModalType, summary?: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({
  activeBranch,
  onNavigate,
  onOpenModal,
}) => {
  const tr = useTr();
  const { eventPackages: EVENT_PACKAGES } = useCms();
  const scrollToRoi = () => {
    const el = document.getElementById('venue-roi-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <section className="bg-[#0B0F19] border-b border-white/10 pt-10 pb-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#111827] border border-white/10 rounded-xl w-fit mb-9">
            <button
              type="button"
              onClick={() => onNavigate('solutions-event')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeBranch === 'solutions-event'
                  ? 'bg-[#00E5FF] text-[#0B0F19]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tx k="solutions.001" d={"Holomia Event"} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('solutions-venue')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeBranch === 'solutions-venue'
                  ? 'bg-[#00E5FF] text-[#0B0F19]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tx k="solutions.002" d={"Holomia Venue"} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('solutions-custom')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeBranch === 'solutions-custom'
                  ? 'bg-[#00E5FF] text-[#0B0F19]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Tx k="solutions.003" d={"Holomia Custom"} />
            </button>
          </div>

          {activeBranch === 'solutions-event' && (
            <div className="max-w-3xl space-y-4">
              <p className="text-xs sm:text-sm font-semibold text-[#00E5FF]"><Tx k="solutions.004" d={"Holomia Event"} /></p>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
                <Tx k="solutions.005" d={"VR trọn gói cho sự kiện lưu lượng lớn"} />
              </h1>
              <p className="text-base text-slate-300">
                <Tx k="solutions.006" d={"Thiết bị, nội dung và đội ngũ điều phối trọn gói tại sự kiện."} />
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenModal('agency-rate-card')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] text-sm font-semibold cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span><Tx k="solutions.007" d={"Nhận Rate Card Agency"} /></span>
                </button>
              </div>
            </div>
          )}

          {activeBranch === 'solutions-venue' && (
            <div className="max-w-3xl space-y-4">
              <p className="text-xs sm:text-sm font-bold tracking-wider text-[#00E5FF]">
                <Tx k="solutions.008" d={"HOLOMIA VENUE"} />
              </p>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
                <Tx k="solutions.009" d={"Khai thác sàn VR thương mại"} />
              </h1>
              <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                <Tx k="solutions.010" d={"Đón khách khám phá với Holomia Journey và mở phiên giải trí nhóm với Omega Arena trên cùng mặt bằng tương thích."} />
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={scrollToRoi}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] text-sm font-bold cursor-pointer"
                >
                  <span><Tx k="solutions.011" d={"Tính thử hoàn vốn"} /></span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('showroom')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-white/25 hover:bg-white/5 text-white text-sm font-semibold cursor-pointer"
                >
                  <span><Tx k="solutions.012" d={"Đặt lịch khảo sát mặt bằng"} /></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeBranch === 'solutions-custom' && (
            <div className="max-w-3xl space-y-4">
              <p className="text-xs sm:text-sm font-semibold text-[#00E5FF]"><Tx k="solutions.013" d={"Holomia Custom"} /></p>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
                <Tx k="solutions.014" d={"VR5D/9D, Vali VR Kit & Số hóa Di sản"} />
              </h1>
              <p className="text-base text-slate-300">
                <Tx k="solutions.015" d={"Phần cứng và nội dung độc quyền cho bảo tàng, du lịch và triển lãm quốc tế."} />
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('showroom')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] text-sm font-semibold cursor-pointer"
                >
                  <span><Tx k="solutions.016" d={"Trao đổi dự án riêng"} /></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {activeBranch === 'solutions-event' && (
        <section className="bg-white text-slate-900 py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight">
                <Tx k="solutions.017" d={"Ba gói sự kiện chuẩn"} />
              </h2>
              <p className="text-sm text-slate-600 mt-1.5"><Tx k="solutions.018" d={"Giá tham chiếu sự kiện 2 ngày."} /></p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-5 text-xs font-semibold text-slate-500"><Tx k="solutions.019" d={"Hạng mục"} /></th>
                    {EVENT_PACKAGES.map((pkg) => (
                      <th key={pkg.id} className="py-4 px-5 text-base font-bold text-[#0B0F19]">
                        {pkg.name}
                        {pkg.highlighted && (
                          <span className="ml-2 text-xs font-semibold text-[#0284C7]"><Tx k="solutions.020" d={"· Phổ biến"} /></span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  <tr>
                    <td className="py-3.5 px-5 font-medium text-slate-600"><Tx k="solutions.021" d={"Quy mô"} /></td>
                    {EVENT_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="py-3.5 px-5 font-semibold font-mono-num">{pkg.scale}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-medium text-slate-600"><Tx k="solutions.022" d={"Lượt/ngày"} /></td>
                    {EVENT_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="py-3.5 px-5 font-semibold text-[#0284C7] font-mono-num">
                        {pkg.capacityPerDay}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-medium text-slate-600"><Tx k="solutions.023" d={"Nhân sự"} /></td>
                    {EVENT_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="py-3.5 px-5">{pkg.staffing}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-medium text-slate-600"><Tx k="solutions.024" d={"Nội dung"} /></td>
                    {EVENT_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="py-3.5 px-5">{pkg.contentIncluded}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-medium text-slate-600"><Tx k="solutions.025" d={"Trọn gói 2 ngày"} /></td>
                    {EVENT_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="py-3.5 px-5 font-extrabold text-lg font-mono-num">
                        {pkg.twoDayPrice}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-medium text-slate-600"><Tx k="solutions.026" d={"Ngày bổ sung"} /></td>
                    {EVENT_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="py-3.5 px-5 font-mono-num">{pkg.extraDayPrice}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B0F19]"><Tx k="solutions.027" d={"Chính sách Event Agency"} /></h3>
                <p className="text-sm text-slate-600 mt-1">
                  <Tx k="solutions.028" d={"Logo thương hiệu trên kính, check-in QR và chiết khấu đối tác."} />
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenModal('agency-rate-card')}
                className="px-6 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] font-semibold text-sm whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Tx k="solutions.029" d={"Nhận Rate Card Agency"} />
              </button>
            </div>
          </div>
        </section>
      )}

      {activeBranch === 'solutions-venue' && (
        <>
          {/* Section 2: Hai hình thức hợp tác (Strict 2-col grid) + Separate Khảo sát mặt bằng bar */}
          <section className="bg-[#0B0F19] py-16 border-b border-white/10">
            <div className="max-w-[1200px] mx-auto px-6 space-y-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                <Tx k="solutions.030" d={"Hai hình thức hợp tác"} />
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0F172A] border border-[#00E5FF]/35 rounded-2xl p-6 sm:p-7 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#00E5FF]">
                    <Building2 className="w-4 h-4" />
                    <span><Tx k="solutions.031" d={"Phương án 01"} /></span>
                  </div>
                  <h3 className="text-xl font-bold text-white"><Tx k="solutions.032" d={"Chia sẻ doanh thu"} /></h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <Tx k="solutions.033" d={"Tham chiếu phương án 70/30. Tỷ lệ của mỗi bên, trách nhiệm đầu tư và chi phí vận hành được thống nhất theo địa điểm."} />
                  </p>
                </div>

                <div className="bg-[#0F172A] border border-[#F59E0B]/35 rounded-2xl p-6 sm:p-7 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#F59E0B]">
                    <Sparkles className="w-4 h-4" />
                    <span><Tx k="solutions.034" d={"Phương án 02"} /></span>
                  </div>
                  <h3 className="text-xl font-bold text-white"><Tx k="solutions.035" d={"Cấp phép hằng năm"} /></h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <Tx k="solutions.036" d={"Đối tác chủ động đầu tư và kinh doanh. Holomia cung cấp nền tảng, nội dung được cấp phép, chuyển giao và hỗ trợ theo hợp đồng."} />
                  </p>
                </div>
              </div>

              {/* Separate horizontal action bar for Site Survey (distinct hierarchy from the 2 options) */}
              <div className="bg-[#111827] border border-white/12 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00E5FF]">
                    <MapPin className="w-4 h-4" />
                    <span><Tx k="solutions.037" d={"Bước tiếp theo · Khảo sát mặt bằng thực tế"} /></span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    <Tx k="solutions.038" d={"Đánh giá diện tích, tuyến khách, năng lực mạng, tủ kính và khung giờ để lập dự phóng chi tiết cho từng địa điểm."} />
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('showroom')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-[#00E5FF] text-white hover:text-[#0B0F19] text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span><Tx k="solutions.039" d={"Hẹn trao đổi phương án"} /></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <SpecGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2" />
            </div>
          </section>

          {/* Section 3: Khai thác theo khung giờ — Một mặt bằng, hai cách khai thác */}
          <section className="bg-[#0E1422] py-16 lg:py-20 border-b border-white/10">
            <div className="max-w-[1200px] mx-auto px-6">
              <VenueDualModeShowcase />
            </div>
          </section>

          {/* Section 4: White ROI Calculator Band */}
          <section
            id="venue-roi-calculator"
            className="bg-[#F8FAFC] text-slate-900 py-16 lg:py-20 border-b border-slate-200"
          >
            <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <p className="text-xs font-bold tracking-wider text-[#0284C7]">
                  <Tx k="solutions.040" d={"DỰ PHÓNG CHO CHỦ MẶT BẰNG"} />
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B0F19] tracking-tight leading-tight [text-wrap:balance]">
                  <Tx k="solutions.041" d={"Mặt bằng của anh chị có thể mang về bao nhiêu?"} />
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <Tx k="solutions.042" d={"Chọn số kính và giá vé để ước tính doanh thu theo tháng và thời gian hoàn vốn dự kiến theo mô hình hợp tác của địa điểm."} />
                </p>
                <div className="rounded-xl overflow-hidden border border-slate-200 mt-4">
                  <ResilientImage
                    src={IMAGES.floorplanBlueprint}
                    alt={tr('Sơ đồ bố trí mặt bằng Holomia Venue', 'Holomia Venue layout')}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <RoiCalculator
                  showExtendedChart
                  onRequestExcel={(summary) => onOpenModal('roi-excel', summary)}
                />
              </div>
            </div>
          </section>

          {/* Section 5: Điểm đến thương mại */}
          <section className="bg-[#0B0F19] py-16 lg:py-20">
            <div className="max-w-[1200px] mx-auto px-6 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  <Tx k="solutions.043" d={"Điểm đến thương mại"} />
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('case-studies')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#00E5FF] hover:text-white transition-colors cursor-pointer"
                >
                  <span><Tx k="solutions.044" d={"Xem tất cả dự án"} /></span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => onNavigate('case-studies')}
                  className="group relative min-h-[260px] rounded-2xl overflow-hidden border border-white/12 text-left cursor-pointer"
                >
                  <ResilientImage
                    src={IMAGES.caseLandmark}
                    alt="Landmark 81 & Lotte Center"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-xs font-medium text-[#00E5FF]">
                      <Tx k="solutions.045" d={"Điểm đến thương mại"} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      <Tx k="solutions.046" d={"Landmark 81 & Lotte Center"} />
                    </h3>
                    <p className="text-sm text-slate-300 mt-0.5">
                      <Tx k="solutions.047" d={"Vận hành chia sẻ doanh thu dài hạn"} />
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('showroom')}
                  className="group relative min-h-[260px] rounded-2xl overflow-hidden border border-white/12 text-left cursor-pointer"
                >
                  <ResilientImage
                    src={IMAGES.thumbVenue}
                    alt={tr('Mô hình sàn giải trí không dây trong trung tâm thương mại', 'Wireless entertainment floor in a shopping mall')}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-xs font-medium text-[#F59E0B]">
                      <Tx k="solutions.048" d={"Trải nghiệm trực tiếp"} />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                      <Tx k="solutions.049" d={"Khảo sát & demo tại Living Lab"} />
                    </h3>
                    <p className="text-sm text-slate-300 mt-0.5">
                      <Tx k="solutions.050" d={"Lập dự phóng chi tiết theo diện tích 50 – 300 m²"} />
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {activeBranch === 'solutions-custom' && (
        <section className="bg-[#0E1422] py-16">
          <CustomCards />
        </section>
      )}
    </div>
  );
};

import { Tx } from '../lib/editor';
import React, { useState, useMemo } from 'react';
import { useCms } from '../lib/cms';
import { ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';

interface RoiCalculatorProps {
  onRequestExcel: (summary: string) => void;
  showExtendedChart?: boolean;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({
  onRequestExcel,
  showExtendedChart = false,
}) => {
  const { t } = useCms();
  const [headsets, setHeadsets] = useState<number>(10);
  const [ticketPrice, setTicketPrice] = useState<number>(100000);
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);

  const [operatingDays, setOperatingDays] = useState<number>(26);
  const [occupancyRate, setOccupancyRate] = useState<number>(35);
  const [partnerShare, setPartnerShare] = useState<number>(30);

  const metrics = useMemo(() => {
    const slotsPerHeadsetPerDay = 12;
    const dailyCapacity = headsets * slotsPerHeadsetPerDay;
    const avgGuestsPerDay = dailyCapacity * (occupancyRate / 100);
    const monthlyGrossRevenue = Math.round(avgGuestsPerDay * ticketPrice * operatingDays);
    const monthlyNetCashflow = Math.round(monthlyGrossRevenue * (partnerShare / 100));
    const estimatedInvestment = 160_000_000 + headsets * 18_000_000;
    const paybackMonths = Math.max(
      4,
      Math.min(24, Math.round(estimatedInvestment / Math.max(1, monthlyNetCashflow)))
    );

    const cumulative12Months = Array.from({ length: 12 }, (_, idx) => {
      const month = idx + 1;
      const cumulative = monthlyNetCashflow * month;
      const progressPct = Math.min(100, Math.round((cumulative / estimatedInvestment) * 100));
      return { month, cumulative, progressPct };
    });

    return {
      monthlyGrossRevenue,
      monthlyNetCashflow,
      paybackMonths,
      cumulative12Months,
    };
  }, [headsets, ticketPrice, operatingDays, occupancyRate, partnerShare]);

  const formatVnd = (amount: number) =>
    amount.toLocaleString('vi-VN') + ' đ';

  const summaryText = `${headsets} kính · Vé ${formatVnd(ticketPrice)} · Doanh thu ${formatVnd(metrics.monthlyGrossRevenue)}/tháng · Hoàn vốn ~${metrics.paybackMonths} tháng`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-slate-900">
      <div className="space-y-5">
        {/* Slider 1 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="roi-headsets" className="text-sm font-semibold text-slate-800">
              <Tx k="roi.001" d={"Số lượng kính"} />
            </label>
            <span className="text-base font-bold font-mono-num text-[#0B0F19]">
              {headsets} kính
            </span>
          </div>
          <input
            id="roi-headsets"
            type="range"
            min={6}
            max={20}
            step={1}
            value={headsets}
            onChange={(e) => setHeadsets(Number(e.target.value))}
            className="holomia-slider"
          />
          <div className="flex justify-between text-xs text-slate-400 font-mono-num mt-1">
            <span>6</span>
            <span>12</span>
            <span>20</span>
          </div>
        </div>

        {/* Slider 2 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="roi-ticket" className="text-sm font-semibold text-slate-800">
              <Tx k="roi.002" d={"Giá vé dự kiến"} />
            </label>
            <span className="text-base font-bold font-mono-num text-[#0B0F19]">
              {formatVnd(ticketPrice)}
            </span>
          </div>
          <input
            id="roi-ticket"
            type="range"
            min={80000}
            max={150000}
            step={5000}
            value={ticketPrice}
            onChange={(e) => setTicketPrice(Number(e.target.value))}
            className="holomia-slider"
          />
          <div className="flex justify-between text-xs text-slate-400 font-mono-num mt-1">
            <span>80.000 đ</span>
            <span>115.000 đ</span>
            <span>150.000 đ</span>
          </div>
        </div>

        {/* Collapsible Assumptions */}
        <div>
          <button
            type="button"
            onClick={() => setShowAssumptions((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0B0F19] transition-colors cursor-pointer"
          >
            {showAssumptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span><Tx k="roi.003" d={"Điều chỉnh giả định"} /></span>
          </button>

          {showAssumptions && (
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1"><Tx k="roi.004" d={"Ngày mở/tháng"} /></label>
                <select
                  value={operatingDays}
                  onChange={(e) => setOperatingDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900"
                >
                  <option value={22}>{t('roi.005', "22 ngày")}</option>
                  <option value={26}>{t('roi.006', "26 ngày")}</option>
                  <option value={30}>{t('roi.007', "30 ngày")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1"><Tx k="roi.008" d={"Tỷ lệ lấp đầy"} /></label>
                <select
                  value={occupancyRate}
                  onChange={(e) => setOccupancyRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900"
                >
                  <option value={25}>25%</option>
                  <option value={35}>35%</option>
                  <option value={50}>50%</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1"><Tx k="roi.009" d={"Tỷ lệ giữ lại"} /></label>
                <select
                  value={partnerShare}
                  onChange={(e) => setPartnerShare(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900"
                >
                  <option value={30}>{t('roi.010', "30% (Rev-share)")}</option>
                  <option value={45}>{t('roi.011', "45% (Tự vận hành)")}</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Outputs */}
        <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="text-xs font-medium text-slate-500"><Tx k="roi.012" d={"Doanh thu ước tính / tháng"} /></div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-[#0284C7] mt-1">
              {formatVnd(metrics.monthlyGrossRevenue)}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500"><Tx k="roi.013" d={"Hoàn vốn dự kiến"} /></div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono-num text-[#0B0F19] mt-1">
              {metrics.paybackMonths} tháng
            </div>
          </div>
        </div>

        {showExtendedChart && (
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
              <span className="font-semibold text-slate-700"><Tx k="roi.014" d={"Lũy kế hoàn vốn 12 tháng"} /></span>
              <span className="font-mono-num"><Tx k="roi.015" d={"Mục tiêu: 100%"} /></span>
            </div>
            <div className="grid grid-cols-12 gap-1.5 items-end h-20">
              {metrics.cumulative12Months.map((item) => (
                <div key={item.month} className="flex flex-col items-center h-full justify-end">
                  <div
                    className={`w-full rounded-t transition-all duration-200 ${
                      item.month >= metrics.paybackMonths ? 'bg-[#00B8D4]' : 'bg-slate-300'
                    }`}
                    style={{ height: `${Math.max(12, item.progressPct)}%` }}
                  />
                  <span className="text-[10px] font-mono-num text-slate-500 mt-1">
                    T{item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => onRequestExcel(summaryText)}
          className="w-full py-3 px-5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span><Tx k="roi.016" d={"Nhận bảng tính Excel chi tiết 5 năm qua Email"} /></span>
        </button>
      </div>
    </div>
  );
};

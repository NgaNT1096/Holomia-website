import React, { useState } from 'react';
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react';

interface LivingLabFormProps {
  defaultInterest?: 'Tổ chức Sự kiện' | 'Hợp tác Mặt bằng' | 'Dự án Du lịch & Custom';
  showSchedulePicker?: boolean;
}

const INTEREST_TAG_MAP: Record<string, { tag: string; team: string }> = {
  'Tổ chức Sự kiện': {
    tag: 'event-lead',
    team: 'Đội ngũ Sự kiện & Agency',
  },
  'Hợp tác Mặt bằng': {
    tag: 'venue-lead',
    team: 'Đội ngũ Mặt bằng Thương mại',
  },
  'Dự án Du lịch & Custom': {
    tag: 'custom-lead',
    team: 'Đội ngũ Du lịch & Thiết kế riêng',
  },
};

const TIME_SLOTS = ['09:30 – 10:00', '10:30 – 11:00', '14:00 – 14:30', '15:30 – 16:00'];

export const LivingLabForm: React.FC<LivingLabFormProps> = ({
  defaultInterest = 'Tổ chức Sự kiện',
  showSchedulePicker = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [interest, setInterest] = useState<string>(defaultInterest);
  const [location, setLocation] = useState<'Hà Nội' | 'TP.HCM'>('Hà Nội');
  const [date, setDate] = useState('2026-11-26');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !company.trim()) {
      setError('Vui lòng điền Họ tên, Số điện thoại/Zalo và Tên Công ty.');
      return;
    }
    if (!agreed) {
      setError('Vui lòng xác nhận đồng ý đặt lịch.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  if (submitted) {
    const routing = INTEREST_TAG_MAP[interest] || INTEREST_TAG_MAP['Tổ chức Sự kiện'];
    return (
      <div className="bg-[#0F172A] border border-white/15 rounded-2xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">Đã nhận yêu cầu đặt lịch</h3>
        <p className="text-sm text-slate-300">
          Chuyển tiếp tới <strong className="text-[#00E5FF]">{routing.team}</strong> ({routing.tag}).
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs font-medium text-slate-400 hover:text-white underline cursor-pointer"
        >
          Đặt lịch khác
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0F172A] border border-white/15 rounded-2xl p-6 sm:p-7 space-y-3.5"
    >
      <div>
        <label htmlFor="ll-name" className="block text-xs font-medium text-slate-300 mb-1">
          Họ tên *
        </label>
        <input
          id="ll-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nguyễn Minh Anh"
          className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
        />
      </div>

      <div>
        <label htmlFor="ll-phone" className="block text-xs font-medium text-slate-300 mb-1">
          Số điện thoại / Zalo *
        </label>
        <input
          id="ll-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912 345 678"
          className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
        />
      </div>

      <div>
        <label htmlFor="ll-company" className="block text-xs font-medium text-slate-300 mb-1">
          Tên Công ty / Tổ chức *
        </label>
        <input
          id="ll-company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Tên doanh nghiệp hoặc Agency"
          className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
        />
      </div>

      <div>
        <label htmlFor="ll-interest" className="block text-xs font-medium text-slate-300 mb-1">
          Nhu cầu quan tâm
        </label>
        <select
          id="ll-interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white focus:outline-none focus:border-[#00E5FF]"
        >
          <option value="Tổ chức Sự kiện">Tổ chức Sự kiện</option>
          <option value="Hợp tác Mặt bằng">Hợp tác Mặt bằng</option>
          <option value="Dự án Du lịch & Custom">Dự án Du lịch & Custom</option>
        </select>
      </div>

      {showSchedulePicker && (
        <div className="pt-2 border-t border-white/10 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-[#00E5FF]">
            <Calendar className="w-4 h-4" />
            <span>Chọn địa điểm & khung giờ 30 phút</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['Hà Nội', 'TP.HCM'] as const).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setLocation(city)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  location === city
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                    : 'bg-[#0B0F19] border-white/15 text-slate-300 hover:border-white/30'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#0B0F19] border border-white/15 text-xs text-white font-mono-num focus:outline-none focus:border-[#00E5FF]"
            />
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#0B0F19] border border-white/15 text-xs text-white font-mono-num focus:outline-none focus:border-[#00E5FF]"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="accent-[#00E5FF] rounded"
        />
        <span>Đồng ý để Holomia liên hệ xác nhận lịch hẹn.</span>
      </label>

      {error && (
        <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 px-5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <span>Gửi yêu cầu đặt lịch</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
};

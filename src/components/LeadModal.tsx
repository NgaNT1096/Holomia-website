import React, { useState } from 'react';
import { X, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { LeadModalType, LeadTag } from '../types/holomia';

interface LeadModalProps {
  modalType: LeadModalType;
  onClose: () => void;
  contextSummary?: string;
}

const MODAL_CONFIG: Record<
  Exclude<LeadModalType, null>,
  {
    tag: LeadTag;
    salesTeam: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    successTitle: string;
    successDetail: string;
  }
> = {
  'pitch-deck': {
    tag: 'pitch-deck-download',
    salesTeam: 'Bộ phận Tư vấn Giải pháp Doanh nghiệp',
    title: 'Tải Hồ sơ Năng lực (Pitch Deck)',
    subtitle:
      'Nhận ngay bộ tài liệu tổng quan hạ tầng Holomia Platform, các dự án đã triển khai cùng Meta, VOV, Oxalis và bảng thông số vận hành chuẩn.',
    ctaLabel: 'Nhận Pitch Deck ngay',
    successTitle: 'Hồ sơ năng lực đã sẵn sàng',
    successDetail:
      'Liên kết tải PDF đã được gửi tới email của anh/chị. Thông tin yêu cầu đã được gắn thẻ tự động tới Bộ phận Tư vấn Giải pháp Doanh nghiệp.',
  },
  'agency-rate-card': {
    tag: 'agency-rate-card',
    salesTeam: 'Đội ngũ Phụ trách Event Agency',
    title: 'Nhận Rate Card dành riêng cho Event Agency',
    subtitle:
      'Bao gồm chiết khấu đối tác Agency, tùy chọn nhận diện thương hiệu trên giao diện kính, check-in QR và phương án điều phối đa cụm.',
    ctaLabel: 'Gửi Rate Card qua Email / Zalo',
    successTitle: 'Đã gửi Rate Card Agency',
    successDetail:
      'Bảng giá chi tiết và chính sách chiết khấu Agency đã được chuyển tới email đăng ký và đồng bộ sang chuyên viên phụ trách mảng Sự kiện.',
  },
  'roi-excel': {
    tag: 'venue-roi-excel',
    salesTeam: 'Đội ngũ Phát triển Mặt bằng Thương mại',
    title: 'Nhận bảng tính Excel dự phóng 5 năm',
    subtitle:
      'File Excel cho phép điều chỉnh linh hoạt chi phí thuê mặt bằng, nhân sự ca trực, lịch bảo trì và tỷ lệ chia sẻ doanh thu 70/30.',
    ctaLabel: 'Gửi bảng tính Excel qua Email',
    successTitle: 'Đã gửi bảng tính dự phóng 5 năm',
    successDetail:
      'Mẫu Excel dự phóng dòng tiền theo cấu hình kính anh/chị đã chọn đã được gửi qua email và chuyển tới chuyên viên mảng Mặt bằng.',
  },
};

export const LeadModal: React.FC<LeadModalProps> = ({
  modalType,
  onClose,
  contextSummary,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!modalType) return null;

  const config = MODAL_CONFIG[modalType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Vui lòng điền đầy đủ Họ tên, Số điện thoại/Zalo và Email công việc.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError('Địa chỉ email chưa đúng định dạng.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#111827] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Đóng hộp thoại"
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="text-xs font-medium text-[#00E5FF] mb-2">
              Tài liệu B2B · {config.salesTeam}
            </div>
            <h2
              id="lead-modal-title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight pr-8"
            >
              {config.title}
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              {config.subtitle}
            </p>

            {contextSummary && (
              <div className="mt-4 px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/10 text-xs text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span>Cấu hình đính kèm: {contextSummary}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Minh Anh"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Số điện thoại / Zalo *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email nhận tài liệu *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.vn"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Tên Công ty / Đơn vị
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Tên doanh nghiệp hoặc Agency"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {error && (
                <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3.5 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{config.ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">{config.successTitle}</h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              {config.successDetail}
            </p>
            <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-slate-400 text-left space-y-1">
              <div>
                <span className="text-slate-500">Email nhận:</span>{' '}
                <span className="text-white font-medium">{email}</span>
              </div>
              <div>
                <span className="text-slate-500">Phân loại tự động:</span>{' '}
                <span className="text-[#00E5FF] font-mono-num">{config.tag}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-2 px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

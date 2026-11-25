import { Tx } from '../lib/editor';
import { submitLead, useCms, useLocalized  } from '../lib/cms';
import { MODAL_CONFIG as MODAL_CONFIG_RAW } from '../data/holomiaData';
import React, { useState } from 'react';
import { X, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { LeadModalType, LeadTag } from '../types/holomia';

interface LeadModalProps {
  modalType: LeadModalType;
  onClose: () => void;
  contextSummary?: string;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  modalType,
  onClose,
  contextSummary,
}) => {
  const { t } = useCms();
  const MODAL_CONFIG = useLocalized(MODAL_CONFIG_RAW, 'MODAL_CONFIG');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!modalType) return null;

  const config = MODAL_CONFIG[modalType];

  const handleSubmit = async (e: React.FormEvent) => {
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
    const ok = await submitLead({
      tag: config.tag, name, phone, email, company, message: contextSummary,
    });
    if (!ok) {
      setError('Gửi không thành công, vui lòng thử lại sau.');
      return;
    }
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
          aria-label={t('lead.008', "Đóng hộp thoại")}
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
                    <Tx k="lead.001" d={"Họ và tên *"} />
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('lead.009', "Nguyễn Minh Anh")}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0F19] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    <Tx k="lead.002" d={"Số điện thoại / Zalo *"} />
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
                  <Tx k="lead.003" d={"Email nhận tài liệu *"} />
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
                  <Tx k="lead.004" d={"Tên Công ty / Đơn vị"} />
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={t('lead.010', "Tên doanh nghiệp hoặc Agency")}
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
                <span className="text-slate-500"><Tx k="lead.005" d={"Email nhận:"} /></span>{' '}
                <span className="text-white font-medium">{email}</span>
              </div>
              <div>
                <span className="text-slate-500"><Tx k="lead.006" d={"Phân loại tự động:"} /></span>{' '}
                <span className="text-[#00E5FF] font-mono-num">{config.tag}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-2 px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Tx k="lead.007" d={"Đóng cửa sổ"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { AppRoute, LeadModalType } from '../types/holomia';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onOpenModal: (type: LeadModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenModal }) => {
  return (
    <footer className="bg-[#070A12] border-t border-white/10 text-slate-300">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xl font-extrabold tracking-tight text-white">
              H<span className="text-[#00E5FF]">O</span>LOMIA
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Hạ tầng vận hành thực tế ảo đa người dùng cho sự kiện, điểm đến thương mại và di sản.
            </p>
            <div className="pt-1 text-xs text-slate-500 space-y-1">
              <p className="text-slate-300 font-medium">Công ty TNHH Công nghệ Holomia</p>
              <p>MST: 0107625839</p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-sm font-semibold text-white">Giải pháp</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('platform')}
                  className="text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  Holomia Platform
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions-event')}
                  className="text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  Holomia Event
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions-venue')}
                  className="text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  Holomia Venue
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solutions-custom')}
                  className="text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer"
                >
                  Holomia Custom
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-sm font-semibold text-white">Showroom & Hotline</h3>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>Hà Nội: Tầng 6, Viwaseen Tower, 48 Tố Hữu</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>TP.HCM: Living Lab B2B, Quận 1</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <a
                  href="tel:0986123456"
                  className="text-white font-medium font-mono-num hover:text-[#F59E0B]"
                >
                  0986 123 456
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href="mailto:contact@holomia.com" className="hover:text-white">
                  contact@holomia.com
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-sm font-semibold text-white">Kênh kết nối</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenModal('pitch-deck')}
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-[#F59E0B] cursor-pointer"
                >
                  <span>Tải Pitch Deck</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <span>YouTube Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  <span>Facebook</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Holomia Technology.</p>
          <button
            type="button"
            onClick={() => onNavigate('showroom')}
            className="hover:text-slate-300 cursor-pointer"
          >
            Đặt lịch Showroom
          </button>
        </div>
      </div>
    </footer>
  );
};

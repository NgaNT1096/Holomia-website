import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AppRoute } from '../types/holomia';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onBookShowroom: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onBookShowroom,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSolutionActive =
    currentRoute === 'solutions-event' ||
    currentRoute === 'solutions-venue' ||
    currentRoute === 'solutions-custom';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRouteClick = (route: AppRoute) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/92 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          type="button"
          onClick={() => handleRouteClick('home')}
          className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded"
        >
          H<span className="text-[#00E5FF]">O</span>LOMIA
        </button>

        {/* Zone 2: 6 concise single-line navigation links */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          <button
            type="button"
            onClick={() => handleRouteClick('home')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              currentRoute === 'home'
                ? 'text-[#00E5FF] border-[#00E5FF]'
                : 'border-transparent hover:text-white hover:border-white/30'
            }`}
          >
            Trang chủ
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('platform')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              currentRoute === 'platform'
                ? 'text-[#00E5FF] border-[#00E5FF]'
                : 'border-transparent hover:text-white hover:border-white/30'
            }`}
          >
            Nền tảng lõi
          </button>

          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1 whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                isSolutionActive
                  ? 'text-[#00E5FF] border-[#00E5FF]'
                  : 'border-transparent hover:text-white hover:border-white/30'
              }`}
            >
              <span>Giải pháp</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full pt-2 w-64">
                <div className="bg-[#111827] border border-white/15 rounded-xl p-1.5 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => handleRouteClick('solutions-event')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      currentRoute === 'solutions-event'
                        ? 'bg-[#00E5FF]/12 text-[#00E5FF]'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-sm font-semibold">Holomia Event</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Sự kiện trọn gói · Rate Card Agency
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRouteClick('solutions-venue')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      currentRoute === 'solutions-venue'
                        ? 'bg-[#00E5FF]/12 text-[#00E5FF]'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-sm font-semibold">Holomia Venue</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Hợp tác Rev-share 70/30 & Tính ROI
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRouteClick('solutions-custom')}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      currentRoute === 'solutions-custom'
                        ? 'bg-[#00E5FF]/12 text-[#00E5FF]'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-sm font-semibold">Holomia Custom</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      VR5D/9D · Vali VR Kit · Số hóa di sản
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleRouteClick('case-studies')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              currentRoute === 'case-studies'
                ? 'text-[#00E5FF] border-[#00E5FF]'
                : 'border-transparent hover:text-white hover:border-white/30'
            }`}
          >
            Dự án
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('showroom')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              currentRoute === 'showroom'
                ? 'text-[#00E5FF] border-[#00E5FF]'
                : 'border-transparent hover:text-white hover:border-white/30'
            }`}
          >
            Showroom
          </button>

          <button
            type="button"
            onClick={() => handleRouteClick('about')}
            className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
              currentRoute === 'about'
                ? 'text-[#00E5FF] border-[#00E5FF]'
                : 'border-transparent hover:text-white hover:border-white/30'
            }`}
          >
            Về Holomia & Tin tức
          </button>
        </nav>

        {/* Zone 3: 1 Primary CTA button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onBookShowroom();
            }}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#0B0F19] bg-[#F59E0B] hover:bg-[#FBBF24] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19]"
          >
            Đặt lịch showroom
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg border border-white/15 text-slate-200 hover:bg-white/5 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B0F19] px-6 py-5 space-y-2">
          <button
            type="button"
            onClick={() => handleRouteClick('home')}
            className="block w-full text-left py-2.5 text-sm font-medium text-slate-200 hover:text-[#00E5FF]"
          >
            Trang chủ
          </button>
          <button
            type="button"
            onClick={() => handleRouteClick('platform')}
            className="block w-full text-left py-2.5 text-sm font-medium text-slate-200 hover:text-[#00E5FF]"
          >
            Nền tảng lõi
          </button>
          <div className="py-1.5 border-y border-white/10 space-y-1">
            <div className="text-xs font-medium text-slate-400 py-1">Giải pháp sản phẩm</div>
            <button
              type="button"
              onClick={() => handleRouteClick('solutions-event')}
              className="block w-full text-left pl-3 py-2 text-sm text-slate-200 hover:text-[#00E5FF]"
            >
              Holomia Event — Sự kiện trọn gói
            </button>
            <button
              type="button"
              onClick={() => handleRouteClick('solutions-venue')}
              className="block w-full text-left pl-3 py-2 text-sm text-slate-200 hover:text-[#00E5FF]"
            >
              Holomia Venue — Hợp tác Mặt bằng
            </button>
            <button
              type="button"
              onClick={() => handleRouteClick('solutions-custom')}
              className="block w-full text-left pl-3 py-2 text-sm text-slate-200 hover:text-[#00E5FF]"
            >
              Holomia Custom — VR5D/9D & Di sản
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleRouteClick('case-studies')}
            className="block w-full text-left py-2.5 text-sm font-medium text-slate-200 hover:text-[#00E5FF]"
          >
            Dự án thực chiến
          </button>
          <button
            type="button"
            onClick={() => handleRouteClick('showroom')}
            className="block w-full text-left py-2.5 text-sm font-medium text-slate-200 hover:text-[#00E5FF]"
          >
            Showroom Mẫu
          </button>
          <button
            type="button"
            onClick={() => handleRouteClick('about')}
            className="block w-full text-left py-2.5 text-sm font-medium text-slate-200 hover:text-[#00E5FF]"
          >
            Về Holomia & Tin tức
          </button>
          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onBookShowroom();
              }}
              className="w-full py-3 text-sm font-semibold text-[#0B0F19] bg-[#F59E0B] rounded-lg"
            >
              Đặt lịch showroom
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

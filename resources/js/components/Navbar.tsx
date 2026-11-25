import { Brand } from './Brand';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AppRoute } from '../types/holomia';
import { AddItem, GlobalSection, IfText, Item, ItemData, SectionData, T, useEditor, useItems } from '../lib/editor';
import { useCurrentPath, useFollow } from '../lib/links';
import { LanguageSwitch } from './LanguageSwitch';
import { useTr } from '../lib/locale';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onBookShowroom: () => void;
}

export const Navbar: React.FC<NavbarProps> = (props) => (
  <GlobalSection template="header">{(section) => <NavbarContent {...props} section={section} />}</GlobalSection>
);

const NavbarContent: React.FC<NavbarProps & { section: SectionData }> = ({ onNavigate, onBookShowroom, section }) => {
  const { editing } = useEditor();
  const tr = useTr();
  const menu = useItems(section, 'menu');
  const solutions = useItems(section, 'solution');
  const follow = useFollow();
  const path = useCurrentPath();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const go = (item: ItemData) => {
    if (editing) return;
    setDropdownOpen(false);
    setMobileOpen(false);
    follow(item.link);
  };

  const tab = (active: boolean) =>
    `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
      active ? 'text-[#00E5FF] border-[#00E5FF]' : 'border-transparent hover:text-white hover:border-white/30'
    }`;

  const bookShowroom = () => {
    if (editing) return;
    setMobileOpen(false);
    onBookShowroom();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/92 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => !editing && onNavigate('home')}
          className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded"
        >
          <Brand k="header.brand" />
        </button>

        <nav aria-label={tr('Điều hướng chính', 'Main navigation')} className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {menu.map((item) =>
            item.link === '#solutions' ? (
              <Item key={item.id} item={item} inline linkable>
                <div
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => !editing && setDropdownOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={dropdownOpen}
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={`flex items-center gap-1 ${tab(solutions.some((s) => s.link === path))}`}
                  >
                    <span>
                      <T k="label" />
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full pt-2 w-72">
                      <div className="bg-[#111827] border border-white/15 rounded-xl p-1.5 shadow-2xl space-y-0.5">
                        {solutions.map((sub) => (
                          <Item key={sub.id} item={sub} linkable>
                            <button
                              type="button"
                              onClick={() => go(sub)}
                              className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors cursor-pointer ${
                                path === sub.link ? 'bg-[#00E5FF]/12 text-[#00E5FF]' : 'text-slate-200 hover:bg-white/5'
                              }`}
                            >
                              <div className="text-sm font-semibold">
                                <T k="label" />
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">
                                <T k="description" />
                              </div>
                            </button>
                          </Item>
                        ))}
                        <AddItem kind="solution" label="Thêm mục con" className="w-full" link="/" fields={{ label: 'Mục mới', description: '' }} />
                      </div>
                    </div>
                  )}
                </div>
              </Item>
            ) : (
              <Item key={item.id} item={item} inline linkable>
                <button type="button" onClick={() => go(item)} className={tab(path === item.link)}>
                  <T k="label" />
                </button>
              </Item>
            )
          )}
          <AddItem kind="menu" label="Menu" link="/" fields={{ label: 'Mục mới' }} />
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <LanguageSwitch />
          <IfText k="header.cta">
          <button
            type="button"
            onClick={bookShowroom}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#0B0F19] bg-[#F59E0B] hover:bg-[#FBBF24] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19]"
          >
            <T k="header.cta" d="Đặt lịch showroom" />
          </button>
          </IfText>

          <button
            type="button"
            aria-label={mobileOpen ? tr('Đóng menu', 'Close menu') : tr('Mở menu', 'Open menu')}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg border border-white/15 text-slate-200 hover:bg-white/5 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer: same items as desktop (edit them on a wide screen) */}
      {mobileOpen && !editing && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B0F19] px-6 py-5 space-y-2">
          {menu.map((item) => (
            <Item key={item.id} item={item}>
              {item.link === '#solutions' ? (
                <div className="py-1.5 border-y border-white/10 space-y-1">
                  <div className="text-xs font-medium text-slate-400 py-1">
                    <T k="label" />
                  </div>
                  {solutions.map((sub) => (
                    <Item key={sub.id} item={sub}>
                      <button type="button" onClick={() => go(sub)} className="block w-full text-left pl-3 py-2 text-sm text-slate-200 hover:text-[#00E5FF]">
                        <T k="label" />
                      </button>
                    </Item>
                  ))}
                </div>
              ) : (
                <button type="button" onClick={() => go(item)} className="block w-full text-left py-2.5 text-sm font-medium text-slate-200 hover:text-[#00E5FF]">
                  <T k="label" />
                </button>
              )}
            </Item>
          ))}
          <div className="pt-3">
            <IfText k="header.cta">
            <button type="button" onClick={bookShowroom} className="w-full py-3 text-sm font-semibold text-[#0B0F19] bg-[#F59E0B] rounded-lg">
              <T k="header.cta" d="Đặt lịch showroom" />
            </button>
            </IfText>
          </div>
        </div>
      )}
    </header>
  );
};

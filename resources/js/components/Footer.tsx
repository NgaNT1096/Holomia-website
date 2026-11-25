import React from 'react';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { AppRoute, LeadModalType } from '../types/holomia';
import { AddItem, GlobalSection, IfText, Item, SectionData, T, useEditor, useField, useItems } from '../lib/editor';
import { useFollow } from '../lib/links';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onOpenModal: (type: LeadModalType) => void;
}

export const Footer: React.FC<FooterProps> = (props) => (
  <GlobalSection template="footer">{(section) => <FooterContent {...props} section={section} />}</GlobalSection>
);

const FooterContent: React.FC<FooterProps & { section: SectionData }> = ({ onNavigate, onOpenModal, section }) => {
  const { editing } = useEditor();
  const field = useField();
  const follow = useFollow(onOpenModal);
  const links = useItems(section, 'link');
  const locations = useItems(section, 'location');
  const channels = useItems(section, 'channel');

  const phone = field('footer.phone');
  const email = field('footer.email');
  const href = (value: string) => (editing ? undefined : value);

  return (
    <footer className="bg-[#070A12] border-t border-white/10 text-slate-300">
      <div className="max-w-[1200px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xl font-extrabold tracking-tight text-white">
              H<span className="text-[#00E5FF]">O</span>
              <T k="footer.brand" d="LOMIA" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              <T k="footer.about" />
            </p>
            <div className="pt-1 text-xs text-slate-500 space-y-1">
              <p className="text-slate-300 font-medium">
                <T k="footer.company" />
              </p>
              <p>
                <T k="footer.tax" />
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-sm font-semibold text-white">
              <T k="footer.linksTitle" />
            </h3>
            <ul className="space-y-2 text-sm">
              {links.map((item) => (
                <li key={item.id}>
                  <Item item={item} linkable>
                    <button type="button" onClick={() => follow(item.link)} className="text-slate-400 hover:text-[#00E5FF] transition-colors cursor-pointer">
                      <T k="label" />
                    </button>
                  </Item>
                </li>
              ))}
            </ul>
            <AddItem kind="link" label="Thêm link" link="/" fields={{ label: 'Link mới' }} />
          </div>

          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-sm font-semibold text-white">
              <T k="footer.contactTitle" />
            </h3>
            <div className="space-y-2.5 text-sm text-slate-400">
              {locations.map((item) => (
                <Item key={item.id} item={item}>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>
                      <T k="label" />
                    </span>
                  </div>
                </Item>
              ))}
              <AddItem kind="location" label="Thêm địa chỉ" fields={{ label: 'Địa chỉ mới' }} />
              <IfText k="footer.phone">
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <a href={href(`tel:${phone.replace(/[^0-9+]/g, '')}`)} className="text-white font-medium font-mono-num hover:text-[#F59E0B]">
                  <T k="footer.phone" />
                </a>
              </div>
              </IfText>
              <IfText k="footer.email">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href={href(`mailto:${email}`)} className="hover:text-white">
                  <T k="footer.email" />
                </a>
              </div>
              </IfText>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-sm font-semibold text-white">
              <T k="footer.channelsTitle" />
            </h3>
            <ul className="space-y-2 text-sm">
              {channels.map((item) => (
                <li key={item.id}>
                  <Item item={item} linkable>
                    <button
                      type="button"
                      onClick={() => follow(item.link)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <span>
                        <T k="label" />
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </Item>
                </li>
              ))}
            </ul>
            <AddItem kind="channel" label="Thêm kênh" link="https://" fields={{ label: 'Kênh mới' }} />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} <T k="footer.copyright" />
          </p>
          <IfText k="footer.cta">
          <button type="button" onClick={() => !editing && onNavigate('showroom')} className="hover:text-slate-300 cursor-pointer">
            <T k="footer.cta" />
          </button>
          </IfText>
        </div>
      </div>
    </footer>
  );
};

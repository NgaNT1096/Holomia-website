import { AddItem, GlobalSection, Item, SectionData, T, useItems } from '../lib/editor';
import { Tx } from '../lib/editor';
import { useCms } from '../lib/cms';
import React from 'react';
import { Clock, MapPin, Check } from 'lucide-react';
import { IMAGES } from '../data/holomiaData';
import { LivingLabForm } from '../components/LivingLabForm';
import { ResilientImage } from '../components/ResilientImage';

const Locations: React.FC<{ section: SectionData }> = ({ section }) => {
  const items = useItems(section, 'location');
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item}>
          <div className="bg-[#0B0F19] border border-white/12 rounded-2xl p-6 space-y-2.5">
            <div className="text-xs font-semibold text-[#00E5FF]">
              <T k="city" />
            </div>
            <h3 className="text-lg font-bold text-white">
              <T k="name" />
            </h3>
            <div className="flex items-start gap-2 text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span>
                <T k="address" />
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 shrink-0" />
              <span>
                <T k="hours" />
              </span>
            </div>
          </div>
        </Item>
      ))}
      <AddItem kind="location" label="Thêm địa điểm" fields={{ city: 'Thành phố', name: 'Tên địa điểm', address: 'Địa chỉ', hours: 'Giờ mở cửa' }} />
    </>
  );
};

export const ShowroomPage: React.FC = () => {
  return (
    <div>
      <section className="bg-[#0B0F19] border-b border-white/10 py-14">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs sm:text-sm font-semibold text-[#00E5FF]"><Tx k="showroom.001" d={"Living Lab"} /></p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              <Tx k="showroom.002" d={"30 phút tự tay vận hành sàn chơi 1-ra-100"} />
            </h1>
            <div className="pt-2 space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span><Tx k="showroom.003" d={"01–10′ · Đeo kính trải nghiệm Journey & Arena"} /></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span><Tx k="showroom.004" d={"11–20′ · Cầm Tablet điều phối cụm thiết bị"} /></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                <span><Tx k="showroom.005" d={"21–30′ · Tư vấn cấu hình & dự toán miễn phí"} /></span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-white/15 h-[300px] sm:h-[360px]">
              <ResilientImage
                src={IMAGES.showroomLab}
                alt="Showroom Mẫu Holomia Living Lab"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0E1422] py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              <Tx k="showroom.006" d={"Địa điểm đón khách B2B"} />
            </h2>

            <GlobalSection template="locations">
              {(section) => <Locations section={section} />}
            </GlobalSection>
          </div>

          <div className="lg:col-span-6">
            <LivingLabForm showSchedulePicker />
          </div>
        </div>
      </section>
    </div>
  );
};

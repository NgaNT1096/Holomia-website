import { useTr } from '../lib/locale';
import { Tx, AddItem, GlobalSection, ImageControl, ItemScope, ItemTools, resolve, SectionData, SectionImg, T, useEditor, useItems } from '../lib/editor';
import React, { useEffect, useState } from 'react';
import { Compass, Crosshair, Pause, Play, Tablet } from 'lucide-react';
import { PlatformModeId } from '../types/holomia';
import { useCms, useLocalized  } from '../lib/cms';
import { TabletSimulator } from './TabletSimulator';

const Showcase: React.FC<{ section: SectionData }> = ({ section }) => {
  const { t } = useCms();
  const { editing, locale } = useEditor();
  const tr = useTr();
  const [viewType, setViewType] = useState<'video' | 'interactive'>('video');
  const [mode, setMode] = useState<PlatformModeId>('journey');
  const [isPlaying, setIsPlaying] = useState(true);
  const [frameIdx, setFrameIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const frames = useItems(section, mode);
  const index = frames.length ? Math.min(frameIdx, frames.length - 1) : 0;
  const current = frames[index];
  const field = (k: string) => (current ? resolve(current.fields[k], locale, '') : '');

  useEffect(() => {
    if (editing || viewType !== 'video' || !isPlaying || !frames.length) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setFrameIdx((f) => (f + 1) % frames.length);
          return 0;
        }
        return prev + 2.5; // ~4s per scene smoothly
      });
    }, 100);

    return () => clearInterval(interval);
  }, [editing, viewType, isPlaying, frames.length]);

  const handleModeSwitch = (nextMode: PlatformModeId) => {
    setMode(nextMode);
    setFrameIdx(0);
    setProgress(0);
  };

  if (viewType === 'interactive') {
    return (
      <div className="space-y-3 h-full flex flex-col">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setViewType('video')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E5FF] hover:text-white cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span><Tx k="platformvideo.001" d={"Quay lại Video Demo"} /></span>
          </button>
        </div>
        <div className="flex-1">
          <TabletSimulator />
        </div>
      </div>
    );
  }

  const totalProgress =
    ((index + progress / 100) / Math.max(1, frames.length)) * 100;

  return (
    <div className="bg-[#0F172A] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between h-full">
      {/* Top Bar: Mode Switcher + Interactive Tablet Switch */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label={t('platformvideo.005', "Chọn video mô phỏng chế độ")}
          className="inline-flex items-center gap-1 p-1 bg-[#0B0F19] border border-white/10 rounded-xl"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'journey'}
            onClick={() => handleModeSwitch('journey')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'journey'
                ? 'bg-[#00E5FF] text-[#0B0F19]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span><Tx k="platformvideo.002" d={"Holomia Journey"} /></span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'arena'}
            onClick={() => handleModeSwitch('arena')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'arena'
                ? 'bg-[#F59E0B] text-[#0B0F19]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span><Tx k="platformvideo.003" d={"Omega Arena"} /></span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setViewType('interactive')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 hover:border-[#00E5FF]/50 text-xs font-medium text-slate-200 hover:text-[#00E5FF] transition-colors cursor-pointer"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span><Tx k="platformvideo.004" d={"Thử bấm Tablet"} /></span>
        </button>
      </div>

      {/* Video Viewport */}
      <div className="relative flex-1 min-h-[290px] sm:min-h-[340px] bg-[#0B0F19] overflow-hidden group">
        {current && (
          <ItemScope item={current}>
            <SectionImg
              k="image"
              alt={field('caption')}
              className={`w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${
                isPlaying && !editing ? 'scale-105' : 'scale-100'
              }`}
            />
          </ItemScope>
        )}

        {/* Measured Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/20 to-transparent" />

        {/* Center Play/Pause Overlay Button on Hover or Pause */}
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          aria-label={isPlaying ? tr('Tạm dừng video', 'Pause') : tr('Phát video', 'Play')}
          className={`absolute inset-0 flex items-center justify-center transition-opacity cursor-pointer ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          <span className="w-14 h-14 rounded-full bg-[#0B0F19]/75 border border-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#F59E0B] hover:text-[#0B0F19] hover:border-[#F59E0B] transition-colors">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </span>
        </button>

        {/* Bottom Caption & Chapter Dots */}
        <div className={`absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4 ${editing ? 'z-20' : 'pointer-events-none'}`}>
          <div>
            <div className="text-xs font-semibold text-[#00E5FF]">
              <T k={mode === 'journey' ? 'journeyVenue' : 'arenaVenue'} />
            </div>
            {current && (
              <ItemScope item={current}>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                  <T k="caption" />
                </div>
              </ItemScope>
            )}
          </div>
          <span className="text-xs font-mono-num text-slate-300 shrink-0">
            {current && (
              <ItemScope item={current}>
                <T k="timecode" />
              </ItemScope>
            )}{' '}
            / <T k="duration" />
          </span>
        </div>

        {editing && current && (
          <ItemScope item={current}>
            <div className="absolute top-3 left-3 right-3 z-30 flex items-start justify-between gap-2">
              <ImageControl k="image" label="Đổi ảnh cảnh này" className="relative" />
              <ItemTools item={current} />
            </div>
          </ItemScope>
        )}
      </div>

      {/* Video Scrubber Controls */}
      <div className="p-4 bg-[#0B0F19] border-t border-white/10 space-y-2.5">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              mode === 'journey' ? 'bg-[#00E5FF]' : 'bg-[#F59E0B]'
            }`}
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="text-xs font-medium text-slate-300 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>
                <T k={isPlaying ? 'playing' : 'paused'} />
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {frames.map((f, idx) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFrameIdx(idx);
                  setProgress(0);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-num cursor-pointer transition-colors ${
                  idx === index ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <T k="scene" /> {idx + 1}
              </button>
            ))}
            <AddItem kind={mode} label="Thêm cảnh" fields={{ caption: 'Chú thích cảnh mới', timecode: '00:00' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PlatformVideoShowcase: React.FC = () => (
  <GlobalSection template="videos">{(section) => <Showcase section={section} />}</GlobalSection>
);

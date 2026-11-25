import { Tx } from '../lib/editor';
import React, { useState } from 'react';
import { useCms, useLocalized  } from '../lib/cms';
import { Tablet, Compass, Crosshair, RotateCw, Users } from 'lucide-react';
import { PLATFORM_MODES as PLATFORM_MODES_RAW } from '../data/holomiaData';
import { PlatformModeId } from '../types/holomia';

export const TabletSimulator: React.FC = () => {
  const { t } = useCms();
  const PLATFORM_MODES = useLocalized(PLATFORM_MODES_RAW, 'PLATFORM_MODES');
  const [mode, setMode] = useState<PlatformModeId>('journey');
  const [stepIndex, setStepIndex] = useState<number>(0);

  const currentMode = PLATFORM_MODES[mode];
  const currentStep = currentMode.steps[stepIndex];

  const handleModeChange = (nextMode: PlatformModeId) => {
    setMode(nextMode);
    setStepIndex(0);
  };

  const handleNextStep = () => {
    setStepIndex((prev) => (prev + 1) % currentMode.steps.length);
  };

  const stepActionLabels = [
    `Xác nhận giao ${currentMode.headsetCount} kính`,
    'Bắt đầu phiên',
    'Chuyển xoay vòng',
    'Đón lượt mới',
  ];

  const nodeCount = currentMode.headsetCount;

  return (
    <div className="bg-[#0F172A] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <Tablet className="w-4 h-4 text-[#00E5FF]" />
            <span><Tx k="tablet.001" d={"Mô phỏng Tablet điều khiển"} /></span>
          </div>
          <span className="text-xs text-slate-400 font-mono-num">
            {currentMode.venueExample}
          </span>
        </div>

        {/* Mode Switcher */}
        <div
          role="tablist"
          aria-label={t('tablet.007', "Chế độ vận hành")}
          className="grid grid-cols-2 gap-1.5 p-1 mt-4 bg-[#0B0F19] border border-white/10 rounded-xl"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'journey'}
            onClick={() => handleModeChange('journey')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'journey'
                ? 'bg-[#00E5FF] text-[#0B0F19]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span className="truncate"><Tx k="tablet.002" d={"Holomia Journey - Di sản"} /></span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'arena'}
            onClick={() => handleModeChange('arena')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'arena'
                ? 'bg-[#F59E0B] text-[#0B0F19]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Crosshair className="w-4 h-4 shrink-0" />
            <span className="truncate"><Tx k="tablet.003" d={"Omega Arena - Giải trí"} /></span>
          </button>
        </div>

        {/* 4-Step Tabs */}
        <div className="grid grid-cols-4 gap-1 mt-4 border-b border-white/10">
          {currentMode.steps.map((step, idx) => {
            const isActive = idx === stepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setStepIndex(idx)}
                className={`pb-2.5 text-xs font-medium text-center border-b-2 transition-colors whitespace-nowrap truncate cursor-pointer ${
                  isActive
                    ? mode === 'journey'
                      ? 'text-[#00E5FF] border-[#00E5FF]'
                      : 'text-[#F59E0B] border-[#F59E0B]'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Visual Arena Grid */}
        <div
          className={`mt-4 rounded-xl p-5 border transition-colors duration-200 ${
            mode === 'journey'
              ? 'bg-gradient-to-br from-[#0B2233] via-[#0B1628] to-[#0B0F19] border-[#00E5FF]/25'
              : 'bg-gradient-to-br from-[#2B1B0C] via-[#17121E] to-[#0B0F19] border-[#F59E0B]/25'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div
                className={`text-xs font-semibold ${
                  mode === 'journey' ? 'text-[#00E5FF]' : 'text-[#F59E0B]'
                }`}
              >
                {currentMode.badgeLabel}
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                {currentMode.contentTitle}
              </h3>
            </div>
            <span className="text-xs font-mono-num text-slate-300 shrink-0">
              {currentMode.sessionDuration}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            {currentStep.detail}
          </p>

          <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-white/10">
            {Array.from({ length: nodeCount }).map((_, idx) => {
              const isRunning = stepIndex === 1 || stepIndex === 2;
              const isRotating = stepIndex === 3;
              return (
                <div
                  key={idx}
                  className={`h-8 rounded-md border flex items-center justify-center text-xs font-mono-num transition-all duration-200 ${
                    isRunning
                      ? mode === 'journey'
                        ? 'bg-[#00E5FF]/20 border-[#00E5FF]/60 text-[#00E5FF]'
                        : 'bg-[#F59E0B]/20 border-[#F59E0B]/60 text-[#F59E0B]'
                      : isRotating
                        ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-300'
                  }`}
                >
                  #{String(idx + 1).padStart(2, '0')}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Row + Action */}
      <div className="mt-5 pt-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xl font-bold font-mono-num text-white">
              {currentStep.readyCount}/{currentMode.headsetCount}
            </div>
            <div className="text-xs text-slate-400"><Tx k="tablet.004" d={"Kính sẵn sàng"} /></div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono-num text-[#00E5FF]">
              {currentStep.activeSessions}
            </div>
            <div className="text-xs text-slate-400"><Tx k="tablet.005" d={"Phiên đang chạy"} /></div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono-num text-white">
              {currentStep.completedGuests}
            </div>
            <div className="text-xs text-slate-400"><Tx k="tablet.006" d={"Lượt hoàn thành"} /></div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0B0F19] text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            {stepIndex === 3 ? (
              <RotateCw className="w-4 h-4" />
            ) : (
              <Users className="w-4 h-4" />
            )}
            <span>{stepActionLabels[stepIndex]}</span>
          </button>

          <span className="text-xs text-slate-400 font-mono-num">
            {currentMode.throughputEstimate}
          </span>
        </div>
      </div>
    </div>
  );
};

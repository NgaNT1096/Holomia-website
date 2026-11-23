import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="w-full h-full min-h-[180px] bg-gradient-to-br from-[#0F172A] via-[#13203A] to-[#0B0F19] flex flex-col items-center justify-center p-6 text-center border border-white/10"
        role="img"
        aria-label={alt}
      >
        <Layers className="w-8 h-8 text-[#00E5FF]/60 mb-3" />
        <span className="text-sm font-medium text-slate-300 max-w-xs">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useCms } from '../lib/cms';
import type { CmsImage } from '../types/holomia';

interface ResilientImageProps {
  /** A CMS image object, an image-slot key (e.g. "img.hero_arena"), or a plain URL. */
  src: string | CmsImage | undefined;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  /** Above-the-fold image: load eagerly with high priority. */
  priority?: boolean;
  sizes?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}) => {
  const { img } = useCms();
  const [hasError, setHasError] = useState(false);

  const image: CmsImage | undefined =
    typeof src === 'string' ? img(src) ?? { src, srcset: '', width: 0, height: 0, alt: '' } : src;
  const finalAlt = image?.alt || alt;

  if (hasError || !image?.src) {
    return (
      <div
        className="w-full h-full min-h-[180px] bg-gradient-to-br from-[#0F172A] via-[#13203A] to-[#0B0F19] flex flex-col items-center justify-center p-6 text-center border border-white/10"
        role="img"
        aria-label={finalAlt}
      >
        <Layers className="w-8 h-8 text-[#00E5FF]/60 mb-3" />
        <span className="text-sm font-medium text-slate-300 max-w-xs">
          {fallbackTitle || finalAlt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={image.src}
      srcSet={image.srcset || undefined}
      sizes={image.srcset ? sizes : undefined}
      width={image.width || undefined}
      height={image.height || undefined}
      alt={finalAlt}
      onError={() => setHasError(true)}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
};

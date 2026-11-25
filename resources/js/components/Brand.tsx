import React from 'react';
import { usePage } from '@inertiajs/react';
import { T } from '../lib/editor';

/** Uploaded logo (admin > "Logo, tiêu đề & favicon"), otherwise the text wordmark. */
export const Brand: React.FC<{ k: string }> = ({ k }) => {
  const logo = usePage<{ logo: string | null }>().props.logo;

  if (logo) return <img src={logo} alt="Holomia" className="h-9 w-auto max-w-[180px] object-contain" />;

  return (
    <>
      H<span className="text-[#00E5FF]">O</span>
      <T k={k} d="LOMIA" />
    </>
  );
};

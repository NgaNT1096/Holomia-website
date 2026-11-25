import React from 'react';
import { router } from '@inertiajs/react';
import { usePaths } from '../lib/locale';

/** VI / EN links to the same page in the other language (plain anchors, so crawlers can follow them). */
export const LanguageSwitch: React.FC = () => {
  const { locale, canonical, localize } = usePaths();

  return (
    <div className="flex items-center gap-0.5 text-xs font-bold">
      {(['vi', 'en'] as const).map((lang) => {
        const href = localize(canonical, lang);
        return (
          <a
            key={lang}
            href={href}
            hrefLang={lang}
            aria-current={lang === locale}
            onClick={(e) => {
              e.preventDefault();
              if (lang !== locale) router.visit(href + window.location.search);
            }}
            className={`px-2 py-1 rounded ${lang === locale ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {lang.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
};

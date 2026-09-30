'use client';

import { useTranslations } from 'next-intl';
import { locales, type Locale } from '@/next-intl.config';
import { useApp } from '@/context/AppContext';

const LOCALE_LABELS: Record<Locale, string> = {
    ja: 'JP',
    en: 'EN',
};

export function LanguageSwitcher() {
    const { state, dispatch } = useApp();
    const t = useTranslations('controls.languageSwitcher');

    return (
        <div
            role="group"
            aria-label={t('label')}
            className="flex items-center gap-1"
            data-testid="language-switcher"
        >
            {locales.map((loc) => {
                const selected = state.currentLocale === loc;
                const label = LOCALE_LABELS[loc];
                return (
                    <button
                        key={loc}
                        type="button"
                        aria-pressed={selected}
                        aria-label={t('switchTo', { label })}
                        data-testid={`lang-button-${loc}`}
                        onClick={() => dispatch({ type: 'SET_LOCALE', payload: loc })}
                        className={
                            'rounded px-2 py-1 text-sm font-medium ' +
                            (selected
                                ? 'bg-primary text-on-primary'
                                : 'text-text-muted hover:text-text hover:bg-surface')
                        }
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

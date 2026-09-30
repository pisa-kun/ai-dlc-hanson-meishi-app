'use client';

import { useTranslations } from 'next-intl';
import { THEMES } from '@/config/themes';
import { useApp } from '@/context/AppContext';

export function ThemePalette() {
    const { state, dispatch } = useApp();
    const t = useTranslations('controls.themePalette');

    return (
        <div
            role="group"
            aria-label={t('label')}
            className="flex items-center gap-2"
            data-testid="theme-palette"
        >
            {THEMES.map((theme) => {
                const selected = state.currentTheme === theme.key;
                return (
                    <button
                        key={theme.key}
                        type="button"
                        aria-pressed={selected}
                        aria-label={t('selectTheme', { name: theme.name })}
                        title={theme.name}
                        data-testid={`theme-button-${theme.key}`}
                        onClick={() => dispatch({ type: 'SET_THEME', payload: theme.key })}
                        className={
                            'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ' +
                            (selected
                                ? 'border-text ring-2 ring-primary scale-110'
                                : 'border-border')
                        }
                        style={{ backgroundColor: theme.swatch }}
                    >
                        <span className="sr-only">{theme.name}</span>
                    </button>
                );
            })}
        </div>
    );
}

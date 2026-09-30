'use client';

import { useTranslations } from 'next-intl';
import type { ProfileBasic, Skill, SnsLink } from '@/schemas/profile';
import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import { IconImage } from '@/components/common/IconImage';
import { SnsLinks } from '@/components/common/SnsLinks';
import { PageSwitcher } from '@/components/controls/PageSwitcher';

export interface BusinessCardProps {
    basic: ProfileBasic;
    skills: Skill[];
    sns: SnsLink[];
}

export function BusinessCard({ basic, skills, sns }: BusinessCardProps) {
    const { state } = useApp();
    const locale = state.currentLocale;
    const t = useTranslations('card');

    return (
        <article
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
            aria-label="Business Card"
            data-testid="business-card"
        >
            <div className="flex items-start gap-4">
                <IconImage
                    src={basic.iconImagePath}
                    alt={tx(basic.name, locale)}
                    size={96}
                    priority
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="truncate text-xl font-bold">{tx(basic.name, locale)}</h1>
                        <PageSwitcher />
                    </div>
                    <p className="text-sm text-primary font-medium">{tx(basic.title, locale)}</p>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        {tx(basic.tagline, locale)}
                    </p>
                </div>
            </div>

            {skills.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5" data-testid="card-skill-tags">
                    {skills.slice(0, 8).map((s) => {
                        const cat = s.category ?? 'other';
                        return (
                            <li
                                key={s.id}
                                data-category={cat}
                                className={`skill-tag skill-tag-${cat} rounded-full px-2 py-0.5 text-xs font-medium`}
                            >
                                {s.name}
                            </li>
                        );
                    })}
                </ul>
            )}

            {sns.length > 0 && (
                <div className="mt-4">
                    <SnsLinks sns={sns} variant="compact" />
                </div>
            )}

            <p className="mt-5 text-center text-xs text-text-muted">{t('scrollHint')}</p>
        </article>
    );
}

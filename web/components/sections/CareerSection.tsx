'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import type { CareerEntry } from '@/schemas/profile';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export interface CareerSectionProps {
    career: CareerEntry[];
}

export function CareerSection({ career }: CareerSectionProps) {
    const t = useTranslations('sections');
    const { state } = useApp();
    if (career.length === 0) return null;

    // 新しい順
    const sorted = [...career].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

    return (
        <AnimatedSection id="career" className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">{t('career')}</h2>
            <ol className="space-y-6 border-l-2 border-border pl-6">
                {sorted.map((entry) => (
                    <li key={entry.id} className="relative">
                        <span className="absolute -left-[34px] top-1 h-3 w-3 rounded-full bg-primary" aria-hidden="true" />
                        <div className="text-sm text-text-muted">
                            {entry.startDate} – {entry.endDate ?? 'Present'}
                        </div>
                        <h3 className="text-lg font-medium">{tx(entry.organization, state.currentLocale)}</h3>
                        <p className="text-base">{tx(entry.role, state.currentLocale)}</p>
                        <p className="text-sm text-text-muted mt-1">{tx(entry.description, state.currentLocale)}</p>
                    </li>
                ))}
            </ol>
        </AnimatedSection>
    );
}

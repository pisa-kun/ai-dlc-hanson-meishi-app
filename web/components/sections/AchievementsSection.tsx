'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import type { Achievement } from '@/schemas/profile';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export interface AchievementsSectionProps {
    achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
    const t = useTranslations('sections');
    const { state } = useApp();
    if (achievements.length === 0) return null;

    const sorted = [...achievements].sort((a, b) => (a.date < b.date ? 1 : -1));

    return (
        <AnimatedSection id="achievements" className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">{t('achievements')}</h2>
            <ul className="space-y-4">
                {sorted.map((a) => (
                    <li key={a.id} className="rounded-lg border border-border bg-surface p-4">
                        <div className="text-sm text-text-muted">{a.date}</div>
                        <h3 className="text-lg font-medium">{tx(a.title, state.currentLocale)}</h3>
                        <p className="text-sm mt-1">{tx(a.description, state.currentLocale)}</p>
                    </li>
                ))}
            </ul>
        </AnimatedSection>
    );
}

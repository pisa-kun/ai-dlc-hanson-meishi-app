'use client';

import { useTranslations } from 'next-intl';
import type { Skill } from '@/schemas/profile';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export interface SkillsSectionProps {
    skills: Skill[];
    variant?: 'web' | 'card';
}

function categoryClass(category: Skill['category']): string {
    switch (category) {
        case 'language': return 'skill-tag skill-tag-language';
        case 'framework': return 'skill-tag skill-tag-framework';
        case 'cloud': return 'skill-tag skill-tag-cloud';
        case 'design': return 'skill-tag skill-tag-design';
        case 'tool': return 'skill-tag skill-tag-tool';
        case 'other':
        default: return 'skill-tag skill-tag-other';
    }
}

export function SkillsSection({ skills, variant = 'web' }: SkillsSectionProps) {
    const t = useTranslations('sections');
    if (skills.length === 0) return null;
    const isCard = variant === 'card';

    return (
        <AnimatedSection id="skills" className={isCard ? 'mt-6' : 'mt-16'}>
            <h2 className={isCard ? 'text-lg font-semibold mb-3' : 'text-2xl font-semibold mb-6'}>
                {t('skills')}
            </h2>
            <ul className="flex flex-wrap gap-2" data-testid="skill-tags">
                {skills.map((skill) => (
                    <li
                        key={skill.id}
                        data-category={skill.category ?? 'other'}
                        className={
                            `${categoryClass(skill.category)} rounded-full font-medium ` +
                            (isCard ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm')
                        }
                    >
                        {skill.name}
                    </li>
                ))}
            </ul>
        </AnimatedSection>
    );
}

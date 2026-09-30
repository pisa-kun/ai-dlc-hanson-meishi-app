'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import type { BlogLink } from '@/schemas/profile';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export interface BlogSectionProps {
    blog: BlogLink[];
}

const PLATFORM_LABEL: Record<BlogLink['platform'], string> = {
    zenn: 'Zenn',
    qiita: 'Qiita',
    medium: 'Medium',
    note: 'note',
    devto: 'dev.to',
    speakerdeck: 'Speaker Deck',
    other: 'Blog',
};

export function BlogSection({ blog }: BlogSectionProps) {
    const t = useTranslations('sections');
    const { state } = useApp();
    if (blog.length === 0) return null;

    const sorted = [...blog].sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));

    return (
        <AnimatedSection id="blog" className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">{t('blog')}</h2>
            <ul className="space-y-3">
                {sorted.map((link) => (
                    <li key={link.id}>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-baseline gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
                            data-testid={`blog-link-${link.id}`}
                        >
                            <span className="rounded bg-background px-2 py-0.5 text-xs font-medium text-text-muted border border-border">
                                {PLATFORM_LABEL[link.platform]}
                            </span>
                            <span className="flex-1 text-base font-medium">
                                {tx(link.title, state.currentLocale)}
                            </span>
                            <span className="text-sm text-text-muted whitespace-nowrap">
                                {link.publishedDate}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </AnimatedSection>
    );
}

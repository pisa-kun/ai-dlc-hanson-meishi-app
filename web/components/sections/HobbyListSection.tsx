'use client';

import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import type { HobbyItem } from '@/schemas/profile-hobby';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SafeImage } from '@/components/common/SafeImage';

export interface HobbyListSectionProps {
    items: HobbyItem[];
}

export function HobbyListSection({ items }: HobbyListSectionProps) {
    const { state } = useApp();
    if (items.length === 0) return null;

    const sectionTitle = state.currentLocale === 'ja' ? '趣味一覧' : 'Hobbies';

    return (
        <AnimatedSection id="hobby-list" className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">{sectionTitle}</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => {
                    const title = tx(item.title, state.currentLocale);
                    const hasUrl = item.url && item.url.length > 0 && item.url !== '#';

                    const content = (
                        <>
                            <div className="relative aspect-[4/3] bg-surface">
                                <SafeImage
                                    src={item.thumbnailPath}
                                    alt={title}
                                    fill
                                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    fallbackLabel={title}
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-base font-medium group-hover:text-primary">{title}</h3>
                                <p className="text-sm text-text-muted mt-1">
                                    {tx(item.summary, state.currentLocale)}
                                </p>
                                {item.tags && item.tags.length > 0 && (
                                    <ul className="mt-2 flex flex-wrap gap-1">
                                        {item.tags.map((tag) => (
                                            <li
                                                key={tag}
                                                className="rounded border border-border px-2 py-0.5 text-xs text-text-muted"
                                            >
                                                {tag}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    );

                    return (
                        <li key={item.id}>
                            {hasUrl ? (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block overflow-hidden rounded-lg border border-border bg-surface transition-transform hover:scale-[1.02]"
                                    data-testid={`hobby-item-${item.id}`}
                                >
                                    {content}
                                </a>
                            ) : (
                                <div
                                    className="group block overflow-hidden rounded-lg border border-border bg-surface"
                                    data-testid={`hobby-item-${item.id}`}
                                >
                                    {content}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </AnimatedSection>
    );
}

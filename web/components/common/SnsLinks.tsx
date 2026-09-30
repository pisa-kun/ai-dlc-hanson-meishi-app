'use client';

import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import { snsIconFor } from '@/lib/snsIcon';
import type { SnsLink } from '@/schemas/profile';

export interface SnsLinksProps {
    sns: SnsLink[];
    variant?: 'inline' | 'compact';
}

export function SnsLinks({ sns, variant = 'inline' }: SnsLinksProps) {
    const { state } = useApp();
    const size = variant === 'compact' ? 22 : 24;

    if (sns.length === 0) return null;

    return (
        <ul className="flex flex-wrap gap-3" aria-label="SNS Links">
            {sns.map((link) => {
                const Icon = snsIconFor(link.platform);
                const label = tx(link.label, state.currentLocale);
                return (
                    <li key={link.id}>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            data-testid={`sns-link-${link.platform}`}
                            className="inline-flex items-center justify-center rounded-full border border-border p-2 hover:bg-surface hover:text-primary transition-colors"
                        >
                            <Icon width={size} height={size} aria-hidden="true" />
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}

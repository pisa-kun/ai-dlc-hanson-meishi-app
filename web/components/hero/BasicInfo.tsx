'use client';

import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import type { ProfileBasic } from '@/schemas/profile';
import { PageSwitcher } from '@/components/controls/PageSwitcher';

export interface BasicInfoProps {
    basic: ProfileBasic;
    size?: 'web' | 'card';
}

export function BasicInfo({ basic, size = 'web' }: BasicInfoProps) {
    const { state } = useApp();
    const locale = state.currentLocale;
    const isCard = size === 'card';

    return (
        <div className={isCard ? 'space-y-1' : 'space-y-3'}>
            <div className="flex items-center gap-3 flex-wrap">
                <h1 className={isCard ? 'text-2xl font-bold' : 'text-4xl md:text-5xl font-bold'}>
                    {tx(basic.name, locale)}
                </h1>
                <PageSwitcher />
            </div>
            <p className={isCard ? 'text-sm text-text-muted' : 'text-xl text-primary font-medium'}>
                {tx(basic.title, locale)}
            </p>
            <p className={isCard ? 'text-sm leading-relaxed' : 'text-base leading-relaxed text-text-muted max-w-prose'}>
                {tx(basic.tagline, locale)}
            </p>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { useApp } from '@/context/AppContext';

/**
 * 仕事 ↔ 趣味 ページ切替ボタン（アイコンのみ、ツールチップで説明）
 */
export function PageSwitcher() {
    const pathname = usePathname();
    const { state } = useApp();
    const locale = state.currentLocale;

    const isHobby = pathname?.includes('/hobby');

    const targetPath = isHobby ? `/${locale}/` : `/${locale}/hobby/`;
    const tooltip = isHobby
        ? (locale === 'ja' ? '仕事へ切替' : 'Switch to Work')
        : (locale === 'ja' ? '趣味へ切替' : 'Switch to Hobby');

    return (
        <Link
            href={targetPath}
            aria-label={tooltip}
            title={tooltip}
            data-testid="page-switcher"
            className="inline-flex items-center justify-center rounded-full border border-primary/50 bg-primary/10 p-2 text-primary hover:bg-primary/20 hover:scale-110 transition-all"
        >
            <FaArrowRightArrowLeft size={18} aria-hidden="true" />
        </Link>
    );
}

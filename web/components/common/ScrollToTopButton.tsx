'use client';

import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

/**
 * スマホ画面（< 768px）で下にスクロールすると右下に表示される「最上部へ戻る」ボタン
 */
export function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="ページ最上部へ戻る"
            data-testid="scroll-to-top"
            className="web:hidden fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg hover:scale-110 transition-transform"
        >
            <FaArrowUp size={20} aria-hidden="true" />
        </button>
    );
}

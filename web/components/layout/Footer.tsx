'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('footer');
    const year = new Date().getFullYear();
    return (
        <footer
            className="mt-24 border-t border-border px-4 py-6 text-center text-sm text-text-muted md:px-8"
            data-testid="footer"
        >
            <p>© {year} — {t('builtWith')}</p>
        </footer>
    );
}

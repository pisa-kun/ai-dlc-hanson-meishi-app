import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { locales, type Locale } from '@/next-intl.config';
import { AppProvider } from '@/context/AppContext';
import { ProfileSchema } from '@/schemas/profile';
import profileJson from '@/data/profile.json';

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
    children: ReactNode;
    params: { locale: string };
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
    if (!(locales as readonly string[]).includes(locale)) notFound();
    unstable_setRequestLocale(locale);

    const messages = await getMessages();

    // ビルド時に profile.json を検証 → デフォルトのギャラリー画像IDを決定
    const profile = ProfileSchema.parse(profileJson);
    const defaultGalleryImageId =
        profile.gallery.find((g) => g.isDefaultMain)?.id ?? profile.gallery[0].id;

    return (
        <html lang={locale} data-theme="lime">
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <AppProvider initialLocale={locale as Locale} defaultGalleryImageId={defaultGalleryImageId}>
                        {children}
                    </AppProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

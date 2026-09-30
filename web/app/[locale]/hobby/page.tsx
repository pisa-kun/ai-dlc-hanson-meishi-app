import { unstable_setRequestLocale } from 'next-intl/server';
import { HobbyProfileSchema } from '@/schemas/profile-hobby';
import hobbyJson from '@/data/profile-hobby.json';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HobbyWebLayout } from '@/components/layout/HobbyWebLayout';
import { HobbyCardLayout } from '@/components/layout/HobbyCardLayout';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';

interface PageProps {
    params: { locale: string };
}

export default function HobbyPage({ params: { locale } }: PageProps) {
    unstable_setRequestLocale(locale);

    const profile = HobbyProfileSchema.parse(hobbyJson);

    return (
        <>
            <Header />
            <main>
                <HobbyWebLayout profile={profile} />
                <HobbyCardLayout profile={profile} />
            </main>
            <Footer />
            <ScrollToTopButton />
        </>
    );
}

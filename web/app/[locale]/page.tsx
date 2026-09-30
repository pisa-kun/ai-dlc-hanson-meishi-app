import { unstable_setRequestLocale } from 'next-intl/server';
import { ProfileSchema } from '@/schemas/profile';
import profileJson from '@/data/profile.json';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WebLayout } from '@/components/layout/WebLayout';
import { BusinessCardLayout } from '@/components/layout/BusinessCardLayout';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';

interface PageProps {
    params: { locale: string };
}

export default function HomePage({ params: { locale } }: PageProps) {
    unstable_setRequestLocale(locale);

    const profile = ProfileSchema.parse(profileJson);

    return (
        <>
            <Header />
            <main>
                <WebLayout profile={profile} />
                <BusinessCardLayout profile={profile} />
            </main>
            <Footer />
            <ScrollToTopButton />
        </>
    );
}

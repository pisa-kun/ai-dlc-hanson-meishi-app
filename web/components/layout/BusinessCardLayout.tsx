import type { Profile } from '@/schemas/profile';
import { BusinessCard } from '@/components/card/BusinessCard';
import { CareerSection } from '@/components/sections/CareerSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { BlogSection } from '@/components/sections/BlogSection';

export interface BusinessCardLayoutProps {
    profile: Profile;
}

export function BusinessCardLayout({ profile }: BusinessCardLayoutProps) {
    return (
        <div className="layout-card px-4 py-6">
            {/* 名刺カード — 1画面に収まるように設計 */}
            <div className="min-h-[calc(100dvh-80px)] flex flex-col justify-center">
                <BusinessCard
                    basic={profile.basic}
                    skills={profile.skills}
                    sns={profile.sns}
                />
            </div>

            {/* 経歴以降 — スクロールして初めて見える */}
            <div className="mt-4 space-y-2">
                <CareerSection career={profile.career} />
                <AchievementsSection achievements={profile.achievements} />
                <PortfolioSection portfolio={profile.portfolio} />
                <BlogSection blog={profile.blog} />
            </div>
        </div>
    );
}

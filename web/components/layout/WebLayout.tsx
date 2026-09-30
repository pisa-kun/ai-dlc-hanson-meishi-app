import type { Profile } from '@/schemas/profile';
import { HeroWeb } from '@/components/hero/HeroWeb';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { CareerSection } from '@/components/sections/CareerSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { BlogSection } from '@/components/sections/BlogSection';

export interface WebLayoutProps {
    profile: Profile;
}

export function WebLayout({ profile }: WebLayoutProps) {
    return (
        <div className="layout-web mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
            <HeroWeb profile={profile} />
            <SkillsSection skills={profile.skills} />
            <CareerSection career={profile.career} />
            <AchievementsSection achievements={profile.achievements} />
            <PortfolioSection portfolio={profile.portfolio} />
            <BlogSection blog={profile.blog} />
        </div>
    );
}

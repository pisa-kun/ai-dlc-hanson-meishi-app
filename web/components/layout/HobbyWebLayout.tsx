import type { HobbyProfile } from '@/schemas/profile-hobby';
import { HeroWeb } from '@/components/hero/HeroWeb';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { HobbyListSection } from '@/components/sections/HobbyListSection';

export interface HobbyWebLayoutProps {
    profile: HobbyProfile;
}

export function HobbyWebLayout({ profile }: HobbyWebLayoutProps) {
    return (
        <div className="layout-web mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
            <HeroWeb profile={{ ...profile, career: [], achievements: [], blog: [], sns: [] } as any} />
            <SkillsSection skills={profile.skills} />
            <HobbyListSection items={profile.portfolio} />
        </div>
    );
}

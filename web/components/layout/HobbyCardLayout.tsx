import type { HobbyProfile } from '@/schemas/profile-hobby';
import { BusinessCard } from '@/components/card/BusinessCard';
import { HobbyListSection } from '@/components/sections/HobbyListSection';

export interface HobbyCardLayoutProps {
    profile: HobbyProfile;
}

export function HobbyCardLayout({ profile }: HobbyCardLayoutProps) {
    return (
        <div className="layout-card px-4 py-6">
            <div className="min-h-[calc(100dvh-80px)] flex flex-col justify-center">
                <BusinessCard
                    basic={profile.basic}
                    skills={profile.skills}
                    sns={[]}
                />
            </div>
            <div className="mt-4 space-y-2">
                <HobbyListSection items={profile.portfolio} />
            </div>
        </div>
    );
}

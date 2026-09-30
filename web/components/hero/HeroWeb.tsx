import type { Profile } from '@/schemas/profile';
import { Gallery } from './Gallery';
import { BasicInfo } from './BasicInfo';
import { SnsLinks } from '@/components/common/SnsLinks';

export interface HeroWebProps {
    profile: Profile;
}

export function HeroWeb({ profile }: HeroWebProps) {
    return (
        <section className="grid grid-cols-1 gap-8 web:grid-cols-2 web:gap-12 items-center" id="hero">
            <Gallery images={profile.gallery} />
            <div className="space-y-6">
                <BasicInfo basic={profile.basic} />
                <SnsLinks sns={profile.sns} variant="inline" />
            </div>
        </section>
    );
}

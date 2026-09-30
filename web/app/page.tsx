import { redirect } from 'next/navigation';
import { defaultLocale } from '@/next-intl.config';

export default function RootIndex() {
    redirect(`/${defaultLocale}`);
}

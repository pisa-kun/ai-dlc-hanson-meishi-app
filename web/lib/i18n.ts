import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/next-intl.config';

export default getRequestConfig(async ({ locale }) => {
  if (!(locales as readonly string[]).includes(locale)) notFound();
  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});

export type { Locale };

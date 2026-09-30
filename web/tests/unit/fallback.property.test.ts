import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { tx } from '@/lib/fallback';
import type { LocalizedText } from '@/schemas/profile';
import type { Locale } from '@/next-intl.config';

const localeArb = fc.constantFrom<Locale>('ja', 'en');

const nonEmptyStrArb = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);

describe('lib/fallback.tx — property-based', () => {
  it('returns the primary value when both languages are non-empty', () => {
    fc.assert(
      fc.property(nonEmptyStrArb, nonEmptyStrArb, localeArb, (ja, en, locale) => {
        const text: LocalizedText = { ja, en };
        expect(tx(text, locale)).toBe(text[locale]);
      }),
    );
  });

  it('falls back to the other language if primary is empty/whitespace', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', '   ', '\t', '\n'),
        nonEmptyStrArb,
        localeArb,
        (emptyish, other, locale) => {
          const text: LocalizedText =
            locale === 'ja' ? { ja: emptyish, en: other } : { ja: other, en: emptyish };
          expect(tx(text, locale)).toBe(other);
        },
      ),
    );
  });

  it('returns non-empty as long as at least one side is non-empty', () => {
    fc.assert(
      fc.property(nonEmptyStrArb, fc.string(), localeArb, (a, b, locale) => {
        const text: LocalizedText = locale === 'ja' ? { ja: a, en: b } : { ja: b, en: a };
        expect(tx(text, locale).length).toBeGreaterThan(0);
      }),
    );
  });
});

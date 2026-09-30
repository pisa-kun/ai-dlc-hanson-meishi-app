import type { Locale } from '@/next-intl.config';
import type { LocalizedText } from '@/schemas/profile';

/**
 * 多言語テキストフォールバック (BR-3)
 *
 * 優先: 指定 locale → もう一方の locale。
 * いずれも非空であれば必ず非空文字列を返す。
 *
 * 純粋関数。fast-check で不変条件をテストする。
 */
export function tx(text: LocalizedText, locale: Locale): string {
  const primary = text[locale];
  const other = locale === 'ja' ? text.en : text.ja;
  if (primary && primary.trim().length > 0) return primary;
  if (other && other.trim().length > 0) return other;
  return '';
}

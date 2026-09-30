/**
 * カラーテーマ定義（要件 FR-03-6）
 * 実際の色値は web/app/globals.css の `[data-theme="..."]` セレクタ内で
 * CSS Variables として定義されている（DRY原則：色値の単一情報源）
 */

export const THEME_KEYS = ['mono', 'lime', 'rose', 'sky'] as const;
export type ThemeKey = (typeof THEME_KEYS)[number];

export interface ThemeMeta {
  key: ThemeKey;
  /** UI表示名（ツールチップ等） */
  name: string;
  /** カラーパレットボタン用のスウォッチカラー（プレビュー） */
  swatch: string;
  /** デフォルトテーマフラグ */
  isDefault?: boolean;
}

export const THEMES: readonly ThemeMeta[] = [
  { key: 'mono', name: 'Black',      swatch: '#000000' },
  { key: 'lime', name: 'Shiun San', swatch: '#7CFC00', isDefault: true },
  { key: 'rose', name: 'Rose Pink',  swatch: '#B33E5C' },
  { key: 'sky',  name: 'Sky Blue',   swatch: '#89C3EB' },
] as const;

export const DEFAULT_THEME_KEY: ThemeKey =
  THEMES.find((t) => t.isDefault)?.key ?? 'mono';

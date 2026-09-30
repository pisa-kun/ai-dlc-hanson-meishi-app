import { THEMES, THEME_KEYS, DEFAULT_THEME_KEY, type ThemeMeta, type ThemeKey } from '@/config/themes';

export function themeFromKey(key: string): ThemeMeta | undefined {
  return THEMES.find((t) => t.key === key);
}

export function getDefaultTheme(): ThemeMeta {
  return themeFromKey(DEFAULT_THEME_KEY)!;
}

export function getThemeKeys(): readonly ThemeKey[] {
  return THEME_KEYS;
}

export function isThemeKey(value: unknown): value is ThemeKey {
  return typeof value === 'string' && (THEME_KEYS as readonly string[]).includes(value);
}

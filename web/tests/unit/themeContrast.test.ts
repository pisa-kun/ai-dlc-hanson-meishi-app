import { describe, it, expect } from 'vitest';
import { contrastRatio, WCAG_AA_NORMAL } from '@/lib/contrast';

/**
 * 4テーマの主要色組のコントラスト比が WCAG AA (4.5:1) 以上であることを検証。
 * 値は web/app/globals.css の定義と一致させる。
 */
const THEMES_FOR_TEST: Record<
  string,
  { background: string; surface: string; text: string; textMuted: string; primary: string; onPrimary: string }
> = {
  mono: {
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#111111',
    textMuted: '#555555',
    primary: '#000000',
    onPrimary: '#ffffff',
  },
  lime: {
    background: '#0e1a0e',
    surface: '#162616',
    text: '#eaffea',
    textMuted: '#a8c8a8',
    primary: '#7cfc00',
    onPrimary: '#0e1a0e',
  },
  rose: {
    background: '#fff7f8',
    surface: '#fbe9ee',
    text: '#1f1216',
    textMuted: '#5a3946',
    primary: '#b33e5c',
    onPrimary: '#ffffff',
  },
  sky: {
    background: '#0f1b23',
    surface: '#16242e',
    text: '#e6f3fb',
    textMuted: '#a0bfd3',
    primary: '#89c3eb',
    onPrimary: '#0f1b23',
  },
};

describe('Theme contrast (WCAG AA)', () => {
  for (const [name, t] of Object.entries(THEMES_FOR_TEST)) {
    describe(`theme=${name}`, () => {
      it('text vs background ≥ 4.5:1', () => {
        expect(contrastRatio(t.text, t.background)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      });
      it('text vs surface ≥ 4.5:1', () => {
        expect(contrastRatio(t.text, t.surface)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      });
      it('textMuted vs background ≥ 4.5:1', () => {
        expect(contrastRatio(t.textMuted, t.background)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      });
      it('onPrimary vs primary ≥ 4.5:1', () => {
        expect(contrastRatio(t.onPrimary, t.primary)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      });
    });
  }
});

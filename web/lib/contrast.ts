/**
 * WCAG 2.1 コントラスト比計算 (純粋関数)
 *
 * 参考: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3.0;

/**
 * '#RRGGBB' 形式の HEX を RGB に変換
 * 不正値は例外を投げる（呼び出し側で検証済みの色のみ渡す想定）
 */
export function hexToRgb(hex: string): RGB {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) throw new Error(`Invalid hex color: ${hex}`);
  const n = parseInt(m[1], 16);
  return {
    r: (n >> 16) & 0xff,
    g: (n >> 8) & 0xff,
    b: n & 0xff,
  };
}

/**
 * sRGB → 相対輝度
 */
export function relativeLuminance(rgb: RGB): number {
  const linear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linear(rgb.r) + 0.7152 * linear(rgb.g) + 0.0722 * linear(rgb.b);
}

/**
 * 2色のコントラスト比 (WCAG)
 * 戻り値は 1〜21 の範囲、対称的（ratio(a,b) === ratio(b,a)）
 */
export function contrastRatio(fgHex: string, bgHex: string): number {
  const l1 = relativeLuminance(hexToRgb(fgHex));
  const l2 = relativeLuminance(hexToRgb(bgHex));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function meetsWcagAaNormal(fgHex: string, bgHex: string): boolean {
  return contrastRatio(fgHex, bgHex) >= WCAG_AA_NORMAL;
}

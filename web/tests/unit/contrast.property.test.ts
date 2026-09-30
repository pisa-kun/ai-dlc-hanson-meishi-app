import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { contrastRatio, hexToRgb, relativeLuminance } from '@/lib/contrast';

const hexColorArb = fc
  .integer({ min: 0, max: 0xffffff })
  .map((n) => '#' + n.toString(16).padStart(6, '0'));

describe('lib/contrast — property-based', () => {
  it('contrastRatio is symmetric', () => {
    fc.assert(
      fc.property(hexColorArb, hexColorArb, (a, b) => {
        const r1 = contrastRatio(a, b);
        const r2 = contrastRatio(b, a);
        expect(Math.abs(r1 - r2)).toBeLessThan(1e-9);
      }),
    );
  });

  it('contrastRatio is in [1, 21]', () => {
    fc.assert(
      fc.property(hexColorArb, hexColorArb, (a, b) => {
        const r = contrastRatio(a, b);
        expect(r).toBeGreaterThanOrEqual(1);
        expect(r).toBeLessThanOrEqual(21 + 1e-9);
      }),
    );
  });

  it('contrastRatio of identical colors is exactly 1', () => {
    fc.assert(
      fc.property(hexColorArb, (a) => {
        expect(contrastRatio(a, a)).toBeCloseTo(1, 9);
      }),
    );
  });

  it('relativeLuminance is in [0, 1]', () => {
    fc.assert(
      fc.property(hexColorArb, (a) => {
        const l = relativeLuminance(hexToRgb(a));
        expect(l).toBeGreaterThanOrEqual(0);
        expect(l).toBeLessThanOrEqual(1);
      }),
    );
  });

  it('black vs white = 21', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
  });
});

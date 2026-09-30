import { describe, it, expect } from 'vitest';
import { ProfileSchema } from '@/schemas/profile';
import profileJson from '@/data/profile.json';

const minimalValid = {
  basic: {
    name:    { ja: 'A', en: 'A' },
    title:   { ja: 'B', en: 'B' },
    tagline: { ja: 'C', en: 'C' },
    iconImagePath: '/x.svg',
  },
  gallery: [{ id: 'g1', path: '/g1.svg', alt: { ja: 'a', en: 'a' }, isDefaultMain: true }],
  skills: [],
  career: [],
  achievements: [],
  portfolio: [],
  blog: [],
  sns: [],
};

describe('ProfileSchema', () => {
  it('accepts the bundled sample profile.json', () => {
    expect(() => ProfileSchema.parse(profileJson)).not.toThrow();
  });

  it('accepts a minimal valid profile', () => {
    expect(() => ProfileSchema.parse(minimalValid)).not.toThrow();
  });

  it('rejects empty gallery', () => {
    const bad = { ...minimalValid, gallery: [] };
    expect(() => ProfileSchema.parse(bad)).toThrow();
  });

  it('rejects multiple isDefaultMain=true', () => {
    const bad = {
      ...minimalValid,
      gallery: [
        { id: 'g1', path: '/g1.svg', alt: { ja: 'a', en: 'a' }, isDefaultMain: true },
        { id: 'g2', path: '/g2.svg', alt: { ja: 'b', en: 'b' }, isDefaultMain: true },
      ],
    };
    expect(() => ProfileSchema.parse(bad)).toThrow();
  });

  it('rejects career with startDate after endDate', () => {
    const bad = {
      ...minimalValid,
      career: [
        {
          id: 'c1',
          startDate: '2024-06',
          endDate: '2023-01',
          organization: { ja: 'O', en: 'O' },
          role: { ja: 'R', en: 'R' },
          description: { ja: 'D', en: 'D' },
        },
      ],
    };
    expect(() => ProfileSchema.parse(bad)).toThrow();
  });

  it('rejects invalid url in sns', () => {
    const bad = {
      ...minimalValid,
      sns: [{ id: 'n1', platform: 'github', label: { ja: 'G', en: 'G' }, url: 'not-a-url' }],
    };
    expect(() => ProfileSchema.parse(bad)).toThrow();
  });
});

import { describe, it, expect } from 'vitest';
import { appReducer, type AppState } from '@/context/AppContext';

const initial: AppState = {
  currentTheme: 'mono',
  currentLocale: 'ja',
  selectedGalleryImageId: 'g1',
};

describe('appReducer', () => {
  it('SET_THEME updates theme only', () => {
    const next = appReducer(initial, { type: 'SET_THEME', payload: 'lime' });
    expect(next).toEqual({ ...initial, currentTheme: 'lime' });
  });

  it('SET_LOCALE updates locale only', () => {
    const next = appReducer(initial, { type: 'SET_LOCALE', payload: 'en' });
    expect(next).toEqual({ ...initial, currentLocale: 'en' });
  });

  it('SET_GALLERY_IMAGE updates selected image only', () => {
    const next = appReducer(initial, { type: 'SET_GALLERY_IMAGE', payload: 'g3' });
    expect(next).toEqual({ ...initial, selectedGalleryImageId: 'g3' });
  });

  it('returns same state for unknown action', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next = appReducer(initial, { type: 'UNKNOWN' } as any);
    expect(next).toBe(initial);
  });
});

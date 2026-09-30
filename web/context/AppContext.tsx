'use client';

import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    type Dispatch,
    type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DEFAULT_THEME_KEY, THEME_KEYS, type ThemeKey } from '@/config/themes';
import type { Locale } from '@/next-intl.config';

const THEME_STORAGE_KEY = 'meishi-app-theme';

export interface AppState {
    currentTheme: ThemeKey;
    currentLocale: Locale;
    selectedGalleryImageId: string;
}

export type AppAction =
    | { type: 'SET_THEME'; payload: ThemeKey }
    | { type: 'SET_LOCALE'; payload: Locale }
    | { type: 'SET_GALLERY_IMAGE'; payload: string };

export function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, currentTheme: action.payload };
        case 'SET_LOCALE':
            return { ...state, currentLocale: action.payload };
        case 'SET_GALLERY_IMAGE':
            return { ...state, selectedGalleryImageId: action.payload };
        default:
            return state;
    }
}

interface AppContextValue {
    state: AppState;
    dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
    return ctx;
}

export interface AppProviderProps {
    children: ReactNode;
    initialLocale: Locale;
    defaultGalleryImageId: string;
}

/** localStorage から保存済みテーマを読み取る（無効値はデフォルトに戻す） */
function getSavedTheme(): ThemeKey {
    if (typeof window === 'undefined') return DEFAULT_THEME_KEY;
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved && (THEME_KEYS as readonly string[]).includes(saved)) {
            return saved as ThemeKey;
        }
    } catch {
        // localStorage 使用不可（プライベートブラウジング等）
    }
    return DEFAULT_THEME_KEY;
}

export function AppProvider({ children, initialLocale, defaultGalleryImageId }: AppProviderProps) {
    const [state, dispatch] = useReducer(appReducer, {
        currentTheme: DEFAULT_THEME_KEY,
        currentLocale: initialLocale,
        selectedGalleryImageId: defaultGalleryImageId,
    });

    const router = useRouter();
    const pathname = usePathname();

    // 初回マウント時に localStorage から保存済みテーマを復元
    useEffect(() => {
        const saved = getSavedTheme();
        if (saved !== DEFAULT_THEME_KEY) {
            dispatch({ type: 'SET_THEME', payload: saved });
        }
    }, []);

    // <html data-theme="..."> を更新 + localStorage に保存
    useEffect(() => {
        document.documentElement.dataset.theme = state.currentTheme;
        try {
            localStorage.setItem(THEME_STORAGE_KEY, state.currentTheme);
        } catch {
            // localStorage 使用不可
        }
    }, [state.currentTheme]);

    // <html lang="..."> を更新
    useEffect(() => {
        document.documentElement.lang = state.currentLocale;
    }, [state.currentLocale]);

    // ロケール変更時に URL も同期 (/ja/... <-> /en/...)
    useEffect(() => {
        if (!pathname) return;
        const segments = pathname.split('/');
        if (segments[1] === state.currentLocale) return;
        if (segments[1] === 'ja' || segments[1] === 'en') {
            segments[1] = state.currentLocale;
            router.replace(segments.join('/') || '/');
        }
    }, [state.currentLocale, pathname, router]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
    );
}

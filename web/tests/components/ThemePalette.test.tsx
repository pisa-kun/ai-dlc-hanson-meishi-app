import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { AppProvider } from '@/context/AppContext';
import { ThemePalette } from '@/components/controls/ThemePalette';

// next/navigation の mock（AppProvider 内 useRouter / usePathname が呼ばれるため）
vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
    usePathname: () => '/ja',
}));

const messages = {
    controls: {
        themePalette: {
            label: 'Theme',
            selectTheme: 'Select theme: {name}',
        },
    },
};

function renderWithProviders(ui: React.ReactNode) {
    return render(
        <NextIntlClientProvider locale="ja" messages={messages}>
            <AppProvider initialLocale="ja" defaultGalleryImageId="g1">
                {ui}
            </AppProvider>
        </NextIntlClientProvider>,
    );
}

describe('<ThemePalette />', () => {
    it('renders 4 theme buttons', () => {
        renderWithProviders(<ThemePalette />);
        expect(screen.getByTestId('theme-button-mono')).toBeInTheDocument();
        expect(screen.getByTestId('theme-button-lime')).toBeInTheDocument();
        expect(screen.getByTestId('theme-button-rose')).toBeInTheDocument();
        expect(screen.getByTestId('theme-button-sky')).toBeInTheDocument();
    });

    it('default theme (mono) has aria-pressed=true', () => {
        renderWithProviders(<ThemePalette />);
        expect(screen.getByTestId('theme-button-mono')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByTestId('theme-button-lime')).toHaveAttribute('aria-pressed', 'false');
    });

    it('clicking lime updates aria-pressed', () => {
        renderWithProviders(<ThemePalette />);
        fireEvent.click(screen.getByTestId('theme-button-lime'));
        expect(screen.getByTestId('theme-button-lime')).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByTestId('theme-button-mono')).toHaveAttribute('aria-pressed', 'false');
    });
});

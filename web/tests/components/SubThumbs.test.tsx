import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { AppProvider } from '@/context/AppContext';
import { SubThumbs } from '@/components/hero/SubThumbs';
import type { GalleryImage } from '@/schemas/profile';

vi.mock('next/navigation', () => ({
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
    usePathname: () => '/ja',
}));

// next/image をシンプルな img にモック
vi.mock('next/image', () => ({
    default: (props: Record<string, unknown>) => {
        const { fill, sizes, priority, ...rest } = props as Record<string, unknown>;
        void fill;
        void sizes;
        void priority;
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...(rest as Record<string, unknown>)} />;
    },
}));

const messages = {
    hero: {
        galleryAria: 'Gallery',
        thumbnailLabel: 'Show sub image {index}',
    },
};

const images: GalleryImage[] = [
    { id: 'g1', path: '/g1.svg', alt: { ja: 'メイン', en: 'Main' }, isDefaultMain: true },
    { id: 'g2', path: '/g2.svg', alt: { ja: 'サブ1', en: 'Sub 1' } },
    { id: 'g3', path: '/g3.svg', alt: { ja: 'サブ2', en: 'Sub 2' } },
    { id: 'g4', path: '/g4.svg', alt: { ja: 'サブ3', en: 'Sub 3' } },
];

function renderWithProviders(ui: React.ReactNode) {
    return render(
        <NextIntlClientProvider locale="ja" messages={messages}>
            <AppProvider initialLocale="ja" defaultGalleryImageId="g1">
                {ui}
            </AppProvider>
        </NextIntlClientProvider>,
    );
}

describe('<SubThumbs />', () => {
    it('excludes the current main image', () => {
        renderWithProviders(<SubThumbs images={images} excludeId="g1" max={3} />);
        expect(screen.queryByTestId('sub-thumb-g1')).toBeNull();
        expect(screen.getByTestId('sub-thumb-g2')).toBeInTheDocument();
        expect(screen.getByTestId('sub-thumb-g3')).toBeInTheDocument();
        expect(screen.getByTestId('sub-thumb-g4')).toBeInTheDocument();
    });

    it('respects max limit', () => {
        renderWithProviders(<SubThumbs images={images} excludeId="g1" max={2} />);
        expect(screen.getByTestId('sub-thumb-g2')).toBeInTheDocument();
        expect(screen.getByTestId('sub-thumb-g3')).toBeInTheDocument();
        expect(screen.queryByTestId('sub-thumb-g4')).toBeNull();
    });

    it('renders nothing when no subs available', () => {
        const { container } = renderWithProviders(
            <SubThumbs images={[images[0]]} excludeId="g1" max={3} />,
        );
        // ul not rendered
        expect(container.querySelector('[data-testid="sub-thumbs"]')).toBeNull();
    });
});

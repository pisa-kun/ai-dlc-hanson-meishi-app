'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import type { GalleryImage } from '@/schemas/profile';
import { SafeImage } from '@/components/common/SafeImage';

export interface SubThumbsProps {
    images: GalleryImage[];
    /** メイン画像（メインに昇格中の画像）— サブには表示しない */
    excludeId: string;
    /** 表示上限（要件: 3枚） */
    max?: number;
}

export function SubThumbs({ images, excludeId, max = 3 }: SubThumbsProps) {
    const { state, dispatch } = useApp();
    const t = useTranslations('hero');

    const subs = images.filter((g) => g.id !== excludeId).slice(0, max);
    if (subs.length === 0) return null;

    return (
        <ul className="flex gap-2" aria-label={t('galleryAria')} data-testid="sub-thumbs">
            {subs.map((img, idx) => {
                const isActive = state.selectedGalleryImageId === img.id;
                const alt = tx(img.alt, state.currentLocale);
                return (
                    <li key={img.id}>
                        <button
                            type="button"
                            data-testid={`sub-thumb-${img.id}`}
                            aria-current={isActive ? 'true' : undefined}
                            aria-label={t('thumbnailLabel', { index: idx + 1 })}
                            onClick={() => dispatch({ type: 'SET_GALLERY_IMAGE', payload: img.id })}
                            className={
                                'relative aspect-square w-20 overflow-hidden rounded border-2 transition-all ' +
                                (isActive
                                    ? 'border-primary ring-2 ring-primary'
                                    : 'border-border opacity-80 hover:opacity-100 hover:scale-105')
                            }
                        >
                            <SafeImage
                                src={img.path}
                                alt={alt}
                                fill
                                sizes="80px"
                                fallbackLabel={alt}
                                className="object-cover"
                            />
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

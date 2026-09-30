'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import type { GalleryImage } from '@/schemas/profile';
import { MainImage } from './MainImage';
import { SubThumbs } from './SubThumbs';

export interface GalleryProps {
    images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
    const { state, dispatch } = useApp();

    // ページ切替時に selectedGalleryImageId が現在の画像リストに存在しない場合、
    // デフォルト画像（isDefaultMain or 先頭）にリセットする
    useEffect(() => {
        if (images.length === 0) return;
        const exists = images.some((g) => g.id === state.selectedGalleryImageId);
        if (!exists) {
            const defaultImg = images.find((g) => g.isDefaultMain) ?? images[0];
            dispatch({ type: 'SET_GALLERY_IMAGE', payload: defaultImg.id });
        }
    }, [images, state.selectedGalleryImageId, dispatch]);

    if (images.length === 0) return null;

    // 現在の選択が画像リストに存在するか確認（useEffect 反映前のレンダリング対策）
    const currentId = images.some((g) => g.id === state.selectedGalleryImageId)
        ? state.selectedGalleryImageId
        : (images.find((g) => g.isDefaultMain) ?? images[0]).id;

    return (
        <div className="space-y-3">
            <MainImage images={images} />
            <SubThumbs images={images} excludeId={currentId} max={3} />
        </div>
    );
}

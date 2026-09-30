'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

export interface SafeImageProps extends Omit<ImageProps, 'onError'> {
    /** 表示用のフォールバック文字 (画像読み込み失敗時) */
    fallbackLabel?: string;
}

export function SafeImage({ fallbackLabel, alt, className, ...rest }: SafeImageProps) {
    const [errored, setErrored] = useState(false);

    if (errored) {
        return (
            <div
                role="img"
                aria-label={alt || fallbackLabel || 'image'}
                className={`flex items-center justify-center bg-surface text-text-muted text-sm ${className ?? ''}`}
                style={{ minWidth: 80, minHeight: 80 }}
            >
                {(fallbackLabel ?? (typeof alt === 'string' ? alt : '?'))?.slice(0, 1).toUpperCase() || '?'}
            </div>
        );
    }

    return (
        <Image
            {...rest}
            alt={alt}
            className={className}
            onError={() => setErrored(true)}
        />
    );
}

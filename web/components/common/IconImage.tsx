'use client';

import { SafeImage } from './SafeImage';

export interface IconImageProps {
    src: string;
    alt: string;
    size?: number;
    className?: string;
    priority?: boolean;
}

export function IconImage({ src, alt, size = 160, className, priority }: IconImageProps) {
    return (
        <SafeImage
            src={src}
            alt={alt}
            width={size}
            height={size}
            priority={priority}
            fallbackLabel={alt}
            className={`rounded-full object-cover border border-border ${className ?? ''}`}
        />
    );
}

'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import type { GalleryImage } from '@/schemas/profile';
import { SafeImage } from '@/components/common/SafeImage';

export interface MainImageProps {
    images: GalleryImage[];
}

export function MainImage({ images }: MainImageProps) {
    const { state } = useApp();
    const prefersReducedMotion = useReducedMotion();
    const current = images.find((g) => g.id === state.selectedGalleryImageId) ?? images[0];

    if (!current) return null;

    const alt = tx(current.alt, state.currentLocale);

    return (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                >
                    <SafeImage
                        src={current.path}
                        alt={alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        priority
                        fallbackLabel={alt}
                        className="object-cover"
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

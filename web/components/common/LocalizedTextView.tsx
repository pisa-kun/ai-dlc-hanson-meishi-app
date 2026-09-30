'use client';

import { createElement, type ElementType } from 'react';
import { useApp } from '@/context/AppContext';
import { tx } from '@/lib/fallback';
import type { LocalizedText } from '@/schemas/profile';

export interface LocalizedTextViewProps {
    text: LocalizedText;
    as?: ElementType;
    className?: string;
}

export function LocalizedTextView({ text, as = 'span', className }: LocalizedTextViewProps) {
    const { state } = useApp();
    return createElement(as, { className }, tx(text, state.currentLocale));
}

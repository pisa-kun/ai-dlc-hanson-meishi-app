'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface AnimatedSectionProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    id?: string;
}

export function AnimatedSection({ children, delay = 0, className, id }: AnimatedSectionProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return (
            <section id={id} className={className}>
                {children}
            </section>
        );
    }

    return (
        <motion.section
            id={id}
            className={className}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        >
            {children}
        </motion.section>
    );
}

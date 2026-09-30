import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Tanaka Masato Profile',
    description: 'Self-introduction page of Masato Tanaka — Software Engineer / SRE / Assistant Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // [locale]/layout.tsx で <html> をラップしているため、ここは中身のみ
    return children;
}

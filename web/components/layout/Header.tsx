import { ThemePalette } from '@/components/controls/ThemePalette';
import { LanguageSwitcher } from '@/components/controls/LanguageSwitcher';

export function Header() {
    return (
        <header
            className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8"
            data-testid="header"
        >
            <ThemePalette />
            <LanguageSwitcher />
        </header>
    );
}

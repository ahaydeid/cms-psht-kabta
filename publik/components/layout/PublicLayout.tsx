import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';

import { PublicBottomBar } from './PublicBottomBar';
import { PublicFooter } from './PublicFooter';
import { PublicTopbar } from './PublicTopbar';
import { usePage } from '../../runtime/inertia-shim';

type PublicLayoutProps = {
    children: ReactNode;
};

export function PublicLayout({ children }: PublicLayoutProps) {
    const { url } = usePage();
    const isHome = url === '/';

    return (
        <div className="flex min-h-dvh flex-col bg-white text-zinc-950">
            <PublicTopbar />
            <div className={cn('flex flex-1 flex-col', !isHome && 'pt-16')}>{children}</div>
            <PublicFooter />
            <PublicBottomBar />
        </div>
    );
}

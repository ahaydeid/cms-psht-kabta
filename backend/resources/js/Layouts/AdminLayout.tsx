import { useState, type ReactNode } from 'react';

import { AdminSidebar } from '@/Components/Admin/AdminSidebar';
import { AdminTopbar } from '@/Components/Admin/AdminTopbar';
import { cn } from '@/lib/cn';

type AdminLayoutProps = {
    children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const sidebarMargin = isOpen ? 'lg:ml-64' : 'lg:ml-16';

    return (
        <div className="relative min-h-screen bg-zinc-50">
            <AdminSidebar
                isMobileOpen={isMobileOpen}
                isOpen={isOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
                onToggle={() => setIsOpen((value) => !value)}
            />

            {isMobileOpen ? (
                <button
                    aria-label="Tutup sidebar"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                    type="button"
                />
            ) : null}

            <div className={cn('transition-all duration-300', sidebarMargin)}>
                <AdminTopbar onMenuClick={() => setIsMobileOpen(true)} />
            </div>

            <main className={cn('transition-all duration-300', sidebarMargin, 'px-3 py-4 lg:px-5')}>{children}</main>
        </div>
    );
}

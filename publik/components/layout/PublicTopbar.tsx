import { ChevronDown, User2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '../../lib/cn';

import { organizationProfile } from '../../data/homeContent';
import { publicNavigationItems } from '../../data/navigation';
import { Link, usePage } from '../../runtime/inertia-shim';

export function PublicTopbar() {
    const { url } = usePage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isTopbarVisible, setIsTopbarVisible] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrolled = () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;

            setIsScrolled(currentScrollY > 8);
            if (Math.abs(scrollDelta) < 8) {
                return;
            }

            setIsTopbarVisible(currentScrollY < 24 || scrollDelta < 0);
            lastScrollY = currentScrollY;
        };

        updateScrolled();
        window.addEventListener('scroll', updateScrolled, { passive: true });

        return () => window.removeEventListener('scroll', updateScrolled);
    }, []);

    useEffect(() => {
        setIsTopbarVisible(true);
    }, [url]);

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,box-shadow,opacity,transform] duration-300 ease-out will-change-transform',
                isTopbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
                'border-zinc-200 bg-white/95 shadow-sm backdrop-blur',
            )}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link className="flex min-w-0 items-center gap-3" href="/">
                    <img alt="Logo PSHT" className="size-10 shrink-0 object-contain" src={organizationProfile.logo} />
                    <div className="min-w-0">
                        <p
                            className={cn(
                                'truncate text-sm font-bold transition-colors',
                                useTransparentTopbar ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]' : 'text-zinc-950',
                            )}
                        >
                            PSHT
                        </p>
                        <p
                            className={cn(
                                'truncate text-xs transition-colors',
                                useTransparentTopbar ? 'text-white/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]' : 'text-zinc-500',
                            )}
                        >
                            Kab. Tangerang
                        </p>
                    </div>
                </Link>

                <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
                    {publicNavigationItems.map((item) => {
                        const isActive = url === item.href || item.children?.some((child) => url === child.href) === true;
                        const isContact = item.href === '/kontak';
                        const linkClassName = cn(
                            'border-b-2 px-3 py-2 text-sm font-medium transition hover:text-brand-yellow-dark',
                            isActive
                                ? 'border-brand-yellow text-brand-red-dark'
                                : isContact
                                  ? 'border-transparent text-brand-red hover:text-brand-red-dark'
                                  : 'border-transparent text-zinc-700 hover:text-brand-yellow-dark',
                        );

                        if (item.children) {
                            return (
                                <div className="group relative" key={item.href}>
                                    <button
                                        aria-haspopup="true"
                                        className={cn(linkClassName, 'inline-flex items-center gap-1.5')}
                                        type="button"
                                    >
                                        {item.label}
                                        <ChevronDown className="size-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
                                    </button>
                                    <div className="invisible absolute left-0 top-full min-w-56 translate-y-2 border border-zinc-200 bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                        {item.children.map((child) => {
                                            const isChildActive = url === child.href;

                                            return (
                                                <Link
                                                    className={cn(
                                                        'block px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-50 hover:text-brand-yellow-dark',
                                                        isChildActive ? 'text-brand-yellow-dark' : 'text-zinc-700',
                                                    )}
                                                    href={child.href}
                                                    key={child.href}
                                                >
                                                    {child.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                className={linkClassName}
                                href={item.href}
                                key={item.href}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <Link
                    className={cn(
                        'inline-flex size-7 items-center justify-center rounded-full bg-slate-700 text-white/80 transition hover:bg-slate-800',
                    )}
                    href="/admin/login"
                    title="Masuk admin"
                >
                    <User2 className="size-5" />
                </Link>
            </div>
        </header>
    );
}

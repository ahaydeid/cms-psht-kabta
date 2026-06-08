import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '../../lib/cn';

import { publicNavigationItems } from '../../data/navigation';
import { Link, usePage } from '../../runtime/inertia-shim';

export function PublicBottomBar() {
    const { url } = usePage();
    const [openMenuHref, setOpenMenuHref] = useState<string | null>(null);

    useEffect(() => {
        setOpenMenuHref(null);
    }, [url]);

    return (
        <nav
            aria-label="Navigasi mobile"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white px-2 py-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] lg:hidden"
        >
            <div className="grid grid-cols-6 gap-1">
                {publicNavigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = url === item.href || item.children?.some((child) => url === child.href) === true;
                    const isOpen = openMenuHref === item.href;

                    if (item.children) {
                        return (
                            <div className="relative" key={item.href}>
                                {isOpen ? (
                                    <div className="absolute bottom-[calc(100%+0.75rem)] left-1/2 w-52 -translate-x-1/2 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_14px_36px_rgba(24,24,27,0.16)]">
                                        {item.children.map((child) => {
                                            const isChildActive = url === child.href;

                                            return (
                                                <Link
                                                    className={cn(
                                                        'block px-4 py-3 text-sm font-semibold transition hover:bg-zinc-50 hover:text-brand-yellow-dark',
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
                                ) : null}
                                <button
                                    aria-expanded={isOpen}
                                    className={cn(
                                        'flex min-h-12 w-full flex-col items-center justify-center gap-1 rounded text-[10px] font-semibold transition hover:text-brand-yellow-dark',
                                        isActive ? 'text-brand-yellow-dark' : 'text-zinc-600',
                                    )}
                                    onClick={() => setOpenMenuHref(isOpen ? null : item.href)}
                                    type="button"
                                >
                                    <span className="relative">
                                        <Icon className="size-4" />
                                        <ChevronDown className={cn('absolute -right-3 -top-1 size-3 transition', isOpen && 'rotate-180')} />
                                    </span>
                                    <span className="max-w-full truncate">{item.label}</span>
                                </button>
                            </div>
                        );
                    }

                    return (
                        <Link
                            className={cn(
                                'flex min-h-12 flex-col items-center justify-center gap-1 rounded text-[10px] font-semibold transition hover:text-brand-yellow-dark',
                                isActive ? 'text-brand-yellow-dark' : 'text-zinc-600',
                            )}
                            href={item.href}
                            key={item.href}
                        >
                            <Icon className="size-4" />
                            <span className="max-w-full truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, ChevronsLeftIcon, Menu } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { buildAdminMenu } from '@/config/adminMenu';
import type { MenuItem } from '@/types/Menu';
import { cn } from '@/lib/cn';

type AdminSidebarProps = {
    isMobileOpen?: boolean;
    isOpen: boolean;
    onCloseMobile?: () => void;
    onToggle: () => void;
};

function collectPaths(items: MenuItem[]): string[] {
    return items.flatMap((item) => [
        ...(item.path ? [item.path] : []),
        ...(item.children ? collectPaths(item.children) : []),
    ]);
}

function containsActivePath(item: MenuItem, activePath?: string): boolean {
    if (!activePath) {
        return false;
    }

    if (item.path === '/admin/dashboard' && (activePath === '/admin/dashboard' || activePath.startsWith('/admin/dashboard/'))) {
        return true;
    }

    if (item.path === activePath) {
        return true;
    }

    return item.children?.some((child) => containsActivePath(child, activePath)) ?? false;
}

function findAncestorKeys(items: MenuItem[], activePath?: string, ancestors: string[] = []): string[] {
    if (!activePath) {
        return [];
    }

    for (const item of items) {
        const key = item.path ?? item.name;

        if (item.path === activePath) {
            return ancestors;
        }

        if (item.children) {
            const childAncestors = findAncestorKeys(item.children, activePath, [...ancestors, key]);

            if (childAncestors.length > 0) {
                return childAncestors;
            }
        }
    }

    return [];
}

export function AdminSidebar({ isMobileOpen = false, isOpen, onCloseMobile, onToggle }: AdminSidebarProps) {
    const { props, url } = usePage<{
        auth?: {
            access?: any;
        };
    }>();
    const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
    const menuItems = useMemo(() => buildAdminMenu(props.auth?.access ?? {}), [props.auth?.access]);

    const allPaths = useMemo(() => collectPaths(menuItems), [menuItems]);
    const activePath = useMemo(
        () =>
            allPaths
                .filter((path) => {
                    if (path === '/admin/dashboard') {
                        return url === '/admin/dashboard' || url.startsWith('/admin/dashboard/');
                    }

                    return url === path || url.startsWith(`${path}/`) || url.startsWith(`${path}?`);
                })
                .sort((a, b) => b.length - a.length)[0],
        [allPaths, url],
    );

    useEffect(() => {
        setOpenDropdowns(findAncestorKeys(menuItems, activePath));
    }, [activePath, menuItems]);

    const toggleDropdown = (key: string) => {
        setOpenDropdowns((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
    };

    const renderMenu = (items: MenuItem[], level = 1) =>
        items.map((item) => {
            if (item.section && item.children) {
                return (
                    <div key={item.section}>
                        {(isOpen || isMobileOpen) ? (
                            <div className="px-3 pb-1 pl-5 pt-5 text-xs uppercase tracking-wide text-zinc-400">
                                {item.section}
                            </div>
                        ) : null}
                        {renderMenu(item.children, level)}
                    </div>
                );
            }

            const key = item.path ?? item.name;
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const active = containsActivePath(item, activePath);
            const open = openDropdowns.includes(key);
            const padding = level === 1 ? 'px-3 py-3 pl-5' : 'py-2 pl-10 pr-3';
            const activeClass = level === 1 ? 'bg-yellow-400 text-zinc-950 font-normal' : 'font-bold text-zinc-950';
            const inactiveClass = 'text-zinc-700 hover:bg-yellow-400/10';

            const icon = Icon && level === 1 ? (
                <div className="flex size-4 shrink-0 items-center justify-center">
                    <Icon className="size-4" />
                </div>
            ) : null;

            const label = (isOpen || isMobileOpen) ? (
                <span className="truncate">{level > 1 ? `• ${item.name}` : item.name}</span>
            ) : null;

            if (hasChildren) {
                return (
                    <div key={key}>
                        <button
                            className={cn(
                                'flex w-full cursor-pointer items-center gap-3 text-sm transition',
                                padding,
                                isOpen || isMobileOpen ? 'justify-start' : 'justify-center',
                                active ? activeClass : inactiveClass,
                            )}
                            onClick={() => toggleDropdown(key)}
                            type="button"
                        >
                            {icon}
                            {(isOpen || isMobileOpen) ? (
                                <div className="flex w-full items-center justify-between">
                                    {label}
                                    {open ? <ChevronDown className="size-4 shrink-0" /> : <ChevronRight className="size-4 shrink-0" />}
                                </div>
                            ) : null}
                        </button>

                        {open && (isOpen || isMobileOpen) ? <div className="ml-4">{renderMenu(item.children!, level + 1)}</div> : null}
                    </div>
                );
            }

            return (
                <Link
                    className={cn(
                        'flex w-full items-center gap-3 text-sm transition',
                        padding,
                        isOpen || isMobileOpen ? 'justify-start' : 'justify-center',
                        active ? activeClass : inactiveClass,
                    )}
                    href={item.path ?? '#'}
                    key={key}
                    onClick={() => {
                        if (isMobileOpen && onCloseMobile) {
                            onCloseMobile();
                        }
                    }}
                >
                    {icon}
                    {label}
                </Link>
            );
        });

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-300',
                isMobileOpen ? 'w-64 translate-x-0 shadow-2xl' : 'w-64 -translate-x-full lg:translate-x-0',
                isOpen ? 'lg:w-64' : 'lg:w-16',
            )}
        >
            <div className="sticky top-0 flex h-14 items-center justify-between bg-white px-4">
                {(isOpen || isMobileOpen) ? (
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-black leading-none text-zinc-950">
                            PSHT<span className="text-yellow-500"> Kabta</span>
                        </h1>
                    </div>
                ) : null}
                <button
                    className="cursor-pointer rounded-full p-2 hover:bg-zinc-100"
                    onClick={() => {
                        if (isMobileOpen && onCloseMobile) {
                            onCloseMobile();
                            return;
                        }

                        onToggle();
                    }}
                    type="button"
                >
                    <span className="lg:hidden">
                        <ChevronsLeftIcon size={18} />
                    </span>
                    <span className="hidden lg:block">{isOpen ? <ChevronsLeftIcon size={18} /> : <Menu size={18} />}</span>
                </button>
            </div>

            <div className="shrink-0">
                <div className="mx-auto h-px w-[60%] bg-zinc-200" />
            </div>

            <nav className="flex-1 overflow-y-auto pt-3">{renderMenu(menuItems)}</nav>

            <div className="sticky bottom-0 border-t border-zinc-200 bg-white p-3">
                <h3 className="text-xs text-zinc-400">Sisfo PSHT Kabta</h3>
            </div>
        </aside>
    );
}

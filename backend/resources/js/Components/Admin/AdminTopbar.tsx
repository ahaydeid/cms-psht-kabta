import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Menu, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/Components/ui';
import { confirmAction } from '@/lib/alert';

type AdminTopbarProps = {
    onMenuClick?: () => void;
};

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
    const { props } = usePage<{
        auth?: {
            organizationUnit?: {
                name?: string;
            };
            user?: {
                name?: string;
            };
            roles?: string[];
        };
    }>();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement | null>(null);

    const displayName = props.auth?.user?.name ?? 'Admin';
    const organizationName = props.auth?.organizationUnit?.name ?? 'PSHT Kabta';
    const displayRole = props.auth?.roles?.[0]?.replace(/_/g, ' ') ?? 'Administrator';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setIsProfileOpen(false);

        const result = await confirmAction({
            title: 'Keluar dari aplikasi?',
            text: 'Sesi login akan diakhiri dan kamu perlu masuk kembali.',
            confirmButtonText: 'Ya, keluar',
            cancelButtonText: 'Batal',
            variant: 'danger',
        });

        if (result.isConfirmed) {
            router.post('/admin/logout');
        }
    };

    return (
        <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-6">
            <div className="flex items-center gap-3 lg:gap-4">
                <Button className="-ml-2 rounded-lg p-2 lg:hidden" onClick={onMenuClick} variant="ghost">
                    <Menu className="size-5 text-zinc-600" />
                </Button>

                <div className="hidden flex-col leading-tight lg:flex">
                    <span className="text-lg font-semibold tracking-tight text-zinc-800">{organizationName}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
                <Button className="relative rounded-lg p-2" variant="ghost">
                    <Bell className="size-5 text-zinc-700" />
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-600" />
                </Button>
                <div className="relative" ref={profileRef}>
                    <Button
                        className="flex h-auto items-center gap-2 rounded px-2 py-1.5"
                        onClick={() => setIsProfileOpen((value) => !value)}
                        variant="ghost"
                    >
                        <span className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-slate-200 text-zinc-950">
                            <UserRound className="size-4" />
                        </span>
                        <span className="hidden text-left lg:block">
                            <span className="block text-sm font-semibold text-zinc-800">{displayName}</span>
                            <span className="block text-[10px] capitalize text-zinc-500">{displayRole}</span>
                        </span>
                    </Button>

                    {isProfileOpen ? (
                        <div className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-44 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                            <Link
                                className="block px-4 py-2 text-sm text-zinc-700 transition hover:text-zinc-950"
                                href="/admin/profil-akun"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                Profil
                            </Link>
                            <button
                                className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-zinc-700 transition hover:text-rose-600"
                                onClick={handleLogout}
                                type="button"
                            >
                                Keluar
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}

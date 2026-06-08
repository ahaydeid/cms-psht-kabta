import {
    LayoutDashboard,
    UsersRound,
    Building2,
    UserPen,
    UserRound,
    SquarePen
} from 'lucide-react';

import type { MenuItem } from '@/types/Menu';

export const adminMenu: MenuItem[] = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/admin/dashboard',
    },
    {
        name: 'MEDIA',
        section: 'MEDIA',
        children: [
            {
                name: 'Buat konten',
                icon: SquarePen,
                children: [
                    {
                        name: 'Tulisan',
                        path: '/admin/berita',
                    },
                    {
                        name: 'Galeri',
                        path: '/admin/galeri',
                    },
                ],
            },
            {
                name: 'Kontributor',
                path: '/admin/kontributor',
                icon: UserPen,
            },
        ],
    },
    {
        name: 'Master Data',
        section: 'Master Data',
        children: [
            {
                name: 'Warga',
                path: '/admin/warga',
                icon: UsersRound,
            },
            {
                name: 'Ranting',
                path: '/admin/ranting',
                icon: Building2,
            },
            {
                name: 'Pengguna',
                path: '/admin/pengguna',
                icon: UserRound,
            },
        ],
    },
];

export function buildAdminMenu(access?: any): MenuItem[] {
    return adminMenu;
}

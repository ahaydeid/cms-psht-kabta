import {
    LayoutDashboard,
    UsersRound,
    Building2,
    UserPen,
    UserRound,
    CalendarDays,
    FileText,
    Image
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
                name: 'Tulisan',
                path: '/admin/berita',
                icon: FileText,
            },
            {
                name: 'Galeri',
                path: '/admin/galeri',
                icon: Image,
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
            {
                name: 'Jadwal Latihan',
                path: '/admin/jadwal-latihan',
                icon: CalendarDays,
            },
        ],
    },
];

export function buildAdminMenu(_access?: any): MenuItem[] {
    return adminMenu;
}

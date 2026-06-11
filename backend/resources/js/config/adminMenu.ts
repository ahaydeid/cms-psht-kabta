import {
    LayoutDashboard,
    UsersRound,
    MapPinned,
    UserPen,
    UserRound,
    CalendarDays,
    FileText,
    Image,
    Inbox,
    Mail
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
            {
                name: 'Draft',
                path: '/admin/draft',
                icon: Inbox,
            },
            {
                name: 'Agenda',
                path: '/admin/agenda',
                icon: CalendarDays,
            },
            {
                name: 'Pesan',
                path: '/admin/pesan',
                icon: Mail,
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
                icon: MapPinned,
            },
            {
                name: 'Akun',
                path: '/admin/akun',
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

export function buildAdminMenu(role?: string): MenuItem[] {
    const menu = [...adminMenu];
    
    const masterDataIndex = menu.findIndex(m => m.name === 'Master Data');
    if (masterDataIndex !== -1 && menu[masterDataIndex].children) {
        let children = [...menu[masterDataIndex].children!];
        
        if (role === 'admin') {
            children = children.filter(item => item.name !== 'Ranting');
            
            const insertIndex = children.findIndex(item => item.name === 'Warga') + 1;
            children.splice(insertIndex, 0, {
                name: 'Rayon',
                path: '/admin/rayon',
                icon: MapPinned,
            });
        }
        
        menu[masterDataIndex] = { ...menu[masterDataIndex], children };
    }
    
    return menu;
}

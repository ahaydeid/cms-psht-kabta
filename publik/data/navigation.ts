import { Building2, CalendarDays, Home, Images, Newspaper, Phone } from 'lucide-react';

import type { PublicNavigationItem } from '../types';

export const publicNavigationItems: PublicNavigationItem[] = [
    {
        href: '/',
        icon: Home,
        label: 'Beranda',
    },
    {
        children: [
            {
                href: '/profil/tentang',
                label: 'Tentang',
            },
            {
                href: '/profil/struktur-organisasi',
                label: 'Struktur Organisasi',
            },
            {
                href: '/profil/ranting',
                label: 'Ranting',
            },
            {
                href: '/profil/keanggotaan',
                label: 'Keanggotaan',
            },
        ],
        href: '/profil/tentang',
        icon: Building2,
        label: 'Profil',
    },
    {
        href: '/berita',
        icon: Newspaper,
        label: 'Berita',
    },
    {
        href: '/galeri',
        icon: Images,
        label: 'Galeri',
    },
    {
        href: '/jadwal',
        icon: CalendarDays,
        label: 'Jadwal',
    },
    {
        href: '/kontak',
        icon: Phone,
        label: 'Kontak',
    },
];

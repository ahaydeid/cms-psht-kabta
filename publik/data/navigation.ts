import { Info, CalendarDays, Home, Images, Newspaper, Phone, Calendar } from 'lucide-react';

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
        icon: Info,
        label: 'Profil',
    },
    {
        children: [
            {
                href: '/berita',
                label: 'Berita',
            },
            {
                href: '/galeri',
                label: 'Galeri',
            },
        ],
        href: '/berita',
        icon: Newspaper,
        label: 'Media',
    },
    {
        href: '/agenda',
        icon: Calendar,
        label: 'Agenda',
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

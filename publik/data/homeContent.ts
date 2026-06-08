import type { PublicArticle, PublicGalleryItem, PublicInformationPopup, PublicQuickAccess, PublicTrainingSchedule } from '../types';

export const organizationProfile = {
    name: 'PSHT Kabta',
    eyebrow: 'Persaudaraan Setia Hati Terate',
    headline: 'Membangun persaudaraan, kedisiplinan, dan budi luhur.',
    description:
        'Website profil resmi untuk menampilkan informasi organisasi, kegiatan, berita, dan layanan publik PSHT Cabang Kabupaten Tangerang.',
    logo: '/img/logo-psht.webp',
    address: 'Kabupaten Tangerang, Banten',
    email: 'info@pshtkabtangerang.or.id',
    phone: '+62 812-0000-0000',
};

export const homeIntro = {
    title: 'Informasi resmi PSHT Cabang Kabupaten Tangerang',
    lead: 'Mendidik manusia yang berbudi luhur, tahu benar dan salah, serta bertakwa kepada Tuhan Yang Maha Esa.',
};

export const featuredNotice = {
    category: 'Pengumuman',
    date: 'Mei 2026',
    title: 'Validasi data dan informasi cabang',
    description:
        'Pengurus cabang menyiapkan kanal informasi terpadu agar warga, siswa, dan masyarakat dapat menemukan informasi resmi dengan lebih mudah.',
};

export const homeInformationPopup: PublicInformationPopup = {
    body: 'Website public PSHT Cabang Kabupaten Tangerang sedang dalam tahap penyiapan. Informasi yang tampil saat ini masih berupa data contoh dan akan diperbarui melalui CMS admin.',
    date: 'Mei 2026',
    imageAlt: 'Placeholder informasi website',
    imageUrl: '/img/logo-psht.webp',
    // Set to true when the home information modal should appear again.
    isActive: false,
    title: 'Informasi Website',
};

export const organizationStats = [
    {
        label: 'Ranting',
        value: '29+',
    },
    {
        label: 'Rayon',
        value: '120+',
    },
    {
        label: 'Warga Terdata',
        value: '3.500+',
    },
    {
        label: 'Kegiatan Tahunan',
        value: '40+',
    },
];

export const quickAccessItems: PublicQuickAccess[] = [
    {
        description: 'Profil singkat, identitas, dan informasi organisasi.',
        href: '/profil',
        label: 'Profil Cabang',
    },
    {
        description: 'Kabar kegiatan, pengumuman, dan artikel organisasi.',
        href: '/berita',
        label: 'Berita',
    },
    {
        description: 'Informasi latihan dan agenda kegiatan terdekat.',
        href: '/jadwal',
        label: 'Jadwal',
    },
    {
        description: 'Dokumentasi kegiatan cabang, ranting, dan rayon.',
        href: '/galeri',
        label: 'Galeri',
    },
];

export const latestArticles: PublicArticle[] = [
    {
        category: 'Kegiatan',
        date: '12 Mei 2026',
        excerpt: 'Konsolidasi pengurus cabang bersama ranting untuk memperkuat koordinasi program kerja organisasi.',
        image: '/img/logo-psht.webp',
        slug: 'konsolidasi-pengurus-cabang',
        title: 'Konsolidasi Pengurus Cabang dan Ranting',
    },
    {
        category: 'Latihan',
        date: '8 Mei 2026',
        excerpt: 'Pembinaan latihan rutin diarahkan untuk menjaga kedisiplinan, teknik dasar, dan nilai persaudaraan.',
        image: '/img/logo-psht.webp',
        slug: 'pembinaan-latihan-rutin',
        title: 'Pembinaan Latihan Rutin Rayon',
    },
    {
        category: 'Pengumuman',
        date: '4 Mei 2026',
        excerpt: 'Informasi awal agenda pendataan dan validasi data warga pada tingkat ranting dan rayon.',
        image: '/img/logo-psht.webp',
        slug: 'validasi-data-warga',
        title: 'Validasi Data Warga Organisasi',
    },
];

export const trainingSchedules: PublicTrainingSchedule[] = [
    {
        day: 'Selasa',
        place: 'Ranting Balaraja',
        time: '19.30 WIB',
    },
    {
        day: 'Kamis',
        place: 'Ranting Cikupa',
        time: '19.30 WIB',
    },
    {
        day: 'Minggu',
        place: 'Latihan Gabungan Cabang',
        time: '07.00 WIB',
    },
];

export const galleryItems: PublicGalleryItem[] = [
    {
        image: '/img/logo-psht.webp',
        title: 'Latihan Bersama',
    },
    {
        image: '/img/logo-psht.webp',
        title: 'Kegiatan Cabang',
    },
    {
        image: '/img/logo-psht.webp',
        title: 'Pembinaan Rayon',
    },
    {
        image: '/img/logo-psht.webp',
        title: 'Silaturahmi Warga',
    },
];

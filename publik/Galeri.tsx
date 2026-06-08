import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { PublicLayout } from './components/layout/PublicLayout';
import { Head } from './runtime/inertia-shim';

type GalleryAlbum = {
    count: number;
    date: string;
    description: string;
    images: string[];
    kind: 'group' | 'single';
    place: string;
    slug: string;
    title: string;
};

const galleryAlbums: GalleryAlbum[] = [
    {
        count: 1,
        date: '12 Mei 2026',
        description: 'Dokumentasi latihan gabungan cabang dengan agenda pembinaan teknik, penguatan kedisiplinan, dan silaturahmi antarwarga. Kegiatan ini menjadi ruang temu bagi warga dan siswa dari berbagai ranting untuk menyamakan arah latihan, menjaga tata tertib, dan mempererat persaudaraan dalam suasana yang tertib, guyub, dan penuh kekeluargaan.',
        images: ['/img/logo-psht.webp'],
        kind: 'single',
        place: 'Cabang Kab. Tangerang',
        slug: 'latihan-gabungan-cabang',
        title: 'Latihan Gabungan Cabang dan Pembinaan Warga',
    },
    {
        count: 18,
        date: '8 Mei 2026',
        description: 'Album pembinaan Ranting Balaraja berisi rangkaian latihan, pengarahan, dan dokumentasi kebersamaan warga serta siswa. Setiap sesi memuat suasana pemanasan, pendalaman materi dasar, koreksi gerak, serta pengarahan singkat agar proses latihan tetap berjalan disiplin tanpa kehilangan nilai persaudaraan yang menjadi dasar kegiatan.',
        images: ['/img/logo-psht.webp', '/img/logo-psht.webp', '/img/logo-psht.webp'],
        kind: 'group',
        place: 'Ranting Balaraja',
        slug: 'pembinaan-ranting-balaraja',
        title: 'Pembinaan Ranting Balaraja dan Penguatan Materi Dasar',
    },
    {
        count: 9,
        date: '4 Mei 2026',
        description: 'Dokumentasi silaturahmi warga Kresek dalam agenda koordinasi, ramah tamah, dan penguatan persaudaraan lintas rayon. Kegiatan ini menjadi tempat bertukar kabar, merapikan agenda, serta menjaga hubungan antarwarga agar komunikasi organisasi tetap hangat, terbuka, dan saling menguatkan.',
        images: ['/img/logo-psht.webp', '/img/logo-psht.webp'],
        kind: 'group',
        place: 'Ranting Kresek',
        slug: 'silaturahmi-warga-kresek',
        title: 'Silaturahmi Warga Kresek dan Koordinasi Lintas Rayon',
    },
    {
        count: 1,
        date: '2 Mei 2026',
        description: 'Foto kegiatan latihan Rayon Binong sebagai arsip kegiatan rutin dan pembinaan siswa di lingkungan ranting. Dokumentasi ini merekam suasana latihan, perhatian pelatih kepada siswa, serta semangat peserta dalam mengikuti arahan dengan tertib dan penuh kesungguhan dari awal hingga akhir kegiatan.',
        images: ['/img/logo-psht.webp'],
        kind: 'single',
        place: 'Rayon Binong',
        slug: 'latihan-rayon-binong',
        title: 'Latihan Rayon Binong dan Pembinaan Siswa Rutin',
    },
    {
        count: 24,
        date: '30 April 2026',
        description: 'Album kegiatan Ranting Curug yang memuat dokumentasi latihan, pembinaan, dan suasana kegiatan organisasi. Foto-foto ini menampilkan proses kebersamaan warga, persiapan kegiatan, pengarahan lapangan, serta momen sederhana yang menjadi bagian penting dari kehidupan organisasi di tingkat ranting.',
        images: ['/img/logo-psht.webp', '/img/logo-psht.webp', '/img/logo-psht.webp'],
        kind: 'group',
        place: 'Ranting Curug',
        slug: 'dokumentasi-ranting-curug',
        title: 'Dokumentasi Ranting Curug dalam Agenda Latihan dan Organisasi',
    },
    {
        count: 1,
        date: '28 April 2026',
        description: 'Dokumentasi singkat sesi latihan Talagasari dengan fokus pembinaan dasar, ketertiban, dan nilai persaudaraan. Latihan ini menjadi bagian dari upaya menjaga kesinambungan pembinaan siswa agar memahami gerak, adab, dan tanggung jawab sejak proses awal belajar.',
        images: ['/img/logo-psht.webp'],
        kind: 'single',
        place: 'Rayon Talagasari',
        slug: 'sesi-latihan-talaga-sari',
        title: 'Sesi Latihan Talagasari untuk Pembinaan Dasar',
    },
    {
        count: 15,
        date: '24 April 2026',
        description: 'Album pengabdian Pasar Kemis yang merangkum kegiatan warga, koordinasi lapangan, dan dokumentasi bersama. Rangkaian foto ini memperlihatkan keterlibatan warga dalam kegiatan sosial, pengaturan teknis di lapangan, serta semangat gotong royong yang dijaga sebagai bagian dari nilai persaudaraan.',
        images: ['/img/logo-psht.webp', '/img/logo-psht.webp'],
        kind: 'group',
        place: 'Ranting Pasar Kemis',
        slug: 'pengabdian-pasar-kemis',
        title: 'Pengabdian Pasar Kemis dan Dokumentasi Kegiatan Warga',
    },
];

const galleryImageSet = Array.from({ length: 21 }, () => '/img/logo-psht.webp');

galleryAlbums.forEach((album) => {
    if (album.kind === 'group') {
        album.images = galleryImageSet;
        album.count = galleryImageSet.length;
    }
});

const cardHeights = ['h-76', 'h-88', 'h-80', 'h-72', 'h-92', 'h-78', 'h-84'];
const trimDescription = (description: string) => description.slice(0, 500);
const trimCollapsedDescription = (description: string) => description.slice(0, 120);

const singleAlbums = galleryAlbums.filter((album) => album.kind === 'single');
const groupAlbums = galleryAlbums.filter((album) => album.kind === 'group');
const displayedAlbums = Array.from({ length: Math.max(singleAlbums.length, groupAlbums.length) }).flatMap((_, index) => [
    groupAlbums[index],
    singleAlbums[index],
]).filter((album): album is GalleryAlbum => Boolean(album));

export default function Galeri() {
    const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
    const thumbnailStripRef = useRef<HTMLDivElement>(null);
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const searchableAlbums = displayedAlbums.filter((album) => {
        const haystack = `${album.title} ${album.place} ${album.date}`.toLowerCase();

        return haystack.includes(normalizedSearchQuery);
    });
    const suggestedAlbums = normalizedSearchQuery ? searchableAlbums.slice(0, 5) : [];

    const openAlbum = (album: GalleryAlbum) => {
        setActiveAlbum(album);
        setActiveImageIndex(0);
        setIsCaptionExpanded(false);
    };

    const closeAlbum = () => setActiveAlbum(null);
    const captionText = activeAlbum ? trimDescription(activeAlbum.description) : '';
    const collapsedCaptionText = activeAlbum ? trimCollapsedDescription(activeAlbum.description) : '';
    const moveActiveImage = (direction: 'next' | 'previous') => {
        if (!activeAlbum) {
            return;
        }

        setActiveImageIndex((currentIndex) => {
            const step = direction === 'next' ? 1 : -1;

            return (currentIndex + step + activeAlbum.images.length) % activeAlbum.images.length;
        });
        setIsCaptionExpanded(false);
    };

    useEffect(() => {
        if (!activeAlbum) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeAlbum();
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeAlbum]);

    useEffect(() => {
        const activeThumbnail = thumbnailStripRef.current?.querySelector<HTMLElement>('[data-active-thumbnail="true"]');

        activeThumbnail?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });
    }, [activeAlbum, activeImageIndex]);

    return (
        <PublicLayout>
            <Head title="Galeri" />
            <main className="bg-white">
                <section className="overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">Galeri</h1>

                            <div className="relative sm:w-full sm:max-w-sm">
                                <div className="flex items-center rounded-full border border-zinc-300 bg-white px-4">
                                    <Search className="size-4 shrink-0 text-zinc-400" />
                                    <input
                                        className="min-h-12 w-full bg-transparent px-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-400"
                                        onBlur={() => {
                                            window.setTimeout(() => setIsSuggestionOpen(false), 120);
                                        }}
                                        onChange={(event) => {
                                            setSearchQuery(event.target.value);
                                            setIsSuggestionOpen(true);
                                        }}
                                        onFocus={() => setIsSuggestionOpen(true)}
                                        placeholder="Cari galeri foto"
                                        type="text"
                                        value={searchQuery}
                                    />
                                </div>

                                {isSuggestionOpen && normalizedSearchQuery ? (
                                    <div className="absolute right-0 top-full z-10 mt-2 max-h-80 w-full overflow-y-auto rounded-xs border border-zinc-200 bg-white shadow-sm">
                                        {suggestedAlbums.length > 0 ? (
                                            suggestedAlbums.map((album) => (
                                                <button
                                                    className="block w-full border-b border-zinc-100 px-4 py-3 text-left last:border-b-0 hover:bg-zinc-50"
                                                    key={`suggestion-${album.slug}`}
                                                    onClick={() => {
                                                        setSearchQuery(album.title);
                                                        setIsSuggestionOpen(false);
                                                    }}
                                                    type="button"
                                                >
                                                    <p className="text-sm font-semibold text-zinc-950">{album.title}</p>
                                                    <p className="mt-1 text-xs text-zinc-500">{album.place}</p>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="px-4 py-3 text-sm text-zinc-500">Tidak ada hasil</p>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="columns-1 gap-6 sm:columns-2 lg:columns-4 lg:gap-8">
                            {searchableAlbums.map((album, index) => {
                                const heightClass = cardHeights[index % cardHeights.length];
                                const stackCount = album.kind === 'group' ? Math.min(album.images.length, 3) : 1;

                                return (
                                    <button
                                        className="group mb-8 block w-full break-inside-avoid px-1 pb-6 pt-1 text-left sm:px-2"
                                        key={album.slug}
                                        onClick={() => openAlbum(album)}
                                        type="button"
                                    >
                                        <article className="relative">
                                            {album.kind === 'group' ? (
                                                <div className="absolute inset-0 -translate-x-2 translate-y-3 -rotate-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 transition group-hover:-translate-x-3 group-hover:translate-y-4 group-hover:-rotate-6">
                                                    <img alt="" className="h-full w-full object-cover opacity-75" loading="lazy" src={album.images[1] ?? album.images[0]} />
                                                </div>
                                            ) : null}
                                            {album.kind === 'group' && stackCount > 2 ? (
                                                <div className="absolute inset-0 translate-x-3 translate-y-5 rotate-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 transition group-hover:translate-x-4 group-hover:translate-y-6 group-hover:rotate-6">
                                                    <img alt="" className="h-full w-full object-cover opacity-65" loading="lazy" src={album.images[2] ?? album.images[1] ?? album.images[0]} />
                                                </div>
                                            ) : null}
                                            <div className={`relative ${heightClass} overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 transition group-hover:border-brand-yellow group-hover:shadow-xl group-hover:-rotate-2`}>
                                                <img alt="" className="h-full w-full object-cover opacity-90 transition duration-500" loading="lazy" src={album.images[0]} />
                                                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/25 to-transparent" />
                                                {album.kind === 'group' ? (
                                                    <div className="absolute left-0 top-0 rounded-br-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-950">
                                                        {album.count} foto
                                                    </div>
                                                ) : null}
                                                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                                    <p className="text-xs text-white/65">{album.date} | {album.place}</p>
                                                    <h2 className="mt-2 line-clamp-2 text-xl font-bold leading-tight">{album.title}</h2>
                                                </div>
                                            </div>
                                        </article>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {activeAlbum ? (
                    <section
                        aria-modal="true"
                        className="fixed inset-0 z-50 h-svh overflow-hidden bg-white text-zinc-950"
                        role="dialog"
                    >
                        <button
                            aria-label="Tutup galeri"
                            className="fixed right-4 top-4 z-10 inline-flex text-zinc-950 transition hover:text-brand-yellow-dark"
                            onClick={closeAlbum}
                            type="button"
                        >
                            <X className="size-7" />
                        </button>

                        <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                            <div className="w-full shrink-0 text-left">
                                <p className="text-xs text-zinc-500">{activeAlbum.date} | {activeAlbum.place}</p>
                                <h2 className="mt-3 text-xl font-bold leading-tight sm:text-3xl">{activeAlbum.title}</h2>
                            </div>

                            {activeAlbum.kind === 'single' ? (
                                <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-4 sm:py-5">
                                    <figure className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-xl">
                                        <img
                                            alt=""
                                            className="h-full w-auto max-w-full object-contain"
                                            src={activeAlbum.images[0]}
                                        />
                                    </figure>
                                    <button
                                        className={`mt-3 flex h-6 w-full max-w-3xl items-baseline gap-1 text-left text-sm leading-6 text-zinc-700 transition hover:text-zinc-950 ${
                                            isCaptionExpanded ? 'invisible' : ''
                                        }`}
                                        onClick={() => setIsCaptionExpanded(true)}
                                        type="button"
                                    >
                                        <span className="min-w-0 flex-1 truncate">{collapsedCaptionText}</span>
                                        <span className="shrink-0 font-medium text-blue-600">selengkapnya</span>
                                    </button>
                                    {isCaptionExpanded ? (
                                        <button
                                            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl bg-white/55 px-4 py-3 text-left text-sm leading-6 text-zinc-800 backdrop-blur transition hover:bg-white/65"
                                            onClick={() => setIsCaptionExpanded(false)}
                                            type="button"
                                        >
                                            {captionText}
                                        </button>
                                    ) : null}
                                </div>
                            ) : (
                                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden py-4 sm:gap-5 sm:py-5 lg:flex-row lg:items-stretch">
                                    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
                                        <figure className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-xl">
                                            <img
                                                alt=""
                                                className="h-full w-auto max-w-full object-contain"
                                                src={activeAlbum.images[activeImageIndex] ?? activeAlbum.images[0]}
                                            />
                                            <button
                                                aria-label="Foto sebelumnya"
                                                className="absolute border border-slate-200 left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-950 transition hover:bg-brand-yellow"
                                                onClick={() => moveActiveImage('previous')}
                                                type="button"
                                            >
                                                <ChevronLeft className="size-5" />
                                            </button>
                                            <button
                                                aria-label="Foto berikutnya"
                                                className="absolute border border-slate-200 right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-950 transition hover:bg-brand-yellow"
                                                onClick={() => moveActiveImage('next')}
                                                type="button"
                                            >
                                                <ChevronRight className="size-5" />
                                            </button>
                                        </figure>
                                        <p className="mt-2 text-center">
                                            <span className="text-base font-semibold text-zinc-900">{activeImageIndex + 1}</span>
                                            <span className="text-xs font-normal text-zinc-400">/{activeAlbum.images.length}</span>
                                        </p>
                                        <button
                                            className={`mt-3 flex h-6 w-full items-baseline gap-1 text-left text-sm leading-6 text-zinc-700 transition hover:text-zinc-950 ${
                                                isCaptionExpanded ? 'invisible' : ''
                                            }`}
                                            onClick={() => setIsCaptionExpanded(true)}
                                            type="button"
                                        >
                                            <span className="min-w-0 flex-1 truncate">{collapsedCaptionText}</span>
                                            <span className="shrink-0 font-medium text-blue-600">selengkapnya</span>
                                        </button>
                                        {isCaptionExpanded ? (
                                            <button
                                                className="absolute inset-x-0 bottom-0 bg-white/55 px-4 py-3 text-left text-sm leading-6 text-zinc-800 backdrop-blur transition hover:bg-white/65"
                                                onClick={() => setIsCaptionExpanded(false)}
                                                type="button"
                                            >
                                                {captionText}
                                            </button>
                                        ) : null}
                                    </div>

                                    <div className="min-w-0 shrink-0 overflow-hidden lg:max-h-140 lg:w-80 lg:overflow-y-auto lg:pr-1">
                                        <div
                                            className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
                                            ref={thumbnailStripRef}
                                        >
                                            {activeAlbum.images.map((image, index) => (
                                                <button
                                                    aria-label={`Buka foto ${index + 1}`}
                                                    className={`aspect-square w-20 shrink-0 overflow-hidden rounded-lg transition lg:w-auto ${
                                                        activeImageIndex === index
                                                            ? 'scale-100 border-4 border-brand-yellow'
                                                            : 'scale-90 border border-zinc-200 opacity-55 hover:scale-95 hover:border-zinc-500 hover:opacity-100'
                                                    }`}
                                                    data-active-thumbnail={activeImageIndex === index}
                                                    key={`${activeAlbum.slug}-${index}`}
                                                    onClick={() => {
                                                        setActiveImageIndex(index);
                                                        setIsCaptionExpanded(false);
                                                    }}
                                                    type="button"
                                                >
                                                    <img alt="" className="h-full w-full object-cover" src={image} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                ) : null}
            </main>
        </PublicLayout>
    );
}

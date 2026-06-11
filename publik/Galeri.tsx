import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Search, X } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { Head } from './runtime/inertia-shim';
import { API_BASE_URL } from './lib/config';

type GalleryAlbum = {
    id?: number;
    count: number;
    date: string;
    description: string;
    images: string[];
    kind: 'group' | 'single';
    place: string;
    slug: string;
    title: string;
    contributor?: string;
};

const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('/storage/')) {
        return `${API_BASE_URL}${path}`;
    }
    return path;
};

function GalleryImage({ src, className, alt = "", opacityClass = "" }: { src: string; className?: string; alt?: string; opacityClass?: string }) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`flex items-center justify-center bg-zinc-100 text-zinc-400 w-full h-full min-h-[150px] ${className}`}>
                <ImageIcon className="size-8" />
            </div>
        );
    }

    return (
        <img
            alt={alt}
            className={`${className} ${opacityClass}`}
            onError={() => setError(true)}
            src={src}
            loading="lazy"
        />
    );
}

const formatDate = (dateStr: string) => {
    try {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(dateStr));
    } catch (e) {
        return dateStr;
    }
};

const mapApiToAlbum = (item: any): GalleryAlbum => {
    const rawImages = Array.isArray(item.file_path) ? item.file_path : [];
    const images = rawImages.map(getImageUrl);
    
    let rantingName = item.penulis?.keanggotaan?.ranting?.nama;
    
    // Pencocokan hardcode kata kunci Ranting dari judul/keterangan
    const titleLower = (item.judul || '').toLowerCase();
    const descLower = (item.keterangan || '').toLowerCase();
    
    if (titleLower.includes('tigaraksa') || descLower.includes('tigaraksa')) {
        rantingName = 'Tigaraksa';
    } else if (titleLower.includes('cikupa') || descLower.includes('cikupa')) {
        rantingName = 'Cikupa';
    } else if (titleLower.includes('balaraja') || descLower.includes('balaraja')) {
        rantingName = 'Balaraja';
    } else if (titleLower.includes('curug') || descLower.includes('curug')) {
        rantingName = 'Curug';
    } else if (titleLower.includes('panongan') || descLower.includes('panongan')) {
        rantingName = 'Panongan';
    }

    const displayRanting = rantingName 
        ? (rantingName.toLowerCase().startsWith('ranting') ? rantingName : `Ranting ${rantingName}`)
        : 'PSHT Cabang Kabupaten Tangerang';

    const contributorName = item.penulis?.name || 'Admin';

    return {
        id: item.id,
        count: images.length,
        date: formatDate(item.created_at),
        description: item.keterangan || '',
        images: images.length > 0 ? images : ['/img/logo-psht.webp'],
        kind: images.length > 1 ? 'group' : 'single',
        place: displayRanting,
        slug: `album-${item.id}`,
        title: item.judul || '',
        contributor: contributorName,
    };
};

const cardHeights = ['h-76', 'h-88', 'h-80', 'h-72', 'h-92', 'h-78', 'h-84'];
const trimDescription = (description: string) => description.slice(0, 500);
const trimCollapsedDescription = (description: string) => description.slice(0, 120);

export default function Galeri() {
    const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
    const thumbnailStripRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/galeri?per_page=100`)
            .then((res) => res.json())
            .then((resData) => {
                const rawData = resData.data || [];
                const mapped = rawData.map(mapApiToAlbum);
                setAlbums(mapped);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const displayedAlbums = useMemo(() => {
        const singleAlbums = albums.filter((album) => album.kind === 'single');
        const groupAlbums = albums.filter((album) => album.kind === 'group');
        return Array.from({ length: Math.max(singleAlbums.length, groupAlbums.length) })
            .flatMap((_, index) => [groupAlbums[index], singleAlbums[index]])
            .filter((album): album is GalleryAlbum => Boolean(album));
    }, [albums]);

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
                            <h1 className="text-2xl font-bold leading-tight text-zinc-800 sm:text-4xl">Galeri</h1>

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

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <span className="text-zinc-500 italic text-sm">Memuat galeri foto...</span>
                            </div>
                        ) : searchableAlbums.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <span className="text-zinc-500 italic text-sm">Tidak ada galeri foto ditemukan.</span>
                            </div>
                        ) : (
                            <div className="columns-1 gap-6 sm:columns-2 lg:columns-4 lg:gap-8">
                                {searchableAlbums.map((album, index) => {
                                    const heightClass = cardHeights[index % cardHeights.length];
                                    const stackCount = album.kind === 'group' ? Math.min(album.images.length, 3) : 1;

                                    return (
                                        <button
                                            className="group mb-8 cursor-pointer block w-full break-inside-avoid px-1 pb-6 pt-1 text-left sm:px-2"
                                            key={album.slug}
                                            onClick={() => openAlbum(album)}
                                            type="button"
                                        >
                                            <article className="relative">
                                                {album.kind === 'group' ? (
                                                    <div className="absolute inset-0 -translate-x-2 translate-y-3 -rotate-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 transition group-hover:-translate-x-3 group-hover:translate-y-4 group-hover:-rotate-6">
                                                        <GalleryImage className="h-full w-full object-cover" opacityClass="opacity-75" src={album.images[1] ?? album.images[0]} />
                                                    </div>
                                                ) : null}
                                                {album.kind === 'group' && stackCount > 2 ? (
                                                    <div className="absolute inset-0 translate-x-3 translate-y-5 rotate-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 transition group-hover:translate-x-4 group-hover:translate-y-6 group-hover:rotate-6">
                                                        <GalleryImage className="h-full w-full object-cover" opacityClass="opacity-65" src={album.images[2] ?? album.images[1] ?? album.images[0]} />
                                                    </div>
                                                ) : null}
                                                <div className={`relative ${heightClass} overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 transition group-hover:border-brand-yellow group-hover:shadow-xl group-hover:-rotate-2`}>
                                                    <GalleryImage className="h-full w-full object-cover" opacityClass="opacity-90 transition duration-500" src={album.images[0]} />
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
                        )}
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
                            className="fixed cursor-pointer right-4 top-4 z-10 inline-flex text-zinc-950 transition hover:text-brand-yellow-dark"
                            onClick={closeAlbum}
                            type="button"
                        >
                            <X className="size-7" />
                        </button>

                        <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                            <div className="w-full shrink-0 text-left">
                                <p className="text-xs text-zinc-500">{activeAlbum.date} | Mas {activeAlbum.contributor} - {activeAlbum.place}</p>
                                <h2 className="mt-3 text-xl font-bold leading-tight sm:text-3xl">{activeAlbum.title}</h2>
                            </div>

                            {activeAlbum.kind === 'single' ? (
                                <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-4 sm:py-5">
                                    <figure className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-xl">
                                        <GalleryImage
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
                                        <span className="cursor-pointer shrink-0 font-medium text-blue-600">selengkapnya</span>
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
                                            <GalleryImage
                                                className="h-full w-auto max-w-full object-contain"
                                                src={activeAlbum.images[activeImageIndex] ?? activeAlbum.images[0]}
                                            />
                                            <button
                                                aria-label="Foto sebelumnya"
                                                className="absolute cursor-pointer border border-slate-200 left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-950 transition hover:bg-brand-yellow"
                                                onClick={() => moveActiveImage('previous')}
                                                type="button"
                                            >
                                                <ChevronLeft className="size-5" />
                                            </button>
                                            <button
                                                aria-label="Foto berikutnya"
                                                className="absolute cursor-pointer border border-slate-200 right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-zinc-950 transition hover:bg-brand-yellow"
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
                                            <span className="cursor-pointer shrink-0 font-medium text-blue-600">selengkapnya</span>
                                        </button>
                                        {isCaptionExpanded ? (
                                            <button
                                                className="cursor-pointer absolute inset-x-0 bottom-0 bg-white/55 px-4 py-3 text-left text-sm leading-6 text-zinc-800 backdrop-blur transition hover:bg-white/65"
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
                                                    <GalleryImage className="h-full w-full object-cover" src={image} />
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

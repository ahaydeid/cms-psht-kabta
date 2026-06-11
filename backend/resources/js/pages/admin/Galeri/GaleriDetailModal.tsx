import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type GaleriRecord = {
    id: number;
    judul: string;
    file_path: string[];
    keterangan?: string | null;
    status: 'active' | 'inactive';
    penulis?: {
        name: string;
        keanggotaan?: {
            ranting?: {
                id: number;
                nama: string;
            } | null;
        } | null;
    } | null;
    created_at: string;
};

type Props = {
    galeri: GaleriRecord | null;
    onClose: () => void;
};

export function GaleriDetailModal({ galeri, onClose }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
    const thumbnailStripRef = useRef<HTMLDivElement>(null);

    const images = galeri?.file_path ?? [];

    const moveImage = (direction: 'next' | 'previous') => {
        setActiveIndex((cur) => {
            const step = direction === 'next' ? 1 : -1;
            return (cur + step + images.length) % images.length;
        });
        setIsCaptionExpanded(false);
    };

    // Reset state saat galeri berubah
    useEffect(() => {
        setActiveIndex(0);
        setIsCaptionExpanded(false);
    }, [galeri?.id]);

    // Keyboard navigation + scroll lock
    useEffect(() => {
        if (!galeri) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') moveImage('next');
            if (e.key === 'ArrowLeft') moveImage('previous');
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [galeri, activeIndex]);

    // Scroll active thumbnail into view
    useEffect(() => {
        const activeThumbnail = thumbnailStripRef.current?.querySelector<HTMLElement>(
            '[data-active-thumbnail="true"]',
        );
        activeThumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, [activeIndex]);

    if (!galeri) return null;

    const keterangan = galeri.keterangan ?? '';
    const collapsedCaption = keterangan.length > 120 ? keterangan.slice(0, 120) + '…' : keterangan;
    const tanggal = new Date(galeri.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const ranting = galeri.penulis?.keanggotaan?.ranting?.nama;
    const penulis = galeri.penulis?.name;
    const place = [penulis, ranting].filter(Boolean).join(' · ');

    return (
        <section
            aria-modal="true"
            className="fixed inset-0 z-50 h-svh overflow-hidden bg-white text-zinc-950"
            role="dialog"
        >
            {/* Tombol tutup */}
            <button
                aria-label="Tutup galeri"
                className="fixed right-4 top-4 z-10 inline-flex text-zinc-950 transition hover:text-yellow-600"
                onClick={onClose}
                type="button"
            >
                <X className="size-7" />
            </button>

            <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
                {/* Header */}
                <div className="w-full shrink-0 text-left">
                    <p className="text-xs text-zinc-500">{tanggal}{place ? ` | ${place}` : ''}</p>
                    <h2 className="mt-3 text-xl font-bold leading-tight sm:text-3xl">{galeri.judul}</h2>
                </div>

                {images.length === 1 ? (
                    // Single foto
                    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden py-4 sm:py-5">
                        <figure className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-xl">
                            <img
                                alt=""
                                className="h-full w-auto max-w-full object-contain"
                                src={images[0]}
                            />
                        </figure>
                        {keterangan && (
                            <>
                                <button
                                    className={`mt-3 flex h-6 w-full max-w-3xl items-baseline gap-1 text-left text-sm leading-6 text-zinc-700 transition hover:text-zinc-950 ${isCaptionExpanded ? 'invisible' : ''}`}
                                    onClick={() => setIsCaptionExpanded(true)}
                                    type="button"
                                >
                                    <span className="min-w-0 flex-1 truncate">{collapsedCaption}</span>
                                    {keterangan.length > 120 && (
                                        <span className="shrink-0 font-medium text-blue-600">selengkapnya</span>
                                    )}
                                </button>
                                {isCaptionExpanded && (
                                    <button
                                        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl bg-white/55 px-4 py-3 text-left text-sm leading-6 text-zinc-800 backdrop-blur transition hover:bg-white/65"
                                        onClick={() => setIsCaptionExpanded(false)}
                                        type="button"
                                    >
                                        {keterangan}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    // Multi foto — main image + thumbnail strip
                    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden py-4 sm:gap-5 sm:py-5 lg:flex-row lg:items-stretch">
                        {/* Main image */}
                        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
                            <figure className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-xl">
                                <img
                                    alt=""
                                    className="h-full w-auto max-w-full object-contain"
                                    src={images[activeIndex] ?? images[0]}
                                />
                                <button
                                    aria-label="Foto sebelumnya"
                                    className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-zinc-950 transition hover:bg-yellow-400"
                                    onClick={() => moveImage('previous')}
                                    type="button"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>
                                <button
                                    aria-label="Foto berikutnya"
                                    className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-zinc-950 transition hover:bg-yellow-400"
                                    onClick={() => moveImage('next')}
                                    type="button"
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                            </figure>

                            {/* Counter */}
                            <p className="mt-2 text-center">
                                <span className="text-base font-semibold text-zinc-900">{activeIndex + 1}</span>
                                <span className="text-xs font-normal text-zinc-400">/{images.length}</span>
                            </p>

                            {/* Caption */}
                            {keterangan && (
                                <>
                                    <button
                                        className={`mt-3 flex h-6 w-full items-baseline gap-1 text-left text-sm leading-6 text-zinc-700 transition hover:text-zinc-950 ${isCaptionExpanded ? 'invisible' : ''}`}
                                        onClick={() => setIsCaptionExpanded(true)}
                                        type="button"
                                    >
                                        <span className="min-w-0 flex-1 truncate">{collapsedCaption}</span>
                                        {keterangan.length > 120 && (
                                            <span className="shrink-0 font-medium text-blue-600">selengkapnya</span>
                                        )}
                                    </button>
                                    {isCaptionExpanded && (
                                        <button
                                            className="absolute inset-x-0 bottom-0 bg-white/55 px-4 py-3 text-left text-sm leading-6 text-zinc-800 backdrop-blur transition hover:bg-white/65"
                                            onClick={() => setIsCaptionExpanded(false)}
                                            type="button"
                                        >
                                            {keterangan}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Thumbnail strip */}
                        <div className="min-w-0 shrink-0 overflow-hidden lg:max-h-[560px] lg:w-80 lg:overflow-y-auto lg:pr-1">
                            <div
                                className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
                                ref={thumbnailStripRef}
                            >
                                {images.map((image, index) => (
                                    <button
                                        aria-label={`Buka foto ${index + 1}`}
                                        className={`aspect-square w-20 shrink-0 overflow-hidden rounded-lg transition lg:w-auto ${
                                            activeIndex === index
                                                ? 'scale-100 border-4 border-yellow-400'
                                                : 'scale-90 border border-zinc-200 opacity-55 hover:scale-95 hover:border-zinc-500 hover:opacity-100'
                                        }`}
                                        data-active-thumbnail={activeIndex === index}
                                        key={index}
                                        onClick={() => {
                                            setActiveIndex(index);
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
    );
}

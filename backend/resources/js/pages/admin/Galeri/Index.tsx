import { Head } from '@inertiajs/react';
import { Loader2, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button, Input } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';

type ImagePreview = {
    file: File;
    preview: string;
};

export default function GaleriIndex() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const MAX_IMAGES = 30;
    const MAX_DESC = 500;

    const selectedImagesRef = useRef<ImagePreview[]>([]);
    selectedImagesRef.current = selectedImages;

    useEffect(() => {
        return () => {
            selectedImagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccessMessage(null);
        if (!e.target.files) return;

        const files = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));

        if (selectedImages.length + files.length > MAX_IMAGES) {
            setError(`Maksimal hanya dapat mengunggah ${MAX_IMAGES} foto.`);
            e.target.value = '';
            return;
        }

        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setSelectedImages((prev) => [...prev, ...newImages]);
        e.target.value = '';
    };

    const removeSelectedImage = (index: number) => {
        setSelectedImages((prev) => {
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });
    };

    const handleAction = (status: 'publish' | 'draft') => {
        setError(null);
        setSuccessMessage(null);

        if (!judul.trim()) {
            setError('Judul galeri wajib diisi.');
            return;
        }

        if (selectedImages.length === 0) {
            setError('Pilih minimal 1 gambar.');
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setSuccessMessage(
                status === 'publish'
                    ? 'Galeri berhasil diterbitkan!'
                    : 'Galeri disimpan sebagai draf.'
            );
            setJudul('');
            setDeskripsi('');
            setSelectedImages([]);
        }, 1000);
    };

    const handleReset = () => {
        if (confirm('Batalkan pembuatan galeri?')) {
            setJudul('');
            setDeskripsi('');
            selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
            setSelectedImages([]);
            setError(null);
            setSuccessMessage(null);
        }
    };

    return (
        <AdminLayout>
            <Head title="Buat Galeri" />

            <div className="flex flex-col gap-3">
                {/* Page header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-zinc-900">Buat Galeri</h1>
                    {error && (
                        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
                            {successMessage}
                        </div>
                    )}
                </div>

                {/*
                    Two-column layout.
                    Panel height = 100dvh - topbar(3.5rem/56px) - page padding top+bottom(2rem) - header area(~4rem)
                    = calc(100dvh - 9.5rem)
                */}
                <div
                    className="grid grid-cols-1 gap-3 lg:grid-cols-2"
                    style={{ height: 'calc(100dvh - 9.5rem)' }}
                >
                    {/* === LEFT: Form Inputs === */}
                    <div className="flex flex-col gap-4 overflow-hidden rounded border border-zinc-200 bg-white p-4">
                        <p className="shrink-0 text-sm font-medium text-zinc-500">Informasi Galeri</p>

                        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
                            <Input
                                label="Judul Galeri"
                                placeholder="Tulis judul galeri..."
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                requiredNote="Wajib"
                            />

                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-zinc-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    className="w-full flex-1 resize-none rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                                    placeholder="Tulis keterangan galeri..."
                                    rows={8}
                                    maxLength={MAX_DESC}
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                />
                                <p className="text-right text-xs text-zinc-400">
                                    {deskripsi.length} / {MAX_DESC}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 border-t border-zinc-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2.5">
                            <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
                                Batal
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleAction('draft')}
                                disabled={isSubmitting}
                                icon={isSubmitting ? <Loader2 className="size-4 animate-spin" /> : undefined}
                            >
                                Simpan Draf
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => handleAction('publish')}
                                disabled={isSubmitting}
                                icon={isSubmitting ? <Loader2 className="size-4 animate-spin" /> : undefined}
                            >
                                Terbitkan
                            </Button>
                        </div>
                    </div>

                    {/* === RIGHT: Photo Grid with internal scroll === */}
                    <div className="flex flex-col gap-3 overflow-hidden rounded border border-zinc-200 bg-white p-4">
                        <div className="shrink-0 flex items-center justify-between">
                            <p className="text-sm font-medium text-zinc-500">Foto</p>
                            <span className="text-xs text-zinc-400">{selectedImages.length} / {MAX_IMAGES}</span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Scrollable photo grid */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-4 gap-2">
                                {selectedImages.length < MAX_IMAGES && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group flex aspect-square items-center justify-center rounded border-2 border-dashed border-zinc-300 bg-zinc-50 transition hover:border-yellow-400 hover:bg-yellow-50"
                                    >
                                        <Plus className="size-7 text-zinc-400 transition group-hover:text-yellow-500" />
                                    </button>
                                )}

                                {selectedImages
                                    .map((img, idx) => ({ img, idx }))
                                    .reverse()
                                    .map(({ img, idx }) => (
                                        <div
                                            key={idx}
                                            className="relative aspect-square overflow-hidden rounded border border-zinc-200 bg-zinc-100"
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`preview-${idx}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedImage(idx)}
                                                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>

                            {selectedImages.length === 0 && (
                                <p className="py-4 text-center text-xs text-zinc-400">
                                    Klik tombol <span className="font-semibold text-zinc-500">+</span> untuk memilih foto
                                </p>
                            )}
                        </div>

                        {selectedImages.length > 1 && (
                            <button
                                type="button"
                                onClick={() => {
                                    selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
                                    setSelectedImages([]);
                                }}
                                className="shrink-0 self-end text-xs text-red-500 hover:underline"
                            >
                                Hapus Semua
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

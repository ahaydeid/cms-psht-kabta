import { Head, useForm } from '@inertiajs/react';
import { Loader2, Plus, X, ChevronLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button, Input } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction } from '@/lib/alert';

type ImagePreview = {
    file: File;
    preview: string;
};

type GaleriRecord = {
    id: number;
    judul: string;
    file_path: string[];
    keterangan?: string | null;
    status: 'active' | 'inactive';
};

type FormProps = {
    galeri?: GaleriRecord;
};

export default function GaleriForm({ galeri }: FormProps) {
    const isEdit = !!galeri;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, transform } = useForm({
        _method: isEdit ? ('put' as const) : undefined,
        judul: galeri?.judul ?? '',
        keterangan: galeri?.keterangan ?? '',
        images: [] as File[],
        existing_images: (galeri?.file_path ?? []) as string[],
        status: galeri?.status ?? 'active',
    });

    const [newImages, setNewImages] = useState<ImagePreview[]>([]);

    const MAX_IMAGES = 30;
    const MAX_DESC = 500;

    useEffect(() => {
        return () => {
            newImages.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, [newImages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files).filter((f) => f.type.startsWith('image/'));

        if (data.existing_images.length + newImages.length + files.length > MAX_IMAGES) {
            return;
        }

        const added = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        const updatedNewImages = [...newImages, ...added];
        setNewImages(updatedNewImages);
        setData('images', updatedNewImages.map((img) => img.file));
    };

    const removeExistingImage = (idx: number) => {
        const updated = [...data.existing_images];
        updated.splice(idx, 1);
        setData('existing_images', updated);
    };

    const removeNewImage = (idx: number) => {
        const updated = [...newImages];
        URL.revokeObjectURL(updated[idx].preview);
        updated.splice(idx, 1);
        setNewImages(updated);
        setData('images', updated.map((img) => img.file));
    };

    const submitForm = (status: 'active' | 'inactive') => {
        transform((data) => ({
            ...data,
            status,
        }));

        const submitUrl = isEdit ? `/admin/galeri/${galeri.id}` : '/admin/galeri';

        post(submitUrl, {
            forceFormData: true,
        });
    };

    const handleCancel = async () => {
        const result = await confirmAction({
            title: isEdit ? 'Batalkan perubahan galeri?' : 'Batalkan pembuatan galeri?',
            text: 'Informasi dan foto yang sudah diunggah akan dibuang.',
            confirmButtonText: 'Ya, batalkan',
            cancelButtonText: 'Kembali',
            variant: 'danger',
        });

        if (result.isConfirmed) {
            window.location.href = '/admin/galeri';
        }
    };

    const totalImageCount = data.existing_images.length + newImages.length;

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Galeri' : 'Buat Galeri'} />

            <div className="flex h-auto pb-20 flex-col gap-3 lg:h-[calc(100dvh-5.5rem)] lg:overflow-hidden lg:pb-0">
                {/* Page header */}
                <div className="flex items-center gap-1.5 -ml-1">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center p-1 rounded-md text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition"
                        title="Kembali ke Daftar"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        {isEdit ? 'Edit Galeri' : 'Buat Galeri'}
                    </h1>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {Object.values(errors)[0]}
                    </div>
                )}

                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
                    {/* === LEFT: Form Inputs === */}
                    <div className="flex flex-col gap-4 rounded border border-zinc-200 bg-white p-4 lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-hidden">
                        <p className="shrink-0 text-sm font-medium text-zinc-500">Informasi Galeri</p>

                        <div className="flex flex-col gap-4 lg:flex-1 lg:overflow-y-auto lg:min-h-0">
                            <Input
                                label="Judul Galeri"
                                placeholder="Tulis judul galeri..."
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                error={errors.judul}
                                requiredNote="Wajib"
                            />

                            <div className="flex flex-col space-y-1.5 lg:flex-1 lg:min-h-0">
                                <label className="block text-xs font-semibold text-zinc-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    className="w-full resize-none rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 min-h-[12rem] lg:flex-1"
                                    placeholder="Tulis keterangan galeri..."
                                    maxLength={MAX_DESC}
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                />
                                <p className="text-right text-xs text-zinc-400">
                                    {data.keterangan.length} / {MAX_DESC}
                                </p>
                                {errors.keterangan && <p className="text-xs text-red-600 mt-1">{errors.keterangan}</p>}
                            </div>
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 bg-white p-4 flex gap-2 justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] lg:static lg:border-t lg:border-zinc-100 lg:p-0 lg:shadow-none lg:bg-transparent lg:flex lg:flex-row lg:justify-end lg:gap-2.5 lg:pt-4 lg:shrink-0">
                            <Button
                                type="button"
                                variant="secondary"
                                className="flex-1 lg:flex-none lg:w-auto"
                                onClick={() => submitForm('inactive')}
                                disabled={processing}
                                icon={processing && data.status === 'inactive' ? <Loader2 className="size-4 animate-spin" /> : undefined}
                            >
                                Draft
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                className="flex-1 lg:flex-none lg:w-auto"
                                onClick={() => submitForm('active')}
                                disabled={processing}
                                icon={processing && data.status === 'active' ? <Loader2 className="size-4 animate-spin" /> : undefined}
                            >
                                Terbitkan
                            </Button>
                        </div>
                    </div>

                    {/* === RIGHT: Photo Grid with internal scroll === */}
                    <div className="flex flex-col gap-3 rounded border border-zinc-200 bg-white p-4 lg:h-full lg:min-h-0 lg:flex-1 lg:overflow-hidden">
                        <div className="shrink-0 flex items-center justify-between">
                            <p className="text-sm font-medium text-zinc-500">Foto</p>
                            <span className="text-xs text-zinc-400">{totalImageCount} / {MAX_IMAGES}</span>
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
                        <div className="lg:flex-1 lg:overflow-y-auto">
                            <div className="grid grid-cols-4 gap-2">
                                {totalImageCount < MAX_IMAGES && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group flex aspect-square items-center justify-center rounded border-2 border-dashed border-zinc-300 bg-zinc-50 transition hover:border-yellow-400 hover:bg-yellow-50"
                                    >
                                        <Plus className="size-7 text-zinc-400 transition group-hover:text-yellow-500" />
                                    </button>
                                )}

                                {/* Render new images */}
                                {newImages.slice().reverse().map((img, revIdx) => {
                                    const idx = newImages.length - 1 - revIdx;
                                    return (
                                        <div
                                            key={`new-${idx}`}
                                            className="relative aspect-square overflow-hidden rounded border border-zinc-200 bg-zinc-100"
                                        >
                                            <img
                                                src={img.preview}
                                                alt={`preview-new-${idx}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(idx)}
                                                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    );
                                })}

                                {/* Render existing images */}
                                {data.existing_images.slice().reverse().map((url, revIdx) => {
                                    const idx = data.existing_images.length - 1 - revIdx;
                                    return (
                                        <div
                                            key={`existing-${idx}`}
                                            className="relative aspect-square overflow-hidden rounded border border-zinc-200 bg-zinc-100"
                                        >
                                            <img
                                                src={url}
                                                alt={`preview-existing-${idx}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {totalImageCount === 0 && (
                                <p className="py-4 text-center text-xs text-zinc-400">
                                    Klik tombol <span className="font-semibold text-zinc-500">+</span> untuk memilih foto
                                </p>
                            )}
                        </div>

                        {totalImageCount > 1 && (
                            <button
                                type="button"
                                onClick={() => {
                                    newImages.forEach((img) => URL.revokeObjectURL(img.preview));
                                    setNewImages([]);
                                    setData({
                                        ...data,
                                        images: [],
                                        existing_images: [],
                                    });
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

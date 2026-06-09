import { Head, useForm } from '@inertiajs/react';
import { Loader2, Save, Send, Upload, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

import { Button, Input } from '@/Components/ui';
import { RichTextEditor } from '@/Components/Editor/RichTextEditor';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction } from '@/lib/alert';

const fallbackCategories = ['Kegiatan', 'Pengumuman', 'Prestasi', 'Organisasi', 'Opini', 'Lainnya'];

type BeritaRecord = {
    id: number;
    judul: string;
    kategori?: string | null;
    gambar?: string | null;
    isi: string;
    status: 'draft' | 'published';
};

type FormProps = {
    berita?: BeritaRecord;
};

export default function BeritaForm({ berita }: FormProps) {
    const isEdit = !!berita;

    const { data, setData, post, processing, errors, transform } = useForm({
        _method: isEdit ? ('put' as const) : undefined,
        judul: berita?.judul ?? '',
        kategori: berita?.kategori ?? fallbackCategories[0],
        gambar: null as File | string | null,
        isi: berita?.isi ?? '',
        status: berita?.status ?? 'draft',
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(berita?.gambar ?? null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('gambar', file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(berita?.gambar ?? null);
        }
    };

    const submitForm = (status: 'draft' | 'published') => {
        transform((data) => ({
            ...data,
            status,
        }));

        const submitUrl = isEdit ? `/admin/berita/${berita.id}` : '/admin/berita';

        post(submitUrl, {
            forceFormData: true,
        });
    };

    const handleCancel = async () => {
        const result = await confirmAction({
            title: isEdit ? 'Batalkan perubahan berita?' : 'Batalkan pembuatan berita?',
            text: 'Perubahan yang belum disimpan akan dibuang.',
            confirmButtonText: 'Ya, batalkan',
            cancelButtonText: 'Kembali',
            variant: 'danger',
        });

        if (result.isConfirmed) {
            window.location.href = '/admin/berita';
        }
    };

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Berita' : 'Buat Berita'} />

            <div className="space-y-4">
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
                        {isEdit ? 'Edit Berita' : 'Buat Berita'}
                    </h1>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {Object.values(errors)[0]}
                    </div>
                )}

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <Input
                        label="Judul Berita"
                        placeholder="Tulis judul berita..."
                        value={data.judul}
                        onChange={(e) => setData('judul', e.target.value)}
                        error={errors.judul}
                        requiredNote="*wajib"
                    />

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <label className="block space-y-1.5">
                            <span className="block text-xs font-semibold text-zinc-700">Kategori</span>
                            <select
                                className="w-full rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                            >
                                {fallbackCategories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori && <p className="text-xs text-red-600 mt-1">{errors.kategori}</p>}
                        </label>

                        <label className="block space-y-1.5">
                            <span className="block text-xs font-semibold text-zinc-700">Gambar Utama</span>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 rounded border border-zinc-200 bg-white px-4 py-2.5">
                                    <Upload className="size-4 shrink-0 text-zinc-400" />
                                    <input
                                        accept="image/*"
                                        className="w-full text-sm text-zinc-700 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                {previewUrl && (
                                    <div className="mt-1">
                                        <img
                                            src={previewUrl}
                                            alt="Preview Gambar Utama"
                                            className="max-h-48 rounded-lg object-cover border border-zinc-200 shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>
                            {errors.gambar && <p className="text-xs text-red-600 mt-1">{errors.gambar}</p>}
                        </label>
                    </div>

                    <section className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <label className="text-xs font-semibold text-zinc-500">Isi</label>
                        </div>

                        <div>
                            <RichTextEditor
                                content={data.isi}
                                onChange={(val) => setData('isi', val)}
                                placeholder="Tulis berita di sini"
                                className="min-h-[400px]"
                                footerActions={
                                    <>
                                        <Button
                                            variant="secondary"
                                            size="md"
                                            icon={processing && data.status === 'draft' ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                            onClick={() => submitForm('draft')}
                                            disabled={processing}
                                        >
                                            Simpan Draf
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="md"
                                            icon={processing && data.status === 'published' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                                            onClick={() => submitForm('published')}
                                            disabled={processing}
                                        >
                                            Terbitkan
                                        </Button>
                                    </>
                                }
                            />
                        </div>
                        {errors.isi && <p className="text-xs text-red-600 mt-1">{errors.isi}</p>}
                    </section>

                    <div className="flex flex-row gap-3 justify-end pt-4 border-t border-zinc-200">
                        <Button
                            variant="secondary"
                            size="md"
                            className="w-1/2 sm:w-auto"
                            icon={processing && data.status === 'draft' ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            onClick={() => submitForm('draft')}
                            disabled={processing}
                        >
                            Simpan Draf
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            className="w-1/2 sm:w-auto"
                            icon={processing && data.status === 'published' ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                            onClick={() => submitForm('published')}
                            disabled={processing}
                        >
                            Terbitkan
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

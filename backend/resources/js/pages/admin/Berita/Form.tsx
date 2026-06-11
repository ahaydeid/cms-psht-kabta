import { Head, router } from '@inertiajs/react';
import { Loader2, Save, Send, Upload, ChevronLeft, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button, Input } from '@/Components/ui';
import { RichTextEditor } from '@/Components/Editor/RichTextEditor';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';

const DEFAULT_CATEGORIES = ['Kegiatan', 'Pengumuman', 'Prestasi', 'Organisasi', 'Opini', 'Lainnya'];

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [judul, setJudul] = useState(berita?.judul ?? '');
    const [kategori, setKategori] = useState(berita?.kategori ?? DEFAULT_CATEGORIES[0]);
    const [isi, setIsi] = useState(berita?.isi ?? '');
    const [gambarFile, setGambarFile] = useState<File | null>(null);
    // keeps track of the original server image URL (separate from new upload)
    const [existingGambar, setExistingGambar] = useState<string | null>(berita?.gambar ?? null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(berita?.gambar ?? null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setGambarFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setExistingGambar(null);
        }
    };

    const removeCover = () => {
        setGambarFile(null);
        setPreviewUrl(null);
        setExistingGambar(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submitForm = async (status: 'draft' | 'published') => {
        if (!judul.trim()) {
            setErrors({ judul: 'Judul berita wajib diisi.' });
            return;
        }
        if (!isi.trim() || isi === '<p></p>') {
            setErrors({ isi: 'Isi berita wajib diisi.' });
            return;
        }
        setErrors({});

        const confirmed = await confirmAction({
            title: status === 'published'
                ? (isEdit ? 'Perbarui & terbitkan berita?' : 'Terbitkan berita ini?')
                : (isEdit ? 'Simpan perubahan sebagai draf?' : 'Simpan sebagai draf?'),
            text: status === 'published'
                ? 'Berita akan dipublikasikan dan dapat dilihat oleh publik.'
                : 'Berita akan disimpan sebagai draf dan belum dapat dilihat publik.',
            confirmButtonText: status === 'published' ? 'Ya, terbitkan' : 'Ya, simpan draf',
            cancelButtonText: 'Periksa lagi',
            variant: status === 'published' ? 'primary' : undefined,
        });

        if (!confirmed.isConfirmed) return;

        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('kategori', kategori);
        formData.append('isi', isi);
        formData.append('status', status);

        if (gambarFile) {
            formData.append('gambar', gambarFile);
        } else if (existingGambar) {
            formData.append('gambar_existing', existingGambar);
        }
        // if both are null, server will set gambar = null (image removed)

        if (isEdit) {
            formData.append('_method', 'PUT');
        }

        setProcessing(true);

        router.post(
            isEdit ? `/admin/berita/${berita.id}` : '/admin/berita',
            formData,
            {
                forceFormData: true,
                onSuccess: () => {
                    showToast({
                        title: status === 'published'
                            ? 'Berita berhasil diterbitkan.'
                            : 'Berita berhasil disimpan sebagai draf.',
                    });
                },
                onError: (errs) => {
                    setErrors(errs as Record<string, string>);
                    showToast({ title: 'Gagal menyimpan berita. Periksa kembali isian.', icon: 'error' });
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleCancel = async () => {
        const hasInputs = !isEdit && (
            judul.trim() !== '' ||
            gambarFile !== null ||
            (isi && isi.trim() !== '' && isi !== '<p></p>') ||
            kategori !== DEFAULT_CATEGORIES[0]
        );

        if (!isEdit && !hasInputs) {
            window.location.href = '/admin/berita';
            return;
        }

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

    const submitButtons = (
        <>
            <Button
                variant="secondary"
                size="md"
                icon={processing ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                onClick={() => submitForm('draft')}
                disabled={processing}
            >
                Simpan Draf
            </Button>
            <Button
                variant="primary"
                size="md"
                icon={processing ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                onClick={() => submitForm('published')}
                disabled={processing}
            >
                Terbitkan
            </Button>
        </>
    );

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Berita' : 'Buat Berita'} />

            <div className="space-y-4">
                {/* Header */}
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

                {/* Server errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {Object.values(errors)[0]}
                    </div>
                )}

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    {/* Judul */}
                    <Input
                        label="Judul Berita"
                        placeholder="Tulis judul berita..."
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        error={errors.judul}
                        requiredNote="*wajib"
                    />

                    {/* Kategori + Gambar Utama */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {/* Kategori */}
                        <label className="block space-y-1.5">
                            <span className="block text-xs font-semibold text-zinc-700">Kategori</span>
                            <select
                                className="w-full rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                                value={kategori}
                                onChange={(e) => setKategori(e.target.value)}
                            >
                                {DEFAULT_CATEGORIES.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori && <p className="text-xs text-red-600 mt-1">{errors.kategori}</p>}
                        </label>

                        {/* Gambar Utama (sampul) */}
                        <div className="space-y-1.5">
                            <span className="block text-xs font-semibold text-zinc-700">Gambar Utama</span>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 rounded border border-zinc-200 bg-white px-4 py-2.5">
                                    <Upload className="size-4 shrink-0 text-zinc-400" />
                                    <input
                                        ref={fileInputRef}
                                        accept="image/*"
                                        className="w-full text-sm text-zinc-700 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                {previewUrl && (
                                    <div className="relative mt-1 inline-block">
                                        <img
                                            src={previewUrl}
                                            alt="Preview Gambar Utama"
                                            className="max-h-48 rounded-lg object-cover border border-zinc-200 shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeCover}
                                            className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-600"
                                            title="Hapus gambar sampul"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {errors.gambar && <p className="text-xs text-red-600 mt-1">{errors.gambar}</p>}
                        </div>
                    </div>

                    {/* Isi / RichTextEditor */}
                    <section className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500">
                            Isi Berita <span className="text-red-500">*</span>
                        </label>

                        <RichTextEditor
                            content={isi}
                            onChange={setIsi}
                            placeholder="Tulis isi berita di sini..."
                            className="min-h-[400px]"
                            footerActions={submitButtons}
                        />
                        {errors.isi && <p className="text-xs text-red-600 mt-1">{errors.isi}</p>}
                    </section>

                    {/* Footer actions — duplikasi disengaja agar tetap terlihat di luar fullscreen mode */}
                    <div className="flex flex-row gap-3 justify-end pt-4 border-t border-zinc-200">
                        {submitButtons}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

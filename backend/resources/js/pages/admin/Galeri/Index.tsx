import { Head } from '@inertiajs/react';
import { Image as ImageIcon, Loader2, Send, Save, UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button, Input } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';

export default function GaleriIndex() {
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string; name: string; size: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Clean up previews on unmount
    useEffect(() => {
        return () => {
            selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, [selectedImages]);

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccessMessage(null);
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        
        if (selectedImages.length + files.length > 30) {
            setError('Maksimal hanya dapat mengunggah 30 foto dalam sekali upload.');
            return;
        }

        const newImages = files.map((file) => ({
            file,
            name: file.name,
            size: formatBytes(file.size),
            preview: URL.createObjectURL(file),
        }));

        setSelectedImages((prev) => [...prev, ...newImages]);
    };

    const removeSelectedImage = (index: number) => {
        setSelectedImages((prev) => {
            const next = [...prev];
            URL.revokeObjectURL(next[index].preview);
            next.splice(index, 1);
            return next;
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        if (!e.dataTransfer.files) return;

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length === 0) {
            setError('Harap jatuhkan file gambar saja.');
            return;
        }

        if (selectedImages.length + imageFiles.length > 30) {
            setError('Maksimal hanya dapat mengunggah 30 foto dalam sekali upload.');
            return;
        }

        const newImages = imageFiles.map((file) => ({
            file,
            name: file.name,
            size: formatBytes(file.size),
            preview: URL.createObjectURL(file),
        }));

        setSelectedImages((prev) => [...prev, ...newImages]);
    };

    const handleAction = (status: 'publish' | 'draft') => {
        setError(null);
        setSuccessMessage(null);

        if (!judul.trim()) {
            setError('Judul galeri wajib diisi.');
            return;
        }

        if (selectedImages.length === 0) {
            setError('Minimal pilih 1 gambar untuk diunggah.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API request
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccessMessage(
                status === 'publish'
                    ? 'Konten galeri berhasil diterbitkan!'
                    : 'Galeri berhasil disimpan sebagai draf.'
            );
            // Reset form
            setJudul('');
            setDeskripsi('');
            setSelectedImages([]);
        }, 1200);
    };

    return (
        <AdminLayout>
            <Head title="Buat Galeri Baru" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col gap-1 border-b border-zinc-100 pb-4">
                    <h1 className="text-2xl font-bold text-zinc-950">Buat Galeri Baru</h1>
                    <p className="text-sm text-zinc-500">
                        Unggah foto dokumentasi kegiatan organisasi untuk dipublikasikan ke halaman galeri.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                        {successMessage}
                    </div>
                )}

                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-6">
                    {/* Section 1: Metadata */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider">
                            Informasi Galeri
                        </h2>

                        <Input
                            label="Judul Galeri"
                            placeholder="Contoh: Latihan Bersama Cabang PSHT Kabta 2026"
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                            requiredNote="Wajib"
                        />

                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-zinc-700">
                                Deskripsi / Keterangan Galeri
                            </label>
                            <textarea
                                className="w-full rounded border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:ring-1 focus:ring-yellow-400/30 min-h-[120px]"
                                placeholder="Tuliskan keterangan detail mengenai kegiatan ini (waktu, lokasi, tujuan, dll)..."
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="border-t border-zinc-100 my-6" />

                    {/* Section 2: Image Upload */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-sm font-semibold text-zinc-800 uppercase tracking-wider">
                                    Media Galeri
                                </h2>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    Jatuhkan file foto Anda di sini. Maksimal 30 gambar dalam sekali unggah.
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-zinc-500">
                                {selectedImages.length} / 30 Gambar
                            </span>
                        </div>

                        {/* Drag & Drop Area */}
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-zinc-200 hover:border-yellow-400/50 rounded-xl p-10 text-center cursor-pointer transition bg-zinc-50/50 hover:bg-yellow-50/5 relative"
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <UploadCloud className="size-12 text-zinc-400 mx-auto mb-3" />
                            <p className="text-sm font-medium text-zinc-700">
                                Seret & jatuhkan gambar Anda di sini, atau <span className="text-yellow-600 hover:underline">pilih file</span>
                            </p>
                            <p className="text-xs text-zinc-400 mt-1.5">
                                Hanya mendukung file gambar (.png, .jpg, .jpeg)
                            </p>
                        </div>

                        {/* Image Previews Grid */}
                        {selectedImages.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-zinc-500">Daftar Preview Gambar</span>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedImages([])}
                                        className="text-red-500 hover:underline font-medium"
                                    >
                                        Hapus Semua
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 border border-zinc-150 rounded-xl bg-zinc-50 max-h-[350px] overflow-y-auto">
                                    {selectedImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 group bg-white shadow-sm">
                                            <img
                                                src={img.preview}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Hover overlay for details and action */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedImage(idx)}
                                                    className="self-end bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition shadow"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                                <div className="text-[10px] text-white truncate font-medium">
                                                    <p className="truncate" title={img.name}>{img.name}</p>
                                                    <p className="text-zinc-300">{img.size}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-zinc-100 my-6" />

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (confirm('Apakah Anda yakin ingin membatalkan? Semua input akan hilang.')) {
                                    setJudul('');
                                    setDeskripsi('');
                                    setSelectedImages([]);
                                    setError(null);
                                    setSuccessMessage(null);
                                }
                            }}
                            disabled={isSubmitting}
                            className="font-medium"
                        >
                            Batal
                        </Button>
                        
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleAction('draft')}
                            disabled={isSubmitting}
                            icon={isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            className="font-medium"
                        >
                            Simpan Draf
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => handleAction('publish')}
                            disabled={isSubmitting}
                            icon={isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                            className="font-medium"
                        >
                            Terbitkan Konten
                        </Button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

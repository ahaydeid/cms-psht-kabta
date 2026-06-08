import { Head } from '@inertiajs/react';
import { Loader2, Send, Save, UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button, Input } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';

type ImagePreview = {
    file: File;
    preview: string;
    name: string;
    size: string;
};

export default function GaleriIndex() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
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
            setError('Maksimal hanya dapat mengunggah 30 foto.');
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
            setError('Harap pilih file gambar.');
            return;
        }

        if (selectedImages.length + imageFiles.length > 30) {
            setError('Maksimal hanya dapat mengunggah 30 foto.');
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

    return (
        <AdminLayout>
            <Head title="Buat Galeri" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-950">Buat Galeri</h1>
                </div>

                {error && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-semibold">
                        {successMessage}
                    </div>
                )}

                <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5">
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
                            className="w-full rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:ring-1 focus:ring-yellow-400/30 min-h-[100px]"
                            placeholder="Tulis keterangan galeri..."
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-medium text-zinc-700">
                            <span>Gambar (Maks. 30)</span>
                            <span className="text-zinc-400">{selectedImages.length} / 30</span>
                        </div>

                        {/* Custom Trigger Dropzone */}
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-zinc-200 hover:border-yellow-400/50 rounded-lg py-8 text-center cursor-pointer transition bg-zinc-50/50 hover:bg-yellow-50/5"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <UploadCloud className="size-8 text-zinc-400 mx-auto mb-2" />
                            <p className="text-xs font-medium text-zinc-700">
                                Seret gambar ke sini atau <span className="text-yellow-600 font-semibold">pilih file</span>
                            </p>
                        </div>
                    </div>

                    {selectedImages.length > 0 && (
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center text-[11px] font-medium text-zinc-400">
                                <span>Preview Gambar</span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedImages([])}
                                    className="text-red-500 hover:underline"
                                >
                                    Hapus Semua
                                </button>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 p-2.5 border border-zinc-150 rounded-lg bg-zinc-50 max-h-[220px] overflow-y-auto">
                                {selectedImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-zinc-200 group bg-white shadow-sm">
                                        <img
                                            src={img.preview}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSelectedImage(idx);
                                                }}
                                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition shadow"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t border-zinc-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (confirm('Batalkan pembuatan galeri?')) {
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
                            icon={isSubmitting ? <Loader2 className="size-4 animate-spin" /> : undefined}
                            className="font-medium"
                        >
                            Simpan Draf
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => handleAction('publish')}
                            disabled={isSubmitting}
                            icon={isSubmitting ? <Loader2 className="size-4 animate-spin" /> : undefined}
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

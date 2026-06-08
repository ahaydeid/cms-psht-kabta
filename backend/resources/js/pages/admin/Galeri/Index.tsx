import { Head } from '@inertiajs/react';
import { Image as ImageIcon, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button, Input } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';

type GalleryItem = {
    id: number;
    judul: string;
    deskripsi: string;
    images: string[];
    penulis: string;
    created_at: string;
};

const mockGalleryItems: GalleryItem[] = [
    {
        id: 1,
        judul: 'Kegiatan Latihan Bersama Cabang',
        deskripsi: 'Dokumentasi kegiatan latihan bersama yang diikuti oleh seluruh ranting di tingkat cabang pada hari Minggu kemarin.',
        images: [
            'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
        ],
        penulis: 'Adi Hidayat',
        created_at: '2026-06-08',
    },
    {
        id: 2,
        judul: 'Bakti Sosial Ranting Ciputat',
        deskripsi: 'Pemberian santunan anak yatim dan pembagian sembako gratis kepada warga sekitar yang membutuhkan.',
        images: [
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400',
        ],
        penulis: 'Slamet Riyadi',
        created_at: '2026-06-07',
    },
];

export default function GaleriIndex() {
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [galleries, setGalleries] = useState<GalleryItem[]>(mockGalleryItems);

    // Clean up previews on unmount
    useEffect(() => {
        return () => {
            selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, [selectedImages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccessMessage(null);
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        
        // Validation: Limit to 30 files total
        if (selectedImages.length + files.length > 30) {
            setError('Maksimal hanya dapat mengunggah 30 foto dalam sekali upload.');
            return;
        }

        const newImages = files.map((file) => ({
            file,
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
        
        // Check file types (only images)
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
            preview: URL.createObjectURL(file),
        }));

        setSelectedImages((prev) => [...prev, ...newImages]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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

        // Simulate upload
        const newItem: GalleryItem = {
            id: Date.now(),
            judul,
            deskripsi,
            images: selectedImages.map((img) => img.preview),
            penulis: 'Administrator',
            created_at: new Date().toISOString().split('T')[0],
        };

        setGalleries((prev) => [newItem, ...prev]);
        setSuccessMessage('Galeri berhasil diunggah!');
        
        // Reset form
        setJudul('');
        setDeskripsi('');
        setSelectedImages([]);
    };

    const handleDeleteGallery = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus galeri ini?')) {
            setGalleries((prev) => prev.filter((item) => item.id !== id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Galeri Foto" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">Galeri Foto</h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Kelola dokumentasi foto kegiatan organisasi.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left: Upload Form */}
                    <div className="lg:col-span-1 bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
                        <h2 className="text-base font-semibold text-zinc-800">Upload Galeri Baru</h2>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
                                {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded text-xs">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Judul Galeri"
                                placeholder="Masukkan judul galeri..."
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                requiredNote="Wajib"
                            />

                            <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-zinc-700">
                                    Deskripsi / Keterangan
                                </label>
                                <textarea
                                    className="w-full rounded border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:ring-1 focus:ring-yellow-400/30 min-h-[100px]"
                                    placeholder="Masukkan penjelasan singkat mengenai galeri ini..."
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                />
                            </div>

                            {/* Drag & Drop Area */}
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-zinc-700">
                                    Unggah Gambar (Maksimal 30 foto)
                                </label>
                                
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className="border-2 border-dashed border-zinc-200 hover:border-yellow-400/50 rounded-lg p-6 text-center cursor-pointer transition bg-zinc-50 hover:bg-yellow-50/5 relative"
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <UploadCloud className="size-8 text-zinc-400 mx-auto mb-2" />
                                    <p className="text-xs font-medium text-zinc-700">
                                        Seret & jatuhkan gambar di sini, atau klik untuk memilih
                                    </p>
                                    <p className="text-[10px] text-zinc-400 mt-1">
                                        Hanya menerima format file gambar (PNG, JPG, JPEG)
                                    </p>
                                </div>
                            </div>

                            {/* Selected Files count & Thumbnails Grid */}
                            {selectedImages.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs text-zinc-500">
                                        <span>{selectedImages.length} dari 30 foto terpilih</span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedImages([])}
                                            className="text-red-500 hover:underline"
                                        >
                                            Hapus Semua
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 border border-zinc-100 rounded-md bg-zinc-50">
                                        {selectedImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded overflow-hidden border border-zinc-200 group bg-white">
                                                <img
                                                    src={img.preview}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeSelectedImage(idx)}
                                                    className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 transition"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full flex justify-center py-2.5 font-medium"
                                icon={<Plus className="size-4" />}
                            >
                                Simpan Galeri
                            </Button>
                        </form>
                    </div>

                    {/* Right: Existing Galleries List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-base font-semibold text-zinc-800">Daftar Galeri Aktif</h2>

                        {galleries.length === 0 ? (
                            <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center text-zinc-500">
                                <ImageIcon className="size-12 text-zinc-300 mx-auto mb-3" />
                                <p className="text-sm">Belum ada galeri yang diunggah.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {galleries.map((item) => (
                                    <div key={item.id} className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between">
                                        <div>
                                            {/* Preview Grid for Gallery Images */}
                                            <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-2 h-36">
                                                {item.images.slice(0, 3).map((imgUrl, imgIdx) => (
                                                    <div key={imgIdx} className="relative h-full rounded overflow-hidden bg-zinc-200">
                                                        <img
                                                            src={imgUrl}
                                                            alt={item.judul}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {imgIdx === 2 && item.images.length > 3 && (
                                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-semibold">
                                                                +{item.images.length - 3} Foto
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {item.images.length === 1 && (
                                                    <div className="col-span-2 h-full bg-zinc-200 rounded flex items-center justify-center text-zinc-400">
                                                        <ImageIcon className="size-8" />
                                                    </div>
                                                )}
                                                {item.images.length === 2 && (
                                                    <div className="col-span-1 h-full bg-zinc-200 rounded flex items-center justify-center text-zinc-400">
                                                        <ImageIcon className="size-8" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 space-y-1.5">
                                                <h3 className="font-semibold text-zinc-800 line-clamp-1">
                                                    {item.judul}
                                                </h3>
                                                <p className="text-xs text-zinc-500 line-clamp-2">
                                                    {item.deskripsi || 'Tidak ada deskripsi.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                                            <div>
                                                <span>Oleh: <b>{item.penulis}</b></span>
                                                <span className="mx-1.5">•</span>
                                                <span>{item.created_at}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteGallery(item.id)}
                                                className="text-red-500 hover:text-red-700 flex items-center gap-1 hover:underline"
                                            >
                                                <Trash2 className="size-3.5" />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

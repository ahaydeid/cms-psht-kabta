import React, { useState, useEffect } from 'react';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { Head } from './runtime/inertia-shim';
import { API_BASE_URL } from './lib/config';

type RantingData = {
    id: number;
    nama: string;
    alamat: string | null;
    ketua: string | null;
    kontak: string | null;
};

type PaginatedResponse = {
    current_page: number;
    data: RantingData[];
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    per_page: number;
};

export default function ProfilRanting() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [rantings, setRantings] = useState<PaginatedResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchRantings = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/v1/ranting?search=${encodeURIComponent(debouncedSearch)}&page=${page}&per_page=10`
                );
                if (!response.ok) {
                    throw new Error('Gagal mengambil data ranting.');
                }
                const data = await response.json();
                setRantings(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Terjadi kesalahan saat memuat data ranting.');
            } finally {
                setLoading(false);
            }
        };

        fetchRantings();
    }, [debouncedSearch, page]);

    const displayValue = (val: string | null | undefined) => {
        if (!val) return '-';
        return val.trim() || '-';
    };

    return (
        <PublicLayout>
            <Head title="Ranting" />
            <main className="min-h-dvh flex-1 px-4 py-10 sm:px-6 lg:px-8 bg-zinc-50">
                <div className="mx-auto w-full max-w-7xl">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl text-center">DaftarLanjut kerjakan halaman /agenda untuk tampilannya pakai kalender, ini referensi kalendernya termasuk modalnya (pastikan responsif dan rapi di semua perangkat) /home/ahadi/Kerja/Projek/serikat-kasbi/mobile/src/app/anggota/agenda Jangan improve design Ranting</h1>
                    </header>

                    {/* Filter Pencarian */}
                    <div className="mb-6 flex max-w-md mx-auto items-center relative">
                        <Search className="absolute left-3 size-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari ranting..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-200 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition rounded"
                        />
                    </div>

                    {loading && !rantings && (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="size-8 animate-spin text-zinc-400" />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="border border-red-200 bg-red-50 p-4 rounded-md text-sm font-medium text-red-700 text-center max-w-lg mx-auto">
                            {error}
                        </div>
                    )}

                    {rantings && (
                        <>
                            <div className="bg-white border border-zinc-200 rounded overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-zinc-200 text-left text-sm text-zinc-600">
                                        <thead className="bg-zinc-50 text-xs uppercase font-semibold text-zinc-700">
                                            <tr>
                                                <th className="px-6 py-4 w-16 text-center whitespace-nowrap">No</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Nama Ranting</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Sekretariat</th>
                                                <th className="px-6 py-4 whitespace-nowrap">Kontak</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 bg-white">
                                            {rantings.data.length > 0 ? (
                                                rantings.data.map((item, index) => {
                                                    const no = (rantings.current_page - 1) * rantings.per_page + index + 1;
                                                    return (
                                                        <tr key={item.id} className="hover:bg-zinc-50/50 transition">
                                                            <td className="px-6 py-4 text-center font-medium text-zinc-900 whitespace-nowrap">{no}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="font-semibold text-zinc-900">{item.nama}</div>
                                                                {item.ketua && (
                                                                    <div className="text-xs text-zinc-400 mt-0.5">Ketua: {item.ketua}</div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-zinc-600 whitespace-nowrap">{displayValue(item.alamat)}</td>
                                                            <td className="px-6 py-4 text-zinc-600 whitespace-nowrap">{displayValue(item.kontak)}</td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 font-medium whitespace-nowrap">
                                                        Data ranting tidak ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination (Di luar tabel, bulat, hanya icon, rata tengah) */}
                            <div className="mt-6 flex items-center justify-center">
                                <div className="flex items-center gap-4">
                                    <button
                                        disabled={page <= 1 || loading}
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                        className="size-9 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none"
                                        title="Halaman Sebelumnya"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <div className="text-sm font-semibold text-zinc-700">
                                        {rantings.current_page}/{rantings.last_page || 1}
                                    </div>
                                    <button
                                        disabled={page >= rantings.last_page || loading}
                                        onClick={() => setPage((p) => Math.min(p + 1, rantings.last_page))}
                                        className="size-9 flex items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none"
                                        title="Halaman Selanjutnya"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}

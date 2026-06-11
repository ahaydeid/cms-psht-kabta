import { useState } from 'react';
import { Search, User2, Loader2 } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { Head, Link } from './runtime/inertia-shim';
import { API_BASE_URL } from './lib/config';

type KeanggotaanData = {
    id: number;
    ranting_id: number;
    citizenship: string;
    identity_type: string;
    identity_number: string | null;
    member_number: string;
    name: string;
    birth_place: string | null;
    birth_date: string | null;
    gender: string;
    religion: string | null;
    address: string | null;
    occupation: string | null;
    phone: string | null;
    legalized_at: string | null;
    legalization_place: string | null;
    status: string;
    photo_path: string | null;
    photo_url: string | null;
    is_pengurus_cabang: boolean;
    ranting?: {
        id: number;
        nama: string;
    } | null;
};

const displayValue = (value: string | null | undefined) => {
    if (!value) return '-';
    return value.trim() || '-';
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'active': return 'Aktif';
        case 'inactive': return 'Tidak Aktif';
        case 'transferred': return 'Mutasi';
        case 'deceased': return 'Wafat';
        default: return status;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-emerald-600 text-white';
        case 'inactive': return 'bg-zinc-500 text-white';
        case 'transferred': return 'bg-blue-600 text-white';
        case 'deceased': return 'bg-red-600 text-white';
        default: return 'bg-zinc-600 text-white';
    }
};

export default function ProfilKeanggotaan() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<KeanggotaanData | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchMember = async () => {
        const normalizedQuery = query.trim();
        if (!normalizedQuery) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/keanggotaan/cari?niw=${encodeURIComponent(normalizedQuery)}`);
            if (!response.ok) {
                throw new Error('Gagal melakukan pencarian warga.');
            }
            const data = await response.json();
            if (data && typeof data === 'object' && 'id' in data) {
                setResult(data);
            } else {
                setResult(null);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Terjadi kesalahan saat mencari data warga.');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PublicLayout>
            <Head title="Keanggotaan" />
            <main className="grid min-h-[calc(100dvh-8rem)] flex-1 grid-rows-[1fr_auto_1fr] px-4 py-10 sm:px-6 lg:min-h-[calc(100dvh-4rem)] lg:px-8">
                <div className="row-start-2 w-full max-w-4xl justify-self-center">
                    <div className="relative mx-auto w-full max-w-xl">
                        <p className="absolute bottom-full left-0 mb-4 w-full text-center text-sm font-bold uppercase tracking-[0.24em] text-zinc-950">Cari Warga</p>
                        <form
                            className="flex w-full items-stretch overflow-hidden rounded-full border border-zinc-300 bg-white transition focus-within:border-2 focus-within:border-brand-black"
                            onSubmit={(event) => {
                                event.preventDefault();
                                searchMember();
                            }}
                        >
                            <label className="sr-only" htmlFor="membership-search">
                                Cari Keanggotaan
                            </label>
                            <input
                                className="min-h-14 w-full flex-1 appearance-none bg-transparent px-5 py-4 text-base font-medium leading-none text-zinc-950 outline-none placeholder:text-zinc-400"
                                id="membership-search"
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Masukkan NIW"
                                type="search"
                                value={query}
                            />
                            <button
                                className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-r-full bg-brand-black px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-800 sm:px-6 disabled:opacity-75"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Search className="size-4" />
                                )}
                                <span className="hidden sm:inline">Cari</span>
                            </button>
                        </form>
                    </div>
                </div>

                <div aria-live="polite" className="row-start-3 mt-4 w-full max-w-4xl justify-self-center">
                        {loading && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="size-8 animate-spin text-zinc-500" />
                            </div>
                        )}

                        {!loading && error && (
                            <p className="border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                                {error}
                            </p>
                        )}

                        {!loading && !error && result && (
                            <Link
                                className="group block border border-zinc-200 bg-white p-4 transition hover:border-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black/20 sm:p-5"
                                href={`/profil/keanggotaan/${result.id}`}
                            >
                                <article className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                                    <div className="flex items-center gap-3 sm:contents">
                                        <div className="flex aspect-square w-16 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white overflow-hidden text-slate-600 sm:w-28 sm:self-center">
                                            {result.photo_url ? (
                                                <img alt={result.name} className="h-full w-full object-cover" src={result.photo_url} />
                                            ) : (
                                                <User2 className="size-8 sm:size-15" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1 sm:hidden">
                                            <div className="flex items-start justify-between gap-3">
                                                <h1 className="text-xl font-bold text-zinc-950">{displayValue(result.name)}</h1>
                                                <p className="pt-1 text-xs font-bold uppercase tracking-[0.24em] text-brand-yellow-dark">Warga</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="hidden items-start justify-between gap-4 sm:flex">
                                            <h1 className="text-2xl font-bold text-zinc-950">{displayValue(result.name)}</h1>
                                            <p className="pt-1 text-xs font-bold uppercase tracking-[0.24em] text-brand-yellow-dark">Warga</p>
                                        </div>
                                        <dl className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-4">
                                            <div>
                                                <dt className="font-semibold text-zinc-950">NIW</dt>
                                                <dd className="mt-1">{displayValue(result.member_number)}</dd>
                                            </div>
                                            <div>
                                                <dt className="font-semibold text-zinc-950">Ranting</dt>
                                                <dd className="mt-1">{displayValue(result.ranting?.nama)}</dd>
                                            </div>
                                            <div>
                                                <dt className="font-semibold text-zinc-950">Jenis Kelamin</dt>
                                                <dd className="mt-1">{displayValue(result.gender)}</dd>
                                            </div>
                                            <div>
                                                <dt className="font-semibold text-zinc-950">Status</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(result.status)}`}>
                                                        {getStatusLabel(result.status)}
                                                    </span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </article>
                            </Link>
                        )}

                        {!loading && !error && hasSearched && !result && (
                            <p className="text-center text-lg sm:text-xl border border-rose-200 bg-rose-50 font-normal text-rose-600 py-4">
                                Data warga tidak ditemukan.
                            </p>
                        )}
                </div>
            </main>
        </PublicLayout>
    );
}

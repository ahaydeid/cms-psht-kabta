import { useState } from 'react';
import { Search, User2 } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { dummyMembers, type DummyMember } from './data/dummyMembers';
import { Head, Link } from './runtime/inertia-shim';

const displayValue = (value: string) => value.trim() || '-';

export default function ProfilKeanggotaan() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<DummyMember | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const searchMember = () => {
        const normalizedQuery = query.trim().toLowerCase();

        setHasSearched(true);
        setResult(dummyMembers.find((member) => member.niw.toLowerCase() === normalizedQuery) ?? null);
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
                                className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-r-full bg-brand-black px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-800 sm:px-6"
                                type="submit"
                            >
                                <Search className="size-4" />
                                <span className="hidden sm:inline">Cari</span>
                            </button>
                        </form>
                    </div>
                </div>

                <div aria-live="polite" className="row-start-3 mt-4 w-full max-w-4xl justify-self-center">
                        {result ? (
                            <Link
                                className="group block border border-zinc-200 bg-white p-4 transition hover:border-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black/20 sm:p-5"
                                href={`/profil/keanggotaan/${result.id}`}
                            >
                                <article className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                                    <div className="flex items-center gap-3 sm:contents">
                                        <div className="flex aspect-square w-16 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-white text-slate-600 sm:w-28 sm:self-center">
                                            <User2 className="size-8 sm:size-15" />
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
                                                <dd className="mt-1">{displayValue(result.niw)}</dd>
                                            </div>
                                            <div>
                                                <dt className="font-semibold text-zinc-950">Ranting</dt>
                                                <dd className="mt-1">{displayValue(result.ranting)}</dd>
                                            </div>
                                            <div>
                                                <dt className="font-semibold text-zinc-950">Rayon</dt>
                                                <dd className="mt-1">{displayValue(result.rayon)}</dd>
                                            </div>
                                            <div>
                                                <dt className="font-semibold text-zinc-950">Status</dt>
                                                <dd className="mt-1">
                                                    <span className="inline-flex rounded-full bg-emerald-600 text-white px-2.5 py-1 text-xs font-medium">
                                                        {displayValue(result.status)}
                                                    </span>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </article>
                            </Link>
                        ) : (
                            hasSearched && (
                                <p className="border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-600">
                                    Data warga tidak ditemukan.
                                </p>
                            )
                        )}
                </div>
            </main>
        </PublicLayout>
    );
}

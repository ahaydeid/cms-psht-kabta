import { useState, useEffect } from 'react';
import { ChevronLeft, User2, Loader2 } from 'lucide-react';

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

const formatDateString = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch (e) {
        return dateStr;
    }
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

type ProfilKeanggotaanDetailProps = {
    memberId: string;
};

export default function ProfilKeanggotaanDetail({ memberId }: ProfilKeanggotaanDetailProps) {
    const [member, setMember] = useState<KeanggotaanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMemberDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/keanggotaan/${memberId}`);
                if (!response.ok) {
                    throw new Error('Gagal memuat data detail warga.');
                }
                const data = await response.json();
                setMember(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Terjadi kesalahan saat memuat data warga.');
            } finally {
                setLoading(false);
            }
        };

        if (memberId) {
            fetchMemberDetail();
        }
    }, [memberId]);

    const identityItems = member
        ? [
              { label: 'NIW', value: member.member_number },
              { label: 'Jenis Kelamin', value: member.gender },
              { label: 'Tempat Lahir', value: member.birth_place },
              { label: 'Tanggal Lahir', value: formatDateString(member.birth_date) },
              { label: 'Agama', value: member.religion },
              { label: 'Pekerjaan', value: member.occupation },
          ]
        : [];

    const legalizationItems = member
        ? [
              { label: 'Ranting', value: member.ranting?.nama },
              { label: 'Tempat Pengesahan', value: member.legalization_place },
              { label: 'Tanggal Disahkan', value: formatDateString(member.legalized_at) },
              { label: 'Pengurus Cabang', value: member.is_pengurus_cabang ? 'Ya' : 'Tidak' },
              { label: 'Kewarganegaraan', value: member.citizenship },
          ]
        : [];

    const contactItems = member
        ? [
              { label: 'No. HP / Telepon', value: member.phone },
              { label: 'Alamat Lengkap', value: member.address },
          ]
        : [];

    return (
        <PublicLayout>
            <Head title={member ? member.name : 'Detail Warga'} />
            <main className="min-h-dvh flex-1 px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">
                    <header className="mb-6 flex items-center gap-3">
                        <Link
                            aria-label="Kembali"
                            className="inline-flex shrink-0 text-zinc-600 transition hover:text-brand-black"
                            href="/profil/keanggotaan"
                        >
                            <ChevronLeft className="size-6" />
                        </Link>
                        <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">Detail Warga</h1>
                    </header>

                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="size-10 animate-spin text-zinc-500" />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && !error && member && (
                        <article className="border border-zinc-200 bg-white p-6 sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="flex aspect-square w-28 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white overflow-hidden text-slate-600 sm:w-36">
                                    {member.photo_url ? (
                                        <img alt={member.name} className="h-full w-full object-cover" src={member.photo_url} />
                                    ) : (
                                        <User2 className="size-16 sm:size-20" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">{displayValue(member.name)}</h2>
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(member.status)}`}>
                                            {getStatusLabel(member.status)}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                                        {displayValue(member.ranting?.nama)} | NIW: {displayValue(member.member_number)}
                                    </p>
                                </div>
                            </div>

                            <section className="mt-8 border-t border-zinc-200 pt-6">
                                <h3 className="text-lg font-bold text-sky-800">Identitas Diri</h3>
                                <dl className="mt-5 grid gap-5 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-3">
                                    {identityItems.map((item) => (
                                        <div key={item.label}>
                                            <dt className="text-zinc-400 font-normal">{item.label}</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-zinc-950">{displayValue(item.value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>

                            <section className="mt-8 border-t border-zinc-200 pt-6">
                                <h3 className="text-lg font-bold text-sky-800">Pengesahan & Keanggotaan</h3>
                                <dl className="mt-5 grid gap-5 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-3">
                                    {legalizationItems.map((item) => (
                                        <div key={item.label}>
                                            <dt className="text-zinc-400 font-normal">{item.label}</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-zinc-950">{displayValue(item.value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>

                            <section className="mt-8 border-t border-zinc-200 pt-6">
                                <h3 className="text-lg font-bold text-sky-800">Kontak & Alamat</h3>
                                <dl className="mt-5 grid gap-5 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-3">
                                    {contactItems.map((item) => (
                                        <div key={item.label}>
                                            <dt className="text-zinc-400 font-normal">{item.label}</dt>
                                            <dd className="mt-1.5 text-base font-semibold text-zinc-950">{displayValue(item.value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>
                        </article>
                    )}

                    {!loading && !error && !member && (
                        <div className="border border-zinc-200 bg-white p-6 text-sm font-medium text-zinc-600">
                            Data warga tidak ditemukan.
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}

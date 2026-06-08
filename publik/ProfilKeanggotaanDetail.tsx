import { ChevronLeft, User2 } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { dummyMembers } from './data/dummyMembers';
import { Head, Link } from './runtime/inertia-shim';

const displayValue = (value: string) => value.trim() || '-';
const ketuaRantingByName: Record<string, string> = {
    Balaraja: 'Hendri Saputra',
    Cikupa: 'Agus Salim',
    Curug: 'Siti Aminah',
    Kresek: 'Ahadi',
    'Pasar Kemis': 'Fajar Maulana',
    Tigaraksa: 'Rizki Maulana',
};

type ProfilKeanggotaanDetailProps = {
    memberId: string;
};

export default function ProfilKeanggotaanDetail({ memberId }: ProfilKeanggotaanDetailProps) {
    const member = dummyMembers.find((item) => item.id === memberId);
    const identityItems = member
        ? [
              { label: 'NIW', value: member.niw },
              { label: 'Jenis Kelamin', value: member.gender },
              { label: 'Tanggal Lahir', value: member.birthDate },
              { label: 'Pekerjaan', value: member.occupation },
          ]
        : [];
    const studentItems = member
        ? [
              { label: 'Tahun Masuk', value: member.joinedYear },
              { label: 'Tempat Latihan', value: member.rayon },
              { label: 'Ranting Siswa', value: member.ranting },
              { label: 'Ketur Saat Siswa', value: ketuaRantingByName[member.ranting] ?? '' },
          ]
        : [];
    const membershipItems = member
        ? [
              { label: 'Cabang', value: member.branch },
              { label: 'Disahkan di', value: member.approvedAt },
              { label: 'Ranting', value: member.ranting },
              { label: 'Rayon', value: member.rayon },
              { label: 'Tempat Melatih Aktif', value: member.instructorAt },
              { label: 'Kontak', value: member.contact },
          ]
        : [];

    return (
        <PublicLayout>
            <Head title={member ? member.name : 'Warga'} />
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

                    {member ? (
                        <article className="border border-zinc-200 bg-white p-6 sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="flex aspect-square w-28 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-white text-slate-600 sm:w-36">
                                    {member.photo ? (
                                        <img alt="" className="h-full w-full rounded-full object-cover" src={member.photo} />
                                    ) : (
                                        <User2 className="size-16 sm:size-20" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">{displayValue(member.name)}</h2>
                                        <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white">
                                            {displayValue(member.status)}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                                        {displayValue(member.ranting)} | {displayValue(member.rayon)}
                                    </p>
                                </div>
                            </div>

                            <section className="mt-8 border-t border-zinc-200 pt-6">
                                <h3 className="text-lg font-bold text-zinc-950">Identitas Diri</h3>
                                <dl className="mt-5 grid gap-5 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-3">
                                    {identityItems.map((item) => (
                                        <div key={item.label}>
                                            <dt className="font-semibold text-zinc-950">{item.label}</dt>
                                            <dd className="mt-2 text-base">{displayValue(item.value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>

                            <section className="mt-8 border-t border-zinc-200 pt-6">
                                <h3 className="text-lg font-bold text-zinc-950">Kesiswaan</h3>
                                <dl className="mt-5 grid gap-5 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-3">
                                    {studentItems.map((item) => (
                                        <div key={item.label}>
                                            <dt className="font-semibold text-zinc-950">{item.label}</dt>
                                            <dd className="mt-2 text-base">{displayValue(item.value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>

                            <section className="mt-8 border-t border-zinc-200 pt-6">
                                <h3 className="text-lg font-bold text-zinc-950">Keanggotaan</h3>
                                <dl className="mt-5 grid gap-5 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-3">
                                    {membershipItems.map((item) => (
                                        <div key={item.label}>
                                            <dt className="font-semibold text-zinc-950">{item.label}</dt>
                                            <dd className="mt-2 text-base">{displayValue(item.value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </section>
                        </article>
                    ) : (
                        <div className="border border-zinc-200 bg-white p-6 text-sm font-medium text-zinc-600">
                            Data warga tidak ditemukan.
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}

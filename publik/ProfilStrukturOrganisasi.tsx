import { User2 } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { Head } from './runtime/inertia-shim';

const topOfficials = [
    {
        name: 'Nama Pengurus',
        position: 'Dewan Pembina',
    },
    {
        name: 'Nama Pengurus',
        position: 'Dewan Pertimbangan',
    },
];

const coreOfficials = [
    {
        name: 'Nama Ketua',
        position: 'Ketua Cabang',
    },
];

const chairOfficials = [
    {
        name: 'Nama Pengurus',
        position: 'Ketua I',
    },
    {
        name: 'Nama Pengurus',
        position: 'Ketua II',
    },
    {
        name: 'Nama Pengurus',
        position: 'Ketua III',
    },
];

const secretaryOfficials = [
    {
        name: 'Nama Sekretaris',
        position: 'Sekretaris I',
    },
    {
        name: 'Nama Sekretaris',
        position: 'Sekretaris II',
    },
];

const treasurerOfficials = [
    {
        name: 'Nama Bendahara',
        position: 'Bendahara I',
    },
    {
        name: 'Nama Bendahara',
        position: 'Bendahara II',
    },
    {
        name: 'Nama Bendahara',
        position: 'Bendahara III',
    },
];

const departments = [
    {
        members: ['Nama Pengurus', 'Nama Pengurus'],
        title: 'Bidang Teknik dan Latihan',
    },
    {
        members: ['Nama Pengurus', 'Nama Pengurus'],
        title: 'Bidang Organisasi',
    },
    {
        members: ['Nama Pengurus', 'Nama Pengurus'],
        title: 'Bidang Kerohanian',
    },
    {
        members: ['Nama Pengurus', 'Nama Pengurus'],
        title: 'Bidang Humas',
    },
    {
        members: ['Nama Pengurus', 'Nama Pengurus'],
        title: 'Bidang Pamter',
    },
    {
        members: ['Nama Pengurus', 'Nama Pengurus'],
        title: 'Bidang Sarana Prasarana',
    },
];

function OfficialCard({ name, position, variant = 'light' }: { name: string; position: string; variant?: 'dark' | 'light' }) {
    const isDark = variant === 'dark';

    return (
        <article className={isDark ? 'rounded-lg bg-brand-black p-5 text-white' : 'rounded-lg border border-zinc-200 bg-white p-5 text-zinc-950'}>
            <div className="flex items-start gap-4">
                <span
                    className={
                        isDark
                            ? 'inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-brand-yellow'
                            : 'inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-slate-600 text-slate-600'
                    }
                >
                    <User2 className="size-6" />
                </span>
                <div className="space-y-0.5">
                    <p className={isDark ? 'text-sm font-semibold text-brand-yellow' : 'text-sm font-semibold text-brand-yellow-dark'}>
                        {position}
                    </p>
                    <h3 className="text-xl leading-none font-bold">{name}</h3>
                </div>
            </div>
        </article>
    );
}

function SectionLabel({ children }: { children: string }) {
    return (
        <div className="mx-auto mt-8 flex max-w-4xl items-center gap-4">
            <span className="h-px flex-1 bg-zinc-200" />
            <p className="text-sm font-semibold text-zinc-500">{children}</p>
            <span className="h-px flex-1 bg-zinc-200" />
        </div>
    );
}

export default function ProfilStrukturOrganisasi() {
    return (
        <PublicLayout>
            <Head title="Struktur Organisasi" />
            <main className="bg-white">
                <section className="border-b border-zinc-200 bg-zinc-50">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
                        <div className="max-w-3xl">
                            <h1 className="text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl lg:text-5xl">
                                Pengurus PSHT Cabang Kab. Tangerang
                            </h1>
                        </div>
                    </div>
                </section>

                <section className="py-12 sm:py-16 lg:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative">
                            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-zinc-200 lg:block" />

                            <div className="relative mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
                                {topOfficials.map((official) => (
                                    <OfficialCard key={official.position} {...official} />
                                ))}
                            </div>

                            <div className="relative mx-auto mt-8 max-w-xl">
                                <span className="mx-auto mb-4 hidden h-10 w-px bg-brand-black lg:block" />
                                <OfficialCard name={coreOfficials[0].name} position={coreOfficials[0].position} variant="dark" />
                            </div>

                            <SectionLabel>Ketua Bidang</SectionLabel>
                            <div className="relative mx-auto mt-4 grid max-w-5xl gap-4 sm:grid-cols-3">
                                {chairOfficials.map((official) => (
                                    <OfficialCard key={official.position} {...official} />
                                ))}
                            </div>

                            <SectionLabel>Sekretariat</SectionLabel>
                            <div className="relative mx-auto mt-4 grid max-w-4xl gap-4 sm:grid-cols-2">
                                {secretaryOfficials.map((official) => (
                                    <OfficialCard key={official.position} {...official} />
                                ))}
                            </div>

                            <SectionLabel>Bendahara</SectionLabel>
                            <div className="relative mx-auto mt-4 grid max-w-5xl gap-4 sm:grid-cols-3">
                                {treasurerOfficials.map((official) => (
                                    <OfficialCard key={official.position} {...official} />
                                ))}
                            </div>

                            <SectionLabel>Bidang Kerja</SectionLabel>
                            <div className="relative mt-4 grid gap-4 lg:grid-cols-3">
                                {departments.map((department) => (
                                    <article className="rounded-lg border border-zinc-200 bg-white p-5" key={department.title}>
                                        <h3 className="text-xl font-bold text-zinc-950">{department.title}</h3>
                                        <div className="mt-5 space-y-2">
                                            {department.members.map((member, index) => (
                                                <p className="flex items-center justify-between gap-4 text-sm text-zinc-600" key={`${department.title}-${index}`}>
                                                    <span>{index === 0 ? 'Koordinator' : `Anggota ${index}`}</span>
                                                    <span className="font-semibold text-zinc-950">{member}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </PublicLayout>
    );
}

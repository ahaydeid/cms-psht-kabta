import { Avatar } from './components/common/Avatar';
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
        <article className="flex items-center gap-4 py-3">
            <Avatar name={name} size="medium" />
            <div className="space-y-0.5 min-w-0">
                <p className={isDark ? 'text-xs font-semibold text-brand-yellow-dark' : 'text-xs font-semibold text-brand-yellow-dark'}>
                    {position}
                </p>
                <h3 className="text-base leading-snug font-bold text-zinc-950 truncate">{name}</h3>
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

                            <div className="relative mx-auto grid max-w-4xl gap-2 sm:grid-cols-2">
                                {topOfficials.map((official) => (
                                    <OfficialCard key={official.position} {...official} />
                                ))}
                            </div>

                            <div className="relative mx-auto mt-4 max-w-xl">
                                <span className="mx-auto mb-4 hidden h-10 w-px bg-brand-black lg:block" />
                                <OfficialCard name={coreOfficials[0].name} position={coreOfficials[0].position} variant="dark" />
                            </div>

                            <SectionLabel>Ketua Bidang</SectionLabel>
                            <div className="relative mx-auto mt-2 grid max-w-5xl gap-2 sm:grid-cols-3">
                                {chairOfficials.map((official) => (
                                    <OfficialCard key={official.position} {...official} />
                                ))}
                            </div>

                            <SectionLabel>Sekretariat</SectionLabel>
                            <div className="relative mx-auto mt-2 grid max-w-4xl gap-2 sm:grid-cols-2">
                                {secretaryOfficials.map((official) => (
                                    <OfficialCard key={official.position} {...official} />
                                ))}
                            </div>

                            <SectionLabel>Bendahara</SectionLabel>
                            <div className="relative mx-auto mt-2 grid max-w-5xl gap-2 sm:grid-cols-3">
                                {treasurerOfficials.map((official) => (
                                    <OfficialCard key={official.position} {...official} />
                                ))}
                            </div>

                            <SectionLabel>Bidang Kerja</SectionLabel>
                            <div className="relative mt-4 grid gap-6 lg:grid-cols-3">
                                {departments.map((department) => (
                                    <div key={department.title}>
                                        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-brand-red-dark">
                                            {department.title}
                                        </p>
                                        <div className="space-y-1 divide-y divide-zinc-100">
                                            {department.members.map((member, index) => (
                                                <div
                                                    className="flex items-center gap-3 py-2"
                                                    key={`${department.title}-${index}`}
                                                >
                                                    <Avatar name={member} size="small" />
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-zinc-500">
                                                            {index === 0 ? 'Koordinator' : `Anggota ${index}`}
                                                        </p>
                                                        <p className="text-sm font-semibold text-zinc-950 truncate">
                                                            {member}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </PublicLayout>
    );
}

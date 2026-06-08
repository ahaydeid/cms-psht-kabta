import { PublicLayout } from './components/layout/PublicLayout';
import { Head } from './runtime/inertia-shim';

const timelineItems = [
    {
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio, praesent libero, sed cursus ante dapibus diam.',
        period: 'Lorem Ipsum',
        title: 'Lorem Ipsum',
    },
    {
        description: 'Sed nisi nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum, praesent mauris fusce nec tellus sed augue.',
        period: 'Dolor Sit',
        title: 'Dolor Sit',
    },
    {
        description: 'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.',
        period: 'Amet Elit',
        title: 'Amet Elit',
    },
    {
        description: 'Donec vitae nisi nam ultrices libero non mattis pulvinar. Nulla mollis molestie lorem quisque ut erat.',
        period: 'Nunc Vitae',
        title: 'Nunc Vitae',
    },
];

const figures = [
    {
        role: 'Ketua Cabang',
        name: 'Nama Tokoh',
    },
    {
        role: 'Dewan Pertimbangan',
        name: 'Nama Tokoh',
    },
    {
        role: 'Koordinator Pembinaan',
        name: 'Nama Tokoh',
    },
];

const coverageAreas = ['Lorem', 'Ipsum', 'Dolor', 'Amet', 'Nunc', 'Elit'];

export default function ProfilTentang() {
    return (
        <PublicLayout>
            <Head title="Tentang Cabang" />
            <main className="bg-white">
                <section className="border-b border-zinc-200 bg-zinc-50">
                    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-24">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.32em] text-brand-yellow-dark">Tentang Cabang</p>
                            <h1 className="mt-5 text-4xl font-bold leading-tight text-zinc-950 sm:text-6xl">
                                Lorem ipsum dolor sit amet
                            </h1>
                        </div>
                        <div className="lg:pt-10">
                            <p className="text-xl font-semibold leading-9 text-zinc-800">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                            </p>
                            <p className="mt-5 text-base leading-8 text-zinc-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam congue, risus nec dignissim bibendum, turpis magna
                                volutpat erat, vitae pretium neque lorem ut sem. Donec vitae nisi nam ultrices libero non mattis pulvinar.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 lg:py-24">
                    <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[18rem_1fr] lg:px-8">
                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <div className="border-l-4 border-brand-yellow pl-5">
                                <h2 className="text-3xl font-bold text-zinc-950">Runtutan Sejarah</h2>
                                <p className="mt-4 text-sm leading-7 text-zinc-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio, praesent libero, sed cursus ante dapibus.
                                </p>
                            </div>
                        </aside>

                        <div className="relative">
                            <div className="absolute bottom-0 left-4 top-0 w-px bg-zinc-200 sm:left-6" />
                            <div className="space-y-8">
                                {timelineItems.map((item, index) => (
                                    <article className="relative grid gap-5 pl-12 sm:grid-cols-[10rem_1fr] sm:pl-20" key={item.title}>
                                        <span className="absolute left-1.5 top-1 flex size-6 items-center justify-center rounded-full border border-brand-yellow bg-white text-xs font-bold text-brand-yellow-dark sm:left-3.5">
                                            {index + 1}
                                        </span>
                                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-yellow-dark">{item.period}</p>
                                        <div className="border border-zinc-200 bg-white p-6">
                                            <h3 className="text-2xl font-bold leading-tight text-zinc-950">{item.title}</h3>
                                            <p className="mt-4 text-sm leading-7 text-zinc-600">{item.description}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-brand-black py-16 text-white sm:py-20 lg:py-24">
                    <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.32em] text-brand-yellow">Lorem Ipsum</p>
                            <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">Lorem ipsum dolor sit amet.</h2>
                            <p className="mt-6 max-w-xl text-base leading-8 text-white/65">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisi nulla quis sem at nibh elementum imperdiet.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {figures.map((figure) => (
                                <article className="border border-white/15 p-5" key={figure.role}>
                                    <h3 className="text-lg font-bold">{figure.name}</h3>
                                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{figure.role}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 lg:py-24">
                    <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
                        <div className="border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
                            <h2 className="text-3xl font-bold text-zinc-950">Lorem ipsum dolor sit amet</h2>
                            <p className="mt-5 text-base leading-8 text-zinc-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel nulla eget eros elementum pellentesque.
                                Quisque porta volutpat erat, sed cursus ante dapibus diam.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {coverageAreas.map((area) => (
                                    <span className="border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700" key={area}>
                                        Ranting {area}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                            <article className="border-l-4 border-brand-yellow bg-white p-6">
                                <h3 className="text-xl font-bold text-zinc-950">Arsip Cabang</h3>
                                <p className="mt-4 text-sm leading-7 text-zinc-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arsip dapat berisi dokumen, foto, dan catatan kegiatan.
                                </p>
                            </article>
                            <article className="border-l-4 border-brand-red bg-white p-6">
                                <h3 className="text-xl font-bold text-zinc-950">Catatan Nilai</h3>
                                <p className="mt-4 text-sm leading-7 text-zinc-600">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                            </article>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}

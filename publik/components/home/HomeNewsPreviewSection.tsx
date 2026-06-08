import { Link } from '../../runtime/inertia-shim';

const pancaDasarItems = [
    {
        description: 'Fondasi hubungan antaranggota: saling menghormati, menjaga martabat, dan tidak mudah memecah belah.',
        title: 'Persaudaraan',
    },
    {
        description: 'Latihan tubuh yang membentuk kebugaran, ketekunan, sportivitas, dan kemampuan mengendalikan diri.',
        title: 'Olahraga',
    },
    {
        description: 'Kemampuan menjaga keselamatan dan kehormatan secara proporsional, bukan untuk arogansi atau kekerasan.',
        title: 'Bela Diri',
    },
    {
        description: 'Pelestarian pencak silat sebagai warisan budaya melalui gerak, tata krama, irama, dan tradisi.',
        title: 'Seni Budaya',
    },
    {
        description: 'Pendidikan batin yang mengarahkan pikiran, rasa, tekad, ucapan, dan perbuatan pada budi luhur.',
        title: 'Ke-SH-an',
    },
];

export function HomeNewsPreviewSection() {
    return (
        <section className="bg-brand-black py-16 text-white sm:py-20 lg:py-24" id="panca-dasar">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
                    <div className="relative z-0">
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-yellow">Panca Dasar</p>
                        <div className="mt-8">
                            <img
                                alt="Ilustrasi pesilat PSHT"
                                className="h-auto w-full max-w-sm object-contain sm:max-w-md lg:max-w-136 lg:-translate-x-8 xl:max-w-152"
                                loading="lazy"
                                src="/img/pesilat.webp"
                            />
                        </div>
                    </div>

                    <div className="relative z-10 border-y border-white/20 bg-brand-black/92 lg:-ml-6 lg:pl-6">
                        {pancaDasarItems.map((item, index) => (
                            <article className="grid gap-4 border-b border-white/15 py-6 last:border-b-0 sm:grid-cols-[5rem_1fr]" key={item.title}>
                                <span className="font-bold text-white/35">0{index + 1}</span>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">{item.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

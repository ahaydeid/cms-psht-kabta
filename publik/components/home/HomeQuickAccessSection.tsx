const focusItems = [
    {
        description: 'Berakar dari tradisi Setia Hati yang menekankan kesetiaan pada hati nurani dan keluhuran budi.',
        title: 'Akar Setia Hati',
    },
    {
        description: 'Pencak silat ditempatkan sebagai jalan pendidikan, bukan sekadar kemampuan bela diri.',
        title: 'Pendidikan Karakter',
    },
    {
        description: 'Ke-SH-an menjaga arah latihan agar tetap berpijak pada kerohanian, tanggung jawab, dan pengendalian diri.',
        title: 'Ke-SH-an',
    },
];

export function HomeQuickAccessSection() {
    return (
        <section className="relative scroll-mt-16 overflow-hidden bg-white py-10 sm:py-14 lg:py-24" id="tentang">
            <img
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[58%] z-0 w-2xl max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-10 sm:w-232 lg:top-1/2 lg:w-6xl lg:opacity-15"
                src="/img/teratai-section-bg.svg"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-yellow-dark">Tentang</p>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-zinc-950 sm:mt-4 sm:text-5xl">
                            PSHT mendidik manusia seutuhnya melalui pencak silat dan persaudaraan.
                        </h2>
                    </div>

                    <div className="max-w-xl lg:pt-9">
                        <p className="text-sm leading-7 text-zinc-700 sm:text-base sm:leading-8">
                            PSHT Cabang Kabupaten Tangerang menjadi ruang informasi dan koordinasi kegiatan PSHT di Kabupaten Tangerang. Peran
                            cabang bukan hanya menghubungkan agenda, tetapi menjaga arah pembinaan agar latihan, organisasi, dan
                            persaudaraan tetap berjalan dalam satu nilai.
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-3">
                    {focusItems.map((item) => (
                        <article
                            className="py-2 lg:px-7 lg:first:pl-0 lg:last:pr-0"
                            key={item.title}
                        >
                            <h3 className="text-2xl font-black text-zinc-950">{item.title}</h3>
                            <p className="mt-3 text-base font-semibold leading-7 text-zinc-700">{item.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { ArrowRight, ChevronLeft, ChevronRight, Clock3, User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { latestArticles } from "../../data/homeContent";
import { Link } from "../../runtime/inertia-shim";

const fallbackArticles = [
    ...latestArticles,
    {
        category: "Organisasi",
        date: "Mei 2026",
        excerpt:
            "Koordinasi cabang dan ranting diarahkan agar informasi kegiatan tersampaikan lebih rapi kepada warga dan siswa, mulai dari agenda latihan, pengumuman organisasi, hingga dokumentasi kegiatan yang perlu diketahui bersama.",
        image: "/img/logo-psht.webp",
        slug: "koordinasi-informasi-cabang",
        title: "Koordinasi Informasi Cabang dan Ranting",
    },
    {
        category: "Pembinaan",
        date: "Mei 2026",
        excerpt:
            "Pembinaan latihan menempatkan kedisiplinan, tata krama, dan persaudaraan sebagai bagian penting proses belajar, sehingga siswa tidak hanya mengejar kemampuan gerak, tetapi juga membangun sikap yang tertib dan rendah hati.",
        image: "/img/logo-psht.webp",
        slug: "arah-pembinaan-latihan",
        title: "Arah Pembinaan Latihan yang Tertib dan Berjenjang",
    },
    {
        category: "Ke-SH-an",
        date: "Mei 2026",
        excerpt:
            "Ke-SH-an menjadi pengingat bahwa kemampuan fisik harus berjalan bersama pengendalian diri dan budi luhur, agar setiap proses latihan tetap memiliki arah moral dan tidak berhenti sebagai keterampilan bela diri semata.",
        image: "/img/logo-psht.webp",
        slug: "ke-sh-an-dalam-latihan",
        title: "Ke-SH-an sebagai Arah Moral dalam Latihan",
    },
    {
        category: "Kegiatan",
        date: "Mei 2026",
        excerpt:
            "Kegiatan cabang menjadi ruang silaturahmi, penguatan organisasi, dan pengabdian warga kepada masyarakat, sekaligus menjaga kedekatan antarwarga lintas ranting melalui agenda yang tertib dan bermanfaat.",
        image: "/img/logo-psht.webp",
        slug: "silaturahmi-dan-pengabdian",
        title: "Silaturahmi Warga dan Pengabdian Organisasi",
    },
    {
        category: "Budaya",
        date: "Mei 2026",
        excerpt:
            "Pencak silat tidak hanya dipahami sebagai bela diri, tetapi juga warisan budaya yang perlu dijaga dengan tata krama, kesungguhan latihan, dan kesadaran untuk merawat nilai luhur di tengah masyarakat.",
        image: "/img/logo-psht.webp",
        slug: "pencak-silat-sebagai-budaya",
        title: "Pencak Silat sebagai Warisan Budaya dan Pendidikan",
    },
].slice(0, 8);

const articleAuthors = [
    "Admin | Ranting Balaraja",
    "Hendri | Ranting Balaraja",
    "Ahadi | Ranting Kresek",
    "Rizki | Ranting Cikupa",
    "Dewi | Ranting Tigaraksa",
    "Fajar | Ranting Pasar Kemis",
    "Siti | Ranting Curug",
    "Yusuf | Ranting Mauk",
];

function getStepWidth(carousel: HTMLDivElement) {
    const firstCard = carousel.querySelector<HTMLElement>("[data-news-card]");
    const gap = 24;

    return (firstCard?.offsetWidth ?? carousel.clientWidth) + gap;
}

function getArticleAuthor(index: number) {
    return articleAuthors[index] ?? articleAuthors[0];
}

function getPublishedAt(articleDate: string, index: number) {
    const fallbackDays = ["12", "10", "8", "6", "4", "2", "1", "30"];
    const fallbackTimes = ["08:00", "09:15", "10:30", "13:00", "15:20", "16:45", "19:00", "20:15"];
    const parts = articleDate.split(" ");
    const dateText = parts.length >= 3 ? articleDate : `${fallbackDays[index] ?? "01"} ${articleDate}`;

    return `${dateText}, ${fallbackTimes[index] ?? "08:00"}`;
}

export function HomeSchedulePreviewSection() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollToIndex = (index: number) => {
        const carousel = carouselRef.current;

        if (!carousel) {
            return;
        }

        const safeIndex =
            (index + fallbackArticles.length) % fallbackArticles.length;
        carousel.scrollTo({
            behavior: "smooth",
            left: getStepWidth(carousel) * safeIndex,
        });
        setActiveIndex(safeIndex);
    };

    const scrollCarousel = (direction: "left" | "right") => {
        scrollToIndex(activeIndex + (direction === "right" ? 1 : -1));
    };

    useEffect(() => {
        const carousel = carouselRef.current;

        if (!carousel) {
            return;
        }

        const updateActiveIndex = () => {
            const stepWidth = getStepWidth(carousel);
            setActiveIndex(
                Math.round(carousel.scrollLeft / stepWidth) %
                    fallbackArticles.length,
            );
        };

        carousel.addEventListener("scroll", updateActiveIndex, {
            passive: true,
        });

        return () => carousel.removeEventListener("scroll", updateActiveIndex);
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveIndex((currentIndex) => {
                const nextIndex = (currentIndex + 1) % fallbackArticles.length;
                const carousel = carouselRef.current;

                if (carousel) {
                    carousel.scrollTo({
                        behavior: "smooth",
                        left: getStepWidth(carousel) * nextIndex,
                    });
                }

                return nextIndex;
            });
        }, 4500);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <section
            className="bg-white py-16 sm:py-20 lg:py-24"
            id="berita-terbaru"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-yellow-dark">Berita Terbaru</p>

                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Berita sebelumnya"
                            className="inline-flex size-10 cursor-pointer items-center justify-center text-zinc-950 transition hover:text-brand-yellow-dark"
                            onClick={() => scrollCarousel("left")}
                            type="button"
                        >
                            <ChevronLeft className="size-6" />
                        </button>
                        <button
                            aria-label="Berita berikutnya"
                            className="inline-flex size-10 cursor-pointer items-center justify-center text-zinc-950 transition hover:text-brand-yellow-dark"
                            onClick={() => scrollCarousel("right")}
                            type="button"
                        >
                            <ChevronRight className="size-6" />
                        </button>
                    </div>
                </div>

                <div
                    className="mt-10 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    ref={carouselRef}
                >
                    {fallbackArticles.map((article, index) => (
                        <article
                            className="flex min-w-full snap-start flex-col overflow-hidden border border-zinc-800 bg-brand-black lg:min-w-[calc(50%-0.75rem)]"
                            data-news-card
                            key={article.slug}
                        >
                            <div className="relative">
                                <img
                                    alt=""
                                    className="h-64 w-full object-cover sm:h-72"
                                    loading="lazy"
                                    src={article.image}
                                />
                                <p className="absolute left-0 top-0 rounded-br-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950">
                                    {article.category}
                                </p>
                            </div>

                            <div className="flex flex-1 flex-col p-6 sm:p-7">
                                <div>
                                    <h3 className="max-w-xl text-2xl font-bold leading-tight text-white sm:text-3xl">
                                        {article.title}
                                    </h3>

                                    <div className="mt-6">
                                        <p className="line-clamp-4 text-base leading-6 text-white/68">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-end justify-between gap-4 border-t border-white/10 pt-5 text-sm font-normal text-white/55">
                                    <div className="space-y-2">
                                        <p>{getPublishedAt(article.date, index)}</p>
                                        <p className="inline-flex items-center gap-2">
                                            <span className="inline-flex size-4 items-center justify-center rounded-full bg-white/15 text-white">
                                                <User2 className="size-3" />
                                            </span>
                                            <span>{getArticleAuthor(index)}</span>
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-3">
                                        <span className="inline-flex items-center gap-2">
                                            <Clock3 className="size-4" />6 menit baca
                                        </span>
                                        <Link
                                            className="inline-flex items-center font-normal text-brand-yellow transition hover:text-white"
                                            href={`/berita/${article.slug}`}
                                        >
                                            Baca artikel
                                            <ArrowRight className="ml-2 size-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-4 flex justify-center gap-2">
                    {fallbackArticles.map((article, index) => (
                        <button
                            aria-label={`Tampilkan berita ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all ${
                                activeIndex === index
                                    ? "w-8 bg-brand-yellow"
                                    : "w-2.5 bg-zinc-300 hover:bg-zinc-500"
                            }`}
                            key={article.slug}
                            onClick={() => scrollToIndex(index)}
                            type="button"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

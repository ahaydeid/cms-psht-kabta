import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Clock3, Search, User2 } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { newsArticles } from './data/newsArticles';
import { Head, Link } from './runtime/inertia-shim';

const articleList = newsArticles;
const allCategoryLabel = 'Semua';
const categories = Array.from(new Set(newsArticles.map((article) => article.category)));
const articlesPerLoad = 6;

export default function Berita() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleArticleCount, setVisibleArticleCount] = useState(articlesPerLoad);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(allCategoryLabel);
    const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();
    const filteredArticles = articleList.filter((article) => {
        const haystack = `${article.title} ${article.author} ${article.ranting} ${article.category} ${article.date}`.toLowerCase();
        const matchesCategory = selectedCategory === allCategoryLabel || article.category === selectedCategory;

        return matchesCategory && haystack.includes(normalizedSearchQuery);
    });
    const suggestedArticles = normalizedSearchQuery ? filteredArticles.slice(0, 5) : [];
    const visibleArticles = filteredArticles.slice(0, visibleArticleCount);
    const canShowPreviousArticles = visibleArticleCount > articlesPerLoad;
    const canShowNextArticles = visibleArticleCount < filteredArticles.length;

    const moveCarousel = (direction: 'next' | 'previous') => {
        setActiveIndex((currentIndex) => {
            const step = direction === 'next' ? 1 : -1;

            return (currentIndex + step + newsArticles.length) % newsArticles.length;
        });
    };

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            return;
        }

        const interval = window.setInterval(() => moveCarousel('next'), 5000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <PublicLayout>
            <Head title="Berita" />
            <main className="bg-white">
                <section>
                    <div className="relative overflow-hidden bg-brand-black">
                        <div
                            className="flex transition-transform duration-700 ease-out"
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        >
                            {newsArticles.map((article) => (
                                <div
                                    className="min-w-full bg-cover bg-center"
                                    key={article.slug}
                                    style={{
                                        backgroundImage: `linear-gradient(90deg, rgb(17 17 17 / 0.94), rgb(17 17 17 / 0.74), rgb(17 17 17 / 0.42)), url(${article.image})`,
                                    }}
                                >
                                    <div className="relative h-120 p-6 text-white sm:h-128 sm:p-8 lg:h-136 lg:p-10">
                                        <div className="max-w-3xl pr-2">
                                            <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow">{article.category}</p>
                                            <h1 className="mt-4 line-clamp-3 text-3xl font-bold leading-tight sm:mt-5 sm:text-5xl lg:text-6xl">{article.title}</h1>
                                            <p className="mt-4 max-w-2xl line-clamp-2 text-sm leading-6 text-white/68 sm:mt-5 sm:line-clamp-3 sm:text-base sm:leading-7">{article.excerpt}</p>
                                            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/58 sm:mt-8 sm:gap-x-5 sm:gap-y-3">
                                                <span>{article.date}</span>
                                                <span className="inline-flex items-center gap-2">
                                                    <User2 className="size-4" />
                                                    {article.author} | {article.ranting}
                                                </span>
                                                <span className="inline-flex items-center gap-2">
                                                    <Clock3 className="size-4" />
                                                    {article.readTime}
                                                </span>
                                            </div>
                                            <Link
                                                className="mt-8 inline-flex items-center text-sm font-semibold text-brand-yellow transition hover:text-white"
                                                href={`/berita/${article.slug}`}
                                            >
                                                Baca artikel
                                                <ArrowRight className="ml-2 size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="absolute inset-x-6 bottom-6 flex items-center justify-center gap-4 sm:inset-x-8 sm:bottom-8 lg:inset-x-10 lg:bottom-10">
                            <div className="flex justify-center gap-2">
                                {newsArticles.map((article, index) => (
                                    <button
                                        aria-label={`Tampilkan berita ${index + 1}`}
                                        className={`h-2.5 rounded-full transition-all ${
                                            activeIndex === index ? 'w-8 bg-brand-yellow' : 'w-2.5 bg-white/35 hover:bg-white/70'
                                        }`}
                                        key={article.slug}
                                        onClick={() => setActiveIndex(index)}
                                        type="button"
                                    />
                                ))}
                            </div>
                            <div className="absolute right-0 hidden shrink-0 gap-2 sm:flex">
                                <button
                                    aria-label="Berita sebelumnya"
                                    className="inline-flex size-10 rounded-full items-center justify-center border border-white/20 text-white transition hover:border-brand-yellow hover:text-brand-yellow"
                                    onClick={() => moveCarousel('previous')}
                                    type="button"
                                >
                                    <ChevronLeft className="size-5" />
                                </button>
                                <button
                                    aria-label="Berita berikutnya"
                                    className="inline-flex size-10 rounded-full items-center justify-center border border-white/20 text-white transition hover:border-brand-yellow hover:text-brand-yellow"
                                    onClick={() => moveCarousel('next')}
                                    type="button"
                                >
                                    <ChevronRight className="size-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                        <div className="flex justify-end">
                            <div className="relative w-full max-w-sm">
                                <div className="flex items-center rounded-full border border-zinc-300 bg-white px-4">
                                    <Search className="size-4 shrink-0 text-zinc-400" />
                                    <input
                                        className="min-h-12 w-full bg-transparent px-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-400"
                                        onBlur={() => {
                                            window.setTimeout(() => setIsSuggestionOpen(false), 120);
                                        }}
                                        onChange={(event) => {
                                            setSearchQuery(event.target.value);
                                            setIsSuggestionOpen(true);
                                            setVisibleArticleCount(articlesPerLoad);
                                        }}
                                        onFocus={() => setIsSuggestionOpen(true)}
                                        placeholder="Cari berita"
                                        type="text"
                                        value={searchQuery}
                                    />
                                </div>

                                {isSuggestionOpen && normalizedSearchQuery ? (
                                    <div className="absolute right-0 top-full z-10 mt-2 max-h-80 w-full overflow-y-auto rounded-xs border border-zinc-200 bg-white shadow-sm">
                                        {suggestedArticles.length > 0 ? (
                                            suggestedArticles.map((article) => (
                                                <button
                                                    className="block w-full border-b border-zinc-100 px-4 py-3 text-left last:border-b-0 hover:bg-zinc-50"
                                                    key={`suggestion-${article.slug}`}
                                                    onClick={() => {
                                                        setSearchQuery(article.title);
                                                        setIsSuggestionOpen(false);
                                                        setVisibleArticleCount(articlesPerLoad);
                                                    }}
                                                    type="button"
                                                >
                                                    <p className="text-sm font-semibold text-zinc-950">{article.title}</p>
                                                    <p className="mt-1 text-xs text-zinc-500">{article.ranting}</p>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="px-4 py-3 text-sm text-zinc-500">Tidak ada hasil</p>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-8 gap-8 lg:flex lg:items-start">
                            <div className="min-w-0 flex-1">
                                <div className="columns-1 gap-5 md:columns-2">
                                    {visibleArticles.map((article) => (
                                        <Link
                                            className="group mb-5 block break-inside-avoid overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-brand-yellow hover:shadow-md"
                                            href={`/berita/${article.slug}`}
                                            key={article.slug}
                                        >
                                            <div className="relative h-56 overflow-hidden bg-zinc-50 sm:h-64">
                                                <img alt="" className="h-full w-full object-cover" loading="lazy" src={article.image} />
                                                <p className="absolute left-0 top-0 rounded-br-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950">
                                                    {article.category}
                                                </p>
                                            </div>
                                            <div className="p-5">
                                                <h2 className="text-2xl font-bold leading-tight text-zinc-950 group-hover:text-brand-yellow-dark">{article.title}</h2>
                                                <p className="mt-4 line-clamp-4 text-sm leading-7 text-zinc-600">{article.excerpt}</p>
                                                <div className="mt-6 flex items-end justify-between gap-4 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
                                                    <div className="min-w-0 space-y-2">
                                                        <p>{article.date}</p>
                                                        <span className="inline-flex max-w-full items-center gap-2">
                                                            <User2 className="size-4 shrink-0" />
                                                            <span className="truncate">{article.author} | {article.ranting}</span>
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0">{article.readTime}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-3">
                                    <button
                                        aria-label="Kurangi berita"
                                        className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-950 transition hover:border-brand-yellow hover:text-brand-yellow disabled:cursor-not-allowed disabled:opacity-35"
                                        disabled={!canShowPreviousArticles}
                                        onClick={() => setVisibleArticleCount((currentCount) => Math.max(articlesPerLoad, currentCount - articlesPerLoad))}
                                        type="button"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button
                                        aria-label="Tambah berita"
                                        className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-950 transition hover:border-brand-yellow hover:text-brand-yellow disabled:cursor-not-allowed disabled:opacity-35"
                                        disabled={!canShowNextArticles}
                                        onClick={() => setVisibleArticleCount((currentCount) => Math.min(articleList.length, currentCount + articlesPerLoad))}
                                        type="button"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            </div>

                            <aside className="mt-8 border border-zinc-200 bg-white p-6 lg:sticky lg:top-24 lg:mt-0 lg:w-80 lg:shrink-0">
                                <p className="text-sm font-bold text-zinc-950">Kategori</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {[allCategoryLabel, ...categories].map((category) => (
                                        <button
                                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                                selectedCategory === category
                                                    ? 'border-brand-yellow bg-brand-yellow text-brand-black'
                                                    : 'border-zinc-200 text-zinc-700 hover:border-brand-yellow hover:text-brand-yellow-dark'
                                            }`}
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setVisibleArticleCount(articlesPerLoad);
                                            }}
                                            type="button"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="mt-6 flex w-full flex-col items-center gap-1 text-xs font-normal text-zinc-500 transition hover:text-brand-yellow-dark"
                                    type="button"
                                >
                                    <span>Kategori lainnya</span>
                                    <ChevronDown className="size-4" />
                                </button>
                                <div className="mt-2 border-t border-zinc-200 pt-6">
                                    <p className="text-sm font-bold text-zinc-950">Terbaru</p>
                                    <div className="mt-4 space-y-4">
                                        {newsArticles.slice(0, 4).map((article) => (
                                            <Link className="block group" href={`/berita/${article.slug}`} key={article.slug}>
                                                <p className="text-xs text-zinc-500">{article.date}</p>
                                                <p className="mt-1 text-xs text-zinc-500">{article.author} | {article.ranting}</p>
                                                <h3 className="mt-1 text-sm font-bold leading-6 text-zinc-950 group-hover:text-brand-yellow-dark">
                                                    {article.title}
                                                </h3>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}

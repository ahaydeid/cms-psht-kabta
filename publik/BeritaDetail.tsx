import { ChevronLeft, Clock3, User2 } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { newsArticles } from './data/newsArticles';
import { Head, Link } from './runtime/inertia-shim';

type BeritaDetailProps = {
    slug: string;
};

export default function BeritaDetail({ slug }: BeritaDetailProps) {
    const article = newsArticles.find((item) => item.slug === slug);
    const otherArticles = newsArticles.filter((item) => item.slug !== slug);
    const sidebarArticles = otherArticles.slice(0, 5);
    const recommendedArticles = article
        ? [
              ...(article.relatedSlugs
                  ?.map((relatedSlug) => newsArticles.find((item) => item.slug === relatedSlug))
                  .filter((item): item is (typeof newsArticles)[number] => Boolean(item)) ?? []),
              ...otherArticles,
          ]
              .filter((item, index, items) => item.slug !== article.slug && items.findIndex((candidate) => candidate.slug === item.slug) === index)
              .slice(0, 4)
        : [];

    return (
        <PublicLayout>
            <Head title={article ? article.title : 'Berita'} />
            <main className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
                    <header className="mb-8 hidden sm:block">
                        <Link className="inline-flex items-center gap-3 text-zinc-600 transition hover:text-brand-black" href="/berita">
                            <ChevronLeft className="size-6" />
                            <span className="text-sm font-light italic">Kembali</span>
                        </Link>
                    </header>

                    {article ? (
                        <>
                            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
                                <article>
                                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-yellow-dark">{article.category}</p>
                                    <h2 className="mt-4 text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">{article.title}</h2>
                                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-zinc-500">
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
                                    <img alt="" className="mt-8 h-auto w-full" src={article.image} />
                                    <div className="mt-8 space-y-6 text-base leading-8 text-zinc-700">
                                        {article.body.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
                                        ))}
                                    </div>
                                </article>

                                <aside className="lg:sticky lg:top-28">
                                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-950">Berita lainnya</p>
                                    <div className="mt-5 space-y-5">
                                        {sidebarArticles.map((item) => (
                                            <Link
                                                className="grid grid-cols-[5rem_1fr] gap-4 border-b border-zinc-200 pb-5 transition hover:border-brand-yellow"
                                                href={`/berita/${item.slug}`}
                                                key={item.slug}
                                            >
                                                <img alt="" className="h-16 w-20 object-cover" loading="lazy" src={item.image} />
                                                <span className="min-w-0">
                                                    <span className="line-clamp-2 text-sm font-bold leading-snug text-zinc-950">{item.title}</span>
                                                    <span className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{item.excerpt}</span>
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link className="mt-5 inline-flex text-sm font-semibold text-brand-yellow-dark hover:text-brand-black" href="/berita">
                                        Lihat semua
                                    </Link>
                                </aside>
                            </div>

                            <section className="mt-16 border-t border-zinc-200 pt-10">
                                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-yellow-dark">Baca juga</p>
                                <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
                                    {recommendedArticles.map((item) => (
                                        <Link className="group block border border-zinc-200 bg-white transition hover:border-brand-yellow" href={`/berita/${item.slug}`} key={item.slug}>
                                            <img alt="" className="h-44 w-full object-cover" loading="lazy" src={item.image} />
                                            <div className="p-5">
                                                <p className="text-xs text-zinc-500">{item.date}</p>
                                                <h3 className="mt-3 line-clamp-2 text-base font-bold leading-tight text-zinc-950 group-hover:text-brand-yellow-dark sm:text-lg">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6">{item.excerpt}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="border border-zinc-200 bg-white p-6 text-sm font-medium text-zinc-600">
                            Berita tidak ditemukan.
                        </div>
                    )}
                </div>
            </main>
        </PublicLayout>
    );
}

import { ArrowRight } from 'lucide-react';

import { latestArticles } from '../../data/homeContent';
import { SectionHeader } from '../common/SectionHeader';

export function NewsSection() {
    return (
        <section className="bg-zinc-50 py-16 sm:py-20" id="berita">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    description="Dummy artikel disiapkan dari satu sumber data agar nanti mudah diganti menjadi data blog dari CMS."
                    eyebrow="Berita"
                    title="Kabar Terbaru Organisasi"
                />

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {latestArticles.map((article) => (
                        <article className="overflow-hidden rounded border border-zinc-200 bg-white" key={article.slug}>
                            <div className="flex aspect-[16/10] items-center justify-center bg-zinc-950 p-10">
                                <img alt="" className="h-full w-full object-contain" src={article.image} />
                            </div>
                            <div className="p-5">
                                <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-500">
                                    <span className="text-brand-red">{article.category}</span>
                                    <span>{article.date}</span>
                                </div>
                                <h3 className="mt-3 text-base font-bold leading-6 text-zinc-950">{article.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">{article.excerpt}</p>
                                <a className="mt-5 inline-flex items-center text-sm font-bold text-brand-red hover:text-brand-red-dark" href="#">
                                    Baca Artikel
                                    <ArrowRight className="ml-2 size-4" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

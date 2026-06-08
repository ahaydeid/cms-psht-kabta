import { galleryItems } from '../../data/homeContent';
import { SectionHeader } from '../common/SectionHeader';

export function GallerySection() {
    return (
        <section className="bg-zinc-950 py-16 text-white sm:py-20" id="galeri">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    description="Placeholder galeri kegiatan. Nanti bisa menjadi modul galeri atau album di CMS."
                    eyebrow="Galeri"
                    title="Dokumentasi Kegiatan"
                />

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {galleryItems.map((item) => (
                        <figure className="rounded border border-white/10 bg-white/5 p-4" key={item.title}>
                            <div className="flex aspect-square items-center justify-center bg-white p-8">
                                <img alt="" className="h-full w-full object-contain" src={item.image} />
                            </div>
                            <figcaption className="mt-4 text-sm font-semibold text-zinc-100">{item.title}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}

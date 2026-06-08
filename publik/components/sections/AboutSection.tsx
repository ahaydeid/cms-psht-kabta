import { CheckCircle2 } from 'lucide-react';

import { organizationProfile } from '../../data/homeContent';
import { SectionHeader } from '../common/SectionHeader';

const values = ['Persaudaraan', 'Budi luhur', 'Kedisiplinan', 'Pengabdian organisasi'];

export function AboutSection() {
    return (
        <section className="bg-white py-16 sm:py-20" id="profil">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    description="Profil singkat organisasi sebagai fondasi awal halaman public. Konten ini nanti bisa diganti dari CMS admin."
                    eyebrow="Profil Organisasi"
                    title="Mengenal PSHT Cabang Kabupaten Tangerang"
                />

                <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div className="border-l-4 border-brand-red bg-zinc-50 p-6">
                        <p className="text-sm leading-7 text-zinc-700">
                            {organizationProfile.name} menjadi wadah informasi public untuk kegiatan organisasi, pendataan, pembinaan,
                            dan komunikasi kepada warga maupun masyarakat umum.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {values.map((value) => (
                            <div className="flex items-center gap-3 rounded border border-zinc-200 bg-white p-4" key={value}>
                                <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                                <span className="text-sm font-semibold text-zinc-800">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

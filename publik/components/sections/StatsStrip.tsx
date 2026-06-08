import { organizationStats } from '../../data/homeContent';

export function StatsStrip() {
    return (
        <section className="bg-brand-yellow">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 py-6 sm:px-6 md:grid-cols-4 lg:px-8">
                {organizationStats.map((item) => (
                    <div className="px-3 py-4 text-center" key={item.label}>
                        <p className="text-3xl font-bold text-zinc-950">{item.value}</p>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-700">{item.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

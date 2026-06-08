import { MapPin } from 'lucide-react';

import { trainingSchedules } from '../../data/homeContent';
import { SectionHeader } from '../common/SectionHeader';

export function TrainingSection() {
    return (
        <section className="bg-white py-16 sm:py-20" id="jadwal">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    description="Area jadwal public untuk menampilkan agenda latihan atau kegiatan organisasi."
                    eyebrow="Jadwal"
                    title="Agenda Latihan dan Kegiatan"
                />

                <div className="mx-auto mt-10 max-w-4xl divide-y divide-zinc-200 rounded border border-zinc-200 bg-white">
                    {trainingSchedules.map((schedule) => (
                        <div className="grid gap-3 p-5 sm:grid-cols-[10rem_1fr_auto] sm:items-center" key={`${schedule.day}-${schedule.place}`}>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Hari</p>
                                <p className="mt-1 font-bold text-zinc-950">{schedule.day}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                                <MapPin className="size-4 text-brand-red" />
                                {schedule.place}
                            </div>
                            <p className="text-sm font-bold text-brand-red">{schedule.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

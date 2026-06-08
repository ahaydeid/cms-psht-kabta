import { Clock3, MapPin, PhoneCall } from 'lucide-react';
import { useState } from 'react';

import { PublicLayout } from './components/layout/PublicLayout';
import { Head } from './runtime/inertia-shim';

type ScheduleLocation = {
    address: string;
    contact: string;
    day: string;
    id: string;
    label: string;
    latitude: number;
    longitude: number;
    time: string;
};

const scheduleLocations: ScheduleLocation[] = [
    {
        address: 'Jl. Raya PSHT No. 12, Kabupaten Tangerang, Banten',
        contact: '0812-3456-7890',
        day: 'Senin, Rabu, Jumat',
        id: 'cabang',
        label: 'Cabang',
        latitude: -6.1782,
        longitude: 106.6319,
        time: '19.30 - 21.30',
    },
    {
        address: 'Jl. Raya Balaraja Barat No. 8, Balaraja, Kabupaten Tangerang',
        contact: '0812-1020-3344',
        day: 'Selasa dan Kamis',
        id: 'ranting-balaraja',
        label: 'Ranting Balaraja',
        latitude: -6.2476,
        longitude: 106.4477,
        time: '20.00 - 22.00',
    },
    {
        address: 'Jl. Citra Raya Utama Blok D, Cikupa, Kabupaten Tangerang',
        contact: '0813-5580-1120',
        day: 'Senin dan Kamis',
        id: 'ranting-cikupa',
        label: 'Ranting Cikupa',
        latitude: -6.2256,
        longitude: 106.5234,
        time: '19.30 - 21.30',
    },
    {
        address: 'Jl. Raya STPI Curug No. 21, Curug, Kabupaten Tangerang',
        contact: '0821-7654-9001',
        day: 'Rabu dan Sabtu',
        id: 'ranting-curug',
        label: 'Ranting Curug',
        latitude: -6.2547,
        longitude: 106.5677,
        time: '19.30 - 21.30',
    },
    {
        address: 'Jl. Raya Kresek No. 5, Kresek, Kabupaten Tangerang',
        contact: '0812-7744-2201',
        day: 'Selasa dan Jumat',
        id: 'ranting-kresek',
        label: 'Ranting Kresek',
        latitude: -6.1313,
        longitude: 106.4511,
        time: '19.30 - 21.30',
    },
    {
        address: 'Jl. Raya Pasar Kemis No. 17, Pasar Kemis, Kabupaten Tangerang',
        contact: '0813-7760-9912',
        day: 'Senin dan Jumat',
        id: 'ranting-pasar-kemis',
        label: 'Ranting Pasar Kemis',
        latitude: -6.1769,
        longitude: 106.5799,
        time: '20.00 - 22.00',
    },
    {
        address: 'Jl. Aria Wangsakara No. 10, Tigaraksa, Kabupaten Tangerang',
        contact: '0812-9910-4002',
        day: 'Rabu dan Minggu',
        id: 'ranting-tigaraksa',
        label: 'Ranting Tigaraksa',
        latitude: -6.2248,
        longitude: 106.5086,
        time: '19.30 - 21.30',
    },
];

function buildMapEmbedUrl(latitude: number, longitude: number) {
    return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}

function buildGoogleMapsUrl(latitude: number, longitude: number) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

function splitScheduleDays(day: string) {
    return day
        .replace(/\s+dan\s+/gi, ', ')
        .split(',')
        .map((scheduleDay) => scheduleDay.trim())
        .filter(Boolean);
}

export default function Jadwal() {
    const [selectedLocationId, setSelectedLocationId] = useState(scheduleLocations[0].id);
    const selectedLocation = scheduleLocations.find((location) => location.id === selectedLocationId) ?? scheduleLocations[0];
    const selectedScheduleDays = splitScheduleDays(selectedLocation.day);

    return (
        <PublicLayout>
            <Head title="Jadwal" />
            <main className="flex min-h-[calc(100dvh-8rem)] flex-1 items-center overflow-hidden px-4 py-6 sm:px-6 lg:min-h-[calc(100dvh-4rem)] lg:px-8">
                <section className="mx-auto flex w-full max-w-7xl flex-col overflow-hidden">
                    <div className="flex shrink-0 flex-col gap-4 border-b border-zinc-200 py-5 lg:flex-row lg:items-end">
                        <label className="block lg:w-80">
                            <select
                                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
                                onChange={(event) => setSelectedLocationId(event.target.value)}
                                value={selectedLocationId}
                            >
                                {scheduleLocations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-2">
                        <div className="flex min-h-0 flex-col border-b border-zinc-200 lg:border-b-0">
                            <div className="flex flex-1 flex-col justify-center gap-5 py-5 sm:pr-6">
                                <p className="text-2xl font-bold leading-tight text-brand-yellow-dark sm:text-3xl">{selectedLocation.label}</p>

                                <article className="border-b border-zinc-200 pb-5">
                                    <div className="flex items-start gap-3">
                                        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950">
                                            <Clock3 className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-950">Hari dan jam</p>
                                            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm leading-7 text-zinc-600">
                                                {selectedScheduleDays.map((scheduleDay) => (
                                                    <div className="contents" key={scheduleDay}>
                                                        <p className="pr-4">{scheduleDay}</p>
                                                        <p className="text-right">{selectedLocation.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>

                                <article className="border-b border-zinc-200 pb-5">
                                    <div className="flex items-start gap-3">
                                        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950">
                                            <PhoneCall className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-950">Kontak yang dapat dihubungi</p>
                                            <p className="mt-2 text-sm leading-7 text-zinc-600">{selectedLocation.contact}</p>
                                        </div>
                                    </div>
                                </article>

                                <article>
                                    <div className="flex items-start gap-3">
                                        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950">
                                            <MapPin className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-950">Lokasi latihan</p>
                                            <p className="mt-2 text-sm leading-7 text-zinc-600">{selectedLocation.address}</p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>

                        <div className="flex min-h-0 flex-col overflow-hidden lg:pl-6">
                            <div className="flex items-center py-4 sm:pl-6">
                                <p className="ml-auto text-right text-xs text-zinc-500">
                                    {selectedLocation.latitude}, {selectedLocation.longitude}
                                </p>
                            </div>

                            <div className="min-h-112 flex-1 overflow-hidden rounded-xl bg-zinc-100 sm:min-h-144 lg:min-h-0">
                                <iframe
                                    className="h-full w-full"
                                    loading="lazy"
                                    src={buildMapEmbedUrl(selectedLocation.latitude, selectedLocation.longitude)}
                                    title={`Peta ${selectedLocation.label}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 justify-start py-4 lg:justify-end">
                        <a
                            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                            href={buildGoogleMapsUrl(selectedLocation.latitude, selectedLocation.longitude)}
                            rel="noreferrer"
                            target="_blank"
                        >
                            Buka di Google Maps
                        </a>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}

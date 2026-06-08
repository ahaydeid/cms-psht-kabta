import { Mail, MapPin, MessageCircle, PhoneCall, Send } from 'lucide-react';

import { PublicLayout } from './components/layout/PublicLayout';
import { Head } from './runtime/inertia-shim';

const contactItems = [
    {
        icon: MapPin,
        label: 'Alamat sekretariat',
        value: 'Jl. Raya Lorem Ipsum No. 12, Kabupaten Tangerang, Banten',
    },
    {
        icon: PhoneCall,
        label: 'Telepon',
        value: '021-5567-8890',
    },
    {
        icon: MessageCircle,
        label: 'WhatsApp',
        value: '0812-3456-7890',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'kontak@pshtkabta.or.id',
    },
];

const serviceHours = [
    { day: 'Senin', hours: '19.30 - 21.30' },
    { day: 'Rabu', hours: '19.30 - 21.30' },
    { day: 'Jumat', hours: '19.30 - 21.30' },
    { day: 'Minggu', hours: '09.00 - 12.00' },
];

const messageRecipients = ['Cabang', 'Ranting Balaraja', 'Ranting Cikupa', 'Ranting Curug', 'Ranting Kresek', 'Ranting Pasar Kemis', 'Ranting Tigaraksa'];

export default function Kontak() {
    return (
        <PublicLayout>
            <Head title="Kontak" />
            <main className="bg-white">
                <section className="border-b border-zinc-200">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                        <p className="text-sm font-semibold text-brand-yellow-dark">Kontak</p>
                        <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-zinc-950 sm:text-4xl">
                            Sekretariat dan jalur komunikasi Cabang Kab. Tangerang
                        </h1>
                    </div>
                </section>

                <section className="py-10 sm:py-12 lg:py-14">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {contactItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        className="relative overflow-hidden rounded-lg p-5 text-white"
                                        key={item.label}
                                        style={{
                                            backgroundColor: '#09090b',
                                            backgroundImage: 'radial-gradient(circle at top right, white 0, white 4.75rem, transparent 4.8rem)',
                                        }}
                                    >
                                        <div className="absolute -right-1 -top-1 inline-flex size-16 items-center justify-center text-zinc-950/70">
                                            <Icon className="size-10" />
                                        </div>
                                        <div className="min-w-0 pr-16">
                                            <p className="text-sm font-semibold text-white">{item.label}</p>
                                            <p className="mt-2 text-sm leading-7 text-zinc-300">{item.value}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="border-t border-zinc-200 py-10 sm:py-12 lg:py-14">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                            <div>
                                <section className="rounded-lg border border-zinc-200 bg-white">
                                    <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4">
                                        <h2 className="text-lg font-semibold text-zinc-950">Jam layanan sekretariat</h2>
                                    </div>
                                    <div className="px-5 py-3">
                                        {serviceHours.map((item) => (
                                            <div className="flex items-center justify-between border-b border-zinc-100 py-3 text-sm last:border-b-0" key={item.day}>
                                                <span className="font-medium text-zinc-700">{item.day}</span>
                                                <span className="text-zinc-500">{item.hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div>
                                <form className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="text-sm font-medium text-zinc-700">Nama</span>
                                            <input
                                                className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
                                                placeholder="Nama pengirim"
                                                type="text"
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-medium text-zinc-700">Kontak</span>
                                            <input
                                                className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
                                                placeholder="Nomor WhatsApp atau email"
                                                type="text"
                                            />
                                        </label>
                                    </div>

                                    <label className="mt-4 block">
                                        <span className="text-sm font-medium text-zinc-700">Ditujukan kepada:</span>
                                        <select
                                            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
                                            defaultValue=""
                                        >
                                            <option disabled value="">
                                                Pilih tujuan pesan
                                            </option>
                                            {messageRecipients.map((recipient) => (
                                                <option key={recipient} value={recipient}>
                                                    {recipient}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="mt-4 block">
                                        <span className="text-sm text-zinc-700">
                                            <span className="font-medium">Perihal</span>{' '}
                                            <span className="font-normal italic text-zinc-500">(opsional)</span>
                                        </span>
                                        <input
                                            className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
                                            placeholder="Perihal pesan"
                                            type="text"
                                        />
                                    </label>

                                    <label className="mt-4 block">
                                        <span className="text-sm font-medium text-zinc-700">Pesan</span>
                                        <textarea
                                            className="mt-2 min-h-36 w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm leading-7 text-zinc-950 outline-none transition focus:border-zinc-950"
                                            placeholder="Tulis pesan di sini"
                                        />
                                    </label>

                                    <div className="mt-5 flex justify-end">
                                        <button
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                                            type="button"
                                        >
                                            Kirim pesan
                                            <Send className="size-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}

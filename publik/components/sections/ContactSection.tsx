import { Mail, MapPin, Phone } from 'lucide-react';

import { organizationProfile } from '../../data/homeContent';
import { SectionHeader } from '../common/SectionHeader';

export function ContactSection() {
    const contacts = [
        {
            icon: MapPin,
            label: 'Alamat',
            value: organizationProfile.address,
        },
        {
            icon: Phone,
            label: 'Telepon',
            value: organizationProfile.phone,
        },
        {
            icon: Mail,
            label: 'Email',
            value: organizationProfile.email,
        },
    ];

    return (
        <section className="bg-white py-16 sm:py-20" id="kontak">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    description="Informasi kontak public organisasi. Untuk sekarang masih dummy dan akan terhubung ke CMS profil website."
                    eyebrow="Kontak"
                    title="Hubungi Kami"
                />

                <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
                    {contacts.map((contact) => {
                        const Icon = contact.icon;

                        return (
                            <div className="rounded border border-zinc-200 bg-zinc-50 p-5 text-center" key={contact.label}>
                                <Icon className="mx-auto size-6 text-brand-red" />
                                <p className="mt-3 text-sm font-bold text-zinc-950">{contact.label}</p>
                                <p className="mt-2 text-sm leading-6 text-zinc-600">{contact.value}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

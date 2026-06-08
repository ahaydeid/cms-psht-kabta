import { organizationProfile } from '../../data/homeContent';
import { publicNavigationItems } from '../../data/navigation';
import { Link } from '../../runtime/inertia-shim';

const legalItems = [
    'AHU-00000',
];

export function PublicFooter() {
    const mainMenuItems = publicNavigationItems.filter((item) => !item.children);
    const profileMenu = publicNavigationItems.find((item) => item.label === 'Profil');

    return (
        <footer className="border-t border-zinc-200 bg-zinc-950 pb-20 text-white lg:pb-0">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1fr]">
                    <div>
                        <div className="flex items-center gap-3">
                            <img alt="Logo PSHT" className="size-12 object-contain" src={organizationProfile.logo} />
                            <div>
                                <p className="text-base font-bold">{organizationProfile.name}</p>
                                <p className="text-sm text-zinc-400">{organizationProfile.address}</p>
                            </div>
                        </div>
                        <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
                            {organizationProfile.description}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-white">Menu</p>
                        <div className="mt-4 grid gap-3">
                            {mainMenuItems.map((item) => (
                                <Link className="text-sm text-zinc-400 transition hover:text-brand-yellow" href={item.href} key={item.href}>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-white">Profil</p>
                        <div className="mt-4 grid gap-3">
                            {profileMenu?.children?.map((item) => (
                                <Link className="text-sm text-zinc-400 transition hover:text-brand-yellow" href={item.href} key={item.href}>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-white">Legalitas</p>
                        <div className="mt-4 grid gap-2 text-sm leading-6 text-zinc-400">
                            {legalItems.map((item) => (
                                <p key={item}>{item}</p>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-white/10 pt-5">
                            <p className="text-sm font-bold text-white">Kontak</p>
                            <div className="mt-3 grid gap-2 text-sm text-zinc-400">
                                <a className="transition hover:text-brand-yellow" href={`mailto:${organizationProfile.email}`}>
                                    {organizationProfile.email}
                                </a>
                                <a className="transition hover:text-brand-yellow" href={`tel:${organizationProfile.phone}`}>
                                    {organizationProfile.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>Copyright 2026. Semua hak cipta dilindungi.</p>
                    <p>PSHT Cabang Kabupaten Tangerang, Banten.</p>
                </div>
            </div>
        </footer>
    );
}

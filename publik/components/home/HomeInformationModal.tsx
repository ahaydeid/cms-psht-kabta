import { X } from 'lucide-react';

import type { PublicInformationPopup } from '../../types';

type HomeInformationModalProps = {
    information: PublicInformationPopup;
    onClose: () => void;
};

export function HomeInformationModal({ information, onClose }: HomeInformationModalProps) {
    if (!information.isActive) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
            <section className="relative w-full max-w-lg overflow-hidden rounded border border-zinc-200 bg-white shadow-xl lg:max-w-3xl">
                <button
                    aria-label="Tutup informasi"
                    className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center text-zinc-500 transition hover:text-zinc-900"
                    onClick={onClose}
                    type="button"
                >
                    <X className="size-5" />
                </button>

                {information.imageUrl ? (
                    <div className="flex aspect-video items-center justify-center bg-zinc-100 p-8 lg:p-12">
                        <img
                            alt={information.imageAlt ?? information.title}
                            className="max-h-full max-w-full object-contain"
                            src={information.imageUrl}
                        />
                    </div>
                ) : null}

                <div className="p-6 pr-14 lg:p-8 lg:pr-16">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow-dark">{information.date}</p>
                    <h2 className="mt-3 text-2xl font-bold text-zinc-950 lg:text-3xl">{information.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-zinc-600 lg:text-base lg:leading-8">{information.body}</p>
                </div>
            </section>
        </div>
    );
}

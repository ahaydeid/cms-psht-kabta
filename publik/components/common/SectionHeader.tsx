type SectionHeaderProps = {
    eyebrow: string;
    title: string;
    description?: string;
};

export function SectionHeader({ description, eyebrow, title }: SectionHeaderProps) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-red">{eyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold text-zinc-900 sm:text-3xl">{title}</h2>
            {description ? <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p> : null}
        </div>
    );
}


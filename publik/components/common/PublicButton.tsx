import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/cn';

type PublicButtonVariant = 'primary' | 'secondary' | 'outline';

type PublicButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: ReactNode;
    variant?: PublicButtonVariant;
};

const variants: Record<PublicButtonVariant, string> = {
    primary: 'bg-brand-red text-white hover:bg-brand-red-dark',
    secondary: 'bg-brand-yellow text-brand-black hover:bg-brand-yellow-dark hover:text-white',
    outline: 'border border-zinc-300 bg-white text-zinc-800 hover:border-brand-red hover:text-brand-red',
};

export function PublicButton({ children, className, variant = 'primary', ...props }: PublicButtonProps) {
    return (
        <a
            className={cn(
                'inline-flex min-h-11 items-center justify-center rounded px-5 text-sm font-semibold transition active:scale-95',
                variants[variant],
                className,
            )}
            {...props}
        >
            {children}
        </a>
    );
}

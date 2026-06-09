import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'unstyled';
};

const variants = {
    default: 'border-brand-black bg-brand-black text-white',
    secondary: 'border-zinc-500 bg-zinc-500 text-white',
    destructive: 'border-brand-red bg-brand-red text-white',
    outline: 'border-zinc-200 bg-white text-brand-black',
    success: 'border-emerald-500 bg-emerald-500 text-white',
    warning: 'border-brand-yellow bg-brand-yellow text-brand-black',
    info: 'border-zinc-700 bg-zinc-700 text-white',
    unstyled: '',
};

const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
};

export function Badge({ className = '', size = 'md', variant = 'default', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border tracking-tight transition-colors',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        />
    );
}

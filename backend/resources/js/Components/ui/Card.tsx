import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    title?: string;
};

export function Card({ children, className = '', title, ...props }: CardProps) {
    return (
        <div className={cn('mb-3 break-inside-avoid rounded border border-zinc-200 bg-white p-5', className)} {...props}>
            {title ? <h2 className="mb-4 text-xl font-semibold text-brand-red">{title}</h2> : null}
            {children}
        </div>
    );
}

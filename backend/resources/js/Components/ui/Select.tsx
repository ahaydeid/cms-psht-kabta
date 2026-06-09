import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    containerClassName?: string;
    error?: string;
    label?: string;
};

export function Select({ children, className = '', containerClassName = '', error, id, label, ...props }: SelectProps) {
    const selectId = id ?? props.name;

    return (
        <div className={cn('w-full space-y-1.5 text-left', containerClassName)}>
            {label ? (
                <label className="ml-0.5 block text-xs font-medium text-zinc-700" htmlFor={selectId}>
                    {label}
                </label>
            ) : null}
            <select
                className={cn(
                    'w-full rounded border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-brand-black outline-none transition-all focus:ring-1 focus:ring-brand-yellow/30',
                    error ? 'border-brand-red bg-red-50' : '',
                    className,
                )}
                id={selectId}
                {...props}
            >
                {children}
            </select>
            {error ? <p className="ml-1 mt-1 text-[10px] font-medium text-brand-red">{error}</p> : null}
        </div>
    );
}

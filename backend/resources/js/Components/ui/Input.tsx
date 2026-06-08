import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    containerClassName?: string;
    error?: string;
    label?: string;
    requiredNote?: string;
    variant?: 'underlined' | 'box';
};

const variants = {
    underlined: 'rounded-none border-b border-zinc-300 bg-transparent px-1 focus:border-yellow-600',
    box: 'rounded border border-zinc-200 bg-white px-4 focus:ring-1 focus:ring-yellow-400/30',
};

export function Input({
    className = '',
    containerClassName = '',
    error,
    id,
    label,
    requiredNote,
    variant = 'box',
    ...props
}: InputProps) {
    const inputId = id ?? props.name;

    return (
        <div className={cn('w-full space-y-1.5', containerClassName)}>
            {label ? (
                <div className="flex items-center justify-between gap-3">
                    <label
                        className={cn('ml-0.5 block text-xs font-medium text-zinc-700', error ? 'text-red-600' : '')}
                        htmlFor={inputId}
                    >
                        {label}
                    </label>
                    {requiredNote ? <span className="shrink-0 text-xs italic text-rose-600">{requiredNote}</span> : null}
                </div>
            ) : null}
            <input
                className={cn(
                    'w-full py-2 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400',
                    variants[variant],
                    error ? 'border-red-600 bg-red-50 focus:border-red-600' : '',
                    className,
                )}
                id={inputId}
                {...props}
            />
            {error ? <p className="ml-1 mt-1 text-[10px] font-medium text-red-600 md:text-xs">{error}</p> : null}
        </div>
    );
}

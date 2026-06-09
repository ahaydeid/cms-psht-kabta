import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: string;
    label?: string;
};

export function Textarea({ className = '', error, id, label, ...props }: TextareaProps) {
    const textareaId = id ?? props.name;

    return (
        <div className="w-full space-y-1.5">
            {label ? (
                <label className="ml-0.5 block text-xs font-medium text-zinc-700" htmlFor={textareaId}>
                    {label}
                </label>
            ) : null}
            <textarea
                className={cn(
                    'min-h-24 w-full rounded border border-zinc-200 bg-white px-4 py-2 text-sm text-brand-black outline-none transition-all placeholder:text-zinc-400 focus:ring-1 focus:ring-brand-yellow/30',
                    error ? 'border-brand-red bg-red-50' : '',
                    className,
                )}
                id={textareaId}
                {...props}
            />
            {error ? <p className="ml-1 mt-1 text-[10px] font-medium text-brand-red">{error}</p> : null}
        </div>
    );
}

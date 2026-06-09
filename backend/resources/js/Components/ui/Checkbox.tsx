import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export function Checkbox({ className = '', id, label, ...props }: CheckboxProps) {
    return (
        <label className="group flex cursor-pointer items-center gap-2" htmlFor={id}>
            <input
                className={cn('size-4 cursor-pointer rounded border-zinc-300 text-brand-red focus:ring-brand-yellow', className)}
                id={id}
                type="checkbox"
                {...props}
            />
            <span className="text-sm font-medium text-zinc-700 transition-colors group-hover:text-brand-black">{label}</span>
        </label>
    );
}

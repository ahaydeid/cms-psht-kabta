import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export type ToggleSwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label?: string;
};

export function ToggleSwitch({ checked, className = '', label, ...props }: ToggleSwitchProps) {
    return (
        <label className={cn('inline-flex cursor-pointer items-center gap-2', className)}>
            <input checked={checked} className="peer sr-only" type="checkbox" {...props} />
            <span className="relative h-6 w-11 rounded-full bg-zinc-300 transition peer-checked:bg-brand-yellow after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
            {label ? <span className="text-sm font-medium text-zinc-700">{label}</span> : null}
        </label>
    );
}

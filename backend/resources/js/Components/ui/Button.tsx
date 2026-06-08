import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'link' | 'success' | 'info' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode;
    isLoading?: boolean;
    size?: ButtonSize;
    variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-yellow-400 text-zinc-950 hover:bg-yellow-500',
    secondary: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-yellow-400 text-zinc-950 hover:bg-yellow-500',
    ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100',
    link: 'h-auto bg-transparent p-0 text-red-600 hover:underline',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    info: 'bg-sky-600 text-white hover:bg-sky-700',
    outline: 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50',
};

const sizes: Record<ButtonSize, string> = {
    sm: 'rounded px-3 py-1.5 text-xs',
    md: 'rounded px-4 py-2 text-sm',
    lg: 'rounded px-5 py-2.5 text-sm',
    xl: 'rounded-lg px-8 py-3',
};

export function Button({
    children,
    className = '',
    disabled,
    icon,
    isLoading = false,
    size = 'md',
    type = 'button',
    variant = 'primary',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex cursor-pointer items-center justify-center font-medium transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
                variants[variant],
                sizes[size],
                className,
            )}
            disabled={disabled || isLoading}
            type={type}
            {...props}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {!isLoading && icon ? <span className="mr-2">{icon}</span> : null}
            {children}
        </button>
    );
}

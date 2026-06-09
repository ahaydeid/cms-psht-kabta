import type { HTMLAttributes, ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

import { cn } from '@/lib/cn';

type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
    description?: ReactNode;
    title: string;
    variant?: AlertVariant;
};

const variants = {
    success: { icon: CheckCircle2, style: 'border-emerald-200 bg-emerald-50 text-emerald-950', iconStyle: 'text-emerald-600' },
    warning: { icon: AlertTriangle, style: 'border-brand-yellow/50 bg-brand-yellow/10 text-brand-black', iconStyle: 'text-brand-yellow-dark' },
    danger: { icon: XCircle, style: 'border-brand-red/30 bg-brand-red/10 text-brand-red-dark', iconStyle: 'text-brand-red' },
    info: { icon: Info, style: 'border-zinc-200 bg-zinc-50 text-zinc-900', iconStyle: 'text-zinc-700' },
};

export function Alert({ children, className = '', description, title, variant = 'info', ...props }: AlertProps) {
    const config = variants[variant];
    const Icon = config.icon;

    return (
        <div className={cn('flex gap-3 rounded border p-4', config.style, className)} role="alert" {...props}>
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', config.iconStyle)} />
            <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
                {children}
            </div>
        </div>
    );
}

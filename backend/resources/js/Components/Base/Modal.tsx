import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { cn } from '@/lib/cn';

export type ModalProps = {
    children: ReactNode;
    footer?: ReactNode;
    headerEnd?: ReactNode;
    headerMiddle?: ReactNode;
    onClose: () => void;
    open: boolean;
    rounded?: 'none' | 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    showClose?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
    staggerContent?: boolean;
    subtitle?: ReactNode;
    title?: ReactNode;
};

const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
    '3xl': 'max-w-5xl',
    '4xl': 'max-w-6xl',
    '5xl': 'max-w-7xl',
    '6xl': 'max-w-[1280px]',
    full: 'max-w-full',
};

const roundness = {
    none: 'rounded-none',
    base: 'rounded',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
};

export default function Modal({
    children,
    footer,
    headerEnd,
    headerMiddle,
    onClose,
    open,
    rounded = 'base',
    showClose = true,
    size = 'md',
    staggerContent = true,
    subtitle,
    title,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isRendered, setIsRendered] = useState(open);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) {
            return;
        }

        let frameId: number | null = null;
        let timeoutId: number | null = null;

        if (open) {
            setIsVisible(false);
            setIsRendered(true);
            frameId = window.requestAnimationFrame(() => {
                frameId = window.requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            timeoutId = window.setTimeout(() => setIsRendered(false), 180);
            document.body.style.overflow = 'auto';
        }

        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
            document.body.style.overflow = 'auto';
        };
    }, [isMounted, open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose, open]);

    if (!isMounted || !isRendered) {
        return null;
    }

    const isFull = size === 'full';
    const enteredState = isVisible ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0';
    const sectionTransition = staggerContent
        ? 'transition-all duration-250 ease-out motion-reduce:transition-none'
        : 'transition-all duration-200 ease-out motion-reduce:transition-none';
    const contentTransition = staggerContent
        ? 'transition-all delay-75 duration-250 ease-out motion-reduce:transition-none'
        : 'transition-all duration-200 ease-out motion-reduce:transition-none';
    const footerTransition = staggerContent
        ? 'transition-all delay-120 duration-250 ease-out motion-reduce:transition-none'
        : 'transition-all duration-200 ease-out motion-reduce:transition-none';

    return createPortal(
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-200 ease-out motion-reduce:transition-none',
                isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
                isFull ? 'p-0' : 'p-4',
            )}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className={cn(
                    'flex w-full overflow-hidden bg-white shadow-lg transition-all duration-200 ease-out motion-reduce:transition-none',
                    sizes[size],
                    isFull ? 'h-screen max-h-screen rounded-none flex-col' : `${roundness[rounded]} max-h-[calc(100dvh-2rem)] flex-col`,
                    isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.985] opacity-0',
                )}
                ref={modalRef}
            >
                {(title || subtitle || headerMiddle || headerEnd || showClose) ? (
                    <div
                        className={cn(
                            'mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-zinc-100 px-6 py-4 sm:grid-cols-[1fr_auto_1fr]',
                            sectionTransition,
                            enteredState,
                        )}
                    >
                        <div className="col-start-1 row-start-1 min-w-0 justify-self-start">
                            {title ? <h3 className="text-lg font-bold text-brand-black">{title}</h3> : null}
                            {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
                        </div>
                        {headerMiddle ? (
                            <div className="col-span-2 row-start-2 min-w-0 justify-self-stretch sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-self-center">
                                {headerMiddle}
                            </div>
                        ) : (
                            <div className="hidden sm:block" />
                        )}
                        <div className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end sm:col-start-3">
                            {headerEnd}
                        {showClose ? (
                            <button
                                className="group cursor-pointer rounded-full p-1 transition-colors hover:bg-zinc-100"
                                onClick={onClose}
                                type="button"
                            >
                                <X className="h-5 w-5 text-zinc-400 group-hover:text-zinc-700" />
                            </button>
                        ) : null}
                        </div>
                    </div>
                ) : null}
                <div className={cn(isFull ? 'flex h-full flex-col overflow-hidden' : 'flex min-h-0 flex-col p-4')}>
                    <div
                        className={cn(
                            isFull ? 'min-h-0 flex-1 overflow-y-auto px-6 py-4' : 'min-h-0 overflow-y-auto pr-1',
                            contentTransition,
                            enteredState,
                        )}
                    >
                        {children}
                    </div>
                    {footer ? (
                        <div
                            className={cn(
                                'flex shrink-0 justify-end gap-3 border-t border-zinc-100',
                                isFull ? 'bg-white px-6 py-4' : 'mt-6 pt-6',
                                footerTransition,
                                enteredState,
                            )}
                        >
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>,
        document.body,
    );
}

import Swal from 'sweetalert2';

type ConfirmOptions = {
    title?: string;
    text?: string;
    confirmButtonClassName?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    variant?: 'danger' | 'info' | 'primary' | 'success' | 'warning';
};

type ToastOptions = {
    title: string;
    icon?: 'success' | 'error' | 'warning' | 'info';
};

const brandButtons = {
    cancelButtonColor: '#e4e4e7',
    confirmButtonColor: '#facc15',
};

const confirmButtonColors = {
    danger: brandButtons.confirmButtonColor,
    info: brandButtons.confirmButtonColor,
    primary: brandButtons.confirmButtonColor,
    success: brandButtons.confirmButtonColor,
    warning: brandButtons.confirmButtonColor,
};

const confirmButtonClasses = {
    danger: 'text-zinc-950!',
    info: 'text-zinc-950!',
    primary: 'text-zinc-950!',
    success: 'text-zinc-950!',
    warning: 'text-zinc-950!',
};

const alertTitleClassName = 'text-2xl!';

export function confirmAction(options: ConfirmOptions = {}) {
    const variant = options.variant ?? 'primary';

    return Swal.fire({
        title: options.title ?? 'Konfirmasi tindakan',
        text: options.text ?? 'Data akan diproses.',
        icon: variant === 'danger' ? 'warning' : 'question',
        showCancelButton: true,
        confirmButtonText: options.confirmButtonText ?? 'Ya, lanjutkan',
        cancelButtonText: options.cancelButtonText ?? 'Batal',
        reverseButtons: true,
        cancelButtonColor: brandButtons.cancelButtonColor,
        ...(options.confirmButtonClassName ? {} : { confirmButtonColor: confirmButtonColors[variant] }),
        customClass: {
            title: alertTitleClassName,
            confirmButton: options.confirmButtonClassName ?? confirmButtonClasses[variant],
            cancelButton: 'text-zinc-700!',
        },
    });
}

export function showToast({ title, icon = 'success' }: ToastOptions) {
    return Swal.fire({
        title,
        icon,
        timer: icon === 'success' ? 1800 : undefined,
        timerProgressBar: icon === 'success',
        confirmButtonColor: brandButtons.confirmButtonColor,
        customClass: {
            title: alertTitleClassName,
            confirmButton: 'text-zinc-950!',
        },
    });
}

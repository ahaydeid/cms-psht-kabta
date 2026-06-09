import { resolvePhotoSrc } from '../../lib/photo';

type AvatarProps = {
    name?: string;
    photo?: string | null;
    size?: 'small' | 'medium' | 'large';
    className?: string;
    storagePrefix?: boolean;
};

export function Avatar({
    name = '',
    photo = null,
    size = 'medium',
    className = '',
    storagePrefix = true,
}: AvatarProps) {
    const sizeClasses = {
        small: 'h-8 w-8 text-xs',
        medium: 'h-12 w-12 text-sm',
        large: 'h-20 w-20 text-2xl',
    } as const;

    const photoUrl = storagePrefix ? resolvePhotoSrc(photo) : photo;

    if (!photoUrl) {
        return (
            <div className={`${sizeClasses[size]} flex items-center justify-center rounded-full overflow-hidden ${className}`} aria-label={name || 'User'} role="img">
                <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
                    <circle cx="50" cy="50" r="43" fill="#6b7280" />
                    <circle cx="50" cy="36" r="14" fill="white" />
                    <path d="M24 78c5-16 16-25 26-25s21 9 26 25c-7 6-16 10-26 10s-19-4-26-10Z" fill="white" />
                </svg>
            </div>
        );
    }

    return <img src={photoUrl} alt={name || 'User'} className={`${sizeClasses[size]} rounded-full object-cover ${className}`} />;
}

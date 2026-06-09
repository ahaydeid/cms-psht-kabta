export function resolvePhotoSrc(photo: string | null | undefined) {
    if (!photo) return null;

    const trimmed = photo.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("storage/")) {
        return withStorageOrigin(`/${trimmed}`);
    }

    if (trimmed.startsWith("/storage/")) {
        return withStorageOrigin(trimmed);
    }

    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("data:") ||
        trimmed.startsWith("blob:") ||
        trimmed.startsWith("/")
    ) {
        return trimmed;
    }

    return withStorageOrigin(`/storage/${trimmed}`);
}

function withStorageOrigin(path: string) {
    const origin = import.meta.env.VITE_STORAGE_ORIGIN || "";

    return origin ? `${origin}${path}` : path;
}

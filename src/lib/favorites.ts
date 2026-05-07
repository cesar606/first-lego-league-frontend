export type FavoriteKind = "team" | "edition" | "competition-table";

export interface FavoriteItem {
    readonly kind: FavoriteKind;
    readonly href: string;
    readonly label: string;
    readonly subtitle?: string;
}

export const FAVORITES_STORAGE_KEY = "APP_FAVORITES";
export const FAVORITES_CHANGED_EVENT = "fll:favorites-changed";

function readRawFavorites(): FavoriteItem[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((item): item is FavoriteItem =>
            typeof item === "object"
            && item !== null
            && typeof (item as FavoriteItem).kind === "string"
            && typeof (item as FavoriteItem).href === "string"
            && typeof (item as FavoriteItem).label === "string"
        );
    } catch {
        return [];
    }
}

function writeRawFavorites(favorites: FavoriteItem[]) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

export function getFavorites(): FavoriteItem[] {
    return readRawFavorites();
}

export function subscribeFavorites(callback: () => void): () => void {
    if (typeof window === "undefined") {
        return () => {};
    }

    const listener = () => callback();
    window.addEventListener(FAVORITES_CHANGED_EVENT, listener);
    window.addEventListener("storage", listener);

    return () => {
        window.removeEventListener(FAVORITES_CHANGED_EVENT, listener);
        window.removeEventListener("storage", listener);
    };
}

export function isFavorite(href: string): boolean {
    return readRawFavorites().some((item) => item.href === href);
}

export function addFavorite(item: FavoriteItem): FavoriteItem[] {
    const favorites = readRawFavorites();
    const next = [item, ...favorites.filter((favorite) => favorite.href !== item.href)];
    writeRawFavorites(next);
    return next;
}

export function removeFavorite(href: string): FavoriteItem[] {
    const next = readRawFavorites().filter((item) => item.href !== href);
    writeRawFavorites(next);
    return next;
}

export function toggleFavorite(item: FavoriteItem): FavoriteItem[] {
    const favorites = readRawFavorites();
    const exists = favorites.some((favorite) => favorite.href === item.href);

    if (exists) {
        return removeFavorite(item.href);
    }

    return addFavorite(item);
}

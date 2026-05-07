"use client";

import { buttonVariants } from "@/app/components/button";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Bookmark, ChevronDown, Star, Trash2 } from "lucide-react";
import { getFavorites, removeFavorite, subscribeFavorites, type FavoriteItem } from "@/lib/favorites";
import { cn } from "@/lib/utils";

interface FavoritesDropdownProps {
    readonly mobile?: boolean;
}

function getKindLabel(kind: FavoriteItem["kind"]): string {
    switch (kind) {
        case "team":
            return "Team";
        case "edition":
            return "Edition";
        case "competition-table":
            return "Table";
        default:
            return "Favorite";
    }
}

export default function FavoritesDropdown({ mobile = false }: Readonly<FavoritesDropdownProps>) {
    const favorites = useSyncExternalStore(
        subscribeFavorites,
        getFavorites,
        () => []
    );
    const [isOpen, setIsOpen] = useState(false);
    const sortedFavorites = useMemo(() => [...favorites], [favorites]);

    function handleRemove(href: string) {
        removeFavorite(href);
    }

    const trigger = (
        <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isOpen ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                mobile && "w-full justify-between px-4 py-3 text-base"
            )}
        >
            <span className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Favorites
            </span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>
    );

    if (mobile) {
        return (
            <div className="space-y-2">
                {trigger}
                {isOpen && (
                    <div className="space-y-2 rounded-md border border-border bg-card p-2">
                        {sortedFavorites.length === 0 ? (
                            <p className="px-2 py-2 text-sm text-muted-foreground">No favorites yet.</p>
                        ) : (
                            sortedFavorites.map((item) => (
                                <div key={item.href} className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-secondary/40">
                                    <Link href={item.href} className="min-w-0 flex-1" onClick={() => setIsOpen(false)}>
                                        <span className="block truncate text-sm font-medium text-foreground">{item.label}</span>
                                        <span className="block text-xs text-muted-foreground">{getKindLabel(item.kind)}</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(item.href)}
                                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                                        aria-label={`Remove ${item.label} from favorites`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            {trigger}

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 cursor-default bg-transparent"
                        onClick={() => setIsOpen(false)}
                        role="button"
                        tabIndex={-1}
                        aria-label="Close favorites menu"
                    />

                    <div className="absolute right-0 top-full z-50 mt-2 w-80 animate-in fade-in zoom-in-95">
                        <div className="rounded-md border border-border bg-card p-2 shadow-lg">
                            <div className="flex items-center gap-2 px-2 py-2">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Favorites</p>
                                    <p className="text-xs text-muted-foreground">Quick access to your most used records.</p>
                                </div>
                            </div>

                            <div className="mt-1 space-y-1">
                                {sortedFavorites.length === 0 ? (
                                    <p className="px-2 py-3 text-sm text-muted-foreground">No favorites yet.</p>
                                ) : (
                                    sortedFavorites.map((item) => (
                                        <div key={item.href} className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-secondary/50">
                                            <Link href={item.href} className="min-w-0 flex-1" onClick={() => setIsOpen(false)}>
                                                <span className="block truncate text-sm font-medium text-foreground">{item.label}</span>
                                                <span className="block text-xs text-muted-foreground">{getKindLabel(item.kind)}</span>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(item.href)}
                                                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                                                aria-label={`Remove ${item.label} from favorites`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

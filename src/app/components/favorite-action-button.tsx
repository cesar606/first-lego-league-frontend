"use client";

import { Button } from "@/app/components/button";
import { type FavoriteItem, isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/favorites";
import { Star } from "lucide-react";
import { useSyncExternalStore } from "react";

interface FavoriteActionButtonProps {
    readonly item: FavoriteItem;
    readonly className?: string;
}

export default function FavoriteActionButton({ item, className }: Readonly<FavoriteActionButtonProps>) {
    const favorite = useSyncExternalStore(
        subscribeFavorites,
        () => isFavorite(item.href),
        () => false
    );

    function handleClick() {
        toggleFavorite(item);
    }

    return (
        <Button
            type="button"
            variant={favorite ? "secondary" : "outline"}
            size="sm"
            onClick={handleClick}
            className={className}
        >
            <Star className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
            {favorite ? "Remove favorite" : "Add to favorites"}
        </Button>
    );
}

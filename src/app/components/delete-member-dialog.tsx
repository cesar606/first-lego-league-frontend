'use client';

import { Button } from '@/app/components/button';

export function DeleteMemberDialog({ isOpen, onConfirm, onCancel, isLoading }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded">
                <p>Are you sure?</p>
                <div className="flex gap-2 mt-3">
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button onClick={onConfirm} disabled={isLoading}>Delete</Button>
                </div>
            </div>
        </div>
    );
}
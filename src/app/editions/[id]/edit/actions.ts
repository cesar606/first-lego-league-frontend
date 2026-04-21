'use server';

import { revalidatePath } from 'next/cache';
import { EditionsService } from '@/api/editionApi';
import { serverAuthProvider } from '@/lib/authProvider';


export async function updateEdition(id: string, formData: FormData) {
    const year = formData.get('year');
    const venueName = formData.get('venueName');
    const description = formData.get('description');
    const state = formData.get('state');

    try {
        const service = new EditionsService(serverAuthProvider);
        await service.updateEdition(id, { 
            year: year ? Number(year) : undefined,
            venueName: venueName ? String(venueName) : undefined,
            description: description ? String(description) : undefined,
            state: state ? String(state) : undefined,
        });

        revalidatePath(`/editions/${id}`);
        revalidatePath(`/editions/${id}/edit`);
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function fetchEdition(id: string) {
    try {
        const service = new EditionsService(serverAuthProvider);
        return await service.getEditionById(id);
    } catch (error) {
        throw new Error(`Failed to load edition: ${String(error)}`);
    }
}
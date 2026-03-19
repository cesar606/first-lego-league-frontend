export function getEncodedResourceId(resourceUri?: string): string | null {
    const sanitizedUri = resourceUri?.split(/[?#]/, 1)[0] ?? "";
    const segments = sanitizedUri.split("/").filter(Boolean);
    const resourceId = segments.at(-1);

    return resourceId ? encodeURIComponent(resourceId) : null;
}

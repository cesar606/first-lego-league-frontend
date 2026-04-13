import { API_BASE_URL } from "@/api/halClient";
import type { AuthStrategy } from "@/lib/authProvider";
import type { LeaderboardPageResponse } from "@/types/leaderboard";
import {
    ApiError,
    AuthenticationError,
    NetworkError,
    NotFoundError,
    ServerError,
    ValidationError,
} from "@/types/errors";

export class LeaderboardService {
    constructor(private readonly authStrategy: AuthStrategy) {}

    async getEditionLeaderboard(editionId: string, page = 0, size = 20): Promise<LeaderboardPageResponse> {
        const encodedId = encodeURIComponent(editionId);
        const url = `${API_BASE_URL}/leaderboards/editions/${encodedId}?page=${page}&size=${size}`;
        const authorization = await this.authStrategy.getAuth();

        let res: Response;
        try {
            res = await fetch(url, {
                headers: {
                    Accept: "application/json",
                    ...(authorization ? { Authorization: authorization } : {}),
                },
                cache: "no-store",
            });
        } catch (e) {
            if (e instanceof TypeError) throw new NetworkError(undefined, e);
            throw e;
        }

        if (!res.ok) {
            let errorMessage: string | undefined;
            try {
                const contentType = res.headers.get("content-type");
                if (contentType?.toLowerCase().includes("json")) {
                    const body = await res.json();
                    errorMessage = body.message || body.error || body.detail;
                }
            } catch {
                // ignore, fall back to generic messages
            }

            switch (res.status) {
                case 401:
                case 403:
                    throw new AuthenticationError(errorMessage, res.status);
                case 404:
                    throw new NotFoundError(errorMessage);
                case 400:
                    throw new ValidationError(errorMessage);
                case 500:
                case 502:
                case 503:
                case 504:
                    throw new ServerError(errorMessage, res.status);
                default:
                    throw new ApiError(errorMessage ?? "An error occurred. Please try again.", res.status, true);
            }
        }

        return res.json() as Promise<LeaderboardPageResponse>;
    }
}

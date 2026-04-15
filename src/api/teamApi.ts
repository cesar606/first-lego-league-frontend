import type { AuthStrategy } from "@/lib/authProvider";
import { Team } from "@/types/team";
import { User } from "@/types/user";
import {
    fetchHalCollection,
    fetchHalResource,
    createHalResource,
    deleteHal
} from "./halClient";
import { Resource } from "halfred";

function getSafeEncodedId(id: string): string {
    try {
        return encodeURIComponent(decodeURIComponent(id));
    } catch {
        return encodeURIComponent(id);
    }
}

export interface AddMemberPayload {
    name: string;
    role: string;
}

export class TeamsService {
    constructor(private readonly authStrategy: AuthStrategy) { }

    async getTeams(): Promise<Team[]> {
        return fetchHalCollection<Team>('/teams', this.authStrategy, 'teams');
    }

    async getTeamById(id: string): Promise<Team> {
        const teamId = getSafeEncodedId(id);
        return fetchHalResource<Team>(`/teams/${teamId}`, this.authStrategy);
    }

    async getTeamCoach(id: string): Promise<User[]> {
        const teamId = getSafeEncodedId(id);
        return fetchHalCollection<User>(`/teams/${teamId}/trainedBy`, this.authStrategy, 'coaches');
    }

    async getTeamMembers(teamId: string): Promise<User[]> {
        return fetchHalCollection<User>(
            `/teamMembers?team=/teams/${encodeURIComponent(teamId)}`,
            this.authStrategy,
            'teamMembers'
        );
    }
    async addTeamMember(teamId: string, data: AddMemberPayload): Promise<User> {
        const id = getSafeEncodedId(teamId);
        return createHalResource<User>(
            `/teams/${id}/members`,
            data as Resource,
            this.authStrategy,
            'team member'
        );
    }

    async removeTeamMember(teamId: string, memberId: string): Promise<void> {
        await deleteHal(`/teams/${teamId}/members/${memberId}`, this.authStrategy);
    }
}
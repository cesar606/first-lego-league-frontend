'use server';

import { AwardsService } from "@/api/awardApi";
import { EditionsService } from "@/api/editionApi";
import { TeamsService } from "@/api/teamApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { isAdmin } from "@/lib/authz";
import { getEncodedResourceId } from "@/lib/halRoute";
import { AuthenticationError, NotFoundError } from "@/types/errors";
import { Team } from "@/types/team";
import { UsersService } from "@/api/userApi";

type CreateAwardResult =
    | { success: true }
    | { success: false; error: string };

type CreateAwardFormPayload = {
    name: string;
    title: string;
    category: string;
    edition: string;
};

function getResourceHref(resource: Team): string | null {
    return resource.link("self")?.href ?? resource.uri ?? null;
}

function getTeamEditionHref(team: Team): string | null {
    return team.link("edition")?.href ?? (typeof Reflect.get(team, "edition") === "string" ? Reflect.get(team, "edition") : null);
}

export async function createAwardForTeam(
    teamId: string,
    payload: CreateAwardFormPayload
): Promise<CreateAwardResult> {
    try {
        const name = payload.name.trim();
        const title = payload.title.trim();
        const category = payload.category.trim();
        const edition = payload.edition.trim();

        if (!name || !title || !category || !edition) {
            throw new Error("All award fields are required.");
        }

        const currentUser = await new UsersService(serverAuthProvider).getCurrentUser();
        if (!isAdmin(currentUser)) {
            throw new AuthenticationError("You are not allowed to create awards.", 403);
        }

        const teamsService = new TeamsService(serverAuthProvider);
        const editionsService = new EditionsService(serverAuthProvider);
        const awardsService = new AwardsService(serverAuthProvider);

        const team = await teamsService.getTeamById(teamId);
        const selectedEdition = await editionsService.getEditionByUri(edition);

        const teamHref = getResourceHref(team);
        const teamEditionHref = getTeamEditionHref(team);
        const selectedEditionHref = selectedEdition.link("self")?.href ?? selectedEdition.uri ?? edition;

        if (!teamHref) {
            throw new NotFoundError("The team could not be resolved.");
        }

        if (!teamEditionHref) {
            throw new Error("This team is not linked to an edition.");
        }

        const teamEditionId = getEncodedResourceId(teamEditionHref);
        const selectedEditionId = getEncodedResourceId(selectedEditionHref);

        if (!teamEditionId || !selectedEditionId || teamEditionId !== selectedEditionId) {
            throw new Error("The selected edition does not match this team's edition.");
        }

        await awardsService.createAward({
            name,
            title,
            category,
            edition: selectedEditionHref,
            winner: teamHref,
        });

        return { success: true };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create award";
        return { success: false, error: message };
    }
}

import { EditionsService } from "@/api/editionApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { getEncodedResourceId } from "@/lib/halRoute";
import { Edition } from "@/types/edition";
import { Team } from "@/types/team";
import Link from "next/link";

interface EditionDetailPageProps {
    params: Promise<{ id: string }>;
}

function getTeamHref(team: Team): string | null {
    const teamId = getEncodedResourceId(team.uri);
    return teamId ? `/teams/${teamId}` : null;
}

function getEditionTitle(edition: Edition | null, id: string) {
    if (edition?.year) {
        return `${edition.year}`;
    }

    return `Edition ${id}`;
}

export default async function EditionDetailPage(props: Readonly<EditionDetailPageProps>) {
    const { id } = await props.params;
    const service = new EditionsService(serverAuthProvider);

    const [editionResult, teamsResult] = await Promise.allSettled([
        service.getEditionById(id),
        service.getEditionTeams(id),
    ]);

    const edition = editionResult.status === "fulfilled" ? editionResult.value : null;
    const teams = teamsResult.status === "fulfilled" ? teamsResult.value : [];
    const error = editionResult.status === "rejected" || teamsResult.status === "rejected"
        ? "Failed to load this edition."
        : null;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
            <div className="w-full max-w-3xl px-4 py-10">
                <div className="w-full rounded-lg border bg-white p-6 shadow-sm dark:bg-black">
                    <h1 className="mb-2 text-2xl font-semibold">{getEditionTitle(edition, id)}</h1>
                    {edition?.venueName ? (
                        <p className="text-sm text-zinc-600">{edition.venueName}</p>
                    ) : null}
                    {edition?.description ? (
                        <p className="mt-2 text-sm text-zinc-600">{edition.description}</p>
                    ) : null}

                    {error ? (
                        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </p>
                    ) : null}

                    <h2 className="mt-8 mb-4 text-xl font-semibold">Participating Teams</h2>

                    {!error && teams.length === 0 ? (
                        <p className="text-sm text-zinc-500">No teams registered for this edition.</p>
                    ) : null}

                    {!error && teams.length > 0 ? (
                        <ul className="w-full space-y-3">
                            {teams.map((team, index) => {
                                const href = getTeamHref(team);

                                return (
                                    <li
                                        key={team.uri ?? index}
                                        className="p-4 w-full border rounded-lg bg-white shadow-sm hover:shadow transition dark:bg-black"
                                    >
                                        {href ? (
                                            <Link href={href} className="font-medium">
                                                {team.name ?? `Team ${index + 1}`}
                                            </Link>
                                        ) : (
                                            <span className="font-medium">
                                                {team.name ?? `Team ${index + 1}`}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

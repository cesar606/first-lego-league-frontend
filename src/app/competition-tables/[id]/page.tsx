import { CompetitionTableService } from "@/api/competitionTableApi";
import EmptyState from "@/app/components/empty-state";
import ErrorAlert from "@/app/components/error-alert";
import FavoriteActionButton from "@/app/components/favorite-action-button";
import PageShell from "@/app/components/page-shell";
import { serverAuthProvider } from "@/lib/authProvider";
import { NotFoundError, parseErrorMessage } from "@/types/errors";
import type { CompetitionTable } from "@/types/competitionTable";
import type { Referee } from "@/types/referee";
import Link from "next/link";
import { redirect } from "next/navigation";

interface CompetitionTableDetailPageProps {
    readonly params: Promise<{ id: string }>;
}

function getTableTitle(table: CompetitionTable | null, id: string): string {
    return table?.id ?? id;
}

function getRefereeLabel(referee: Referee): string {
    return referee.name?.trim() || referee.emailAddress?.trim() || "Unknown referee";
}

export default async function CompetitionTableDetailPage(props: Readonly<CompetitionTableDetailPageProps>) {
    const { id } = await props.params;

    const auth = await serverAuthProvider.getAuth();
    if (!auth) redirect("/login");

    const service = new CompetitionTableService(serverAuthProvider);

    let table: CompetitionTable | null = null;
    let referees: Referee[] = [];
    let error: string | null = null;

    try {
        table = await service.getTableById(id);
        referees = await service.getRefereesForTable(id);
    } catch (e) {
        console.error("Failed to fetch competition table:", e);
        error = e instanceof NotFoundError
            ? "This competition table does not exist."
            : `Could not load table details. ${parseErrorMessage(e)}`;
    }

    const tableTitle = getTableTitle(table, id);

    return (
        <PageShell
            eyebrow="Competition"
            title={`Competition Table ${tableTitle}`}
            description="Saved table details and assigned referees."
            heroAside={
                <FavoriteActionButton
                    item={{
                        kind: "competition-table",
                        href: `/competition-tables/${encodeURIComponent(id)}`,
                        label: `Table ${tableTitle}`,
                        subtitle: "Competition Table",
                    }}
                />
            }
        >
            {error && <ErrorAlert message={error} />}

            {!error && (
                <div className="space-y-6">
                    <section className="rounded-lg border border-border bg-card p-5">
                        <div className="space-y-2">
                            <div className="page-eyebrow">Table</div>
                            <h2 className="section-title">{tableTitle}</h2>
                        </div>
                    </section>

                    <section aria-labelledby="referees-heading">
                        <div className="mb-4 space-y-1">
                            <div className="page-eyebrow">Assignments</div>
                            <h2 id="referees-heading" className="section-title">
                                Referees
                            </h2>
                        </div>

                        {referees.length === 0 ? (
                            <EmptyState
                                title="No referees assigned"
                                description="This table does not have referees assigned yet."
                            />
                        ) : (
                            <ul className="space-y-3">
                                {referees.map((referee, index) => (
                                    <li key={referee.uri ?? index} className="rounded-lg border border-border bg-card p-5">
                                        <p className="font-medium text-foreground">{getRefereeLabel(referee)}</p>
                                        {referee.emailAddress && (
                                            <p className="text-sm text-muted-foreground">{referee.emailAddress}</p>
                                        )}
                                        {referee.phoneNumber && (
                                            <p className="text-sm text-muted-foreground">{referee.phoneNumber}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">Quick links</p>
                        <Link href="/competition-tables" className="mt-2 inline-flex text-accent hover:underline">
                            Back to competition tables
                        </Link>
                    </section>
                </div>
            )}
        </PageShell>
    );
}

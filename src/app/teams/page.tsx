import { Button } from "@/app/components/button";
import PageShell from "@/app/components/page-shell";

export default function TeamsPage() {
    return (
        <PageShell
            eyebrow="Team management"
            title="Teams"
            description="Follow team participation and competition activity from one dedicated area."
        >
            <div className="space-y-5">
                <div className="page-eyebrow">Upcoming section</div>
                <h2 className="section-title">Team area in preparation.</h2>
                <p className="section-copy max-w-3xl">
                    This area is reserved for team lists, participation details and related updates.
                </p>
                <Button
                    type="button"
                    disabled
                    variant="secondary"
                    className="fll-disabled mt-2"
                >
                    Team list unavailable
                </Button>
            </div>
        </PageShell>
    );
}

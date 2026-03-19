import { Button } from "@/app/components/button";
import PageShell from "@/app/components/page-shell";

export default function ScientificProjectsPage() {
    return (
        <PageShell
            eyebrow="Innovation project"
            title="Scientific Projects"
            description="Explore innovation projects linked to each FIRST LEGO League edition."
        >
            <div className="space-y-5">
                <div className="page-eyebrow">Upcoming section</div>
                <h2 className="section-title">Project area in preparation.</h2>
                <p className="section-copy max-w-3xl">
                    This area is reserved for project submissions, ideas and season-related documentation.
                </p>
                <Button
                    type="button"
                    disabled
                    variant="secondary"
                    className="fll-disabled mt-2"
                >
                    Scientific project list unavailable
                </Button>
            </div>
        </PageShell>
    );
}

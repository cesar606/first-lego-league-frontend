import { RecordService } from "@/api/recordApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/card";
import PageShell from "@/app/components/page-shell";
import { serverAuthProvider } from "@/lib/authProvider";
import { Record } from "@/types/record";
import { User } from "@/types/user";
import Link from "next/link";

interface RecordPageProps {
    params: Promise<{ id: string }>;
}

export default async function RecordPage(props: Readonly<RecordPageProps>) {
    const recordService = new RecordService(serverAuthProvider)
    const record: Record = await recordService.getRecordById((await props.params).id);
    const owner: User = await recordService.getRecordRelation<User>(record, "ownedBy");

    return (
        <PageShell
            eyebrow="Record detail"
            title="Record"
            description="View the published information associated with this record."
        >
            <Card className="w-full border-border/90">
                <CardHeader>
                    <div className="list-kicker">Record</div>
                    <CardTitle className="text-2xl">{record.name}</CardTitle>
                    {record.description && (
                        <CardDescription>{record.description}</CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-3">
                    {record.created && (
                        <p className="text-sm text-muted-foreground">
                            Created: {new Date(record.created).toLocaleString()}
                        </p>
                    )}
                    {record.modified && (
                        <p className="text-sm text-muted-foreground">
                            Last Modified: {new Date(record.modified).toLocaleString()}
                        </p>
                    )}
                    {owner && (
                        <>
                            <p className="text-sm text-muted-foreground">
                                Owner:{" "}
                                <Link
                                    href={`/users/${owner.username}`}
                                    className="font-semibold text-primary hover:underline"
                                >
                                    {owner.username}
                                </Link>
                            </p>
                            {owner.email && (
                                <p className="text-sm text-muted-foreground">
                                    Email: {owner.email}
                                </p>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </PageShell>
    );
}

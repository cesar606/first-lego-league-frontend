import { RecordService } from "@/api/recordApi";
import { UsersService } from "@/api/userApi";
import { Card, CardHeader, CardTitle } from "@/app/components/card";
import PageShell from "@/app/components/page-shell";
import { serverAuthProvider } from "@/lib/authProvider";
import { Record } from "@/types/record";
import Link from "next/link";

interface UsersPageProps {
    params: Promise<{ id: string }>;
}

function getRecordHref(recordUri: string) {
    const sanitizedUri = recordUri.split(/[?#]/, 1)[0] ?? "";
    const segments = sanitizedUri.split("/").filter(Boolean);
    const recordId = segments.at(-1);

    return recordId ? `/records/${recordId}` : recordUri;
}

export default async function UsersPage(props: Readonly<UsersPageProps>) {
    const userService = new UsersService(serverAuthProvider)
    const recordService = new RecordService(serverAuthProvider)
    const user = await userService.getUserById((await props.params).id);
    let records: Record[] = [];
    try {
        records = await recordService.getRecordsByOwnedBy(user);
    } catch (error) {
        console.log(error);
    }

    return (
        <PageShell
            eyebrow="Participant profile"
            title={user.username}
            description="Profile information and related records for this participant."
        >
            <div className="space-y-8">
                <div className="space-y-3">
                    <div className="page-eyebrow">User details</div>
                    <h2 className="section-title">{user.username}</h2>
                    {user.email && (
                        <p className="section-copy">
                            <strong>Email:</strong> {user.email}
                        </p>
                    )}
                </div>

                <div className="editorial-divider" />

                <div className="space-y-4">
                    <div className="page-eyebrow">Records</div>
                    <h2 className="section-title">Records</h2>

                    <div className="grid gap-4">
                        {records.map((record) => (
                            <Card key={record.uri} className="border-border/90">
                                <CardHeader>
                                    <div className="list-kicker">Record</div>
                                    <CardTitle className="text-xl">
                                        <Link
                                            href={getRecordHref(record.uri)}
                                            className="hover:text-primary"
                                        >
                                            {record.name}
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </PageShell>
    );
}

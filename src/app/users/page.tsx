import { UsersService } from "@/api/userApi";
import PageShell from "@/app/components/page-shell";
import { serverAuthProvider } from "@/lib/authProvider";
import Link from "next/link";

export default async function UsersPage() {
    const service = new UsersService(serverAuthProvider)
    const users = await service.getUsers();

    return (
        <PageShell
            eyebrow="People directory"
            title="Users"
            description="Browse the registered members of the platform and open each participant profile."
        >
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="page-eyebrow">Registered users</div>
                    <h2 className="section-title">Directory</h2>
                    <p className="section-copy max-w-3xl">
                        Select a user to view profile details and related records.
                    </p>
                </div>

                <ul className="list-grid">
                    {users.map((user) => (
                        <li key={user.username} className="list-card pl-7">
                            <div className="list-kicker">User</div>
                            <Link
                                className="list-title block hover:text-primary"
                                href={`/users/${user.username}`}
                            >
                                {user.username}
                            </Link>
                            {user.email && (
                                <div className="list-support">{user.email}</div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </PageShell>
    );
}

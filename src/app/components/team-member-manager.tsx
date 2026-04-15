'use client';

import { useState } from 'react';
import { Button } from '@/app/components/button';
import { AddMemberForm } from './add-member-form';
import { DeleteMemberDialog } from './delete-member-dialog';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { MAX_TEAM_MEMBERS } from '@/types/team';

export function TeamMembersManager({
    teamId,
    members: initialMembers,
    isCoach,
    isAdmin
}: any) {
    const isAuthorized = isCoach || isAdmin;

    const {
        members,
        addMember,
        removeMember,
        isFull
    } = useTeamMembers(teamId, initialMembers);

    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    return (
        <div className="space-y-4">

            {isAuthorized && !isFull && (
                <Button onClick={() => setShowForm(true)}>
                    Add Member
                </Button>
            )}

            {isFull && (
                <p className="text-yellow-600">
                    Max members reached
                </p>
            )}

            {showForm && (
                <AddMemberForm
                    onSubmit={addMember}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <ul>
                {members.map((m: any) => (
                    <li
                        key={m._links?.self?.href}
                        className="flex justify-between border p-2"
                    >
                        <span>{m.name ?? "Unnamed member"}</span>

                        {isAuthorized && (
                            <Button onClick={() => setSelected(m)}>
                                Delete
                            </Button>
                        )}
                    </li>
                ))}
            </ul>

            <DeleteMemberDialog
                isOpen={!!selected}
                onCancel={() => setSelected(null)}
                onConfirm={() => {
                    if (!selected?._links?.self?.href) return;
                    removeMember(selected._links.self.href);
                    setSelected(null);
                }}
            />
        </div>
    );
}
import type { Metadata } from "next";
import { getAllMembers } from "./member-services";
import { MemberTable } from "./member-table";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
	title: "Member Management",
	description: "Manage member status and information",
};

export default async function MemberPage() {
	const members = await getAllMembers();

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-6xl">
				<h1 className="text-3xl font-bold mb-6">Member Management</h1>
				<MemberTable members={members} />
			</div>
		</div>
	);
}

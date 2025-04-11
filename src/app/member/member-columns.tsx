"use client";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { MemberDeleteDialog } from "./member-delete-modal";
import type { Member } from "./member-types";

export const columns: ColumnDef<Member>[] = [
	{
		accessorKey: "phone",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="No. Telepon" />
		),
	},
	{
		accessorKey: "isMember",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => {
			const isMember = row.getValue("isMember") as boolean;
			return (
				<Badge variant={isMember ? "default" : "secondary"}>
					{isMember ? "Member" : "Non-Member"}
				</Badge>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="createdAt" />
		),
		cell: ({ row }) => {
			return format(new Date(row.getValue("createdAt")), "dd MMM yyyy HH:mm", {
				locale: id,
			});
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="updatedAt" />
		),
		cell: ({ row }) => {
			return format(new Date(row.getValue("updatedAt")), "dd MMM yyyy HH:mm", {
				locale: id,
			});
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const member = row.original;
			return (
				<div className="flex justify-end">
					<MemberDeleteDialog member={member} />
				</div>
			);
		},
	},
];

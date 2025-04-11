"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { ColumnDef } from "@tanstack/react-table";
import { addDays, format, isAfter, isBefore } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateMemberExpiredAction } from "./member-action";
import { MemberDeleteDialog } from "./member-delete-modal";
import type { Member } from "./member-types";

// Komponen untuk cell actions
function CellAction({ member }: { member: Member }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdateExpired = async (date: Date | undefined) => {
		try {
			setIsLoading(true);
			const result = await updateMemberExpiredAction({
				id: member.id,
				expiredAt: date || null,
			});

			if (!result || "error" in result) {
				toast.error(
					typeof result?.error === "string"
						? result.error
						: "Gagal mengupdate tanggal expired",
				);
				return;
			}

			toast.success("Tanggal expired berhasil diupdate");
		} catch (error) {
			console.error("Error updating expired date:", error);
			toast.error("Terjadi kesalahan saat mengupdate tanggal expired");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-end gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" disabled={isLoading}>
						{isLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<CalendarIcon className="h-4 w-4" />
								<span className="sr-only">Set Expired</span>
							</>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="end">
					<div className="p-2 flex flex-col gap-2">
						<Calendar
							mode="single"
							selected={
								member.expiredAt ? new Date(member.expiredAt) : undefined
							}
							onSelect={handleUpdateExpired}
							initialFocus
						/>
						<Button
							variant="ghost"
							className="w-full"
							onClick={() => handleUpdateExpired(undefined)}
							disabled={isLoading}
						>
							Hapus Tanggal
						</Button>
					</div>
				</PopoverContent>
			</Popover>
			<MemberDeleteDialog member={member} />
		</div>
	);
}

export const columns: ColumnDef<Member>[] = [
	{
		id: "no",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="No." />
		),
		cell: ({ row }) => {
			return <div className="text-center">{row.index + 1}</div>;
		},
		enableSorting: false,
		enableHiding: false,
	},
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
		accessorKey: "expiredAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Tanggal Expired" />
		),
		cell: ({ row }) => {
			const expiredAt = row.getValue("expiredAt") as Date | null;

			if (!expiredAt) return "-";

			const now = new Date();
			const isExpired = isBefore(new Date(expiredAt), now);
			const isNearExpiry =
				isBefore(new Date(expiredAt), addDays(now, 7)) && !isExpired;

			return (
				<div
					className={`flex items-center ${
						isExpired
							? "text-red-500 font-medium"
							: isNearExpiry
								? "text-yellow-500 font-medium"
								: ""
					}`}
				>
					{format(new Date(expiredAt), "dd MMM yyyy", { locale: id })}
				</div>
			);
		},
		filterFn: (row, id, filterValue) => {
			const expiredAt = row.getValue(id) as Date | null;
			const isMember = row.getValue("isMember") as boolean;
			const now = new Date();

			switch (filterValue) {
				case "expired": {
					return expiredAt ? isBefore(new Date(expiredAt), now) : false;
				}
				case "expiring-soon": {
					if (!expiredAt) return false;
					const expiryDate = new Date(expiredAt);
					return (
						isBefore(expiryDate, addDays(now, 7)) && !isBefore(expiryDate, now)
					);
				}
				case "active": {
					return isMember && (!expiredAt || isAfter(new Date(expiredAt), now));
				}
				case "no-expiry": {
					return expiredAt === null;
				}
				default: {
					return true;
				}
			}
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
			return <CellAction member={member} />;
		},
	},
];

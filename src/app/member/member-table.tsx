"use client";

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateMemberStatusAction } from "./member-action";
import { MemberAddDialog } from "./member-add-modal";
import { columns } from "./member-columns";
import type { Member } from "./member-types";
import { MemberUploadDialog } from "./member-upload-modal";

interface MemberTableProps {
	members: Member[];
}

const expiredFilterOptions = [
	{ label: "Semua", value: "all" },
	{ label: "Sudah Expired", value: "expired" },
	{ label: "Expired 7 Hari", value: "expiring-soon" },
	{ label: "Aktif", value: "active" },
	{ label: "Tanpa Expired", value: "no-expiry" },
];

export function MemberTable({ members }: MemberTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [memberData, setMemberData] = useState(members);
	const [loadingId, setLoadingId] = useState<string | null>(null);

	// Update memberData when members prop changes
	useEffect(() => {
		setMemberData(members);
	}, [members]);

	const table = useReactTable({
		data: memberData,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const handleStatusChange = async (id: string, currentStatus: boolean) => {
		try {
			setLoadingId(id);
			const newStatus = currentStatus ? 0 : 1;
			const result = await updateMemberStatusAction({
				id,
				status: newStatus,
			});

			if (!result || "error" in result) {
				toast.error(
					typeof result?.error === "string"
						? result.error
						: "Gagal mengubah status member",
				);
				return;
			}

			setMemberData(
				memberData.map((member) =>
					member.id === id ? { ...member, isMember: !currentStatus } : member,
				),
			);
			toast.success(
				`Status member berhasil diubah menjadi ${newStatus === 1 ? "Aktif" : "Non-Aktif"}`,
			);
		} catch (error) {
			console.error("Error updating status:", error);
			toast.error("Terjadi kesalahan saat mengubah status");
		} finally {
			setLoadingId(null);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Input
						placeholder="Cari nomor telepon..."
						value={(table.getColumn("phone")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("phone")?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					<Select
						value={
							(table.getColumn("expiredAt")?.getFilterValue() as string) ??
							"all"
						}
						onValueChange={(value) =>
							table.getColumn("expiredAt")?.setFilterValue(value)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter Expired" />
						</SelectTrigger>
						<SelectContent>
							{expiredFilterOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-2">
					<DataTableViewOptions table={table} />
					<MemberUploadDialog />
					<MemberAddDialog />
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{cell.column.id === "isMember" && (
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-500">
														{cell.row.original.isMember
															? "Active"
															: "Non-Active"}
													</span>
													<div className="flex items-center gap-2">
														<Switch
															checked={cell.row.original.isMember}
															onCheckedChange={() =>
																handleStatusChange(
																	cell.row.original.id,
																	cell.row.original.isMember,
																)
															}
															disabled={loadingId === cell.row.original.id}
														/>
														{loadingId === cell.row.original.id && (
															<Loader2 className="h-4 w-4 animate-spin text-primary" />
														)}
													</div>
												</div>
											)}
											{cell.column.id !== "isMember" &&
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Tidak ada data member.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<DataTablePagination table={table} />
		</div>
	);
}

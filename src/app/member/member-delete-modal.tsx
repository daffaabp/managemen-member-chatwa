"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteMemberAction } from "./member-action";
import { DeleteMemberSchema } from "./member-validation";
import type { Member } from "./member-types";

interface DeleteMemberDialogProps {
	member: Member;
}

export function MemberDeleteDialog({ member }: DeleteMemberDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const { form, handleSubmitWithAction } = useHookFormAction(
		deleteMemberAction,
		zodResolver(DeleteMemberSchema),
		{
			actionProps: {
				onSuccess: (result) => {
					if (result && "error" in result && typeof result.error === "string") {
						toast.error(result.error);
						return;
					}
					router.refresh();
					setOpen(false);
					toast.success("Member berhasil dihapus");
				},
				onError: () => {
					toast.error("Terjadi kesalahan internal server");
				},
			},
			formProps: {
				defaultValues: {
					id: member.id
				},
			},
		},
	);

	const isSubmitting = form.formState.isSubmitting;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="icon">
					<Trash2 className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Hapus Member</DialogTitle>
					<DialogDescription>
						Apakah Anda yakin ingin menghapus member dengan nomor &quot;{member.phone}&quot;? Aksi ini tidak dapat dibatalkan.
					</DialogDescription>
				</DialogHeader>

				<div className="flex justify-end gap-4">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Batal
					</Button>
					<Button
						variant="destructive"
						disabled={isSubmitting}
						onClick={() => handleSubmitWithAction()}
					>
						{isSubmitting ? "Menghapus..." : "Hapus"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

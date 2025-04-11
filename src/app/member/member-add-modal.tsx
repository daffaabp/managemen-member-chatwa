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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createMemberAction } from "./member-action";
import { CreateMemberSchema } from "./member-validation";

export function MemberAddDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const { form, handleSubmitWithAction } = useHookFormAction(
		createMemberAction,
		zodResolver(CreateMemberSchema),
		{
			actionProps: {
				onSuccess: (result) => {
					if (result && "error" in result && typeof result.error === "string") {
						toast.error(result.error);
						return;
					}
					router.refresh();
					setOpen(false);
					form.reset();
					toast.success("Member berhasil ditambahkan");
				},
				onError: () => {
					toast.error("Gagal menambahkan member");
				},
			},
			formProps: {
				defaultValues: {
					phone: "",
					isMember: false
				},
			},
		},
	);

	const isSubmitting = form.formState.isSubmitting;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Tambah Member</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tambah Member Baru</DialogTitle>
					<DialogDescription>
						Isi form berikut untuk menambahkan member baru
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmitWithAction} className="space-y-6">
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nomor Telepon</FormLabel>
									<FormControl>
										<Input placeholder="Masukkan nomor telepon" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isSubmitting} className="w-full">
							{isSubmitting ? "Menyimpan..." : "Simpan"}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

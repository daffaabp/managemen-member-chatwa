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
import { FileSpreadsheet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MemberUploadForm from "./member-upload-form";

export function MemberUploadDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const onSuccess = () => {
		setOpen(false);
		router.refresh();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-2">
					<FileSpreadsheet className="w-4 h-4" />
					Upload Excel
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Upload Data Member</DialogTitle>
					<DialogDescription>
						Upload data member dari file Excel atau CSV. Pastikan format data
						sesuai dengan template.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4">
					<MemberUploadForm onSuccess={onSuccess} />
				</div>
			</DialogContent>
		</Dialog>
	);
}

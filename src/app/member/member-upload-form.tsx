"use client";

import { Loader2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import type { MemberUploadData } from "./member-upload-schema";

interface ValidationError {
	code: string;
	message: string;
	path: string[];
}

type ErrorDetails =
	| ValidationError[]
	| Error
	| string
	| Record<string, unknown>;

interface UploadResult {
	success: boolean;
	data?: MemberUploadData[];
	error?: string;
	details?: ErrorDetails;
	message?: string;
}

interface UploadState {
	status: "idle" | "uploading" | "validating" | "success" | "error";
	message?: string;
	details?: string;
}

interface Props {
	onSuccess?: () => void;
}

export default function MemberUploadForm({ onSuccess }: Props) {
	const [uploadState, setUploadState] = useState<UploadState>({
		status: "idle",
	});
	const [result, setResult] = useState<UploadResult | null>(null);

	const formatErrorDetails = useCallback((details: ErrorDetails): string => {
		if (typeof details === "string") return details;
		if (details instanceof Error) return details.message;
		try {
			return JSON.stringify(details, null, 2);
		} catch {
			return "Error details tidak dapat ditampilkan";
		}
	}, []);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (!file) return;

			// Reset state
			setResult(null);
			setUploadState({ status: "uploading", message: "Mengupload file..." });

			const formData = new FormData();
			formData.append("file", file);

			try {
				const response = await fetch("/api/member/upload", {
					method: "POST",
					body: formData,
				});

				const data: UploadResult = await response.json();

				if (data.success) {
					setUploadState({
						status: "success",
						message:
							data.message ||
							`Berhasil mengupload ${data.data?.length} data member`,
					});
					toast.success(data.message || "Data member berhasil diupload");
					onSuccess?.();
				} else {
					const formattedDetails = data.details
						? formatErrorDetails(data.details)
						: undefined;
					setUploadState({
						status: "error",
						message: data.error || "Terjadi kesalahan",
						details: formattedDetails,
					});
					toast.error(data.error || "Gagal mengupload data member");
				}

				setResult(data);
			} catch (error) {
				console.error("Error uploading:", error);
				const errorMessage =
					error instanceof Error ? error.message : "Gagal mengupload file";
				const errorDetails =
					error instanceof Error ? formatErrorDetails(error) : undefined;
				setUploadState({
					status: "error",
					message: errorMessage,
					details: errorDetails,
				});
				toast.error(errorMessage);
			}
		},
		[onSuccess, formatErrorDetails],
	);

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({
			onDrop,
			accept: {
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
					".xlsx",
				],
				"application/vnd.ms-excel": [".xls"],
				"text/csv": [".csv"],
			},
			maxFiles: 1,
			maxSize: 5 * 1024 * 1024, // 5MB
		});

	return (
		<div className="space-y-4">
			<div
				{...getRootProps()}
				className={`relative border-2 border-dashed p-8 text-center rounded-lg cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50 ${
					isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
				} ${uploadState.status === "uploading" ? "pointer-events-none opacity-75" : ""}`}
			>
				<input {...getInputProps()} />

				<div className="flex flex-col items-center gap-3">
					{uploadState.status === "uploading" ? (
						<>
							<Loader2 className="w-8 h-8 animate-spin text-blue-500" />
							<p className="text-blue-700 font-medium">{uploadState.message}</p>
							<p className="text-sm text-blue-600">Mohon tunggu sebentar...</p>
						</>
					) : (
						<>
							<Upload
								className={`w-8 h-8 ${
									isDragActive ? "text-blue-500" : "text-gray-400"
								}`}
							/>
							<div>
								<p className="font-medium mb-1">
									{isDragActive
										? "Lepaskan file di sini..."
										: "Upload Data Member"}
								</p>
								<p className="text-sm text-gray-500">
									Drag & drop file atau klik untuk memilih
								</p>
								<p className="text-xs text-gray-400 mt-2">
									Format: .xlsx, .xls, .csv (Maks. 5MB)
								</p>
								<p className="text-xs text-gray-400">
									Kolom yang diperlukan: No, No Telepon, Status
								</p>
								<div className="mt-2">
									<a
										href="/templates/member-upload-template.csv"
										download
										className="text-xs text-blue-500 hover:text-blue-700 underline"
									>
										Download Template CSV
									</a>
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			{fileRejections.length > 0 && (
				<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
					<p className="text-yellow-700 text-sm">
						File tidak valid: {fileRejections[0].errors[0].message}
					</p>
				</div>
			)}

			{result && (
				<div
					className={`p-4 rounded-lg border ${
						result.success
							? "bg-green-50 border-green-200"
							: "bg-red-50 border-red-200"
					}`}
				>
					{result.success ? (
						<div className="flex items-center gap-2 text-green-700">
							<div className="w-2 h-2 rounded-full bg-green-500" />
							<p>
								{result.message ||
									`Berhasil mengupload ${result.data?.length} data member`}
							</p>
						</div>
					) : (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-red-500" />
								<p className="text-red-700 font-medium">{result.error}</p>
							</div>
							{result.details && (
								<pre className="text-xs bg-white/75 p-3 rounded-md overflow-auto max-h-40 border border-red-100">
									{formatErrorDetails(result.details)}
								</pre>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

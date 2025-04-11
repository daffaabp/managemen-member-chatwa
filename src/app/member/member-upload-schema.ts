import { z } from "zod";

// Schema untuk satu baris data member dari excel
export const memberUploadSchema = z.object({
    No: z.union([z.string(), z.number()])
        .transform((val) => {
            if (typeof val === "string") {
                const num = Number(val);
                if (Number.isNaN(num)) {
                    throw new Error("Nomor harus berupa angka");
                }
                return num;
            }
            return val;
        })
        .pipe(z.number()),
    Telepon: z.string()
        .min(1, "Nomor telepon wajib diisi")
        .regex(/^62\d+$/, "Nomor telepon harus dimulai dengan '62' dan berupa angka")
        .min(11, "Nomor telepon terlalu pendek (minimal 11 digit termasuk '62')")
        .max(15, "Nomor telepon terlalu panjang (maksimal 15 digit termasuk '62')"),
    Status: z.union([z.string(), z.number(), z.boolean()])
        .transform((val) => {
            if (typeof val === "string") {
                const lower = val.toLowerCase().trim();
                if (["1", "true", "aktif", "yes", "y"].includes(lower)) return true;
                if (["0", "false", "non-aktif", "no", "n"].includes(lower)) return false;
                throw new Error("Status tidak valid");
            }
            if (typeof val === "number") {
                if (val === 1) return true;
                if (val === 0) return false;
                throw new Error("Status harus 0 atau 1");
            }
            return val;
        })
        .pipe(z.boolean())
});

// Schema untuk array data member
export const membersUploadArraySchema = z.array(memberUploadSchema);

// Type untuk data upload
export type MemberUploadData = z.infer<typeof memberUploadSchema>;
export type MembersUploadArray = z.infer<typeof membersUploadArraySchema>; 
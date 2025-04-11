import { z } from "zod";

export const CheckMemberSchema = z.object({
    phone: z.string()
        .min(1, "Nomor telepon wajib diisi")
        .regex(/^62\d+$/, "Nomor telepon harus dimulai dengan '62' dan berupa angka")
        .min(8, "Nomor telepon terlalu pendek (minimal 11 digit termasuk '62')")
        .max(15, "Nomor telepon terlalu panjang (maksimal 15 digit termasuk '62')")
}).required();

export type CheckMemberRequest = z.infer<typeof CheckMemberSchema>; 
import { z } from "zod";

export const CreateMemberSchema = z.object({
    phone: z.string()
        .min(1, "Nomor telepon wajib diisi")
        .regex(/^62\d+$/, "Nomor telepon harus dimulai dengan '62' dan berupa angka")
        .min(8, "Nomor telepon terlalu pendek (minimal 11 digit termasuk '62')")
        .max(15, "Nomor telepon terlalu panjang (maksimal 15 digit termasuk '62')"),
    isMember: z.boolean()
}).required();

export const DeleteMemberSchema = z.object({
    id: z.string().min(1, "ID member wajib diisi")
}).required();

// Schema untuk update status member (0 atau 1)
export const UpdateMemberStatusSchema = z.object({
    id: z.string().min(1, "ID member wajib diisi"),
    status: z.number()
        .int()
        .min(0, "Status harus 0 atau 1")
        .max(1, "Status harus 0 atau 1")
}).required();

export type CreateMember = z.infer<typeof CreateMemberSchema>;
export type DeleteMember = z.infer<typeof DeleteMemberSchema>;
export type UpdateMemberStatus = z.infer<typeof UpdateMemberStatusSchema>;
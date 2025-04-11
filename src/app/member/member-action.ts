"use server";
import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import {
    createMember,
    deleteMember,
    getMemberByPhone,
    updateMemberStatus
} from "./member-services";
import { CreateMemberSchema, DeleteMemberSchema, UpdateMemberExpiredSchema, UpdateMemberStatusSchema } from "./member-validation";

export const createMemberAction = actionClient
    .schema(CreateMemberSchema)
    .action(async ({ parsedInput: { phone, isMember } }) => {
        try {
            // Check if member with phone already exists
            const existingMember = await getMemberByPhone(phone.toString());
            if (existingMember) {
                return { success: false, error: "Nomor telepon sudah terdaftar" };
            }

            const member = await createMember({
                phone: phone.toString(),
                isMember: Boolean(isMember),
                expiredAt: null // Set default expiredAt to null for new members
            });
            return { success: true, data: member };
        } catch {
            return { success: false, error: "Gagal membuat member" };
        }
    });

export const deleteMemberAction = actionClient
    .schema(DeleteMemberSchema)
    .action(async ({ parsedInput: { id } }) => {
        try {
            await deleteMember(id);
            return { success: true };
        } catch {
            return { success: false, error: "Gagal menghapus member" };
        }
    });

export const updateMemberStatusAction = actionClient
    .schema(UpdateMemberStatusSchema)
    .action(async ({ parsedInput: { id, status } }) => {
        try {
            // Convert numeric status to boolean
            const isMember = status === 1;
            await updateMemberStatus(id, isMember);
            return { success: true };
        } catch {
            return { success: false, error: "Gagal mengubah status member" };
        }
    });

export async function updateMemberExpiredAction(
    data: z.infer<typeof UpdateMemberExpiredSchema>,
) {
    try {
        const result = UpdateMemberExpiredSchema.safeParse(data);

        if (!result.success) {
            return {
                error: result.error.issues[0]?.message || "Validasi gagal",
            };
        }

        const { id, expiredAt } = result.data;

        const member = await db.member.update({
            where: { id },
            data: { expiredAt },
        });

        revalidatePath("/member");

        return { data: member };
    } catch (error) {
        console.error("Error updating member expired date:", error);
        return {
            error: "Gagal mengupdate tanggal expired member",
        };
    }
}
"use server";
import { actionClient } from "@/lib/safe-action";
import {
    createMember,
    getMemberByPhone,
    deleteMember,
    updateMemberStatus
} from "./member-services";
import { CreateMemberSchema, DeleteMemberSchema, UpdateMemberStatusSchema } from "./member-validation";

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
                isMember: Boolean(isMember)
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
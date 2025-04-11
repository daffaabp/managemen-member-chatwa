import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from 'next/cache';
import type { Member } from "./member-types";

// Get all members
export async function getAllMembers() {
    try {
        // Disable caching
        noStore();

        const members = await prisma.member.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return members;
    } catch (error) {
        console.error("Error getting members:", error);
        throw new Error("Failed to get members");
    }
}

// Get member by id
export async function getMemberById(id: string) {
    try {
        noStore();
        const member = await prisma.member.findUnique({
            where: { id }
        });
        return member;
    } catch (error) {
        console.error("Error getting member:", error);
        throw new Error("Failed to get member");
    }
}

// Create new member
export async function createMember(data: Omit<Member, "id" | "createdAt" | "updatedAt">) {
    try {
        const member = await prisma.member.create({
            data: {
                phone: data.phone,
                isMember: data.isMember,
                expiredAt: data.expiredAt || null
            }
        });
        return member;
    } catch (error) {
        console.error("Error creating member:", error);
        throw new Error("Failed to create member");
    }
}

// Update member
export async function updateMember(id: string, data: Partial<Member>) {
    try {
        const member = await prisma.member.update({
            where: { id },
            data
        });
        return member;
    } catch (error) {
        console.error("Error updating member:", error);
        throw new Error("Failed to update member");
    }
}

// Delete member
export async function deleteMember(id: string) {
    try {
        await prisma.member.delete({
            where: { id }
        });
        return true;
    } catch (error) {
        console.error("Error deleting member:", error);
        throw new Error("Failed to delete member");
    }
}

// Get member by phone
export async function getMemberByPhone(phone: string) {
    try {
        noStore();
        const member = await prisma.member.findUnique({
            where: { phone }
        });
        return member;
    } catch (error) {
        console.error("Error getting member by phone:", error);
        throw new Error("Failed to get member");
    }
}

// Update member status
export async function updateMemberStatus(id: string, isMember: boolean) {
    try {
        const member = await prisma.member.update({
            where: { id },
            data: { isMember }
        });
        return member;
    } catch (error) {
        console.error("Error updating member status:", error);
        throw new Error("Failed to update member status");
    }
}

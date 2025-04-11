import { getMemberByPhone } from "@/app/member/member-services";
import { NextResponse } from "next/server";
import { CheckMemberSchema } from "./validation";

export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate request body
        const validationResult = CheckMemberSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(false);
        }

        // Get member data
        const member = await getMemberByPhone(validationResult.data.phone);

        // Jika member tidak ditemukan atau isMember false, return false
        if (!member || !member.isMember) {
            return NextResponse.json(false);
        }

        // Jika member ditemukan dan isMember true, return true
        return NextResponse.json(true);

    } catch (error) {
        console.error("Error checking member:", error);
        return NextResponse.json(false);
    }
}

// Prevent GET requests
export async function GET() {
    return NextResponse.json(false, { status: 405 });
} 
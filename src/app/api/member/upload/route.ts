import { getMemberByPhone } from "@/app/member/member-services";
import { membersUploadArraySchema } from "@/app/member/member-upload-schema";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "File tidak ditemukan" },
                { status: 400 }
            );
        }

        // Baca file excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);

        // Ambil sheet pertama
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convert ke JSON dengan opsi raw: false untuk menghindari pemformatan otomatis
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        // Validasi data dengan schema
        const validationResult = membersUploadArraySchema.safeParse(jsonData);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Data tidak valid",
                    details: validationResult.error.issues
                },
                { status: 400 }
            );
        }

        const members = validationResult.data;
        const results = [];
        const skippedMembers = [];

        // Proses setiap member
        for (const member of members) {
            try {
                // Cek apakah nomor telepon sudah ada
                const existingMember = await getMemberByPhone(member.Telepon);

                if (existingMember) {
                    // Jika member sudah ada, skip update dan catat sebagai member yang dilewati
                    skippedMembers.push({
                        phone: member.Telepon,
                        reason: "Member sudah terdaftar, status tidak dapat diubah"
                    });
                    continue;
                }

                // Jika member tidak ditemukan, buat baru
                const newMember = await prisma.member.create({
                    data: {
                        phone: member.Telepon,
                        isMember: member.Status
                    }
                });
                results.push(newMember);
            } catch (error) {
                console.error("Error processing member:", member, error);
                throw error;
            }
        }

        return NextResponse.json({
            success: true,
            data: results,
            skippedMembers,
            message: `Berhasil mengupload ${results.length} data member baru${skippedMembers.length > 0
                ? `, ${skippedMembers.length} data dilewati karena sudah terdaftar`
                : ""
                }`
        });

    } catch (error) {
        console.error("Error uploading members:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Gagal memproses file",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Prevent other methods
export async function GET() {
    return NextResponse.json(
        { success: false, error: "Method tidak diizinkan" },
        { status: 405 }
    );
} 
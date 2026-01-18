import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises"; // เพิ่ม mkdir
import path from "path";

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}_${file.name}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        await mkdir(uploadDir, { recursive: true }); 

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${fileName}`;

        return NextResponse.json({ 
            success: true, 
            url: imageUrl 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ 
            success: false, 
            message: error.message 
        }, { status: 500 });
    }
};
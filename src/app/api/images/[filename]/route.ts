import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import fs from "fs";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ filename: string }> }) => {
    try {
        const { filename } = await params;
        const filePath = path.join(process.cwd(), "uploads", filename);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ success: false, message: "File not found" }, { status: 404 });
        }

        const fileBuffer = await readFile(filePath);
        
        // Determine the content type based on the file extension
        const ext = path.extname(filename).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".svg") contentType = "image/svg+xml";
        else if (ext === ".webp") contentType = "image/webp";

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
            },
        });
    } catch (error: any) {
        console.error("Error serving image:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};

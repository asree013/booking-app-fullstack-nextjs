export const handler = <T>(data: T, err?: Error, status?: number) => {
    return {
        data,
        err: getErrorMessage(err),
        status
    }
}

export type THandler<T> = ReturnType<typeof handler<T>>

export const getErrorMessage = (err: any): string | null => {
    if (!err) return null;

    if (err.code) {
        switch (err.code) {
        case 'P2002':
            const target = err.meta?.target || "field";
            return `ข้อมูลซ้ำ: ${target} นี้มีอยู่ในระบบแล้ว`;
        
        case 'P2025':
            return "ไม่พบข้อมูลที่ต้องการดำเนินการ (Record not found)";

        case 'P2003':
            // เกิดตอนพยายามลบข้อมูลที่มี "ลูก" เชื่อมอยู่ หรือใส่ ID อ้างอิงที่ไม่มีอยู่จริง
            return "ไม่สามารถดำเนินการได้ เนื่องจากข้อมูลมีการเชื่อมโยงกับส่วนอื่นอยู่ (Foreign key constraint)";

        case 'P2000':
            // เช่น ใส่ข้อความยาวเกินที่ Database กำหนดไว้
            return "ข้อมูลที่ระบุมีความยาวเกินขอบเขตที่กำหนด";

        case 'P2024':
            // เกิดตอน Database เชื่อมต่อนานเกินไป (Timeout)
            return "การเชื่อมต่อฐานข้อมูลใช้เวลานานเกินไป กรุณาลองใหม่";
            
        default:
            // ถ้าเป็น Error ของ Prisma ตัวอื่นๆ ที่เราไม่ได้ดักไว้
            return `Database Error (${err.code}): ${err.message.split('\n').pop()}`;
    }
    }

    const message = err.message || String(err);

    if (message.includes('invocation') || message.includes('\n')) {
        return message
            .split('\n')
            // ระบุ : string ตรงนี้ครับ
            .filter((msg: string) => msg.trim() && !msg.includes('→'))
            .pop()?.trim() || "Database Error";
    }

    return message;
};
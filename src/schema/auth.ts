import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'รหัสผ่านอย่างน้อย 6 ตัวอักษร')
})

export type TLogin  = z.infer<typeof loginSchema>;

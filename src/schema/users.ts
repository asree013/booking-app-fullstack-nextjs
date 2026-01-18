import { z } from "zod";

export const RolesEnum = z.enum(["USER", "ADMIN", "MANAGER", "CLIENT", "GUEST"]);

// Schema พื้นฐาน (รวมทุกฟิลด์ที่เป็นไปได้)
export const usersSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().optional().or(z.literal('')),
  first_name: z.string().min(1, "กรุณากรอกชื่อ"),
  last_name: z.string().min(1, "กรุณากรอกนามสกุล"),
  age: z.string().nullish().or(z.literal('')),
  tell: z.string().nullish().or(z.literal('')),
  address: z.string().nullish().or(z.literal('')),
  role: RolesEnum.default("USER"),
  image: z.string().optional().nullish(),
});

// สำหรับ Create: บังคับ Password อย่างน้อย 6 ตัว
export const createUserSchema = usersSchema.extend({
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
});

// สำหรับ Update: ใช้ตัว usersSchema ปกติ (ซึ่ง password เป็น optional อยู่แล้ว)
export const updateUserSchema = usersSchema;

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type Users = z.infer<typeof updateUserSchema>;
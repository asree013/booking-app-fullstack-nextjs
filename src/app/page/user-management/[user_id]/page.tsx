'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Label from '@radix-ui/react-label';
import * as Separator from '@radix-ui/react-separator';
import { ChevronLeft, Save, UserPlus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import Schema ของคุณ
import { createUserSchema, CreateUserInput, RolesEnum } from '@/schema/users';

interface UserFormPageProps {
  initialData?: CreateUserInput; // ถ้ามี data ส่งมาจะเป็นโหมด Update
  id?: string;
}

export default function UserFormPage({ initialData, id }: UserFormPageProps) {
  const router = useRouter();
  const isUpdate = !!id;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: initialData || {
      role: 'USER',
      age: '',
      tell: '',
      address: ''
    }
  });

  // อัปเดตข้อมูลเมื่อ initialData เปลี่ยน (กรณีดึงมาจาก API)
  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: CreateUserInput) => {
    try {
      console.log("Submitting Data:", data);
      // Logic: if (isUpdate) { api.update(id, data) } else { api.create(data) }
      await new Promise(res => setTimeout(res, 2000)); // Simulate API
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 shadow-sm sm:shadow-none"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isUpdate ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
            </h1>
            <p className="text-sm text-slate-500 hidden sm:block">กรอกข้อมูลให้ครบถ้วนเพื่อบันทึกลงระบบ</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* ส่วนที่ 1: ข้อมูลพื้นฐาน */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-600">
              <UserPlus size={18} />
              <h2 className="font-bold text-sm uppercase tracking-wider">Account Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Email Address" error={errors.email}>
                <input {...register('email')} className={inputClass(!!errors.email)} placeholder="name@example.com" />
              </FormField>

              <FormField label="Password" error={errors.password}>
                <input 
                  {...register('password')} 
                  type="password" 
                  className={inputClass(!!errors.password)} 
                  placeholder={isUpdate ? "•••••••• (ว่างไว้ถ้าไม่เปลี่ยน)" : "••••••••"} 
                />
              </FormField>

              <FormField label="First Name" error={errors.first_name}>
                <input {...register('first_name')} className={inputClass(!!errors.first_name)} placeholder="ชื่อจริง" />
              </FormField>

              <FormField label="Last Name" error={errors.last_name}>
                <input {...register('last_name')} className={inputClass(!!errors.last_name)} placeholder="นามสกุล" />
              </FormField>
            </div>
          </section>

          <Separator.Root className="h-px bg-slate-100" />

          {/* ส่วนที่ 2: ข้อมูลส่วนตัวและสิทธิ์ */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="Role" error={errors.role}>
                <select {...register('role')} className={inputClass(!!errors.role)}>
                  {RolesEnum.options.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Age" error={errors.age}>
                <input {...register('age')} type="number" className={inputClass(!!errors.age)} placeholder="25" />
              </FormField>

              <FormField label="Telephone" error={errors.tell}>
                <input {...register('tell')} className={inputClass(!!errors.tell)} placeholder="08x-xxx-xxxx" />
              </FormField>
            </div>

            <FormField label="Address" error={errors.address}>
              <textarea 
                {...register('address')} 
                rows={3} 
                className={inputClass(!!errors.address)} 
                placeholder="ที่อยู่ปัจจุบัน..."
              />
            </FormField>
          </section>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-50 px-8 py-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-all order-2 sm:order-1"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70 order-1 sm:order-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isUpdate ? 'บันทึกการแก้ไข' : 'สร้างผู้ใช้งาน'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- Helper Components ---

function FormField({ label, children, error }: { label: string, children: React.ReactNode, error?: any }) {
  return (
    <div className="space-y-2">
      <Label.Root className="text-sm font-bold text-slate-700 ml-1">{label}</Label.Root>
      {children}
      {error && <p className="text-xs text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{error.message}</p>}
    </div>
  );
}

const inputClass = (isError: boolean) => `
  w-full bg-white border rounded-xl px-4 py-2.5 text-sm transition-all outline-none focus:ring-4
  ${isError 
    ? 'border-red-500 focus:ring-red-500/10' 
    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
  }
`;
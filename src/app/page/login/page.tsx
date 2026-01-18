'use client';

import React from 'react';
import * as Label from '@radix-ui/react-label';
import { useForm } from 'react-hook-form';
import { loginSchema, TLogin } from '@/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiService } from '@/service/ApiServices';
import { redirect, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/toast-hook';
import { ToastContainer } from '@/app/components/ToastContainer';
import { Loader2 } from 'lucide-react';
import { useAuthHook } from '@/hooks/auth-hook';

export default function LoginPage() {
    const routers = useRouter();
    // const { setUser, setIsLogin } = useAuthHook()
    const { toast, open, setOpen, title, description, variant } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<TLogin>({
        mode: 'all',
        defaultValues: { email: "root-admin-4@gmail.com", password: "root-admin-4" },
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: TLogin) => {
        toast({ title: "กำลังตรวจสอบข้อมูล", description: "กรุณารอสักครู่", variant: "loading" });

        const result = await apiService.login(data);

        if (result.err && result.err?.length > 0) {
            toast({ title: "เกิดข้อผิดพลาด", description: result.err, variant: "error" });
            return;
        }

        const users = {
            jwt: result.data.jwt,
            first_name: result.data.user.first_name,
            last_name: result.data.user.last_name,
        } as {
            jwt: string,
            first_name: string,
            last_name: string,
        }
        localStorage.setItem('userData', JSON.stringify(users))

        setInterval(() => {
            toast({ title: "เข้าสู่ระบบสำเร็จ", description: "กำลังนำคุณไปยัง Dashboard", variant: "success" });
            if (result.data.user.role === "ADMIN") {
                redirect('/page/dashboard')
            }
            else {
                redirect('/page/home')

            }
        }, 1000)
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
                <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 leading-tight">ยินดีต้อนรับกลับมา</h1>
                        <p className="text-slate-500 mt-1">กรุณาเข้าสู่ระบบเพื่อใช้งานต่อ</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <Label.Root className="text-sm font-semibold text-slate-700" htmlFor="email">อีเมล</Label.Root>
                            <input
                                {...register('email')}
                                className={`h-11 rounded-xl border px-4 text-sm transition-all focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 ring-red-50' : 'border-slate-200 focus:ring-indigo-100'}`}
                                disabled={isSubmitting}
                                id="email"
                                placeholder="name@example.com"
                            />
                            {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between px-1">
                                <Label.Root className="text-sm font-semibold text-slate-700" htmlFor="password">รหัสผ่าน</Label.Root>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-500">ลืมรหัสผ่าน?</a>
                            </div>
                            <input
                                {...register('password')}
                                className={`h-11 rounded-xl border px-4 text-sm transition-all focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 ring-red-50' : 'border-slate-200 focus:ring-indigo-100'}`}
                                disabled={isSubmitting}
                                type="password"
                                id="password"
                                placeholder="••••••••"
                            />
                            {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-11 cursor-pointer flex items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'เข้าสู่ระบบ'}
                        </button>
                    </form>
                </div>
            </div>

            <ToastContainer
                open={open}
                onOpenChange={setOpen}
                title={title}
                description={description}
                variant={variant}
            />
        </>
    );
}
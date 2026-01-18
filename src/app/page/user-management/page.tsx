'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname, redirect } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Avatar from '@radix-ui/react-avatar';
import { useForm } from 'react-hook-form';
import {
    Plus, Search, MoreHorizontal, Edit2, Trash2,
    Mail, ShieldCheck, X, Loader2, Phone, MapPin, Calendar,
    Eye, EyeOff, UserX, ChevronLeft, ChevronRight, List
} from 'lucide-react';

import { createUserSchema, usersSchema, RolesEnum, Users } from '@/schema/users';
import { apiService } from '@/service/ApiServices';
import { ToastContainer } from '@/app/components/ToastContainer';
import { useToast } from '@/hooks/toast-hook';
import { zodResolver } from '@hookform/resolvers/zod';

export default function UserManagementPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [users, setUsers] = useState<Users[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const { toast, open, setOpen, title, description, variant } = useToast();

    // ดึงค่าจาก Search Params
    const searchQuery = searchParams.get('search') || '';
    const currentPage = Number(searchParams.get('page')) || 1;
    const itemsPerPage = Number(searchParams.get('limit')) || 5;

    const updateParams = useCallback((newParams: Record<string, string | number | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '') params.delete(key);
            else params.set(key, String(value));
        });
        redirect(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await apiService.getUsers();
            setUsers(result.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const searchStr = searchQuery.toLowerCase();
            return (
                user.first_name?.toLowerCase().includes(searchStr) ||
                user.last_name?.toLowerCase().includes(searchStr) ||
                user.email?.toLowerCase().includes(searchStr)
            );
        });
    }, [users, searchQuery]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    const paginationRange = useMemo(() => {
        const range = [];
        const delta = 1;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            } else if (range[range.length - 1] !== '...') {
                range.push('...');
            }
        }
        return range;
    }, [currentPage, totalPages]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-in fade-in duration-500">
            {/* --- Header --- */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight italic uppercase">User Management</h1>
                    <p className="text-slate-500 text-sm font-medium">จัดการบัญชีผู้ใช้งานจาก URL Parameters</p>
                </div>
                <button
                    onClick={() => { setSelectedUser(null); setIsOpen(true); }}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                    <Plus size={20} /> เพิ่มผู้ใช้งาน
                </button>
            </div>

            {/* --- Filters Section --- */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-white p-2 rounded-3xl border border-slate-200 shadow-sm flex items-center px-4">
                    <Search className="text-slate-400" size={18} />
                    <input
                        className="w-full border-none bg-transparent py-2 pl-3 text-sm outline-none"
                        placeholder="ค้นหาชื่อ หรืออีเมล..."
                        value={searchQuery}
                        onChange={(e) => updateParams({ search: e.target.value, page: 1 })} // เปลี่ยนคำค้นหาให้กลับไปหน้า 1
                    />
                </div>
                
                <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm flex items-center px-4 gap-2">
                    <List size={18} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Show:</span>
                    <select 
                        value={itemsPerPage} 
                        onChange={(e) => updateParams({ limit: e.target.value, page: 1 })} // เปลี่ยน Limit ให้กลับไปหน้า 1
                        className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer pr-2"
                    >
                        {[5, 10, 20, 50, 100].map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* --- Modal & Table --- */}
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <UserFormModal 
                    title={selectedUser ? "แก้ไขข้อมูลผู้ใช้งาน" : "เพิ่มผู้ใช้งานใหม่"}
                    initialData={selectedUser}
                    onSuccess={() => { setIsOpen(false); fetchUser(); }}
                />
            </Dialog.Root>

            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm flex flex-col min-h-[450px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Profile</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Role</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Contact</th>
                            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600" /></td></tr>
                        ) : paginatedUsers.length === 0 ? (
                            <tr><td colSpan={4} className="py-20 text-center text-slate-400"><UserX size={48} className="mx-auto mb-2 opacity-20" />ไม่พบข้อมูล</td></tr>
                        ) : (
                            paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50 last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden border ring-1 ring-slate-100">
                                                <Avatar.Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.first_name}`} />
                                                <Avatar.Fallback className="bg-indigo-50 text-indigo-600 flex items-center justify-center w-full h-full font-bold">{user.first_name?.[0]}</Avatar.Fallback>
                                            </Avatar.Root>
                                            <div>
                                                <p className="font-bold text-slate-900">{user.first_name} {user.last_name}</p>
                                                <p className="text-slate-400 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md uppercase">{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell text-[11px] text-slate-500">
                                        <p>{user.tell || '-'}</p>
                                        <p className="truncate max-w-[150px]">{user.address || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger asChild>
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer outline-none"><MoreHorizontal size={20} /></button>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content className="bg-white rounded-xl shadow-xl border p-1 min-w-[150px] z-50 animate-in zoom-in-95">
                                                    <DropdownMenu.Item onClick={() => { setSelectedUser(user); setIsOpen(true); }} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 outline-none cursor-pointer font-medium">
                                                        <Edit2 size={14} className="text-indigo-600" /> แก้ไขข้อมูล
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 outline-none cursor-pointer font-medium">
                                                        <Trash2 size={14} /> ลบผู้ใช้งาน
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* --- Dynamic Pagination --- */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between mt-auto gap-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Showing {paginatedUsers.length} of {filteredUsers.length} users
                        </span>
                        
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => updateParams({ page: Math.max(1, currentPage - 1) })} 
                                disabled={currentPage === 1} 
                                className="p-2 border rounded-xl disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="flex items-center gap-1">
                                {paginationRange.map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof page === 'number' && updateParams({ page })}
                                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                                            currentPage === page 
                                            ? 'bg-indigo-600 text-white shadow-lg' 
                                            : page === '...' ? 'text-slate-300 cursor-default' : 'text-slate-400 hover:bg-slate-50 border border-transparent cursor-pointer'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => updateParams({ page: Math.min(totalPages, currentPage + 1) })} 
                                disabled={currentPage === totalPages} 
                                className="p-2 border rounded-xl disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer open={open} onOpenChange={setOpen} title={title} description={description} variant={variant} />
        </div>
    );
}

// UserFormModal ยังคงเดิม...
function UserFormModal({ title, initialData, onSuccess }: { title: string, initialData?: any, onSuccess: () => void }) {
    const { toast } = useToast();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<any>({
        resolver: zodResolver(initialData ? usersSchema : createUserSchema),
    });

    useEffect(() => {
        if (initialData) {
            reset({ ...initialData, age: initialData.age ? String(initialData.age) : '', password: '' });
        } else {
            reset({ email: '', first_name: '', last_name: '', role: 'USER', password: '', age: '', tell: '', address: '' });
        }
    }, [initialData, reset]);

    const onSubmit = async (data: any) => {
        try {
            const result = initialData 
                ? await apiService.editUser(initialData.id, data) 
                : await apiService.createUser(data);

            if (result && !result.err) {
                toast({ title: "Success", description: "บันทึกข้อมูลสำเร็จ", variant: "success" });
                setTimeout(() => onSuccess(), 1000);
            } else {
                toast({ title: "Error", description: result?.err || "บันทึกไม่สำเร็จ", variant: "error" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network Error", variant: "error" });
        }
    };

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-white rounded-[2rem] shadow-2xl z-[101] p-8 border">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <Dialog.Title className="text-lg font-black italic uppercase">{title}</Dialog.Title>
                    <Dialog.Close className="p-2 text-slate-400 hover:bg-slate-50 rounded-full border cursor-pointer"><X size={18} /></Dialog.Close>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input {...register('first_name')} className="w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="First Name" />
                        <input {...register('last_name')} className="w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Last Name" />
                    </div>
                    <input {...register('email')} className="w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Email" />
                    {!initialData && <input {...register('password')} type="password" title='password' className="w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Password" />}
                    <div className="grid grid-cols-3 gap-4">
                        <select {...register('role')} className="w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500">
                            {RolesEnum.options.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <input {...register('age')} className="w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Age" />
                        <input {...register('tell')} className="w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Phone" />
                    </div>
                    <textarea {...register('address')} rows={2} className="w-full bg-slate-50 border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Address" />
                    <div className="flex gap-3 pt-4">
                        <Dialog.Close asChild><button type="button" className="flex-1 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 cursor-pointer">Cancel</button></Dialog.Close>
                        <button type="submit" disabled={isSubmitting} className="flex-[2] bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-xl hover:bg-indigo-700 disabled:opacity-50 cursor-pointer">
                            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Save Data'}
                        </button>
                    </div>
                </form>
            </Dialog.Content>
        </Dialog.Portal>
    );
}
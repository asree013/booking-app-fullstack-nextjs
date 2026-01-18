'use client';

import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Dialog from '@radix-ui/react-dialog';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    BarChart3,
    PieChart,
    Menu,
    X,
    BookText,
    Warehouse
} from 'lucide-react';
import { useRouter, usePathname, redirect } from 'next/navigation';
import { useAuthHook } from '@/hooks/auth-hook';
import { useToast } from '@/hooks/toast-hook';

function NavBar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuthHook()
    const { toast, open, setOpen, onConfirm, title, description, variant } = useToast();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: "Overview", href: "/page/dashboard" },
        { icon: <Warehouse size={20} />, label: "Product", href: "/page/product" },
        { icon: <BookText size={20} />, label: "Booking", href: "/page/booking" },
        { icon: <BarChart3 size={20} />, label: "Analytics", href: "/page/analytics" },
        { icon: <Users size={20} />, label: "Customers", href: "/page/user-management" },
        { icon: <PieChart size={20} />, label: "Reports", href: "/page/reports" },
    ];

    const onLogOut = () => {

        localStorage.removeItem('userData')
        // redirect('/page/login')
        redirect('/page/login')
        // window.location.href = '/page/login'
    }

    const handleLogoutClick = () => {
        toast({
            title: 'ยืนยันการออกจากระบบ',
            description: 'คุณต้องการออกจากระบบใช่หรือไม่?',
            variant: 'confirm',
            onConfirm: () => {
                console.log('User confirmed!');
                onLogOut(); // เรียกฟังก์ชัน logout จริงๆ
                setOpen(false);
            }
        });
    };

    const SidebarContent = () => (
        <>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">Booking APP</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => (
                    <NavItem
                        key={item.href}
                        icon={item.icon}
                        label={item.label}
                        active={pathname === item.href}
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            redirect(item.href);
                        }}
                    />
                ))}

                <div className="pt-4 pb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    System
                </div>
                <NavItem
                    icon={<Settings size={20} />}
                    label="Settings"
                    active={pathname === '/page/settings'}
                    onClick={() => redirect('/page/settings')}
                />
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 w-full px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in" />
                    <Dialog.Content className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="absolute right-4 top-5">
                            <Dialog.Close className="p-2 text-slate-400 hover:text-slate-600 outline-none">
                                <X size={24} />
                            </Dialog.Close>
                        </div>
                        <SidebarContent />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <main className="flex-1 flex flex-col overflow-hidden w-full">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <Menu size={24} />
                    </button>

                    <div className="relative flex-1 max-w-[120px] sm:max-w-xs md:max-w-sm lg:max-w-md ml-2 lg:ml-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input className="w-full bg-slate-100 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400" placeholder="Search..." />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 ml-2">
                        <button className="hidden sm:block p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors cursor-pointer">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button className="flex items-center gap-2 p-1 lg:pl-3 hover:bg-slate-50 rounded-xl transition-all outline-none cursor-pointer">
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-bold leading-none">{user.first_name} {user.last_name}</p>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Admin</p>
                                    </div>
                                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">JD</div>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content className="bg-white rounded-xl shadow-2xl border border-slate-100 p-2 min-w-[180px] z-[60] animate-in fade-in zoom-in-95" align="end">
                                    <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50 outline-none cursor-pointer">Settings</DropdownMenu.Item>
                                    <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                                    <DropdownMenu.Item onClick={handleLogoutClick} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 outline-none cursor-pointer">Logout</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                </header>

                {open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop - พื้นหลังมืด */}
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setOpen(false)}
                        />

                        {/* Modal Content */}
                        <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all border border-gray-100">

                            {/* Icon & Title */}
                            <div className="flex flex-col items-center text-center">
                                {variant === 'confirm' || variant === 'error' ? (
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                                <p className="mt-2 text-sm text-gray-500">{description}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors sm:w-auto"
                                >
                                    {variant === 'confirm' ? 'ยกเลิก' : 'ปิด'}
                                </button>

                                {variant === 'confirm' && (
                                    <button
                                        onClick={() => {
                                            if (onConfirm) onConfirm();
                                            setOpen(false);
                                        }}
                                        className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 transition-all sm:w-auto active:scale-95"
                                    >
                                        ยืนยัน
                                    </button>
                                )}
                            </div >
                        </div>
                    </div>
                )}

                <ScrollArea.Root className="flex-1 overflow-hidden">
                    <ScrollArea.Viewport className="w-full h-full p-4 lg:p-8">
                        <div className="max-w-7xl mx-auto">{children}</div>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-slate-100 transition-colors duration-150 ease-out hover:bg-slate-200 w-1.5" orientation="vertical">
                        <ScrollArea.Thumb className="flex-1 bg-slate-300 rounded-full relative" />
                    </ScrollArea.Scrollbar>
                </ScrollArea.Root>
            </main>
        </div>
    );
}

export default NavBar;

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void; // เพิ่ม onClick เข้ามา
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${active
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' // สไตล์ตอน Active (เด่นขึ้น)
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
        >
            <span className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
            <span className="truncate">{label}</span>
        </button>
    );
}
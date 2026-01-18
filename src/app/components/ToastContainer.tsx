'use client';

import * as Toast from '@radix-ui/react-toast';
import { Loader2, CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastVariant } from '@/hooks/toast-hook';

interface ToastContainerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    variant: ToastVariant;
}

export const ToastContainer = ({ open, onOpenChange, title, description, variant }: ToastContainerProps) => {
    const variantStyles = {
        success: 'border-l-green-500',
        error: 'border-l-red-500',
        warning: 'border-l-yellow-500',
        loading: 'border-l-indigo-500',
        info: 'border-l-blue-500',
    };

    const Icon = () => {
        switch (variant) {
            case 'loading': return <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />;
            case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'info': return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <Toast.Provider swipeDirection="right" duration={variant === 'loading' ? 999999 : 3000}>
            <Toast.Root
                open={open}
                onOpenChange={onOpenChange}
                className={`fixed bottom-4 right-4 z-[100] bg-white border border-slate-200 border-l-4 rounded-xl shadow-2xl p-4 w-80 
                    flex items-start gap-3 transition-all
                    data-[state=open]:animate-in data-[state=closed]:animate-out 
                    data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
                    data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-out 
                    fade-in slide-in-from-right-5 ${variantStyles[variant]}`}
            >
                <div className="flex-shrink-0 mt-0.5"><Icon /></div>
                <div className="flex-grow flex flex-col gap-1">
                    <Toast.Title className="font-bold text-sm text-slate-900">{title}</Toast.Title>
                    {description && <Toast.Description className="text-xs text-slate-500">{description}</Toast.Description>}
                </div>
                <Toast.Close className="text-slate-300 hover:text-slate-500"><X size={16} /></Toast.Close>
            </Toast.Root>
            <Toast.Viewport className="fixed bottom-0 right-0 p-6 list-none z-[101] outline-none" />
        </Toast.Provider>
    );
};
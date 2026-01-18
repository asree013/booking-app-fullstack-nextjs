'use client';

import { useState, useCallback } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'loading' | 'info' | 'confirm';

interface ToastState {
    open: boolean;
    title: string;
    description: string;
    variant: ToastVariant;
    onConfirm?: () => void; // เพิ่มฟังก์ชันสำหรับ Confirm
}

export function useToast() {
    const [state, setState] = useState<ToastState>({
        open: false,
        title: '',
        description: '',
        variant: 'info',
    });

    const toast = useCallback(({ title, description, variant = 'info', onConfirm }: Omit<ToastState, 'open'>) => {
        setState({ 
            open: true, 
            title, 
            description, 
            variant, 
            onConfirm 
        });
    }, []);

    const setOpen = (open: boolean) => setState((prev) => ({ ...prev, open }));

    return { ...state, toast, setOpen };
}
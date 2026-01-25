'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, InputNumber, Upload, message, Rate } from 'antd';
import {
    Plus,
    Image as ImageIcon,
    ArrowLeft,
    Save,
    DoorOpen,
    Info,
    Banknote,
    UploadCloud,
    Star
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import CategorySelect from './SelectCategory';
import { apiService } from '@/service/ApiServices';
import { Category, Product } from '@prisma/client';
import { NIL } from 'uuid';

export default function CreateProduct() {
    const [form] = Form.useForm<Product>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const { product_id } = useParams()

    const [categoryList, setCategoryList] = useState<{ id: string, name: string }[]>([]);

    const findCategory = useCallback(async () => {
        const result = await apiService.getCategoryProduct();
        if (!result.err) {
            setCategoryList(result.data);
        }
    }, []);

    const handleCustomUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        setUploading(true);
        try {
            const response = await apiService.uploadImage(file);
            const url = response.data.image;
            setImageUrl(url);
            // อัปเดตค่าเข้า Form store ทันทีเพื่อให้กด Submit แล้วมีค่า image ออกมา
            form.setFieldValue('image', url);
            onSuccess("ok");
            message.success('อัปโหลดรูปภาพสำเร็จ');
        } catch (error) {
            onError(error);
            message.error('อัปโหลดรูปภาพล้มเหลว');
        } finally {
            setUploading(false);
        }
    };

    const fetchProductById = useCallback(async () => {
        const result = await apiService.getProductByProductId(String(product_id))
        form.setFieldsValue(result.data)
        setImageUrl(result.data.image ?? "")
    }, [form, setImageUrl])

    const handlerUpdate = async (data: Product) => {
        try {
            const payload = {
                name: data.name,
                detail: data.detail || null,
                image: imageUrl || null,
                price: data.price ? String(data.price) : null,
                rating: data.rating || 0,
                categoryId: data.categoryId,
            } as Product;

            const res = await apiService.updateProductByProductId(String(product_id), payload)

            if (!res.err) {
                message.success('สร้างสินค้าสำเร็จ!');
                router.back();
            } else {
                message.error('ไม่สามารถบันทึกข้อมูลได้');
            }
        } catch (error) {
            console.error(error);
            message.error('เกิดข้อผิดพลาดในการสร้างสินค้า');
        } finally {
            setLoading(false);
        }
    }

    const handlerCreate = async (data: Product) => {
        try {
            const payload = {
                name: data.name,
                detail: data.detail || null,
                image: imageUrl || null,
                price: data.price ? String(data.price) : null,
                rating: data.rating || 0,
                categoryId: data.categoryId,
            } as Product;

            const res = await apiService.createProduct(payload);

            if (!res.err) {
                message.success('สร้างสินค้าสำเร็จ!');
                router.back();
            } else {
                message.error('ไม่สามารถบันทึกข้อมูลได้');
            }
        } catch (error) {
            console.error(error);
            message.error('เกิดข้อผิดพลาดในการสร้างสินค้า');
        } finally {
            setLoading(false);
        }
    }

    const handleAddCategory = async (values: { name: string; detail?: string }) => {
        try {
            const data = {
                name: values.name,
                detail: values.detail ?? ""
            } as Category;
            const result = await apiService.createCategoryProduct(data);
            if (!result.err) {
                setCategoryList(prev => [result.data, ...prev]);
                message.success('เพิ่มหมวดหมู่สำเร็จ');
            }
        } catch (error) {
            message.error('เพิ่มหมวดหมู่ล้มเหลว');
        }
    };

    const onFinish = async (values: Product) => {
        console.log("Form Values:", values);
        setLoading(true);
        product_id === NIL ?
            handlerCreate(values)
            : handlerUpdate(values)
    };

    useEffect(() => {
        findCategory();
        if (product_id !== NIL) {
            fetchProductById()
        }
    }, [findCategory, fetchProductById]);

    return (
        <div className="w-full max-w-full min-h-screen bg-slate-50 overflow-x-hidden pb-20">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-xs uppercase tracking-widest mb-2 cursor-pointer bg-transparent border-none"
                        >
                            <ArrowLeft size={16} /> Back to Products
                        </button>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                            Create New <span className="text-indigo-600">Product</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => form.submit()}
                        disabled={loading || uploading}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Plus className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Product Data
                    </button>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={(error) => console.log("Validation Failed:", error)}
                    requiredMark={false}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    initialValues={{ rating: 0, categoryId: "" }}
                >
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-black italic text-slate-900 uppercase mb-8 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Info size={20} /></div>
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</span>}
                                    name="name"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อสินค้า' }]}
                                >
                                    <Input
                                        placeholder="ชื่อสินค้า..."
                                        className="h-12 rounded-xl border-slate-200 font-semibold focus:border-indigo-500"
                                        prefix={<DoorOpen size={16} className="text-slate-300 mr-2" />}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</span>}
                                    name="categoryId"
                                    rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่' }]}
                                >
                                    <CategorySelect
                                        type='SINGLE'
                                        categories={categoryList}
                                        value={form.getFieldValue('categoryId')}
                                        onChange={(val) => form.setFieldValue('categoryId', val)}
                                        onAddCategory={handleAddCategory}
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description Detail</span>}
                                name="detail"
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="รายละเอียดสินค้า..."
                                    className="rounded-xl border-slate-200 font-semibold focus:border-indigo-500"
                                />
                            </Form.Item>
                        </div>

                        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-black italic text-slate-900 uppercase mb-8 flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Banknote size={20} /></div>
                                Pricing & Rating
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (THB)</span>}
                                    name="price"
                                    rules={[{ required: true, message: 'กรุณากรอกราคา' }]}
                                >
                                    <InputNumber
                                        className="w-full h-12 rounded-xl border-slate-200 flex items-center font-black text-lg text-indigo-600"
                                        formatter={value => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value!.replace(/\฿\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Rating</span>}
                                    name="rating"
                                >
                                    <div className="h-12 flex items-center px-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <Rate allowHalf character={<Star size={16} fill="currentColor" />} />
                                    </div>
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-black italic text-slate-900 uppercase mb-8 flex items-center gap-3">
                                <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><ImageIcon size={20} /></div>
                                Product Image
                            </h2>
                            <Form.Item name="image" className="mb-0">
                                <Upload.Dragger
                                    name="file"
                                    multiple={false}
                                    maxCount={1}
                                    customRequest={handleCustomUpload}
                                    showUploadList={false}
                                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-indigo-400 transition-all overflow-hidden"
                                >
                                    {imageUrl ? (
                                        <div className="relative w-full aspect-square">
                                            <img src={imageUrl} alt="preview" className="w-full h-full object-cover rounded-xl" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                <p className="text-white text-xs font-bold">Change Image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-10 flex flex-col items-center gap-4">
                                            {uploading ? <Plus className="animate-spin text-indigo-600" /> : <UploadCloud size={32} className="text-indigo-600" />}
                                            <div className="text-center">
                                                <p className="text-sm font-black text-slate-900">
                                                    {uploading ? 'Uploading...' : 'Click or drag to upload'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </Upload.Dragger>
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </div>

            <style jsx global>{`
                .ant-select-selector { border: none !important; box-shadow: none !important; }
                .ant-rate { color: #f59e0b; }
            `}</style>
        </div>
    );
}
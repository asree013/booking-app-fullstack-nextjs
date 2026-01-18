'use client';

import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Switch, Upload, message } from 'antd';
import { 
  Plus, 
  Image as ImageIcon, 
  ArrowLeft, 
  Save, 
  DoorOpen, 
  Tag, 
  Info, 
  Banknote,
  UploadCloud,
  Zap
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';

export default function CreateRoomPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            console.log('Success:', values);
            message.success('สร้างห้องพักสำเร็จ!');
            // router.push('/page/booking');
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการสร้างห้อง');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-full min-h-screen bg-slate-50 overflow-x-hidden pb-20">
            {/* Header Area */}
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-xs uppercase tracking-widest mb-2 cursor-pointer"
                        >
                            <ArrowLeft size={16} /> Back to Rooms
                        </button>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                            Create New <span className="text-indigo-600">Room</span>
                        </h1>
                    </div>
                    
                    <button 
                        onClick={() => form.submit()}
                        disabled={loading}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? <Plus className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Room Data
                    </button>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-black italic text-slate-900 uppercase mb-8 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><Info size={20} /></div>
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Name</span>}
                                    name="name"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อห้อง' }]}
                                >
                                    <Input 
                                        placeholder="เช่น Ocean View Suite 101" 
                                        className="h-12 rounded-xl border-slate-200 font-semibold focus:border-indigo-500 hover:border-indigo-400 shadow-none"
                                        prefix={<DoorOpen size={16} className="text-slate-300 mr-2" />}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category / Product</span>}
                                    name="room_id"
                                    rules={[{ required: true }]}
                                >
                                    <Select 
                                        placeholder="เลือกประเภทห้องพัก"
                                        className="antd-custom-select h-12"
                                        options={[
                                            { value: 'p1', label: 'Ocean Front Suite' },
                                            { value: 'p2', label: 'City View Standard' },
                                            { value: 'p3', label: 'Deluxe Garden' },
                                        ]}
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description Detail</span>}
                                name="detail"
                            >
                                <Input.TextArea 
                                    rows={4} 
                                    placeholder="รายละเอียดห้องพักเพิ่มเติม..." 
                                    className="rounded-xl border-slate-200 font-semibold focus:border-indigo-500 hover:border-indigo-400 shadow-none"
                                />
                            </Form.Item>
                        </div>

                        {/* Status & Pricing Section */}
                        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-black italic text-slate-900 uppercase mb-8 flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Banknote size={20} /></div>
                                Pricing & Availability
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                                <Form.Item
                                    label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price per Night (THB)</span>}
                                    name="price"
                                    rules={[{ required: true }]}
                                    className="mb-0"
                                >
                                    <InputNumber
                                        className="w-full h-12 rounded-xl border-slate-200 flex items-center font-black text-lg text-indigo-600"
                                        formatter={value => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value!.replace(/\฿\s?|(,*)/g, '')}
                                    />
                                </Form.Item>

                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between px-6 h-12">
                                    <div className="flex items-center gap-3">
                                        <Zap size={16} className="text-amber-500" />
                                        <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Active Status</span>
                                    </div>
                                    <Form.Item name="is_active" valuePropName="checked" noStyle initialValue={true}>
                                        <Switch className="bg-slate-300" />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image Upload */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-black italic text-slate-900 uppercase mb-8 flex items-center gap-3">
                                <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><ImageIcon size={20} /></div>
                                Room Photo
                            </h2>

                            <Form.Item name="image" className="mb-0">
                                <Upload.Dragger 
                                    name="file" 
                                    multiple={false}
                                    action="/api/uploads/image" // ใช้ API ที่เราเขียนไว้ก่อนหน้า
                                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] hover:border-indigo-400 transition-all overflow-hidden"
                                    listType="picture-card"
                                    showUploadList={true}
                                >
                                    <div className="py-10 flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                                            <UploadCloud size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-slate-900">Click or drag to upload</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">PNG, JPG up to 10MB</p>
                                        </div>
                                    </div>
                                </Upload.Dragger>
                            </Form.Item>
                        </div>

                        {/* Additional Quick Settings Card */}
                        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Tag size={20} />
                                    <h3 className="text-sm font-black uppercase italic tracking-widest">Quick Note</h3>
                                </div>
                                <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-80">
                                    ข้อมูลห้องพักจะถูกนำไปแสดงผลในหน้าจองทันทีหลังจากที่คุณกดบันทึก กรุณาตรวจสอบข้อมูลราคาและความพร้อมให้ถูกต้อง
                                </p>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>

            {/* Antd Style Customization */}
            <style jsx global>{`
                .antd-custom-select .ant-select-selector {
                    border-radius: 0.75rem !important;
                    height: 48px !important;
                    display: flex !important;
                    align-items: center !important;
                    border: 2px solid transparent !important;
                    background-color: #f8fafc !important;
                    transition: all 0.2s !important;
                    padding-left: 1rem !important;
                }
                .ant-select-focused .ant-select-selector {
                    background-color: white !important;
                    border-color: #6366f1 !important;
                    box-shadow: none !important;
                }
                .ant-input:focus, .ant-input-focused, .ant-input-number:focus {
                    box-shadow: none !important;
                }
                .ant-upload-list-picture-card-container {
                    width: 100% !important;
                }
            `}</style>
        </div>
    );
}
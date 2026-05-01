'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, InputNumber, Select, message, Upload, Popconfirm } from 'antd';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import {
  Plus, Edit3, Trash2, Home,
  Tag, X, CheckCircle2, AlertCircle, UploadCloud,
  ImageIcon
} from 'lucide-react';
import { apiService } from '@/service/ApiServices';
import { Rooms } from '@prisma/client';
import { ToastContainer } from '@/app/components/ToastContainer';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/toast-hook';

interface RoomFormValues {
  id?: string;
  name: string;
  price: number;
  productId: string;
  is_active: boolean;
  image?: string;
}

export default function RoomsAdminPage() {
  const params = useParams();
  const product_id = params.product_id as string;
  const [form] = Form.useForm<RoomFormValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isActive, setIsActive] = useState(true);

  const { toast, open, setOpen, title, description, variant } = useToast();

  const [rooms, setRooms] = useState<Rooms[]>([])

  const fetchRooms = useCallback(async () => {
    const result = await apiService.getRoomByProductId(product_id)
    if (result.data) {
      // Filter rooms by product_id if API returns all
      setRooms(result.data)
    }
  }, [product_id])

  const onFinish = async (values: RoomFormValues) => {
    const data = {
      ...values,
      is_active: isActive,
      image: imageUrl,
      productId: product_id // Ensure productId is set from URL
    } as Rooms;

    let result;
    if (values.id) {
      result = await apiService.updateRoomByRoomId(values.id, data);
    } else {
      result = await apiService.createRoom(data);
    }

    if (result.err) {
      toast({ title: "ผิดพลาด", description: values.id ? "แก้ไขห้องพักไม่สำเร็จ" : "เพิ่มห้องพักไม่สำเร็จ", variant: "error" });
    } else {
      toast({ title: "สำเร็จ", description: values.id ? "แก้ไขห้องพักสำเร็จ" : "เพิ่มห้องพักสำเร็จ", variant: "success" });
      setIsModalOpen(false);
      fetchRooms();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await apiService.deleteRoomByRoomId(id);
    if (result.err) {
      toast({ title: "ผิดพลาด", description: "ลบห้องพักไม่สำเร็จ", variant: "error" });
    } else {
      toast({ title: "สำเร็จ", description: "ลบห้องพักสำเร็จ", variant: "success" });
      fetchRooms();
    }
  };

  const openModal = (data?: any) => {
    if (data) {
      form.setFieldsValue(data);
      setIsActive(data.is_active);
      setImageUrl(data.image || '');
    } else {
      form.resetFields();
      form.setFieldsValue({ productId: product_id }); // Pre-fill productId for new rooms
      setIsActive(true);
      setImageUrl('');
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])


  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
            Room <span className="text-indigo-600">Status</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Management & Real-time Monitoring</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center gap-3"
        >
          <Plus size={18} /> Add New Room
        </button>
      </div>

      {/* {rooms.map((room, key) => (
        <div key={key}>
          {room.name}
        </div>
      ))} */}

      {/* --- Table Section --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Room / Image</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <Home size={48} strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-widest">No rooms found for this product</p>
                  </div>
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        {room.image ? (
                          <img
                            src={room.image}
                            className="w-full h-full object-cover"
                            alt={room.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg uppercase">{room.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {room.id.split('-')[0]}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">Standard</span>
                  </td>
                  <td className="px-8 py-6 font-black italic text-slate-900">฿ {room.price.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    {room.is_active ? (
                      <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-tight bg-emerald-50 w-fit px-3 py-1.5 rounded-full">
                        <CheckCircle2 size={14} /> Available
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-500 font-black text-xs uppercase tracking-tight bg-rose-50 w-fit px-3 py-1.5 rounded-full">
                        <AlertCircle size={14} /> Occupied (In Use)
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(room)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Edit3 size={20} /></button>
                      <Popconfirm
                        title="ลบห้องพัก"
                        description="คุณแน่ใจหรือไม่ว่าต้องการลบห้องพักนี้?"
                        onConfirm={() => handleDelete(room.id)}
                        okText="ใช่"
                        cancelText="ไม่"
                      >
                        <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={20} /></button>
                      </Popconfirm>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        variant={variant}
      />

      {/* --- CRUD Modal (Radix UI) --- */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[3rem] p-10 shadow-2xl z-[51] overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-8">
              <Dialog.Title className="text-2xl font-black italic uppercase tracking-tighter">
                Room <span className="text-indigo-600">Configuration</span>
              </Dialog.Title>
              <Dialog.Close className="text-slate-300 hover:text-slate-900"><X size={24} /></Dialog.Close>
            </div>

            <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Side: Upload & Status */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Photo</label>
                    <Upload.Dragger
                      showUploadList={false}
                      className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden hover:border-indigo-400 transition-all"
                      beforeUpload={async (file) => {
                        const result = await apiService.uploadImage(file);
                        if (result.data.image) {
                          setImageUrl(result.data.image);
                          message.success('อัปโหลดรูปภาพสำเร็จ');
                        } else {
                          message.error('อัปโหลดรูปภาพไม่สำเร็จ');
                        }
                        return false; // Prevent automatic upload
                      }}
                    >
                      {imageUrl ? (
                        <div className="relative aspect-video">
                          <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white font-bold text-xs uppercase">Change Image</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 flex flex-col items-center gap-2">
                          <UploadCloud size={32} className="text-indigo-500" />
                          <p className="text-[10px] font-black text-slate-400 uppercase">Click to upload image</p>
                        </div>
                      )}
                    </Upload.Dragger>
                  </div>

                  <div className="p-5 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-indigo-300">Room Availability</p>
                      <p className="text-sm font-bold">{isActive ? 'Open for Booking' : 'Currently Occupied'}</p>
                    </div>
                    <Switch.Root
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      className="w-14 h-8 bg-slate-700 rounded-full relative data-[state=checked]:bg-emerald-500 transition-colors"
                    >
                      <Switch.Thumb className="block w-6 h-6 bg-white rounded-full shadow-lg transition-transform translate-x-1 data-[state=checked]:translate-x-7" />
                    </Switch.Root>
                  </div>
                </div>

                {/* Right Side: Inputs */}
                <div className="space-y-4">
                  <Form.Item name="id" hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item name="name" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Number</span>}>
                    <Input className="h-12 rounded-xl border-slate-200 font-bold" placeholder="e.g. A-101" />
                  </Form.Item>

                  <Form.Item name="productId" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product ID</span>}>
                    <Input className="h-12 rounded-xl border-slate-200 font-bold" disabled defaultValue={product_id} />
                  </Form.Item>

                  <Form.Item name="price" label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nightly Rate (THB)</span>}>
                    <InputNumber className="w-full h-12 rounded-xl border-slate-200 font-black flex items-center" formatter={v => `฿ ${v}`} />
                  </Form.Item>

                  <button type="submit" className="w-full bg-indigo-600 text-white h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all mt-4">
                    {form.getFieldValue('id') ? 'Update Room' : 'Create Room'}
                  </button>
                </div>
              </div>
            </Form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <style jsx global>{`
        .custom-select .ant-select-selector {
          border-radius: 12px !important;
          height: 48px !important;
          align-items: center !important;
          border-color: #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
}
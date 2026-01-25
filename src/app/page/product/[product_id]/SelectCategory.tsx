'use client';

import React, { useState } from 'react';
import { Select, Divider, Button, Modal, Form, Input } from 'antd';
import { Plus, Tag, LayoutGrid } from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

// แยก Interface เพื่อให้ TypeScript บังคับความถูกต้องของข้อมูล
interface SingleProps {
  type: "SINGLE";
  value: string; // ถ้าเป็น SINGLE ต้องรับ string
  onChange: (value: string) => void;
}

interface MultiProps {
  type: "MULTI";
  value: string[]; // ถ้าเป็น MULTI ต้องรับ string[]
  onChange: (value: string[]) => void;
}

// รวม Props ทั้งหมดเข้าด้วยกัน
type Props = (SingleProps | MultiProps) & {
  categories: CategoryOption[];
  onAddCategory: (values: { name: string; detail?: string }) => void;
};

export default function CategorySelect(props: Props) {
  // กระจายพร็อพออกมาใช้งาน
  const { categories, value, onChange, onAddCategory, type } = props;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onAddCategory(values);
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const isMulti = type === "MULTI";

  return (
    <>
      <div className="bg-white p-1 pl-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 w-full transition-all focus-within:border-indigo-400 min-h-[56px]">
        <Tag size={18} className="text-indigo-500 shrink-0" />
        <div className="flex flex-col flex-1 py-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter -mb-1">
            {isMulti ? "Categories (Multiple)" : "Category (Single)"}
          </span>
          <Select
            mode={isMulti ? "multiple" : undefined}
            showSearch
            placeholder={isMulti ? "เลือกหมวดหมู่ (ได้หลายรายการ)" : "เลือกหมวดหมู่"}
            variant="borderless"
            className={`w-full font-bold text-slate-800 ${isMulti ? 'custom-multi-select' : ''}`}
            // Cast เป็น any เพื่อให้ Select ของ Antd ยอมรับค่าที่เปลี่ยนไปตามโหมด
            value={value as any}
            onChange={onChange as any}
            optionFilterProp="label"
            maxTagCount="responsive"
            dropdownRender={(menu) => (
              <div className="p-1">
                {menu}
                <Divider className="my-2" />
                <Button 
                  type="text" 
                  block
                  className="text-indigo-600 font-bold flex items-center justify-center gap-2 h-10 hover:bg-indigo-50 rounded-lg"
                  icon={<Plus size={16} />} 
                  onClick={() => setIsModalOpen(true)}
                >
                  Create New Category
                </Button>
              </div>
            )}
            options={categories.map(cat => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </div>
      </div>

      <Modal
        title={<div className="font-black italic text-indigo-600 uppercase flex items-center gap-2"><Plus size={18}/> Add Category</div>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Create"
        okButtonProps={{ className: 'bg-indigo-600 rounded-xl px-6 font-bold h-10 border-none' }}
        centered
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</span>}
            name="name"
            rules={[{ required: true, message: 'กรุณากรอกชื่อหมวดหมู่' }]}
          >
            <Input placeholder="เช่น Electronics" prefix={<LayoutGrid size={16} className="text-slate-300 mr-2" />} className="h-12 rounded-xl" />
          </Form.Item>
          <Form.Item
            label={<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail</span>}
            name="detail"
          >
            <Input.TextArea placeholder="รายละเอียด..." rows={3} className="rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .custom-multi-select .ant-select-selection-item {
          background: #f0f1ff !important;
          border: 1px solid #e0e2ff !important;
          border-radius: 8px !important;
          color: #4f46e5 !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          padding-inline-start: 8px !important;
          margin-block: 2px !important;
        }
      `}</style>
    </>
  );
}
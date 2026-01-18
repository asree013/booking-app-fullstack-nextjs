'use client';

import React, { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { 
  Calendar as CalendarIcon, 
  Users, 
  MapPin, 
  Clock, 
  Check, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  Info
} from 'lucide-react';

export default function ModalFilterRoom() {
  const [date, setDate] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Book Your Session</h1>
          <p className="text-slate-500 font-medium">กรอกรายละเอียดด้านล่างเพื่อทำการจองบริการ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <form className="space-y-6">
                
                {/* Location Selection */}
                <div className="space-y-3">
                  <Label.Root className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MapPin size={14} /> Select Location
                  </Label.Root>
                  <CustomSelect placeholder="เลือกสถานที่..." options={['Bangkok Branch', 'Chiang Mai Branch', 'Phuket Branch']} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Picker */}
                  <div className="space-y-3">
                    <Label.Root className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <CalendarIcon size={14} /> Date
                    </Label.Root>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3 text-sm font-semibold outline-none transition-all"
                    />
                  </div>

                  {/* Time Picker */}
                  <div className="space-y-3">
                    <Label.Root className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Clock size={14} /> Time Slot
                    </Label.Root>
                    <CustomSelect placeholder="เลือกเวลา..." options={['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']} />
                  </div>
                </div>

                {/* Number of Guests */}
                <div className="space-y-3">
                  <Label.Root className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Users size={14} /> Number of Guests
                  </Label.Root>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, '5+'].map((num) => (
                      <button 
                        key={num}
                        type="button"
                        className="flex-1 py-3 rounded-xl border-2 border-slate-100 font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 focus:bg-indigo-50 focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-3">
                  <Label.Root className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Requests</Label.Root>
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-3xl px-5 py-4 text-sm font-semibold outline-none transition-all"
                    placeholder="ระบุความต้องการเพิ่มเติม (ถ้ามี)..."
                  />
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center gap-3 ml-1">
                  <Checkbox.Root className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center border-2 border-transparent data-[state=checked]:bg-indigo-600 transition-all outline-none" id="terms">
                    <Checkbox.Indicator className="text-white">
                      <Check size={14} strokeWidth={4} />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label className="text-xs font-bold text-slate-500 cursor-pointer" htmlFor="terms">
                    ฉันยอมรับ <span className="text-indigo-600 underline">เงื่อนไขและข้อตกลงในการใช้บริการ</span>
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
              <h2 className="text-lg font-black italic uppercase tracking-tight mb-6 flex items-center gap-2">
                <CreditCard size={20} /> Order Summary
              </h2>
              
              <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                <div className="flex justify-between text-sm opacity-80 font-medium">
                  <span>Service Fee</span>
                  <span>฿1,500.00</span>
                </div>
                <div className="flex justify-between text-sm opacity-80 font-medium">
                  <span>VAT (7%)</span>
                  <span>฿105.00</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-sm font-bold uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black italic">฿1,605.00</span>
              </div>

              <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all active:scale-95 cursor-pointer">
                Confirm Booking
              </button>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-start gap-4">
              <div className="bg-amber-50 p-2 rounded-xl text-amber-500">
                <Info size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-tight text-slate-900">Cancellation Policy</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-1">ยกเลิกฟรีก่อน 24 ชั่วโมงก่อนเริ่มใช้บริการ</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

{/* Reusable Select Component with Radix UI */}
function CustomSelect({ placeholder, options }: { placeholder: string, options: string[] }) {
  return (
    <Select.Root>
      <Select.Trigger className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3 text-sm font-semibold outline-none transition-all flex items-center justify-between group cursor-pointer">
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="text-slate-400 group-focus:text-indigo-500">
          <ChevronDown size={18} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-100 z-[110]">
          <Select.ScrollUpButton className="flex items-center justify-center h-8 bg-white text-slate-400">
            <ChevronUp size={16} />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2">
            {options.map((opt) => (
              <Select.Item 
                key={opt} 
                value={opt}
                className="flex items-center px-8 py-3 text-sm font-bold text-slate-600 rounded-xl outline-none data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 cursor-pointer transition-colors relative"
              >
                <Select.ItemText>{opt}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                  <Check size={14} className="text-indigo-600" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { redirect, useRouter } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
import { NIL } from 'uuid';
import {
  Search,
  Star,
  ArrowRight,
  Zap,
  ListFilter,
  Plus
} from 'lucide-react';
import CardBooking from './CardRoom';
import { CategoryBooking, Product, Rooms } from '@prisma/client';
import CardRooms from './CardRoom';

export type TProductWithRelations = Product & {
  categorys?: CategoryBooking[]
  rooms?: Rooms[]
};

const MOCK_CATEGORIES = [
  { id: '1', name: 'Standard', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=300' },
  { id: '2', name: 'Deluxe', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=300' },
  { id: '3', name: 'Suite', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=300' },
  { id: '4', name: 'Villa', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=300' },
];

const MOCK_PRODUCTS: TProductWithRelations[] = [
  {
    id: 'p1',
    name: 'Ocean Front Suite',
    price: '2500',
    detail: 'วิวทะเล 180 องศา พร้อมระเบียงส่วนตัวและอ่างอาบน้ำจากุซซี่',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    rating: 5,
    create_date: new Date(),
    update_date: new Date(),
    categorys: [
      { id: '3', create_date: new Date(), update_date: new Date(), detail: "", image: "", name: "" }
    ],
    rooms: [
      {
        id: '1',
        room_id: '1',
        image: '',
        create_date: new Date(),
        update_date: new Date(),
        is_active: false,
        name: "A101",
        price: 200
      },
      {
        id: '2',
        room_id: '2',
        image: '',
        create_date: new Date(),
        update_date: new Date(),
        is_active: false,
        name: "A102",
        price: 200
      },
    ]
  },
  {
    id: 'p2',
    name: 'City View Standard',
    price: '1200',
    detail: 'ห้องพักใจกลางเมือง เดินทางสะดวกใกล้รถไฟฟ้า',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    rating: 4,
    create_date: new Date(),
    update_date: new Date(),
    categorys: [{ id: '1', create_date: new Date(), update_date: new Date(), detail: "", image: "", name: "" }]
  },
  {
    id: 'p3',
    name: 'Deluxe Garden',
    price: '1800',
    detail: 'บรรยากาศสวนร่มรื่น เงียบสงบ เหมาะสำหรับการพักผ่อน',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    rating: 4,
    create_date: new Date(),
    update_date: new Date(),
    categorys: [{ id: '2', create_date: new Date(), update_date: new Date(), detail: "", image: "", name: "" }, { id: '1', create_date: new Date(), update_date: new Date(), detail: "", image: "", name: "" }]
  }
];

export default function BookingSelectionPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchCategory = activeCategory === 'all' ||
        p.categorys?.some(cat => String(cat.id) === activeCategory);

      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="w-full max-w-full min-h-screen bg-slate-50 overflow-x-hidden pb-12">
      <div className="w-full p-3 sm:p-6 lg:p-8">
        <section className="w-full bg-indigo-600 rounded-[2rem] sm:rounded-[2.5rem] px-5 py-8 sm:py-20 relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="max-w-4xl mx-auto relative z-10 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight">
                PICK YOUR <br className="sm:hidden" /> SPACE
              </h1>

              <button
                onClick={() => redirect(`/page/product/${NIL}`)}
                className="hidden sm:flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95 cursor-pointer shrink-0"
              >
                <Plus size={18} strokeWidth={3} /> Add New Room
              </button>
            </div>

            <div className="w-full max-w-xl bg-white p-1.5 rounded-2xl shadow-xl flex items-center mx-auto sm:mx-0 overflow-hidden border border-white/20">
              <input
                className="flex-1 min-w-0 p-2.5 sm:p-3 text-sm font-bold outline-none text-slate-700 bg-transparent"
                placeholder="ค้นหาบริการ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex items-center gap-1.5 pr-1">
                <button className="shrink-0 bg-indigo-600 text-white p-2.5 sm:p-3 rounded-xl hover:bg-indigo-700 transition-all active:scale-95">
                  <Search size={18} className="sm:w-5 sm:h-5" strokeWidth={3} />
                </button>
                <button
                  onClick={() => redirect(`/page/product/${NIL}`)}
                  className="sm:hidden shrink-0 bg-emerald-500 text-white p-2.5 rounded-xl active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <main className="w-full max-w-full px-4 sm:px-6 lg:max-w-7xl lg:mx-auto min-w-0">
        <div className="w-full relative overflow-hidden mb-8">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 shadow-sm ${activeCategory === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200'
                  : 'bg-white text-slate-400 border-white hover:border-indigo-100'
                }`}
            >
              All Services
            </button>
            {MOCK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 shadow-sm ${activeCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200'
                    : 'bg-white text-slate-400 border-white hover:border-indigo-100'
                  }`}
              >
                <div className="w-5 h-5 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                  <img src={cat.image} className="w-full h-full object-cover" alt="" />
                </div>
                <span className="whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-1">
          <h2 className="text-lg sm:text-xl font-black italic text-slate-900 uppercase tracking-tight leading-none truncate mr-2">
            RESULTS <span className="text-indigo-600">({filteredProducts.length})</span>
          </h2>
          <button className="shrink-0 p-2.5 bg-white rounded-xl border border-slate-100 text-slate-400 shadow-sm hover:text-indigo-600">
            <ListFilter size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 min-w-0">
          {filteredProducts.map(product => (
            <CardRooms key={product.id} data={product as any} />
          ))}
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NIL } from 'uuid';
import { Search, Plus, LayoutGrid, MapPin, Tag } from 'lucide-react';
import { Product, Rooms } from '@prisma/client';
import CardRooms from './CardRoom';

// --- Ant Design ---
import { Select, ConfigProvider, Divider, Input, Button, Space, type InputRef } from 'antd';
import { apiService } from '@/service/ApiServices';

export type TProductWithRelations = Product & {
  rooms?: Rooms[]
};

export default function BookingSelectionPage() {
  const router = useRouter();
  
  // 1. States
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [products, setProducts] = useState<TProductWithRelations[]>([]);

  const fetchData = useCallback(async () => {
    const [prodRes, catRes] = await Promise.all([
      apiService.getProduct(),
      apiService.getCategoryProduct()
    ]);
    
    if (!prodRes.err) setProducts(prodRes.data);
    if (!catRes.err) setCategories(catRes.data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onAddCategory = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const result = await apiService.createCategoryProduct({ name: newCatName, detail: "" } as any);
    if (!result.err) {
      setCategories(prev => [...prev, result.data]);
      setNewCatName('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // 4. Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = activeCategory === 'all' || p.categoryId === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search, products]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4f46e5', borderRadius: 12 } }}>
      <div className="w-full max-w-full min-h-screen bg-slate-50 overflow-x-hidden pb-12">
        
        {/* Hero Section */}
        <div className="w-full p-3 sm:p-6 lg:p-8">
          <section className="w-full bg-indigo-600 rounded-[2rem] sm:rounded-[3rem] px-6 py-10 sm:py-24 relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-2 text-white">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase opacity-80">
                    <MapPin size={14} /> Premium Spaces
                  </div>
                  <h1 className="text-4xl sm:text-7xl font-black italic uppercase leading-[0.9]">
                    BOOKING <br /> <span className="text-indigo-300">SYSTEM</span>
                  </h1>
                </div>
                <button 
                  onClick={() => router.push(`/page/product/${NIL}`)} 
                  className="hidden md:flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm uppercase shadow-xl hover:scale-105 transition-all"
                >
                  <Plus size={20} strokeWidth={3} /> Add New
                </button>
              </div>

              {/* Search Bar */}
              <div className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-2xl flex items-center">
                <Search size={20} className="ml-4 text-slate-400" />
                <input
                  className="flex-1 p-3 font-bold outline-none text-slate-700 bg-transparent"
                  placeholder="ค้นหาชื่อรายการ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            
            {/* Category Filter */}
            <div className="bg-white p-1 pl-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 min-w-[320px]">
              <LayoutGrid size={18} className="text-indigo-500" />
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter -mb-1">Category Filter</span>
                <Select
                  showSearch
                  placeholder="เลือกหมวดหมู่"
                  variant="borderless"
                  className="w-full font-bold"
                  value={activeCategory}
                  onChange={(val) => setActiveCategory(val)}
                  filterOption={(input, option) =>
                    (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  dropdownRender={(menu) => (
                    <div className="p-2">
                      {menu}
                      <Divider className="my-2" />
                      <Space className="w-full" direction="vertical">
                        <div className="flex gap-2">
                          <Input
                            placeholder="เพิ่มหมวดหมู่ใหม่..."
                            ref={inputRef}
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                          <Button 
                            type="primary" 
                            size="small"
                            className="bg-indigo-600 font-bold"
                            onClick={onAddCategory}
                          >
                            Add
                          </Button>
                        </div>
                      </Space>
                    </div>
                  )}
                  options={[
                    { value: 'all', label: 'All Services' },
                    ...categories.map(cat => ({
                      value: cat.id,
                      label: (
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-slate-400" />
                          <span>{cat.name}</span>
                        </div>
                      )
                    }))
                  ]}
                />
              </div>
            </div>

            <div className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase">
              {filteredProducts.length} results found
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <CardRooms key={product.id} data={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="w-full py-20 text-center text-slate-400 font-bold italic">
              No results found for your search.
            </div>
          )}
        </main>
      </div>
    </ConfigProvider>
  );
}
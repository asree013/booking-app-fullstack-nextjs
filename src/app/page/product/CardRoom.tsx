import { Product } from '@prisma/client'
import { ArrowRight, Zap } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'
import { TProductWithRelations } from './page'

type Props = {
    data: TProductWithRelations
}

function CardRooms({ data }: Props) {
    const router = useRouter()
    return (
        <div className="w-full group bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col min-w-0">

            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img src={data.image ?? ""} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={data.name} />
                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] text-indigo-600 uppercase shadow-lg flex items-center gap-2">
                    <Zap size={12} className="fill-indigo-600" /> HOT DEAL
                </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 sm:mb-3 truncate">
                    {data.name}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm font-medium line-clamp-2 mb-6 sm:mb-8 leading-relaxed">
                    {data.detail}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 sm:mb-3 truncate">
                    เหลื่อ: {data.rooms?.length?? 0} ห้อง
                </h3>

                <div className="mt-auto flex items-center justify-between pt-5 sm:pt-6 border-t border-slate-50 gap-2">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 truncate">Starting from</span>
                        <span className="text-xl sm:text-2xl font-black text-indigo-600 italic leading-none whitespace-nowrap">฿{data.price?.toLocaleString() ?? 0}</span>
                    </div>
                    <button
                        onClick={() => redirect(`/page/booking/${data.id}`)}
                        className="shrink-0 bg-slate-900 text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all active:scale-90 hover:bg-indigo-600 shadow-xl shadow-slate-200 cursor-pointer"
                    >
                        <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardRooms
'use client';

import { ArrowRight, Zap, ImageIcon, SquarePen, BedDouble } from 'lucide-react' // เพิ่ม ImageIcon
import { useRouter } from 'next/navigation'
import { TProductWithRelations } from './page'
import { useAuthHook } from '@/hooks/auth-hook';

type Props = {
    data: TProductWithRelations
}

function CardRooms({ data }: Props) {
    const router = useRouter()

    const handleBooking = () => {
        router.push(`/page/product/${data.id}/booking`);
    };

    const handleRoom = () => {
        router.push(`/page/product/${data.id}/room`);
    }

    const handleEdit = () => {
        router.push(`/page/product/${data.id}`);
    };

    const { user } = useAuthHook()

    return (
        <div className="w-full group shadow-2xl bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col min-w-0">

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                {data.image ? (
                    <img
                        src={data.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={data.name}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300">
                        <ImageIcon size={48} strokeWidth={1} />
                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Image Available</span>
                    </div>
                )}

                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] text-indigo-600 uppercase shadow-lg flex items-center gap-2">
                    <Zap size={12} className="fill-indigo-600" /> HOT DEAL
                </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 sm:mb-3 truncate">
                    {data.name}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm font-medium line-clamp-2 mb-4 sm:mb-6 leading-relaxed">
                    {data.detail || "ไม่มีรายละเอียดสินค้า"}
                </p>

                {/* ส่วนแสดงจำนวนห้อง */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        เหลือ: {data.rooms?.length ?? 0} ห้อง
                    </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-5 sm:pt-6 border-t border-slate-50 gap-2">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 truncate">Starting from</span>
                        <span className="text-xl sm:text-2xl font-black text-indigo-600 italic leading-none whitespace-nowrap">
                            ฿{Number(data.price)?.toLocaleString() ?? 0}
                        </span>
                    </div>
                    <div className='flex gap-2'>
                        {
                            user.role === "ADMIN" &&
                            <>
                                <button
                                    onClick={handleEdit} // ใช้ router.push แทน redirect
                                    className="shrink-0 bg-sky-800 text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all active:scale-90 hover:bg-sky-600 shadow-xl shadow-slate-200 cursor-pointer"
                                >
                                    <SquarePen size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                                    {/* <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} /> */}
                                </button>

                                <button
                                    onClick={handleRoom} // ใช้ router.push แทน redirect
                                    className="shrink-0 bg-yellow-600 text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all active:scale-90 hover:bg-yellow-500 shadow-xl shadow-slate-200 cursor-pointer"
                                >
                                    <BedDouble size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                                    {/* <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} /> */}
                                </button>
                            </>
                        }
                        <button
                            onClick={handleBooking} // ใช้ router.push แทน redirect
                            className="shrink-0 bg-slate-900 text-white p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all active:scale-90 hover:bg-indigo-600 shadow-xl shadow-slate-200 cursor-pointer"
                        >
                            <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardRooms
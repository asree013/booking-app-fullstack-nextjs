import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Select from '@radix-ui/react-select';
import { Calendar as CalendarIcon, ChevronDown, User, MapPin, CreditCard } from 'lucide-react';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Info */}
        <div className="md:w-1/3 bg-indigo-600 p-10 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Luxury <br/>Stay.</h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              สัมผัสประสบการณ์การพักผ่อนที่เหนือระดับ พร้อมบริการดูแลระดับ 5 ดาว
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="p-2 bg-indigo-500 rounded-lg"><MapPin size={16} /></div>
              Bangkok, Thailand
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="p-2 bg-indigo-500 rounded-lg"><CreditCard size={16} /></div>
              Best Price Guaranteed
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-10">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">
            Book Your <span className="text-indigo-600">Experience</span>
          </h1>

          <form className="space-y-6">
            {/* Input: Destination */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Destination</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Where are you going?" 
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Radix Popover: Date Picker Placeholder */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Check-in Date</label>
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 flex items-center gap-3 text-slate-900 font-bold hover:bg-slate-100 transition-colors">
                      <CalendarIcon size={18} className="text-indigo-600" />
                      <span>Select Date</span>
                    </button>
                  </Popover.Trigger>
                  <Popover.Content className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200" sideOffset={5}>
                    <div className="text-sm font-bold text-slate-900 mb-2">Calendar Widget Here</div>
                    <div className="w-64 h-48 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                      [Interactive Calendar]
                    </div>
                  </Popover.Content>
                </Popover.Root>
              </div>

              {/* Radix Select: Guests */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Guests</label>
                <select className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 font-bold text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>Family (4+)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
            >
              Confirm Booking
              <div className="bg-white/20 p-1 rounded-md">
                <ChevronDown size={16} className="-rotate-90" />
              </div>
            </button>
          </form>

          <p className="text-center text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-6">
            No credit card required for reservation
          </p>
        </div>
      </div>
    </div>
  );
}
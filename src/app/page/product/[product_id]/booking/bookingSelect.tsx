'use client'
import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Select from '@radix-ui/react-select';
import { Calendar as CalendarIcon, ChevronDown, User, MapPin, CreditCard, X } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import 'react-day-picker/dist/style.css';

export default function BookingPage() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 4),
  });

  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return 'Select Date';
    return format(date, 'MMM dd, yyyy');
  };

  const clearRange = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRange(undefined);
  };
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row">

        {/* Left Side: Info */}
        <div className="md:w-1/3 bg-indigo-600 p-10 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Luxury <br />Stay.</h2>
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
              {/* Date Range Picker */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Stay Duration</label>
                <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                  <Popover.Trigger asChild>
                    <button className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 flex items-center justify-between text-slate-900 font-bold hover:bg-slate-100 transition-all focus:ring-2 focus:ring-indigo-500 outline-none">
                      <div className="flex items-center gap-3">
                        <CalendarIcon size={18} className="text-indigo-600" />
                        <span className="text-sm">
                          {range?.from ? (
                            range.to ? (
                              <>
                                {formatDate(range.from)} — {formatDate(range.to)}
                              </>
                            ) : (
                              formatDate(range.from)
                            )
                          ) : (
                            "Select Dates"
                          )}
                        </span>
                      </div>
                      {range && (
                        <div
                          onClick={clearRange}
                          className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <X size={14} />
                        </div>
                      )}
                    </button>
                  </Popover.Trigger>
                  <Popover.Content
                    className="bg-white p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 z-50 animate-in fade-in zoom-in duration-300"
                    sideOffset={10}
                    align="start"
                  >
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Select Dates</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Plan your luxury experience</p>
                      </div>
                      {range?.from && range?.to && (
                        <div className="bg-indigo-50 px-3 py-1 rounded-full">
                          <span className="text-[10px] font-black text-indigo-600 uppercase">
                            {Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))} Nights
                          </span>
                        </div>
                      )}
                    </div>
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      numberOfMonths={2}
                      className="m-0! p-4"
                      classNames={{
                        months: "flex flex-col sm:flex-row gap-y-4 sm:gap-x-8 sm:gap-y-0",
                        month: "space-y-4",
                        month_caption: "flex justify-center pt-1 relative items-center mb-4",
                        caption_label: "text-sm font-black text-slate-900 uppercase tracking-wider",
                        nav: "space-x-1 flex items-center",
                        button_previous: "absolute left-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                        button_next: "absolute right-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                        month_grid: "w-full border-collapse space-y-1",
                        weekdays: "flex",
                        weekday: "text-slate-400 rounded-md w-9 font-black text-[10px] uppercase tracking-tighter",
                        week: "flex w-full mt-1",
                        day: "h-9 w-9 p-0 font-bold aria-selected:opacity-100 hover:bg-slate-100 rounded-lg transition-all flex items-center justify-center",
                        range_start: "range-start bg-indigo-600! text-white! rounded-l-lg! rounded-r-none!",
                        range_end: "range-end bg-indigo-600! text-white! rounded-r-lg! rounded-l-none!",
                        selected: "bg-indigo-50! text-indigo-600 hover:bg-indigo-100!",
                        today: "bg-slate-100 text-indigo-600",
                        outside: "text-slate-300 opacity-50",
                        disabled: "text-slate-300 opacity-50",
                        range_middle: "bg-indigo-50! text-indigo-600! rounded-none!",
                        hidden: "invisible",
                      }}
                    />
                    <div className="p-4 border-t border-slate-50 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                      >
                        Apply Dates
                      </button>
                    </div>
                  </Popover.Content>
                </Popover.Root>
              </div>

              {/* Guests Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Guests</label>
                <div className="relative">
                  <select className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-12 font-bold text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:bg-slate-100 cursor-pointer">
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>2 Adults, 1 Child</option>
                    <option>Family (4+)</option>
                  </select>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
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
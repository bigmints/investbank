import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, ChevronRight, User, CreditCard, Eye, Plus, ArrowRightLeft, Circle } from 'lucide-react';
import { BillCard } from '../components/home/BillCard';
import { BottomNav } from '../components/ui/BottomNav';


// Transaction Mock Data
const transactions = [
    { id: 1, name: 'Layla Mansour', subtitle: 'First Abu Dhabi Bank', amount: '20,000.00', date: '24th Sep, 2025', type: 'transfer' },
    { id: 2, name: 'Starbucks', subtitle: 'Abu Dhabi Islamic Bank', amount: '9,000.00', date: '24th Sep, 2025', type: 'expense' },
    { id: 3, name: 'Emirates NBD', subtitle: 'Salary Credit', amount: '45,500.00', date: '23rd Sep, 2025', type: 'transfer' },
    { id: 4, name: 'Carrefour', subtitle: 'Mall of the Emirates', amount: '1,250.00', date: '23rd Sep, 2025', type: 'expense' },
    { id: 5, name: 'Ahmed Hassan', subtitle: 'Abu Dhabi Commercial Bank', amount: '5,000.00', date: '22nd Sep, 2025', type: 'transfer' },
    { id: 6, name: 'Netflix', subtitle: 'Monthly Subscription', amount: '55.00', date: '22nd Sep, 2025', type: 'expense' },
    { id: 7, name: 'DEWA', subtitle: 'Electricity & Water', amount: '850.00', date: '21st Sep, 2025', type: 'expense' },
    { id: 8, name: 'Sara Al Mansoori', subtitle: 'Mashreq Bank', amount: '12,500.00', date: '21st Sep, 2025', type: 'transfer' },
    { id: 9, name: 'Apple Store', subtitle: 'Dubai Mall', amount: '3,999.00', date: '20th Sep, 2025', type: 'expense' },
    { id: 10, name: 'Etisalat', subtitle: 'Mobile Bill', amount: '299.00', date: '20th Sep, 2025', type: 'expense' },
];

export default function Home() {
    const [showBill, setShowBill] = useState(true);

    return (
        <div className="min-h-screen bg-[length:100%_100%] text-white font-sans selection:bg-pink-500/30" style={{ background: 'linear-gradient(301deg, #0D1252 1.28%, #D80136 122.11%)' }}>

            {/* --- HEADER SECTION --- */}
            <div className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white/20 overflow-hidden">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?img=11)' }} />
                    </div>
                    <h1 className="text-lg font-bold">Welcome Omar</h1>
                </div>

                <div className="flex items-center gap-5">
                    <button className="relative">
                        <Search size={22} className="text-white" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-[#1a0b2e]" />
                    </button>
                    <button className="relative">
                        <MessageSquare size={22} className="text-white" />
                        <div className="absolute top-0 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-[#1a0b2e]" />
                    </button>
                </div>
            </div>

            {/* --- BILL NOTIFICATION --- */}
            <BillCard isVisible={showBill} onClose={() => setShowBill(false)} />

            {/* --- ACCOUNT CARDS --- */}
            <div className="mt-6">
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pl-4">
                    {/* Current Account Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative w-[85vw] flex-shrink-0 bg-gradient-to-br from-[#5d1a4d] to-[#3d0a3d] rounded-3xl p-5 overflow-hidden"
                    >
                        {/* Decorative circles */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 border-[20px] border-white/5 rounded-full" />
                        <div className="absolute -right-4 top-24 w-20 h-20 border-[15px] border-white/5 rounded-full" />
                        <div className="absolute left-8 bottom-8 w-24 h-24 border-[18px] border-white/5 rounded-full" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm text-white/80">Current account</span>
                                <ChevronRight size={16} className="text-white/60" />
                            </div>

                            <div className="mb-8">
                                <div className="text-3xl font-bold mb-1">AED 15,550.59</div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">Account number</span>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-base font-semibold">543816102001</span>
                                <Eye size={18} className="text-white/60" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Family Circle Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative w-[85vw] flex-shrink-0 bg-gradient-to-br from-[#2d1a4d] to-[#1d0a3d] rounded-3xl p-5 overflow-hidden mr-4"
                    >
                        {/* Decorative circles */}
                        <div className="absolute -right-12 top-12 w-40 h-40 border-[25px] border-white/5 rounded-full" />
                        <div className="absolute right-4 bottom-12 w-16 h-16 border-[12px] border-white/5 rounded-full" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm text-white/80">My Family Circle</span>
                                <ChevronRight size={16} className="text-white/60" />
                            </div>

                            <div className="mb-8">
                                <span className="text-xs text-white/60 block mb-1">Balance</span>
                                <div className="text-3xl font-bold">AED 4,575.59</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?img=11)' }} />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden -ml-3">
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?img=33)' }} />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden -ml-3">
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?img=44)' }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Pagination dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="mt-8 px-4">
                <div className="flex gap-3 justify-center">
                    <button
                        className="flex-1 flex flex-col items-center justify-center py-2 px-3 active:scale-95 transition-transform"
                        style={{
                            maxWidth: '120px',
                            minHeight: '54px',
                            gap: '4px',
                            borderRadius: '16px',
                            border: '1.99px solid transparent',
                            backgroundImage: `linear-gradient(270deg, #060928 0.08%, #131A60 107.37%), 
                                            linear-gradient(155.31deg, rgba(255, 255, 255, 0.5) 12.33%, rgba(255, 255, 255, 0) 34.31%, rgba(255, 255, 255, 0) 52.66%, rgba(255, 255, 255, 0.54) 74.67%)`,
                            backgroundOrigin: 'padding-box, border-box',
                            backgroundClip: 'padding-box, border-box',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}
                    >
                        <Plus size={20} className="text-white" strokeWidth={2.5} />
                        <span className="text-[11px] text-white font-medium leading-tight">Add Money</span>
                    </button>
                    <button
                        className="flex-1 flex flex-col items-center justify-center py-2 px-3 active:scale-95 transition-transform"
                        style={{
                            maxWidth: '120px',
                            minHeight: '54px',
                            gap: '4px',
                            borderRadius: '16px',
                            border: '1.99px solid transparent',
                            backgroundImage: `linear-gradient(270deg, #060928 0.08%, #131A60 107.37%), 
                                            linear-gradient(155.31deg, rgba(255, 255, 255, 0.5) 12.33%, rgba(255, 255, 255, 0) 34.31%, rgba(255, 255, 255, 0) 52.66%, rgba(255, 255, 255, 0.54) 74.67%)`,
                            backgroundOrigin: 'padding-box, border-box',
                            backgroundClip: 'padding-box, border-box',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}
                    >
                        <ArrowRightLeft size={20} className="text-white" strokeWidth={2.5} />
                        <span className="text-[11px] text-white font-medium leading-tight">Transfer</span>
                    </button>
                    <button
                        className="flex-1 flex flex-col items-center justify-center py-2 px-3 active:scale-95 transition-transform"
                        style={{
                            maxWidth: '120px',
                            minHeight: '54px',
                            gap: '4px',
                            borderRadius: '16px',
                            border: '1.99px solid transparent',
                            backgroundImage: `linear-gradient(270deg, #060928 0.08%, #131A60 107.37%), 
                                            linear-gradient(155.31deg, rgba(255, 255, 255, 0.5) 12.33%, rgba(255, 255, 255, 0) 34.31%, rgba(255, 255, 255, 0) 52.66%, rgba(255, 255, 255, 0.54) 74.67%)`,
                            backgroundOrigin: 'padding-box, border-box',
                            backgroundClip: 'padding-box, border-box',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                        }}
                    >
                        <Circle size={20} className="text-white" strokeWidth={2.5} />
                        <span className="text-[11px] text-white font-medium leading-tight">Add a Circle</span>
                    </button>
                </div>
            </div>

            {/* --- BOTTOM SHEET --- */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-t-[32px] min-h-[400px] w-full mt-8 pt-8 pb-32 text-gray-900 relative z-10"
            >
                {/* Transactions Header */}
                <div className="flex items-center justify-between px-6 mb-6">
                    <h2 className="text-[#1a0b2e] text-lg font-bold">Recent transactions</h2>
                    <button className="text-xs font-semibold text-gray-500 underline decoration-gray-300 underline-offset-4">View all</button>
                </div>

                {/* Transactions List */}
                <div className="px-4 space-y-3">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl active:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${tx.type === 'transfer' ? 'bg-[#9E1256]' : 'bg-[#7A0E46]'}`}>
                                    {tx.type === 'transfer' ? <User size={20} /> : <CreditCard size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1a0b2e] text-sm">{tx.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{tx.subtitle}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-[#1a0b2e] text-sm">AED {tx.amount}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">{tx.date}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* --- BOTTOM NAVIGATION --- */}
            <BottomNav />

        </div>
    );
}

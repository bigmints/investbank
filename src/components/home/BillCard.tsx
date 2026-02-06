import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface BillCardProps {
    isVisible: boolean;
    onClose: () => void;
}

export const BillCard: React.FC<BillCardProps> = ({ isVisible, onClose }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative mx-4 mt-6 p-4 rounded-2xl bg-[#090616] border border-white/5 shadow-2xl overflow-hidden"
                >
                    {/* Background Gradient Blur */}
                    <div className="absolute -left-10 top-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full" />

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>

                    <div className="relative flex items-center justify-between z-10">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <Sparkles className="text-white fill-white" size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-[15px]">DEWA bill due in <span className="font-bold">5 days</span></h3>
                                <p className="text-gray-400 text-xs mt-0.5">Due date: 2 Feb 2026</p>
                            </div>
                        </div>

                        <button className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full active:scale-95 transition-transform">
                            Pay Now
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

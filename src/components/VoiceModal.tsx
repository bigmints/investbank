import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mic, Check } from 'lucide-react';

interface VoiceModalProps {
    isActive: boolean;
    stage: 'listening' | 'confirming' | 'success';
    transcript: string;
    onClose: () => void;
    onConfirm: () => void;
    successContent?: React.ReactNode;
}

export default function VoiceModal({ isActive, stage, transcript, onClose, onConfirm, successContent }: VoiceModalProps) {
    if (!isActive) return null;

    return (
        <motion.div
            key="voice-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50"
            style={{
                background: 'linear-gradient(180deg, #5d1a4d 0%, #2d1a4d 100%)'
            }}
        >
            <div className="flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-4 z-50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <button onClick={onClose} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/omar.png)` }} />
                            </button>
                            <h1 className="text-xl font-bold text-white">Hi Omar</h1>
                        </div>

                        <div className="flex items-center gap-4 text-white">
                            <button className="hover:opacity-80 transition-opacity">
                                <img src={`${import.meta.env.BASE_URL}assets/ai-search.svg`} className="w-6 h-6" alt="" />
                            </button>
                            <button className="hover:opacity-80 transition-opacity">
                                <img src={`${import.meta.env.BASE_URL}assets/notification.svg`} className="w-6 h-6" alt="" />
                            </button>
                        </div>
                    </div>

                    {/* Voice/Search Bar Variant */}
                    <motion.div layout className="relative mb-8 mt-4">
                        <div className="w-full bg-white rounded-full px-6 py-3.5 flex items-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                            {stage === 'listening' ? (
                                <>
                                    <div className="flex items-center gap-1">
                                        <motion.span
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0 }}
                                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                        />
                                        <motion.span
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                        />
                                        <motion.span
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                        />
                                    </div>
                                    <div className="ml-auto flex items-center gap-2">
                                        <button className="w-8 h-8 rounded-full bg-[#060928] flex items-center justify-center">
                                            <Plus size={16} className="text-white" strokeWidth={3} />
                                        </button>
                                        <button onClick={onClose}>
                                            <Mic size={18} className="text-[#060928]" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-400 font-medium text-sm">Adding Ahmed to the family..</span>
                                    <div className="ml-auto flex items-center gap-2">
                                        <button className="w-8 h-8 rounded-full bg-[#060928] flex items-center justify-center">
                                            <Plus size={16} className="text-white" strokeWidth={3} />
                                        </button>
                                        <button onClick={onClose}>
                                            <Mic size={18} className="text-[#060928]" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Content Area - Dynamic based on voice stage */}
                <div className="flex-1 flex items-start justify-center relative px-6 pt-0">
                    <AnimatePresence mode="wait">
                        {stage === 'listening' && (
                            <motion.div
                                key="listening-view"
                                className="relative flex flex-col items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Layered Bubble Visualization */}
                                <div className="relative w-64 h-64 flex items-center justify-center">
                                    {/* Outer static dashed circle */}
                                    <div className="absolute inset-0">
                                        <svg className="w-full h-full" viewBox="0 0 256 256">
                                            <circle
                                                cx="128"
                                                cy="128"
                                                r="0"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.3)"
                                                strokeWidth="2"
                                                strokeDasharray="8 8"
                                            />
                                        </svg>
                                    </div>

                                    {/* Bubble Layer 2 - Rotating ring (outer) */}
                                    <motion.div
                                        className="absolute"
                                        style={{
                                            width: '200px',
                                            height: '200px'
                                        }}
                                        animate={{
                                            rotate: 360
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.BASE_URL}assets/bubble-layer-2.png`}
                                            alt=""
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.div>

                                    {/* Bubble Layer 1 - Main gradient bubble with slow wobble */}
                                    <motion.div
                                        className="absolute"
                                        style={{
                                            width: '140px',
                                            height: '140px'
                                        }}
                                        animate={{
                                            rotate: [0, 3, -3, 0],
                                            scale: [1, 1.02, 1]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.BASE_URL}assets/bubble%20layer%201.png`}
                                            alt=""
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.div>

                                    {/* Cora SVG - Chat icon in center (static) */}
                                    <div
                                        className="absolute"
                                        style={{
                                            width: '60px',
                                            height: '60px'
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.BASE_URL}assets/Cora.svg`}
                                            alt=""
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Animated Transcript */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-white text-lg font-medium mt-12 text-center px-8"
                                >
                                    {transcript}
                                </motion.p>
                            </motion.div>
                        )}

                        {stage === 'confirming' && (
                            <motion.div
                                key="confirming-view"
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="w-[90vw] max-w-[400px] bg-white rounded-[40px] p-8 shadow-2xl relative z-50"
                            >
                                <div className="flex flex-wrap items-center gap-2 mb-8 text-[15px]">
                                    <span className="text-gray-500 font-medium">Add</span>
                                    <div className="flex items-center gap-2 bg-[#F5F5F7] px-2.5 py-1.5 rounded-full border border-gray-100">
                                        <div className="w-5 h-5 rounded-full overflow-hidden">
                                            <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs font-bold text-[#060928]">Ahmed</span>
                                    </div>
                                    <span className="text-gray-500 font-medium">to</span>
                                    <div className="bg-[#D40C52] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                                        <div className="flex -space-x-1.5">
                                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 overflow-hidden"><img src={`${import.meta.env.BASE_URL}assets/Amal.png`} className="w-full h-full object-cover" /></div>
                                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 overflow-hidden"><img src={`${import.meta.env.BASE_URL}assets/zyed.png`} className="w-full h-full object-cover" /></div>
                                        </div>
                                        My Family Circle
                                    </div>
                                </div>

                                <div className="bg-[#F5F5F7] rounded-[32px] p-6 flex items-center gap-4 mb-8">
                                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/ahmed.png)` }} />
                                    <div>
                                        <h4 className="text-[#060928] font-bold text-xl">Ahmed Al-Hassan</h4>
                                        <p className="text-gray-400 text-xs font-medium">Account number</p>
                                        <p className="text-[#060928] font-bold text-sm">543816102001</p>
                                    </div>
                                </div>

                                <button
                                    onClick={onConfirm}
                                    className="w-full bg-[#060928] text-white py-4 rounded-[40px] font-bold text-lg active:scale-[0.98] transition-all shadow-xl"
                                >
                                    Confirm
                                </button>
                            </motion.div>
                        )}

                        {stage === 'success' && (
                            <motion.div
                                key="success-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full flex items-center justify-center p-6"
                            >
                                {successContent ? successContent : (
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                            className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-6"
                                        >
                                            <Check size={48} className="text-white" strokeWidth={3} />
                                        </motion.div>
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-white text-2xl font-bold"
                                        >
                                            Done!
                                        </motion.p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

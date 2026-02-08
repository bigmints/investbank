import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Mic, MessageSquare, ChevronLeft, Sparkles,
    Wallet, ArrowLeftRight, Repeat, Receipt, CreditCard,
    BarChart3, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/ui/BottomNav';

type VoiceStage = 'listening' | 'confirming' | 'success';

export default function FamilyCircle() {
    const navigate = useNavigate();
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [voiceStage, setVoiceStage] = useState<VoiceStage>('listening');
    const [transcript, setTranscript] = useState("");
    const [activeTab, setActiveTab] = useState<'overview' | 'permissions'>('overview');

    // Permissions scale state
    const [permissions, setPermissions] = useState({
        balance: true,
        transactions: true,
        transfer: false,
        bills: false,
        cards: false,
        investment: false
    });

    const [memberAvatars, setMemberAvatars] = useState(['omar.png', 'Amal.png', 'zyed.png',]);
    const [showFourthAvatar, setShowFourthAvatar] = useState(false);

    const togglePermission = (key: keyof typeof permissions) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Auto-transition from listening to confirming
    useEffect(() => {
        if (isVoiceActive && voiceStage === 'listening') {
            const timer = setTimeout(() => {
                setVoiceStage('confirming');
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [isVoiceActive, voiceStage]);

    // Simulate transcript appearing letter by letter when voice is active
    useEffect(() => {
        if (isVoiceActive && voiceStage === 'listening') {
            const fullText = "Add Ahmed my dad to my household bills circle...";
            let currentText = "";
            let i = 0;
            const timer = setInterval(() => {
                if (i < fullText.length) {
                    currentText += fullText[i];
                    setTranscript(currentText);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 50);
            return () => clearInterval(timer);
        } else if (!isVoiceActive) {
            setTranscript("");
            setVoiceStage('listening');
        }
    }, [isVoiceActive, voiceStage]);

    const handleConfirm = () => {
        setVoiceStage('success');
        // Animate adding the 4th avatar after a short delay
        setTimeout(() => {
            setShowFourthAvatar(true);
        }, 800);
    };

    return (
        <div
            className="min-h-screen text-[#060928] font-sans pb-20 relative overflow-hidden"
            style={{
                background: isVoiceActive
                    ? 'linear-gradient(180deg, #5d1a4d 0%, #2d1a4d 100%)'
                    : 'linear-gradient(180deg, #5d1a4d 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,1) 40%)'
            }}
        >
            <AnimatePresence mode="wait">
                {!isVoiceActive ? (
                    <motion.div
                        key="normal-ui"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/omar.png)` }} />
                                    </button>
                                    <h1 className="text-xl font-bold text-white">Hi Omar</h1>
                                </div>

                                <div className="flex items-center gap-4 text-white">
                                    <button className="hover:opacity-80 transition-opacity">
                                        <Sparkles size={24} />
                                    </button>
                                    <button className="relative hover:opacity-80 transition-opacity" onClick={() => navigate('/chat-greeting')}>
                                        <MessageSquare size={24} />
                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-[#5d1a4d] flex items-center justify-center">
                                            <span className="text-[8px] font-bold text-white">1</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Back Button / Title */}
                            <div className="mb-6">
                                <button onClick={() => navigate(-1)} className="flex items-center gap-2 group">
                                    <ChevronLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-lg font-bold text-white underline decoration-white/30 underline-offset-4">My Family Circle</span>
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative mb-8">
                                <input
                                    type="text"
                                    placeholder="How can I help you today?"
                                    className="w-full bg-[#F5F5F7] text-gray-800 placeholder-gray-400 rounded-full px-6 py-3.5 pr-24 text-[15px] border-none focus:outline-none focus:ring-1 focus:ring-purple-200"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <button className="w-9 h-9 rounded-full bg-[#060928] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                                        <Plus size={20} className="text-white" strokeWidth={3} />
                                    </button>
                                    <button className="w-9 h-9 flex items-center justify-center active:scale-95 transition-transform" onClick={() => setIsVoiceActive(true)}>
                                        <Mic size={20} className="text-[#060928]" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Family Avatars Large Group */}
                        <div className="px-6 mb-10 flex -space-x-4 items-center">
                            {memberAvatars.map((img, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100"
                                >
                                    <img src={`${import.meta.env.BASE_URL}assets/${img}`} className="w-full h-full object-cover" alt="" />
                                </motion.div>
                            ))}
                            <AnimatePresence>
                                {showFourthAvatar && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -30, scale: 0.5 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        className="w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100 relative z-20"
                                    >
                                        <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} className="w-full h-full object-cover" alt="" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 mb-8">
                            <div className="relative flex gap-10">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`text-lg pb-3 relative z-10 transition-colors ${activeTab === 'overview' ? 'text-[#060928] font-bold' : 'text-gray-400 font-bold'}`}
                                >
                                    Overview
                                    {activeTab === 'overview' && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-[-15%] right-[-15%] h-1 bg-[#060928] rounded-full"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('permissions')}
                                    className={`text-lg pb-3 relative z-10 transition-colors ${activeTab === 'permissions' ? 'text-[#060928] font-bold' : 'text-gray-400 font-bold'}`}
                                >
                                    Permissions
                                    {activeTab === 'permissions' && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-[-15%] right-[-15%] h-1 bg-[#060928] rounded-full"
                                        />
                                    )}
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-100" />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' ? (
                                <motion.div
                                    key="overview-content"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Cards Section */}
                                    <div className="px-6 mb-10">
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-[#060928] text-xl font-extrabold tracking-tight">My Family Circle</h2>
                                            <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">See all</button>
                                        </div>

                                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-6 -mx-6 scroll-smooth snap-x snap-mandatory">
                                            {/* Household Bills Card */}
                                            <div
                                                className="relative min-w-[85vw] h-[241px] rounded-[32px] p-6 overflow-hidden snap-center group shadow-xl"
                                                style={{ background: 'linear-gradient(135deg, #D40C52 0%, #0D1252 100%)' }}
                                            >
                                                <div className="absolute -right-6 -top-6 w-36 h-36 border-[25px] border-white/10 rounded-full group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute right-4 bottom-12 w-16 h-16 border-[12px] border-white/10 rounded-full group-hover:scale-125 transition-transform duration-1000" />
                                                <div className="absolute -left-4 bottom-4 w-12 h-12 border-4 border-white/5 rounded-full" />

                                                <div className="relative z-10 flex flex-col h-full">
                                                    <h3 className="text-white text-2xl font-bold leading-tight mb-auto">Household<br />Bills</h3>
                                                    <div className="space-y-0.5">
                                                        <p className="text-white/80 text-[12px] leading-tight font-medium">Fees are all covered.</p>
                                                        <p className="text-white/80 text-[12px] leading-tight font-medium">Next instalment due in Mar</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* School Fees Card */}
                                            <div
                                                className="relative min-w-[85vw] h-[241px] rounded-[32px] p-6 overflow-hidden snap-center group shadow-xl"
                                                style={{ background: 'linear-gradient(135deg, #0D1252 0%, #5d1a4d 100%)' }}
                                            >
                                                <div className="absolute -right-8 bottom-4 w-40 h-40 border-[30px] border-white/5 rounded-full group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute -left-6 top-8 w-16 h-16 border-8 border-white/5 rounded-full" />

                                                <div className="relative z-10 flex flex-col h-full">
                                                    <h3 className="text-white text-2xl font-bold leading-tight mb-auto">School<br />fees</h3>
                                                    <div className="space-y-0.5">
                                                        <p className="text-white/80 text-[12px] leading-tight font-medium">Next payment on</p>
                                                        <p className="text-white/80 text-[12px] leading-tight font-medium">Monday</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pagination Dots */}
                                        <div className="flex justify-center items-center gap-2 mt-2">
                                            <div className="w-2 h-2 rounded-full bg-[#060928]" />
                                            <div className="w-2 h-2 rounded-full bg-[#E5D7DA] opacity-50" />
                                            <div className="w-2 h-2 rounded-full bg-[#E5D7DA] opacity-50" />
                                        </div>
                                    </div>

                                    {/* Things to run by you SECTION */}
                                    <div className="px-6 pb-12">
                                        <div className="flex items-center justify-between mb-5">
                                            <h2 className="text-[#060928] text-xl font-extrabold tracking-tight">Things to run by you</h2>
                                            <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">See all</button>
                                        </div>

                                        {/* Mock Item */}
                                        <div className="bg-[#F5F5F7] rounded-3xl p-5 border border-gray-100/50 flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-[#060928]">Household Spending</h4>
                                                <p className="text-sm text-gray-500 font-medium">Automated weekly report</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#060928]">
                                                <Plus size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="permissions-content"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-6 space-y-6"
                                >
                                    {/* Account Selector */}
                                    <div className="w-full bg-white border border-gray-200 rounded-full px-5 py-4 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
                                                <img src={`${import.meta.env.BASE_URL}assets/zyed.png`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[#060928] font-bold text-[15px]">Zayed Lite Account (Viewer)</span>
                                        </div>
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </div>

                                    {/* Permission List */}
                                    <div className="space-y-8 pt-4">
                                        <PermissionRow
                                            icon={<Wallet size={24} />}
                                            label="View Account Balance"
                                            active={permissions.balance}
                                            onToggle={() => togglePermission('balance')}
                                        />
                                        <PermissionRow
                                            icon={<ArrowLeftRight size={24} />}
                                            label="View Transactions"
                                            active={permissions.transactions}
                                            onToggle={() => togglePermission('transactions')}
                                        />
                                        <PermissionRow
                                            icon={<Repeat size={24} />}
                                            label="Transfer Funds"
                                            active={permissions.transfer}
                                            onToggle={() => togglePermission('transfer')}
                                        />
                                        <PermissionRow
                                            icon={<Receipt size={24} />}
                                            label="Pay Bills"
                                            active={permissions.bills}
                                            onToggle={() => togglePermission('bills')}
                                        />
                                        <PermissionRow
                                            icon={<CreditCard size={24} />}
                                            label="Manage Cards"
                                            active={permissions.cards}
                                            onToggle={() => togglePermission('cards')}
                                        />
                                        <PermissionRow
                                            icon={<BarChart3 size={24} />}
                                            label="Investment Access"
                                            active={permissions.investment}
                                            onToggle={() => togglePermission('investment')}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bottom Nav */}
                        <BottomNav />
                    </motion.div>
                ) : (
                    <motion.div
                        key="voice-ui"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col h-screen overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-4 z-50">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setIsVoiceActive(false)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/omar.png)` }} />
                                    </button>
                                    <h1 className="text-xl font-bold text-white">Hi Omar</h1>
                                </div>

                                <div className="flex items-center gap-4 text-white">
                                    <button className="hover:opacity-80 transition-opacity">
                                        <Sparkles size={24} />
                                    </button>
                                    <button className="relative hover:opacity-80 transition-opacity">
                                        <MessageSquare size={24} />
                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-[#5d1a4d] flex items-center justify-center">
                                            <span className="text-[8px] font-bold text-white">1</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Voice/Search Bar Variant */}
                            <motion.div
                                layout
                                className="relative mb-8 mt-4"
                            >
                                <div className="w-full bg-white rounded-full px-6 py-3.5 flex items-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                                    {voiceStage === 'success' ? (
                                        <span className="text-[#060928] font-bold">Adding 'Dad'</span>
                                    ) : (
                                        <>
                                            <span className="text-gray-400 font-medium whitespace-nowrap">Add</span>
                                            <div className="flex items-center gap-2 bg-[#F5F5F7] px-2 py-1 rounded-full border border-gray-100">
                                                <div className="w-5 h-5 rounded-full overflow-hidden">
                                                    <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="text-xs font-bold text-[#060928]">Ahmed</span>
                                            </div>
                                            <span className="text-[#060928] font-bold truncate">my dad...</span>
                                        </>
                                    )}
                                    <div className="ml-auto flex items-center gap-2">
                                        <button className="w-8 h-8 rounded-full bg-[#060928] flex items-center justify-center">
                                            <Plus size={16} className="text-white" strokeWidth={3} />
                                        </button>
                                        <button onClick={() => setIsVoiceActive(false)}>
                                            <Mic size={18} className="text-[#060928]" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 flex items-center justify-center relative">
                            <AnimatePresence mode="wait">
                                {voiceStage === 'listening' && (
                                    <motion.div
                                        key="listening-view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative flex flex-col items-center"
                                    >
                                        {/* Waveform Visualization Ring */}
                                        <div className="relative w-[300px] h-[300px] flex items-center justify-center transition-opacity duration-500">
                                            {[...Array(120)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="absolute w-[1.5px] bg-white rounded-full"
                                                    style={{
                                                        transform: `rotate(${i * 3}deg) translateY(-120px)`,
                                                    }}
                                                    animate={{
                                                        height: [
                                                            `${10 + Math.random() * 20}px`,
                                                            `${30 + Math.random() * 40}px`,
                                                            `${10 + Math.random() * 20}px`
                                                        ],
                                                        opacity: [0.3, 0.8, 0.3],
                                                        scaleY: [1, 1.5, 1]
                                                    }}
                                                    transition={{
                                                        duration: 0.8 + Math.random() * 0.5,
                                                        repeat: Infinity,
                                                        ease: "easeInOut"
                                                    }}
                                                />
                                            ))}

                                            {/* Glowing Orb */}
                                            <motion.div
                                                className="w-36 h-36 rounded-full relative overflow-hidden shadow-[0_0_60px_rgba(255,100,255,0.5)] z-10"
                                                animate={{
                                                    rotate: 360,
                                                    scale: [1, 1.05, 1]
                                                }}
                                                transition={{
                                                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                                                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-tr from-[#5d1a4d] via-purple-500 to-pink-400 opacity-90" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-white rounded-full p-3 shadow-lg flex items-center justify-center">
                                                        <div className="flex gap-0.5 items-end h-full">
                                                            <motion.div animate={{ height: ['40%', '100%', '40%'] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-1 bg-[#060928] rounded-full" />
                                                            <motion.div animate={{ height: ['60%', '30%', '60%'] }} transition={{ duration: 0.7, repeat: Infinity }} className="w-1 bg-[#060928] rounded-full" />
                                                            <motion.div animate={{ height: ['80%', '40%', '80%'] }} transition={{ duration: 0.6, repeat: Infinity }} className="w-1 bg-[#060928] rounded-full" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="mt-12 text-center px-8">
                                            <p className="text-white text-lg font-bold leading-relaxed tracking-tight max-w-[280px] mx-auto drop-shadow-md">
                                                {transcript}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {voiceStage === 'confirming' && (
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
                                            onClick={handleConfirm}
                                            className="w-full bg-[#060928] text-white py-4 rounded-[40px] font-bold text-lg active:scale-[0.98] transition-all shadow-xl"
                                        >
                                            Confirm
                                        </button>
                                    </motion.div>
                                )}

                                {voiceStage === 'success' && (
                                    <motion.div
                                        key="success-view"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full flex flex-col items-center"
                                    >
                                        <motion.h2
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="text-white text-3xl font-bold mb-10"
                                        >
                                            Dad is in!
                                        </motion.h2>

                                        {/* My Family Circle Detail Card */}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="relative w-[85vw] max-w-[340px] aspect-[1.4/1] rounded-[40px] p-8 overflow-hidden shadow-2xl"
                                            style={{ background: 'linear-gradient(135deg, #1d1a4d 0%, #060928 100%)' }}
                                        >
                                            <div className="absolute right-0 top-0 w-40 h-40 border-[30px] border-white/5 rounded-full" />
                                            <div className="absolute left-[-20px] bottom-[-20px] w-24 h-24 border-[15px] border-white/5 rounded-full" />

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-white text-base font-bold">My Family Circle</h3>
                                                    < ChevronLeft size={16} className="text-white rotate-180" />
                                                </div>

                                                <div className="flex -space-x-1.5 inline-flex items-center mb-8">
                                                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-md"><img src={`${import.meta.env.BASE_URL}assets/Amal.png`} className="w-full h-full object-cover" /></div>
                                                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-md"><img src={`${import.meta.env.BASE_URL}assets/zyed.png`} className="w-full h-full object-cover" /></div>
                                                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-md"><img src={`${import.meta.env.BASE_URL}assets/omar.png`} className="w-full h-full object-cover" /></div>
                                                    <motion.div
                                                        initial={{ scale: 0, x: -10 }}
                                                        animate={{ scale: 1, x: 0 }}
                                                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-md bg-purple-500 flex items-center justify-center relative z-20"
                                                    >
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.5 }}
                                                            className="absolute inset-0 flex items-center justify-center"
                                                        >
                                                            <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} className="w-full h-full object-cover" />
                                                        </motion.div>
                                                    </motion.div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-4 mb-4">
                                                    <div>
                                                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Members</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="text-white font-bold">3</p>
                                                            <motion.span
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.8 }}
                                                                className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                                            >
                                                                +1
                                                            </motion.span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Circle type</p>
                                                        <p className="text-white font-bold">Budgeting</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Start date</p>
                                                        <p className="text-white font-bold">Sep</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">End date</p>
                                                        <p className="text-white font-bold">NA</p>
                                                    </div>
                                                </div>

                                                <div className="mt-auto border-t border-white/10 pt-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Balance</p>
                                                        <p className="text-white font-bold text-lg">AED 4,575.59</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600/50 flex items-center justify-center border border-white/20">
                                                        <Plus size={24} className="text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Bottom Avatars with new addition */}
                                        <div className="mt-20 flex gap-4">
                                            <div className="flex -space-x-4">
                                                {['Amal.png', 'zyed.png', 'omar.png'].map((img, i) => (
                                                    <div key={i} className="w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100">
                                                        <img src={`${import.meta.env.BASE_URL}assets/${img}`} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                ))}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -30, rotate: -20, scale: 0.5 }}
                                                    animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                                                    transition={{ delay: 1, type: "spring" }}
                                                    className="w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100 relative z-30"
                                                >
                                                    <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} className="w-full h-full object-cover" alt="" />
                                                </motion.div>
                                            </div>
                                        </div>

                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 2 }}
                                            onClick={() => {
                                                setIsVoiceActive(false);
                                                setShowFourthAvatar(true);
                                                setMemberAvatars(['Amal.png', 'zyed.png', 'omar.png']);
                                            }}
                                            className="mt-12 text-white/60 font-bold hover:text-white transition-colors"
                                        >
                                            Dismiss
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PermissionRow({ icon, label, active, onToggle }: { icon: React.ReactNode, label: string, active: boolean, onToggle: () => void }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="text-[#060928] flex items-center justify-center w-6 tracking-tight">
                    {icon}
                </div>
                <span className="text-[#060928] font-bold text-lg tracking-tight">{label}</span>
            </div>
            <button
                onClick={onToggle}
                className={`w-14 h-8 rounded-full transition-colors relative flex items-center px-1 ${active ? 'bg-[#060928]' : 'bg-[#E5D7DA]'}`}
            >
                <motion.div
                    animate={{ x: active ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-6 h-6 rounded-full bg-white shadow-sm"
                />
            </button>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Mic, ChevronLeft,
    Wallet, ArrowLeftRight, Repeat, Receipt, CreditCard,
    BarChart3, ChevronDown, Check
} from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import VoiceModal from '../components/VoiceModal';



type ConversationStage = 'idle' | 'userTyping' | 'aiResponding' | 'roleSelection' | 'confirmationCard' | 'animatingAvatar' | 'confirmed' | 'followUp';

interface Message {
    id: number;
    type: 'user' | 'ai';
    text: string;
    avatar?: string;
    showAvatarGroup?: boolean;
    inlineAvatar?: { image: string; name: string };
}

const roles = [
    { id: 'manager', label: 'Circle Manager', description: 'Full access to manage circle' },
    { id: 'viewer', label: 'Viewer', description: 'View-only access' },
    { id: 'editor', label: 'Editor', description: 'Can edit and contribute' },
    { id: 'contributor', label: 'Contributor', description: 'Can add transactions' }
];

export default function FamilyCircle() {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'dashboard' | 'chat'>('dashboard');
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [voiceStage, setVoiceStage] = useState<'listening' | 'confirming' | 'success'>('listening');
    const [transcript, setTranscript] = useState("");
    const [activeTab, setActiveTab] = useState<'overview' | 'permissions'>('overview');
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const cardsScrollRef = useRef<HTMLDivElement>(null);

    // Chat State
    const [chatStage, setChatStage] = useState<ConversationStage>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Chat Simulation Logic
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, chatStage]);

    // Handle carousel scroll for pagination
    const handleCardsScroll = () => {
        if (cardsScrollRef.current) {
            const scrollLeft = cardsScrollRef.current.scrollLeft;
            const cardWidth = cardsScrollRef.current.clientWidth * 0.85;
            const index = Math.round(scrollLeft / cardWidth);
            setActiveCardIndex(Math.max(0, Math.min(2, index)));
        }
    };

    useEffect(() => {
        if (chatStage === 'userTyping') {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'user',
                    text: 'Add Ahmed, my dad, to my family circle'
                }]);
                setChatStage('aiResponding');
            }, 500);
            return () => clearTimeout(timer);
        }

        if (chatStage === 'aiResponding') {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    text: "Ok, what's the role you want to assign to",
                    inlineAvatar: { image: 'ahmed.png', name: 'Ahmed' }
                }]);
                setChatStage('roleSelection');
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (chatStage === 'animatingAvatar') {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    text: 'Added Dad to the circle',
                    showAvatarGroup: true
                }]);
                setChatStage('confirmed');
                setShowFourthAvatar(true);
                // Don't add to memberAvatars - showFourthAvatar handles the 4th avatar
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (chatStage === 'confirmed') {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    text: 'Is there anything else I can do for you today?'
                }]);
                setChatStage('followUp');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [chatStage]);

    const handleInputSubmit = () => {
        if ((chatStage === 'idle' || chatStage === 'followUp') && inputValue.trim()) {
            setViewMode('chat');
            setInputValue(''); // Clear the input immediately
            setChatStage('userTyping');
        }
    };

    const handleRoleToggle = (roleId: string) => {
        setSelectedRoles(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleRoleConfirm = () => {
        if (selectedRoles.length > 0) {
            setChatStage('confirmationCard');
        }
    };

    const handleConfirmAddMember = () => {
        setChatStage('animatingAvatar');
    };

    const handleBackToDashboard = () => {
        setViewMode('dashboard');
        // Reset chat state to allow replaying the demo
        setMessages([]);
        setChatStage('idle');
        setSelectedRoles([]);
        // Keep avatar - don't reset showFourthAvatar so Ahmed stays visible
    };

    // Permissions scale state
    const [permissions, setPermissions] = useState({
        balance: true,
        transactions: true,
        transfer: false,
        bills: false,
        cards: false,
        investment: false
    });


    const memberAvatars = ['omar.png', 'Amal.png', 'zyed.png'];
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
        // Animate adding the 4th avatar in the background
        setTimeout(() => {
            setShowFourthAvatar(true);
        }, 500);
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
            <VoiceModal
                isActive={isVoiceActive}
                stage={voiceStage}
                transcript={transcript}
                onClose={() => setIsVoiceActive(false)}
                onConfirm={handleConfirm}
                successContent={
                    <div className="w-full flex flex-col items-center">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-white text-3xl font-bold mb-10"
                        >
                            Added Ahmed !
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
                                    <ChevronLeft size={16} className="text-white rotate-180" />
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
                                // Don't add to memberAvatars - showFourthAvatar handles the 4th avatar
                            }}
                            className="mt-12 text-white/60 font-bold hover:text-white transition-colors"
                        >
                            Dismiss
                        </motion.button>
                    </div>
                }
            />

            <AnimatePresence mode="wait">
                {viewMode === 'dashboard' ? (
                    <motion.div
                        key="dashboard-ui"
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
                                        <img src={`${import.meta.env.BASE_URL}assets/ai-search.svg`} className="w-6 h-6" alt="" />
                                    </button>
                                    <button className="hover:opacity-80 transition-opacity">
                                        <img src={`${import.meta.env.BASE_URL}assets/notification.svg`} className="w-6 h-6" alt="" />
                                    </button>
                                </div>
                            </div>

                            {/* Back Button / Title */}
                            <div className="mb-6">
                                <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
                                    <ChevronLeft size={20} className="text-white group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-lg font-bold text-white underline decoration-white/30 underline-offset-4">My Family Circle</span>
                                </button>
                            </div>

                            {/* Search/Chat Input */}
                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                    placeholder="How can I help you today?"
                                    className="w-full bg-[#F5F5F7] text-gray-800 placeholder-gray-400 rounded-full px-6 py-3.5 pr-24 text-[15px] border-none focus:outline-none focus:ring-1 focus:ring-purple-200"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <button
                                        onClick={handleInputSubmit}
                                        className="w-9 h-9 rounded-full bg-[#060928] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                                    >
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

                                        <div
                                            ref={cardsScrollRef}
                                            onScroll={handleCardsScroll}
                                            className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-6 -mx-6 scroll-smooth snap-x snap-mandatory"
                                        >
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
                                            {[0, 1, 2].map((index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        if (cardsScrollRef.current) {
                                                            const cardWidth = cardsScrollRef.current.clientWidth * 0.85;
                                                            cardsScrollRef.current.scrollTo({
                                                                left: cardWidth * index,
                                                                behavior: 'smooth'
                                                            });
                                                        }
                                                    }}
                                                    className="transition-all duration-300"
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full transition-all ${activeCardIndex === index
                                                            ? 'bg-[#060928] scale-125'
                                                            : 'bg-[#E5D7DA] opacity-50'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Things to run by you SECTION */}
                                    <div className="px-6 pb-12">
                                        <h2 className="text-[#060928] text-xl font-extrabold tracking-tight mb-5">Things to run by you</h2>

                                        <div className="space-y-4">
                                            {/* Budget Tracking Card */}
                                            <div className="relative bg-gradient-to-br from-[#8B1858] to-[#2D1A4D] rounded-3xl p-6 overflow-hidden">
                                                {/* Background decorative circles */}
                                                <div className="absolute -right-8 bottom-4 w-40 h-40 bg-[#5D1A4D] opacity-30 rounded-full" />
                                                <div className="absolute -right-4 -top-8 w-32 h-32 bg-[#5D1A4D] opacity-20 rounded-full" />

                                                <div className="relative z-10 flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-white text-lg font-bold mb-1">Cut on bills to get your budget back on track</h3>
                                                        <p className="text-white/70 text-sm">Switch to a new bill providers</p>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1 ml-4">
                                                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                                            <div className="w-10 h-10 rounded-full border-4 border-white/30 border-t-white" />
                                                        </div>
                                                        <div className="bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                            <span className="text-white text-[10px] font-bold">Daman</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className="relative z-10 bg-white text-[#060928] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/90 transition-colors">
                                                    Check out details
                                                </button>
                                            </div>

                                            {/* Approval Request Card */}
                                            <div className="bg-white rounded-3xl p-5 border-2 border-[#D40C52]">
                                                <p className="text-[#060928] font-medium mb-4">
                                                    Zyed has requested an extra <span className="font-bold">AED 500</span> for this month
                                                </p>
                                                <button className="bg-[#060928] text-white px-8 py-2.5 rounded-full font-bold text-sm hover:bg-[#060928]/90 transition-colors">
                                                    Approve
                                                </button>
                                            </div>

                                            {/* Nudge Notification */}
                                            <div className="bg-white rounded-3xl p-5 border border-gray-200 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-[#8B1858] flex items-center justify-center flex-shrink-0">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="M12 8v4M12 16h.01" />
                                                    </svg>
                                                </div>
                                                <p className="text-[#060928] font-semibold text-sm">We nudged your wife to top up the account</p>
                                            </div>

                                            {/* Payment Notifications */}
                                            <div className="space-y-3">
                                                {/* Fatima Al-Hassan */}
                                                <div className="bg-[#F5F5F7] rounded-2xl p-4 flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                                                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/Amal.png)` }} />
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#F5F5F7]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-[#060928] font-bold text-sm">Fatima Al-Hassan</h4>
                                                        <p className="text-gray-500 text-xs">Yesterday at 9:41 AM</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[#060928] font-bold">+AED 2000.00</p>
                                                    </div>
                                                </div>

                                                {/* DEWA Bill Payment */}
                                                <div className="bg-[#F5F5F7] rounded-2xl p-4 flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-white">
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#F5F5F7]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-[#060928] font-bold text-sm">DEWA Bill Payment</h4>
                                                        <p className="text-gray-500 text-xs">Monday at 6:02 AM</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[#060928] font-bold">-AED 320.00</p>
                                                    </div>
                                                </div>

                                                {/* DU Bill Payment */}
                                                <div className="bg-[#F5F5F7] rounded-2xl p-4 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                                                        <span className="text-white font-bold text-xs">du</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-[#060928] font-bold text-sm">DU Bill Payment</h4>
                                                        <p className="text-gray-500 text-xs">Friday at 7:35 AM</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[#060928] font-bold">-AED 40.00</p>
                                                    </div>
                                                </div>
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
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat-ui"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-screen"
                    >
                        {/* Chat Header */}
                        <div className="px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <button onClick={handleBackToDashboard} className="hover:opacity-80 transition-opacity">
                                        <ChevronLeft size={24} className="text-white" />
                                    </button>
                                    <h1 className="text-xl font-bold text-white">Family Circle Chat</h1>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages Container */}
                        <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-4">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                                    >
                                        {message.type === 'ai' && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-sm flex-shrink-0">
                                                <img src={`${import.meta.env.BASE_URL}assets/omar.png`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] rounded-[24px] px-5 py-3.5 ${message.type === 'user'
                                                ? 'bg-[#060928] text-white'
                                                : 'bg-white text-[#060928] shadow-sm'
                                                }`}
                                        >
                                            {message.inlineAvatar ? (
                                                <p className="text-[14px] font-medium leading-relaxed">
                                                    {message.text}{' '}
                                                    <span className="inline-flex items-center gap-1.5 bg-[#F5F5F7] px-2 py-0.5 rounded-full border border-gray-100 align-middle mx-1">
                                                        <span className="inline-block w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                                                            <img src={`${import.meta.env.BASE_URL}assets/${message.inlineAvatar.image}`} className="w-full h-full object-cover" alt="" />
                                                        </span>
                                                        <span className="text-[11px] font-bold text-[#060928] whitespace-nowrap">{message.inlineAvatar.name}</span>
                                                    </span>
                                                    ?
                                                </p>
                                            ) : (
                                                <p className="text-[14px] font-medium leading-relaxed">{message.text}</p>
                                            )}
                                            {message.showAvatarGroup && (
                                                <div className="flex justify-center pt-3 pb-1">
                                                    <div className="flex -space-x-3">
                                                        {['Amal.png', 'zyed.png', 'omar.png'].map((img, i) => (
                                                            <div key={i} className="w-10 h-10 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-gray-100">
                                                                <img src={`${import.meta.env.BASE_URL}assets/${img}`} className="w-full h-full object-cover" alt="" />
                                                            </div>
                                                        ))}
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-10 h-10 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-gray-100 relative z-10"
                                                        >
                                                            <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} className="w-full h-full object-cover" alt="" />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Role Selection UI */}
                                {chatStage === 'roleSelection' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pl-11">
                                        {roles.map((role) => (
                                            <button
                                                key={role.id}
                                                onClick={() => handleRoleToggle(role.id)}
                                                className={`w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between transition-all border ${selectedRoles.includes(role.id) ? 'border-[#D40C52] ring-1 ring-[#D40C52]' : 'border-transparent'
                                                    }`}
                                            >
                                                <div className="text-left">
                                                    <p className="text-[#060928] font-bold text-[14px]">{role.label}</p>
                                                    <p className="text-gray-400 text-[11px]">{role.description}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedRoles.includes(role.id)
                                                    ? 'bg-[#D40C52] border-[#D40C52]'
                                                    : 'border-gray-200'
                                                    }`}>
                                                    {selectedRoles.includes(role.id) && <Check size={12} className="text-white" strokeWidth={3} />}
                                                </div>
                                            </button>
                                        ))}
                                        {selectedRoles.length > 0 && (
                                            <button
                                                onClick={handleRoleConfirm}
                                                className="w-full bg-[#060928] text-white rounded-full py-3.5 font-bold text-[14px] shadow-lg active:scale-95 transition-transform"
                                            >
                                                Continue
                                            </button>
                                        )}
                                    </motion.div>
                                )}

                                {/* Inline Confirmation Card */}
                                {chatStage === 'confirmationCard' && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pl-11">
                                        <div className="w-full bg-white rounded-[32px] p-5 shadow-lg border border-gray-100">
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="w-14 h-14 rounded-full border-2 border-gray-100 overflow-hidden">
                                                    <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[#060928] font-bold text-lg">Ahmed Al-Hassan</h4>
                                                    <p className="text-gray-400 text-xs font-medium">Account: 5438...2001</p>
                                                </div>
                                            </div>
                                            <div className="mb-5 space-y-2 bg-[#F5F5F7] p-4 rounded-2xl">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Permissions</p>
                                                {selectedRoles.map(roleId => (
                                                    <div key={roleId} className="flex items-center gap-2">
                                                        <Check size={12} className="text-[#D40C52]" />
                                                        <span className="text-[#060928] font-semibold text-xs">{roles.find(r => r.id === roleId)?.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={handleConfirmAddMember}
                                                className="w-full bg-[#060928] text-white rounded-full py-3.5 font-bold text-[14px] shadow-lg active:scale-95 transition-transform"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </AnimatePresence>
                        </div>

                        {/* Chat Input Bar */}
                        {(chatStage === 'idle' || chatStage === 'followUp') && (
                            <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+20px)]">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                        placeholder="How can I help you today?"
                                        className="w-full bg-[#F5F5F7] text-gray-800 placeholder-gray-400 rounded-full px-6 py-3.5 pr-24 text-[15px] border-none focus:outline-none focus:ring-1 focus:ring-purple-200"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button
                                            onClick={handleInputSubmit}
                                            className="w-9 h-9 rounded-full bg-[#060928] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                                        >
                                            <Plus size={20} className="text-white" strokeWidth={3} />
                                        </button>
                                        <button className="w-9 h-9 flex items-center justify-center active:scale-95 transition-transform" onClick={() => setIsVoiceActive(true)}>
                                            <Mic size={20} className="text-[#060928]" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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

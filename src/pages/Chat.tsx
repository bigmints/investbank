import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mic, Plus, Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export default function Chat() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [stage, setStage] = useState<ConversationStage>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [voiceStage, setVoiceStage] = useState<'listening' | 'confirming' | 'success'>('listening');
    const [transcript, setTranscript] = useState('');

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, stage]);

    // Auto-focus input on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // Voice simulation: listening → confirming
    useEffect(() => {
        if (isVoiceActive && voiceStage === 'listening') {
            const timer = setTimeout(() => {
                setVoiceStage('confirming');
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [isVoiceActive, voiceStage]);

    // Simulate transcript appearing letter by letter
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


    // Simulate conversation flow
    useEffect(() => {
        if (stage === 'userTyping') {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'user',
                    text: 'I want to add Ahmed, my dad to my circle'
                }]);
                setInputValue('');
                setStage('aiResponding');
            }, 800);
            return () => clearTimeout(timer);
        }

        if (stage === 'aiResponding') {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    text: "Ok, what's the role you want to assign to",
                    inlineAvatar: { image: 'ahmed.png', name: 'Ahmed' }
                }]);
                setStage('roleSelection');
            }, 1200);
            return () => clearTimeout(timer);
        }

        if (stage === 'animatingAvatar') {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    text: 'Added Dad to the circle',
                    showAvatarGroup: true
                }]);
                setStage('confirmed');
            }, 1500);
            return () => clearTimeout(timer);
        }

        if (stage === 'confirmed') {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'ai',
                    text: 'Is there anything else I can do for you today?'
                }]);
                setStage('followUp');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const handleInputSubmit = () => {
        if (stage === 'idle' && inputValue.trim()) {
            setStage('userTyping');
        }
    };

    const handleVoiceClick = () => {
        setIsVoiceActive(true);
        setVoiceStage('listening');
    };

    const handleVoiceConfirm = () => {
        setVoiceStage('success');
        setTimeout(() => {
            setIsVoiceActive(false);
            // Trigger the chat simulation after voice closes
            setStage('userTyping');
        }, 2000);
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
            setStage('confirmationCard');
        }
    };

    const handleConfirmAddMember = () => {
        setStage('animatingAvatar');
    };

    return (
        <div
            className="min-h-screen text-[#060928] font-sans flex flex-col"
            style={{
                background: isVoiceActive
                    ? 'linear-gradient(180deg, #5d1a4d 0%, #2d1a4d 100%)'
                    : 'linear-gradient(180deg, #5d1a4d 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,1) 40%)'
            }}
        >
            <AnimatePresence mode="wait">
                {!isVoiceActive ? (
                    <motion.div
                        key="normal-chat"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-screen"
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
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-4">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                                    >
                                        {message.type === 'ai' && message.avatar && (
                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                                                <img src={`${import.meta.env.BASE_URL}assets/${message.avatar}`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[75%] rounded-3xl px-6 py-4 ${message.type === 'user'
                                                ? 'bg-[#060928] text-white'
                                                : 'bg-white text-[#060928] shadow-md'
                                                }`}
                                        >
                                            {message.inlineAvatar ? (
                                                <p className="text-[15px] font-medium">
                                                    {message.text}{' '}
                                                    <span className="inline-flex items-center gap-1.5 bg-[#F5F5F7] px-2 py-1 rounded-full border border-gray-100 align-middle">
                                                        <span className="inline-block w-5 h-5 rounded-full overflow-hidden flex-shrink-0 align-middle">
                                                            <img src={`${import.meta.env.BASE_URL}assets/${message.inlineAvatar.image}`} className="w-full h-full object-cover" alt="" />
                                                        </span>
                                                        <span className="text-xs font-bold text-[#060928] whitespace-nowrap">{message.inlineAvatar.name}</span>
                                                    </span>
                                                    ?
                                                </p>
                                            ) : (
                                                <p className="text-[15px] font-medium mb-4">{message.text}</p>
                                            )}
                                            {message.showAvatarGroup && (
                                                <div className="flex justify-center pt-2">
                                                    <div className="flex -space-x-4">
                                                        {['Amal.png', 'zyed.png', 'omar.png'].map((img, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, x: -30 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className="w-14 h-14 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100"
                                                            >
                                                                <img src={`${import.meta.env.BASE_URL}assets/${img}`} className="w-full h-full object-cover" alt="" />
                                                            </motion.div>
                                                        ))}
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -30, scale: 0.5 }}
                                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                            className="w-14 h-14 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100 relative z-20"
                                                        >
                                                            <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} className="w-full h-full object-cover" alt="" />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Role Selection */}
                            {stage === 'roleSelection' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                >
                                    {roles.map((role) => (
                                        <motion.button
                                            key={role.id}
                                            onClick={() => handleRoleToggle(role.id)}
                                            className={`w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-between transition-all ${selectedRoles.includes(role.id) ? 'ring-2 ring-[#D40C52]' : ''
                                                }`}
                                        >
                                            <div className="text-left">
                                                <p className="text-[#060928] font-bold text-[15px]">{role.label}</p>
                                                <p className="text-gray-400 text-xs">{role.description}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedRoles.includes(role.id)
                                                ? 'bg-[#D40C52] border-[#D40C52]'
                                                : 'border-gray-300'
                                                }`}>
                                                {selectedRoles.includes(role.id) && (
                                                    <Check size={14} className="text-white" strokeWidth={3} />
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}

                                    {selectedRoles.length > 0 && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            onClick={handleRoleConfirm}
                                            className="w-full bg-[#060928] text-white rounded-full py-4 font-bold text-[15px] shadow-lg active:scale-95 transition-transform"
                                        >
                                            Continue
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}

                            {/* Inline Confirmation Card */}
                            {stage === 'confirmationCard' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full bg-white rounded-[32px] p-6 shadow-xl"
                                >
                                    <div className="flex flex-wrap items-center gap-2 mb-6 text-[14px]">
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

                                    <div className="bg-[#F5F5F7] rounded-[24px] p-5 mb-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/ahmed.png)` }} />
                                            <div>
                                                <h4 className="text-[#060928] font-bold text-lg">Ahmed Al-Hassan</h4>
                                                <p className="text-gray-400 text-xs font-medium">Account number</p>
                                                <p className="text-[#060928] font-bold text-sm">543816102001</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#F5F5F7] rounded-[20px] p-4 mb-6">
                                        <p className="text-gray-400 text-xs font-medium mb-3">Permissions</p>
                                        <div className="space-y-2">
                                            {selectedRoles.map(roleId => {
                                                const role = roles.find(r => r.id === roleId);
                                                return role ? (
                                                    <div key={roleId} className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-[#D40C52] flex items-center justify-center">
                                                            <Check size={12} className="text-white" strokeWidth={3} />
                                                        </div>
                                                        <span className="text-[#060928] font-bold text-sm">{role.label}</span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleConfirmAddMember}
                                        className="w-full bg-[#060928] text-white rounded-full py-4 font-bold text-[15px] shadow-lg active:scale-95 transition-transform"
                                    >
                                        Confirm
                                    </button>
                                </motion.div>
                            )}



                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Bar */}
                        {(stage === 'idle' || stage === 'followUp') && (
                            <div className="px-6 pb-[calc(env(safe-area-inset-bottom)+20px)]">
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                        placeholder="How can I help you today?"
                                        className="w-full bg-[#F5F5F7] text-gray-800 placeholder-gray-400 rounded-full px-6 py-3.5 pr-24 text-[15px] border-none focus:outline-none focus:ring-1 focus:ring-purple-200"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button className="w-9 h-9 rounded-full bg-[#060928] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                                            <Plus size={20} className="text-white" strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={handleVoiceClick}
                                            className="w-9 h-9 flex items-center justify-center active:scale-95 transition-transform"
                                        >
                                            <Mic size={20} className="text-[#060928]" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="voice-modal"
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
                            <motion.div layout className="relative mb-8 mt-4">
                                <div className="w-full bg-white rounded-full px-6 py-3.5 flex items-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                                    <span className="text-gray-400 font-medium whitespace-nowrap">Add</span>
                                    <div className="flex items-center gap-2 bg-[#F5F5F7] px-2 py-1 rounded-full border border-gray-100">
                                        <div className="w-5 h-5 rounded-full overflow-hidden">
                                            <img src={`${import.meta.env.BASE_URL}assets/ahmed.png`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs font-bold text-[#060928]">Ahmed</span>
                                    </div>
                                    <span className="text-[#060928] font-bold truncate">my dad...</span>
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

                        {/* Content Area - Dynamic based on voice stage */}
                        <div className="flex-1 flex items-center justify-center relative px-6">
                            <AnimatePresence mode="wait">
                                {voiceStage === 'listening' && (
                                    <motion.div
                                        key="listening-view"
                                        className="relative flex flex-col items-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {/* Glowing Orb */}
                                        <motion.div
                                            className="w-36 h-36 rounded-full relative overflow-hidden shadow-[0_0_60px_rgba(255,100,255,0.5)] z-10"
                                            style={{
                                                background: 'radial-gradient(circle, rgba(255,150,255,0.9) 0%, rgba(180,100,255,0.7) 50%, rgba(120,50,200,0.5) 100%)'
                                            }}
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                opacity: [0.8, 1, 0.8]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Mic size={48} className="text-white" strokeWidth={2} />
                                            </div>
                                        </motion.div>

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
                                            onClick={handleVoiceConfirm}
                                            className="w-full bg-[#060928] text-white py-4 rounded-[40px] font-bold text-lg active:scale-[0.98] transition-all shadow-xl"
                                        >
                                            Confirm
                                        </button>
                                    </motion.div>
                                )}

                                {voiceStage === 'success' && (
                                    <motion.div
                                        key="success-view"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center"
                                    >
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

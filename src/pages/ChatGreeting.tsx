import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ChatGreeting() {
    const navigate = useNavigate();

    useEffect(() => {
        // Auto-navigate to chat screen after 2 seconds
        const timer = setTimeout(() => {
            navigate('/chat');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div
            className="min-h-screen text-white font-sans flex items-center justify-center"
            style={{
                background: 'linear-gradient(180deg, #5d1a4d 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,1) 40%)'
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
            >
                <h1 className="text-4xl font-bold text-[#060928] mb-8">Hi Omar!</h1>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="relative"
                >
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/omar.png)` }}
                        />
                    </div>
                    {/* Shadow effect */}
                    <div className="absolute inset-0 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.3)]" />
                </motion.div>
            </motion.div>
        </div>
    );
}

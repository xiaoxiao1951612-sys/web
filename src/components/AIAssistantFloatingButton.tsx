import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ChatInterface } from "./ChatInterface";
import { useTheme } from "@/hooks/useTheme";

export const AIAssistantFloatingButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme();

    const toggleAssistant = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed right-6 bottom-6 z-40">
            <AnimatePresence>
                {isOpen && <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.8,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.8,
                        y: 20
                    }}
                    transition={{
                        duration: 0.2
                    }}
                       className="absolute bottom-20 right-0 w-full max-w-md transform-gpu assistant-container md:w-auto">
                    <div
                         className={`backdrop-blur-md rounded-xl border shadow-2xl shadow-purple-500/10 overflow-hidden w-full ${
                            theme === 'dark' 
                                ? 'bg-gray-900/95 border-gray-800' 
                                : 'bg-white/95 border-gray-200'
                        }`}
                        style={{ padding: "0px" }}>
                        <div
                             className={`flex justify-between items-center p-2 border-b ${
                                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                            }`}>
                            <div className="flex items-center gap-2">
                             <h3 className={`font-semibold text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>AI助手</h3>
                            </div>
                            <button
                                onClick={toggleAssistant}
                                className="p-1 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
                                aria-label="关闭AI助手">
                                <X size={14} />
                            </button>
                        </div>
                     <ChatInterface />
                    </div>
                    <div
                             className={`w-6 h-6 border-l border-b absolute -bottom-2 right-6 transform rotate-45 ${
                                theme === 'dark' 
                                    ? 'bg-gray-900/95 border-gray-800' 
                                    : 'bg-white/95 border-gray-200'
                            }`}></div>
                </motion.div>}
            </AnimatePresence>
            <motion.button
                onClick={toggleAssistant}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 transition-all duration-300 ${isOpen ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"}`}
                whileHover={{
                    scale: 1.05
                }}
                whileTap={{
                    scale: 0.95
                }}
                initial={{
                    opacity: 0
                }}
                animate={{
                    opacity: 1
                }}
                transition={{
                    delay: 0.5
                }}
                aria-label="打开AI助手">
                {isOpen ? <X size={24} className="text-white" /> : <span className="text-white text-xl font-bold">AI</span>}
            </motion.button>
        </div>
    );
};
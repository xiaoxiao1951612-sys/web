import { useState } from "react";
import { motion } from "framer-motion";

export const Character3D = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative w-full max-w-xs flex justify-center items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <motion.div
                className="relative w-64 h-64 floating"
                animate={{
                    rotateY: isHovered ? 360 : 0,
                    scale: isHovered ? 1.1 : 1
                }}
                transition={{
                    rotateY: {
                        duration: 2,
                        ease: "easeInOut"
                    },

                    scale: {
                        duration: 0.3
                    }
                }}>
                <div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl"></div>
                <></>
            </motion.div>
        </motion.div>
    );
};
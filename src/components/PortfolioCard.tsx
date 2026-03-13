import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

interface PortfolioItem {
    id: number;
    title: string;
    category: string;
    description: string;
    date: string;
    image: string;
    images?: string[];
}

export const PortfolioCard = (
    {
        item
    }: {
        item: PortfolioItem;
    }
) => {
    const {
        theme
    } = useTheme();

    const cover =
        item.images && item.images.length > 0 ? item.images[0] : item.image;

    return (
        <motion.div
            className={`backdrop-blur-md rounded-xl overflow-hidden border transition-all ${theme === "dark" ? "bg-gray-900/80 border-gray-800 hover:border-purple-500/50" : "bg-white border-gray-200 hover:border-purple-400"}`}
            whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.3)"
            }}
            initial={{
                opacity: 0,
                y: 20
            }}
            whileInView={{
                opacity: 1,
                y: 0
            }}
            viewport={{
                once: true
            }}
            transition={{
                duration: 0.3
            }}>
            <div className="h-48 overflow-hidden">
                <img
                    src={cover}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
            </div>
            <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                    <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${theme === "dark" ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-800"}`}>
                        {item.category}
                    </span>
                    <span
                        className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{item.date}</span>
                </div>
                <h3
                    className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>{item.title}</h3>
                <p
                    className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.description}</p>
                <Link
                    to={`/project/${item.id}`}
                    className={`flex items-center gap-1 transition-colors ${theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-purple-700 hover:text-purple-600"}`}>查看详情 <ChevronRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
};
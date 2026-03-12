import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const NotFound = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col">
      <nav
        className={`sticky top-0 left-0 right-0 backdrop-blur-md z-50 border-b ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/')}
            className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
            aria-label="返回首页"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="ml-4 text-xl font-bold">页面不存在</h1>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-center max-w-md backdrop-blur-md rounded-xl p-8 border shadow-xl ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-800 shadow-purple-900/20' 
              : 'bg-white/90 border-gray-200 shadow-purple-200/50'
          }`}
        >
          <h2 className="text-6xl font-bold mb-4 text-purple-500">404</h2>
          <h3 className="text-2xl font-bold mb-4">页面不存在</h3>
          <p className={theme === 'dark' ? 'text-gray-400 mb-6' : 'text-gray-600 mb-6'}>
            抱歉，您访问的页面不存在或已被移动。
          </p>
          <button 
            onClick={() => navigate('/')}
            className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto ${
              theme === 'dark' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            返回首页 <ArrowLeft size={18} />
          </button>
        </motion.div>
      </main>

      <footer
        className={`backdrop-blur-md border-t py-4 ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
      >
        <div className="container mx-auto px-4 text-center">
          <p
            className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
          >
            © 2026 管理员界面 | 仅供内部使用
          </p>
        </div>
      </footer>
    </div>
  );
}
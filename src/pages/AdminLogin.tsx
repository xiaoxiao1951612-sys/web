import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Lock, User, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';

export default function AdminLogin() {
  const { theme } = useTheme();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    const success = login(username, password);
     if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('用户名或密码错误');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200" : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"}`}>
      <nav
        className={`sticky top-0 left-0 right-0 backdrop-blur-md z-50 border-b ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={handleBack}
            className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
            aria-label="返回首页"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="ml-4 text-xl font-bold">管理员登录</h1>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md backdrop-blur-md rounded-xl p-8 border shadow-xl ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-800 shadow-purple-900/20' 
              : 'bg-white/90 border-gray-200 shadow-purple-200/50'
          }`}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
              }`}
            >
              <Lock size={28} className="text-purple-500" />
            </motion.div>
            <h2 className="text-2xl font-bold">管理员登录</h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              登录后可以编辑项目内容
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-red-900/30 border border-red-800/50 text-red-300' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <AlertTriangle size={18} />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className={`block mb-2 text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-10 py-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="输入用户名"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block mb-2 text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 py-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="输入密码"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              登录
            </motion.button>
          </form>
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
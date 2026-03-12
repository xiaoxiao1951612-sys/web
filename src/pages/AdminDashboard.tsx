import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, PlusSquare, Briefcase, User, Settings, ArrowLeft, Edit } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { getPortfolioItems, getExperiences, listenForDataUpdates, refreshResumeData, resetAllData } from '@/lib/dataService';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projectCount, setProjectCount] = useState(getPortfolioItems().length);
  const [experiences, setExperiences] = useState(getExperiences());

  // 监听数据更新
  useEffect(() => {
    refreshResumeData().then(() => {
      setProjectCount(getPortfolioItems().length);
      setExperiences(getExperiences());
    });

    const cleanup = listenForDataUpdates((dataType) => {
      if (dataType === 'portfolioItems') {
        setProjectCount(getPortfolioItems().length);
      } else if (dataType === 'experiences') {
        setExperiences(getExperiences());
      } else if (dataType === 'all') {
        setProjectCount(getPortfolioItems().length);
        setExperiences(getExperiences());
      }
    });
    
    return cleanup;
  }, []);

  // 检查是否已登录
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  // 处理编辑实习经历
  const handleEditExperience = (index: number) => {
    navigate(`/admin/edit-experience/${index}`);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200" : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"}`}>
      <nav
        className={`sticky top-0 left-0 right-0 backdrop-blur-md z-50 border-b ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
              aria-label="返回首页"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="ml-4 text-xl font-bold">管理员控制面板</h1>
          </div>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "bg-red-100 hover:bg-red-200 text-red-700"}`}
            aria-label="退出登录"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
           className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">欢迎管理员</h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              在这里您可以管理项目、实习经历和个人信息
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 统计卡片 - 项目数量 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className={`backdrop-blur-md rounded-xl p-6 border transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800 hover:border-purple-500/50' 
                  : 'bg-white/90 border-gray-200 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  项目数量
                </h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                }`}>
                  <PlusSquare size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold">{projectCount}</p>
              <button
                onClick={() => navigate('/admin/add-project')}
                className={`mt-4 px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                  theme === 'dark' 
                    ? 'bg-purple-900/30 hover:bg-purple-800/50 text-purple-300' 
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                }`}
              >
                添加项目
              </button>
            </motion.div>

            {/* 统计卡片 - 实习经历数量 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className={`backdrop-blur-md rounded-xl p-6 border transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800 hover:border-blue-500/50' 
                  : 'bg-white/90 border-gray-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  实习经历
                </h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Briefcase size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold">{experiences.length}</p>
              <button
                onClick={() => navigate('/admin/add-experience')}
                className={`mt-4 px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 hover:bg-blue-800/50 text-blue-300' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                }`}
              >
                添加实习经历
              </button>
            </motion.div>

            {/* 统计卡片 - 个人信息 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className={`backdrop-blur-md rounded-xl p-6 border transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800 hover:border-green-500/50' 
                  : 'bg-white/90 border-gray-200 hover:border-green-400'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  个人信息
                </h3>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                }`}>
                  <User size={20} />
                </div>
              </div>
              <p className="text-3xl font-bold">编辑</p>
              <button
                onClick={() => navigate('/admin/edit-profile')}
                className={`mt-4 px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 ${
                  theme === 'dark' 
                    ? 'bg-green-900/30 hover:bg-green-800/50 text-green-300' 
                    : 'bg-green-100 hover:bg-green-200 text-green-800'
                }`}
              >
                修改个人信息
              </button>
            </motion.div>
          </div>

          {/* 实习经历列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`backdrop-blur-md rounded-xl p-6 border mb-12 ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800' 
                : 'bg-white/90 border-gray-200'
            }`}
          >
            <h2 className="text-xl font-semibold mb-6">实习经历管理</h2>
            
            {experiences.length === 0 ? (
              <div className="text-center py-8">
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  暂无实习经历，点击"添加实习经历"按钮创建
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {experiences.map((experience, index) => (
                  <motion.div 
                    key={index}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {experience.company}
                        </h3>
                        <p className="text-purple-400 text-sm">{experience.role}</p>
                      </div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {experience.period}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEditExperience(index)}
                      className={`mt-2 px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 hover:bg-blue-800/50 text-blue-300' 
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                      }`}
                    >
                      <Edit size={12} />
                      编辑
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

           {/* 快捷操作 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`backdrop-blur-md rounded-xl p-6 border ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800' 
                : 'bg-white/90 border-gray-200'
            }`}
          >
            <h2 className="text-xl font-semibold mb-6">快捷操作</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/')}
                className={`p-4 rounded-lg transition-colors flex items-center gap-3 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Settings size={24} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                <span>查看个人主页</span>
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                className={`p-4 rounded-lg transition-colors flex items-center gap-3 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Settings size={24} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                <span>重新登录</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('确定要重置所有数据到初始状态吗？此操作不可恢复！')) {
                    (async () => {
                      const success = await resetAllData();
                      if (success) {
                        toast.success('数据已重置，所有用户将看到初始内容');
                        window.location.reload();
                      } else {
                        toast.error('重置失败，请重试');
                      }
                    })();
                  }
                }}
                className={`p-4 rounded-lg transition-colors flex items-center gap-3 ${
                  theme === 'dark' 
                    ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400' 
                    : 'bg-red-100 hover:bg-red-200 text-red-700'
                }`}
              >
                <Settings size={24} />
                <span>重置所有数据</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer
        className={`backdrop-blur-md border-t py-4 mt-auto ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
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
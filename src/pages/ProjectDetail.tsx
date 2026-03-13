import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Github, ExternalLink, Calendar, BookOpen } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { getPortfolioItems, refreshResumeData, listenForDataUpdates } from '@/lib/dataService';
import { AuthContext } from '@/contexts/authContext';

   export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { isAuthenticated } = useContext(AuthContext);
    // 添加状态来跟踪当前选中的图片索引
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [project, setProject] = useState<any>(null);
    
    // 初始化时检查数据版本
    useEffect(() => {
      loadProjectData();
      refreshResumeData().then(() => loadProjectData());
      
      // 监听数据更新通知
      const cleanup = listenForDataUpdates((dataType) => {
        if (dataType === 'portfolioItems') {
          loadProjectData();
        }
      });
      
      return cleanup;
    }, [id]);
    
    // 加载项目数据
    const loadProjectData = () => {
      const portfolioItems = getPortfolioItems();
      const selectedProject = portfolioItems.find(item => item.id === parseInt(id || '0'));
      if (selectedProject) {
        setProject(selectedProject);
      } else {
        setProject(null);
      }
    };
    
    // 如果项目不存在，返回404提示
     if (!project) {
      return (
        <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200" : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"}`}>
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
                <h1 className="ml-4 text-xl font-bold">项目详情</h1>
            </div>
          </nav>
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">项目不存在</h1>
            <button 
              onClick={() => navigate('/')}
              className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              返回首页 <ArrowLeft size={18} />
            </button>
          </div>
        </div>
      );
    }

    // 处理缩略图点击事件
    const handleThumbnailClick = (index: number) => {
      // 防止事件冒泡，避免在移动端点击时触发其他操作
      setSelectedImageIndex(index);
    };

    return (
      <div 
        className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200" : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"}`}
      >
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
              <h1 className="ml-4 text-xl font-bold">项目详情</h1>
              {/* 管理员编辑按钮：仅在已登录管理员时显示 */}
              {isAuthenticated && (
                <button
                  onClick={() => navigate(`/admin/edit/${id}`)}
                  className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  aria-label="编辑项目"
                >
                  编辑项目
                </button>
              )}
          </div>
        </nav>

        <main className="container mx-auto px-4 py-12">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            {/* 项目头部 */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span 
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                    theme === 'dark' 
                      ? 'bg-purple-900/50 text-purple-300' 
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  <BookOpen size={12} />
                  {project.category}
                </span>
                <span 
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-gray-300' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <Calendar size={12} />
                  {project.date}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
              <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-line`}>
                {project.description}
              </p>
            </div>

             {/* 项目图片轮播 */}
            <motion.div 
              className="mb-12 rounded-xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {project.images && project.images.length > 0 ? (
                <div className="relative">
                  <div className="aspect-video w-full bg-gray-900">
                    <motion.img 
                      src={project.images[selectedImageIndex]} 
                      alt={`${project.title} - 图片 ${selectedImageIndex + 1}`} 
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  {project.images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {project.images.map((img, index) => (
                        <button 
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedImageIndex ? 'w-8 bg-purple-500' : 'bg-white/50'}`}
                          aria-label={`查看图片 ${index + 1}`}
                          onClick={() => handleThumbnailClick(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-auto object-cover"
                />
              )}
            </motion.div>

            {/* 缩略图网格 */}
            {project.images && project.images.length > 1 && (
              <motion.div 
                className="grid grid-cols-4 gap-2 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {project.images.map((img, index) => (
                  <motion.div 
                    key={index}
                    className={`rounded-lg overflow-hidden cursor-pointer shadow-md transition-all duration-300 ${index === selectedImageIndex ? 'ring-2 ring-purple-500 scale-105' : 'hover:scale-105'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${project.title} - 图片 ${index + 1}`} 
                      className="w-full h-24 object-cover"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* 项目概述 */}
            <motion.section 
              className={`mb-12 backdrop-blur-md rounded-xl p-6 border ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800' 
                  : 'bg-white/90 border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-4">项目概述</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}>
                {project.details.overview}
              </p>
            </motion.section>

            {/* 项目功能 */}
            <motion.section 
              className={`mb-12 backdrop-blur-md rounded-xl p-6 border ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800' 
                  : 'bg-white/90 border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-4">核心功能</h2>
              <ul className="space-y-3">
                {project.details.features.map((feature, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-purple-500 mt-1">•</span>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* 技术栈 */}
            <motion.section 
              className={`mb-12 backdrop-blur-md rounded-xl p-6 border ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800' 
                  : 'bg-white/90 border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-4">技术与工具</h2>
              <div className="flex flex-wrap gap-2">
                {project.details.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-gray-300' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* 项目成果 */}
            <motion.section 
              className={`mb-12 backdrop-blur-md rounded-xl p-6 border ${
                theme === 'dark' 
                  ? 'bg-gray-900/50 border-gray-800' 
                  : 'bg-white/90 border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-4">项目成果</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line`}>
                {project.details.results}
              </p>
            </motion.section>

            {/* 操作按钮 */}
            <motion.div 
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <button 
                onClick={() => navigate('/')}
                className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                    : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                返回作品集 <ArrowLeft size={18} />
              </button>
              
              {/* 模拟外部链接按钮 */}
              <button 
                onClick={() => alert('项目详情链接将在实际应用中打开')}
                className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  theme === 'dark' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                查看更多 <ExternalLink size={18} />
              </button>
            </motion.div>
          </motion.div>
        </main>

        <footer
          className={`backdrop-blur-md border-t py-8 mt-12 ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
        >
          <div className="container mx-auto px-4 text-center">
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
            >
              © 2026 赵梓皓 - AI产品经理个人简历 | 使用React + TypeScript + Tailwind CSS构建
            </p>
          </div>
        </footer>
      </div>
    );
  }
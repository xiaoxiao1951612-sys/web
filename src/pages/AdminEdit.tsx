import { useState, useEffect, useContext } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { ArrowLeft, Save, Trash2, Plus, Image, Calendar, BookOpen } from 'lucide-react';
  import { useTheme } from '@/hooks/useTheme';
  import { AuthContext } from '@/contexts/authContext';
  import { toast } from 'sonner';
  import { PortfolioItem, getPortfolioItems, refreshResumeData, savePortfolioItems } from '@/lib/dataService';

  export default function AdminEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { isAuthenticated } = useContext(AuthContext);
    
    // 使用useState存储当前编辑的项目数据
    const [project, setProject] = useState<PortfolioItem | null>(null);
    const [newFeature, setNewFeature] = useState('');
    const [newTechnology, setNewTechnology] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    // 初始化项目数据
    useEffect(() => {
      // 检查是否已登录
      if (!isAuthenticated) {
        navigate('/admin/login');
        return;
      }
      
      const load = async () => {
        await refreshResumeData();
        const projects = getPortfolioItems();
        const selectedProject = projects.find(item => item.id === parseInt(id || '0'));
        if (!selectedProject) {
          navigate('/');
          return;
        }
        setProject(selectedProject);
      };

      load();
    }, [id, navigate, isAuthenticated]);
    
    // 如果项目不存在，显示加载状态
    if (!project) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">加载中...</div>
        </div>
      );
    }
    
    // 处理表单字段变化
    const handleChange = (field: string, value: string) => {
      if (field.includes('.')) {
        // 处理嵌套字段，如details.overview
        const [parent, child] = field.split('.');
        setProject(prev => prev ? {
          ...prev,
          [parent]: {
            ...prev[parent as keyof PortfolioItem],
            [child]: value
          }
        } : null);
      } else {
        setProject(prev => prev ? { ...prev, [field]: value } : null);
      }
    };
    
    // 添加新功能
    const addFeature = () => {
      if (newFeature.trim()) {
        setProject(prev => prev ? {
          ...prev,
          details: {
            ...prev.details,
            features: [...prev.details.features, newFeature.trim()]
          }
        } : null);
        setNewFeature('');
      }
    };
    
    // 删除功能
    const removeFeature = (index: number) => {
      setProject(prev => prev ? {
        ...prev,
        details: {
          ...prev.details,
          features: prev.details.features.filter((_, i) => i !== index)
        }
      } : null);
    };
    
    // 添加新技术
    const addTechnology = () => {
      if (newTechnology.trim()) {
        setProject(prev => prev ? {
          ...prev,
          details: {
            ...prev.details,
            technologies: [...prev.details.technologies, newTechnology.trim()]
          }
        } : null);
        setNewTechnology('');
      }
    };
    
    // 删除技术
    const removeTechnology = (index: number) => {
      setProject(prev => prev ? {
        ...prev,
        details: {
          ...prev.details,
          technologies: prev.details.technologies.filter((_, i) => i !== index)
        }
      } : null);
    };
    
    // 添加新图片（URL方式）
    const addImageByUrl = () => {
      if (newImageUrl.trim()) {
        setProject(prev => prev ? {
          ...prev,
          images: [...prev.images, newImageUrl.trim()],
          // 如果是第一张图片，同时设置为主图
          image: prev.images.length === 0 ? newImageUrl.trim() : prev.image
        } : null);
        setNewImageUrl('');
      }
    };
    
    // 添加新图片（上传方式）
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
          toast.error('请选择图片文件');
          return;
        }
        
        // 检查文件大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
          toast.error('图片大小不能超过5MB');
          return;
        }
        
        // 创建文件读取器
        const reader = new FileReader();
        
        // 读取文件完成后的回调
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setProject(prev => prev ? {
            ...prev,
            images: [...prev.images, imageUrl],
            // 如果是第一张图片，同时设置为主图
            image: prev.images.length === 0 ? imageUrl : prev.image
          } : null);
          
          // 显示预览并3秒后清除预览
          setPreviewImage(imageUrl);
          setTimeout(() => setPreviewImage(null), 3000);
        };
        
        // 以DataURL形式读取文件
        reader.readAsDataURL(file);
        
        // 清空input值，允许重复选择同一文件
        e.target.value = '';
      }
    };
    
    // 删除图片
    const removeImage = (index: number) => {
      if (project.images.length <= 1) {
        toast.error('至少需要保留一张图片');
        return;
      }
      
      setProject(prev => prev ? {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        // 如果删除的是主图，更新主图为第一张
        image: prev.image === prev.images[index] ? prev.images[0] : prev.image
      } : null);
    };
    
    // 保存项目修改
    const handleSaveProject = async () => {
      if (!project) return;
      
      try {
        // 获取现有项目列表
        const projects = getPortfolioItems();
        
        // 更新项目
        const updatedProjects = projects.map(item => 
          item.id === project.id ? project : item
        );
        
        // 使用数据服务保存
        const success = await savePortfolioItems(updatedProjects);
        
        if (success) {
          toast.success('项目保存成功，所有访问者将看到最新内容');
          navigate(`/project/${project.id}`);
        } else {
          throw new Error('保存失败');
        }
      } catch (error) {
        toast.error('保存失败，请重试');
        console.error('保存项目失败:', error);
      }
    };
    
    const handleBack = () => {
      navigate(`/project/${project.id}`);
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
                aria-label="返回项目详情"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="ml-4 text-xl font-bold">编辑项目</h1>
            </div>
             <button
              onClick={handleSaveProject}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              保存修改
            </button>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {project && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
             className="max-w-5xl mx-auto space-y-8"
         >
            {/* 基本信息编辑 */}
            <section className={`backdrop-blur-md rounded-xl p-6 border ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <h2 className="text-2xl font-semibold mb-6">基本信息</h2>
              
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className={`block mb-2 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    项目标题
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={project.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="category"
                      className={`block mb-2 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      类别
                    </label>
                    <select
                      id="category"
                      value={project.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    >
                      <option value="项目">项目</option>
                      <option value="实习">实习</option>
                      <option value="研究">研究</option>
                    </select>
                  </div>
                  
                  <div>
                    <label
                      htmlFor="date"
                      className={`block mb-2 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      时间
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      </div>
                      <input
                        type="text"
                        id="date"
                        value={project.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className={`w-full pl-10 p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                        placeholder="例如：2025.10 - 2026.1"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label
                    htmlFor="description"
                    className={`block mb-2 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    简介
                  </label>
                  <textarea
                    id="description"
                    value={project.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  ></textarea>
                </div>
              </div>
            </section>
            
            {/* 项目概述编辑 */}
            <section className={`backdrop-blur-md rounded-xl p-6 border ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <h2 className="text-2xl font-semibold mb-6">项目概述</h2>
              <textarea
                value={project.details.overview}
                onChange={(e) => handleChange('details.overview', e.target.value)}
                rows={4}
                className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              ></textarea>
            </section>
            
            {/* 核心功能编辑 */}
            <section className={`backdrop-blur-md rounded-xl p-6 border ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <h2 className="text-2xl font-semibold mb-6">核心功能</h2>
              
              <div className="space-y-3 mb-4">
                {project.details.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-purple-500">{index + 1}.</span>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...project.details.features];
                        updatedFeatures[index] = e.target.value;
                        setProject(prev => prev ? {
                          ...prev,
                          details: {
                            ...prev.details,
                            features: updatedFeatures
                          }
                        } : null);
                      }}
                      className={`flex-1 p-2 rounded-lg border focus:outline-none focus:border-purple-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-900/20 rounded-full transition-colors"
                      aria-label="删除功能"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="添加新功能..."
                  className={`flex-1 p-2 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                <button
                  onClick={addFeature}
                  className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  aria-label="添加功能"
                >
                  <Plus size={16} />
                </button>
              </div>
            </section>
            
            {/* 技术与工具编辑 */}
            <section className={`backdrop-blur-md rounded-xl p-6 border ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <h2 className="text-2xl font-semibold mb-6">技术与工具</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.details.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        theme === 'dark' 
                          ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                          : 'bg-gray-200 text-gray-700 border border-gray-300'
                      }`}
                    >
                      {tech}
                    </span>
                    <button
                      onClick={() => removeTechnology(index)}
                      className="p-1 text-red-500 hover:text-red-600 hover:bg-red-900/20 rounded-full transition-colors"
                      aria-label="删除技术"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="添加新技术..."
                  className={`flex-1 p-2 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                <button
                  onClick={addTechnology}
                  className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  aria-label="添加技术"
                >
                  <Plus size={16} />
                </button>
              </div>
            </section>
            
            {/* 项目成果编辑 */}
            <section className={`backdrop-blur-md rounded-xl p-6 border ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <h2 className="text-2xl font-semibold mb-6">项目成果</h2>
              <textarea
                value={project.details.results}
                onChange={(e) => handleChange('details.results', e.target.value)}
                rows={4}
                className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              ></textarea>
            </section>
            
            {/* 项目图片编辑 */}
            <section className={`backdrop-blur-md rounded-xl p-6 border ${
              theme === 'dark' 
                ? 'bg-gray-900/50 border-gray-800' 
                : 'bg-white/90 border-gray-200'
            }`}>
              <h2 className="text-2xl font-semibold mb-6">项目图片</h2>
              
              {/* 图片预览 */}
              {previewImage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
                    theme === 'dark' 
                      ? 'bg-green-900/30 border border-green-800/50 text-green-300' 
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={previewImage} alt="预览" className="w-full h-full object-cover" />
                  </div>
                  <span>图片上传成功！</span>
                </motion.div>
              )}
              
              {/* 图片列表 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {project.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video overflow-hidden rounded-lg border">
                      <img
                        src={img}
                        alt={`图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {project.images.length > 1 && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="删除图片"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    {img === project.image && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs rounded">
                        主图
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                {/* 本地文件上传 */}
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    上传本地图片
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
                
                {/* URL上传 */}
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    或通过URL添加图片
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Image size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                      </div>
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="输入图片URL..."
                        className={`w-full pl-10 p-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    <button
                      onClick={addImageByUrl}
                      className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1"
                      aria-label="添加图片"
                    >
                      <Plus size={16} />
                      添加
                    </button>
                  </div>
                </div>
              </div>
              
              <p className={`mt-3 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                提示：支持JPG、PNG、WEBP等常见图片格式，单张图片不超过5MB。第一张图片将自动设为主图。
              </p>
            </section>
            
            {/* 保存按钮 */}
            <motion.div 
              className="flex justify-center mt-10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
                 <button
                  onClick={handleSaveProject}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  保存所有修改
                </button>
            </motion.div>
          </motion.div>
        )}
        </main>
      </div>
    );
  }
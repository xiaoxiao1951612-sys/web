import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Briefcase, Calendar, Trash2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { ExperienceItem, getExperiences, refreshResumeData, saveExperiences } from '@/lib/dataService';

export default function AdminAddExperience() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  
  // 使用useState存储新实习经历数据
  const [experience, setExperience] = useState<ExperienceItem>({
    company: '',
    role: '',
    period: '',
    responsibilities: []
  });
  
  const [newResponsibility, setNewResponsibility] = useState('');
  
  // 初始化
  useEffect(() => {
    // 检查是否已登录
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    refreshResumeData();
  }, [navigate, isAuthenticated]);
  
  // 处理表单字段变化
  const handleChange = (field: keyof ExperienceItem, value: string) => {
    setExperience(prev => ({ ...prev, [field]: value }));
  };
  
  // 添加新职责
  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setExperience(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };
  
  // 删除职责
  const removeResponsibility = (index: number) => {
    setExperience(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };
  
  // 保存新实习经历
  const handleSaveExperience = async () => {
    // 验证必填字段
    if (!experience.company || !experience.role || !experience.period || experience.responsibilities.length === 0) {
      toast.error('请填写所有必填字段');
      return;
    }
    
    try {
      // 获取现有实习经历列表
      const experiences = getExperiences();
      
      // 添加新实习经历
      const updatedExperiences = [...experiences, experience];
      
      // 使用数据服务保存
      const success = await saveExperiences(updatedExperiences);
      
      if (success) {
        toast.success('实习经历添加成功，所有访问者将看到最新内容');
        navigate('/admin/dashboard');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      toast.error('保存失败，请重试');
      console.error('保存实习经历失败:', error);
    }
  };
  
  const handleBack = () => {
    navigate('/admin/dashboard');
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
              aria-label="返回管理面板"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="ml-4 text-xl font-bold">添加实习经历</h1>
          </div>
           <button
            onClick={handleSaveExperience}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            保存经历
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
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
            <h2 className="text-2xl font-semibold mb-6">实习基本信息</h2>
            
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="company"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  公司名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  value={experience.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="输入公司名称"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="role"
                    className={`block mb-2 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    职位 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={experience.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="输入职位名称"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="period"
                    className={`block mb-2 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    实习时间 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                    </div>
                    <input
                      type="text"
                      id="period"
                      value={experience.period}
                      onChange={(e) => handleChange('period', e.target.value)}
                      className={`w-full pl-10 p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                      placeholder="例如：2025.09 - 2025.11"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* 职责描述编辑 */}
          <section className={`backdrop-blur-md rounded-xl p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-800' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <h2 className="text-2xl font-semibold mb-6">工作内容与职责</h2>
            
            <div className="space-y-3 mb-4">
              {experience.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-purple-500">{index + 1}.</span>
                  <input
                    type="text"
                    value={responsibility}
                    onChange={(e) => {
                      const updatedResponsibilities = [...experience.responsibilities];
                      updatedResponsibilities[index] = e.target.value;
                      setExperience(prev => ({
                        ...prev,
                        responsibilities: updatedResponsibilities
                      }));
                    }}
                    className={`flex-1 p-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="输入职责描述"
                  />
                  <button
                    onClick={() => removeResponsibility(index)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-900/20 rounded-full transition-colors"
                    aria-label="删除职责"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                placeholder="添加新职责..."
                className={`flex-1 p-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              />
              <button
                onClick={addResponsibility}
                className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                aria-label="添加职责"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <p className={`mt-3 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              提示：请详细描述您在该职位上的主要工作内容和职责，建议添加3-5条。
            </p>
          </section>
          
          {/* 保存按钮 */}
          <motion.div 
            className="flex justify-center mt-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
               <button
                onClick={handleSaveExperience}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                保存实习经历
              </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
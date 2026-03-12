import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, Mail, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { AuthContext } from '@/contexts/authContext';
import { toast } from 'sonner';
import { PersonalInfo, getPersonalInfo, refreshResumeData, savePersonalInfo } from '@/lib/dataService';

export default function AdminEditProfile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  
  // 使用useState存储个人信息
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(getPersonalInfo());
  
  // 初始化
  useEffect(() => {
    // 检查是否已登录
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    refreshResumeData().then(() => setPersonalInfo(getPersonalInfo()));
  }, [navigate, isAuthenticated]);
  
  // 处理表单字段变化
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };
  
  // 处理教育经历变化
  const handleEducationChange = (index: number, field: keyof PersonalInfo['education'][0], value: string) => {
    const updatedEducation = [...personalInfo.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setPersonalInfo(prev => ({ ...prev, education: updatedEducation }));
  };
  
  // 添加教育经历
  const addEducation = () => {
    const newEducation = {
      level: "",
      school: "",
      major: "",
      period: "",
      description: ""
    };
    setPersonalInfo(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };
  
  // 删除教育经历
  const removeEducation = (index: number) => {
    if (personalInfo.education.length <= 1) {
      toast.error('至少需要保留一条教育经历');
      return;
    }
    setPersonalInfo(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };
  
  // 保存个人信息
  const handleSavePersonalInfo = async () => {
    // 验证必填字段
    if (!personalInfo.name || !personalInfo.title || !personalInfo.email || !personalInfo.phone) {
      toast.error('请填写所有必填字段');
      return;
    }
    
    try {
      // 使用数据服务保存
      const success = await savePersonalInfo(personalInfo);
      
      if (success) {
        toast.success('个人信息更新成功，所有访问者将看到最新内容');
        navigate('/admin/dashboard');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      toast.error('保存失败，请重试');
      console.error('保存个人信息失败:', error);
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
            <h1 className="ml-4 text-xl font-bold">编辑个人信息</h1>
          </div>
           <button
            onClick={handleSavePersonalInfo}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            保存修改
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
           {/* 关于我介绍 */}
          <section className={`backdrop-blur-md rounded-xl p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-800' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <h2 className="text-2xl font-semibold mb-6">关于我</h2>
            <div>
              <textarea
                value={personalInfo.aboutMe || ''}
                onChange={(e) => handleChange('aboutMe', e.target.value)}
                rows={4}
                className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="输入关于我的介绍文本"
              ></textarea>
            </div>
          </section>
          
          {/* 基本信息 */}
          <section className={`backdrop-blur-md rounded-xl p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-800' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <h2 className="text-2xl font-semibold mb-6">基本信息</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={personalInfo.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              
              <div>
                <label
                  htmlFor="title"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  职位头衔 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={personalInfo.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="例如：校招生 | AI产品经理 | 自动驾驶方向"
                />
              </div>
              
              <div>
                <label
                  htmlFor="age"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  年龄
                </label>
                <input
                  type="text"
                  id="age"
                  value={personalInfo.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              
              <div>
                <label
                  htmlFor="gender"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  性别
                </label>
                <select
                  id="gender"
                  value={personalInfo.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              
              <div>
                <label
                  htmlFor="city"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  所在城市
                </label>
                <input
                  type="text"
                  id="city"
                  value={personalInfo.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              
              <div>
                <label
                  htmlFor="researchDirection"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  研究方向
                </label>
                <input
                  type="text"
                  id="researchDirection"
                  value={personalInfo.researchDirection}
                  onChange={(e) => handleChange('researchDirection', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>
          </section>
          
          {/* 联系方式 */}
          <section className={`backdrop-blur-md rounded-xl p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-800' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <h2 className="text-2xl font-semibold mb-6">联系方式</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="email"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  邮箱 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    type="email"
                    id="email"value={personalInfo.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full pl-10 p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label
                  htmlFor="phone"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  电话 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full pl-10 p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>
              
              <div>
                <label
                  htmlFor="wechat"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  微信
                </label>
                <input
                  type="text"
                  id="wechat"
                  value={personalInfo.wechat || ''}
                  onChange={(e) => handleChange('wechat', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              
              <div>
                <label
                  htmlFor="availableTime"
                  className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  到岗时间
                </label>
                <input
                  type="text"
                  id="availableTime"
                  value={personalInfo.availableTime}
                  onChange={(e) => handleChange('availableTime', e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:border-purple-500 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>
          </section>
          
          {/* 教育背景 */}
          <section className={`backdrop-blur-md rounded-xl p-6 border ${
            theme === 'dark' 
              ? 'bg-gray-900/50 border-gray-800' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">教育背景</h2>
              <button
                onClick={addEducation}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                  theme === 'dark' 
                    ? 'bg-purple-900/30 hover:bg-purple-800/50 text-purple-300' 
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                添加教育经历
              </button>
            </div>
            
            <div className="space-y-6">
              {personalInfo.education.map((edu, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      {index === 0 ? '最高学历' : '教育经历'}
                    </h3>
                    {personalInfo.education.length > 1 && (
                      <button
                        onClick={() => removeEducation(index)}
                        className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-900/20 rounded-full transition-colors"
                        aria-label="删除教育经历"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        学历
                      </label>
                      <select
                        value={edu.level}
                        onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      >
                        <option value="">请选择</option>
                        <option value="高中">高中</option>
                        <option value="大专">大专</option>
                        <option value="本科">本科</option>
                        <option value="硕士">硕士</option>
                        <option value="博士">博士</option>
                      </select>
                    </div>
                    
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        学校
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        专业
                      </label>
                      <input
                        type="text"
                        value={edu.major}
                        onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        时间
                      </label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => handleEducationChange(index, 'period', e.target.value)}
                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                        placeholder="例如：2019.09-2024.06"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        补充说明（GPA、荣誉等）
                      </label>
                      <input
                        type="text"
                        value={edu.description || ''}
                        onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                        className={`w-full p-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'bg-white border-gray-300 text-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* 保存按钮 */}
          <motion.div 
            className="flex justify-center mt-10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
               <button
                onClick={handleSavePersonalInfo}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                保存所有修改
              </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
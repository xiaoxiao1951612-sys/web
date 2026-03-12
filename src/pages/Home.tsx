import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
    Menu,
    X,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Briefcase,
    Linkedin,
    Users,
} from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Character3D } from "@/components/Character3D";
import { PortfolioCard } from "@/components/PortfolioCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ContactCard } from "@/components/ContactCard";
import {
    getPersonalInfo,
    getExperiences,
    getPortfolioItems,
    refreshResumeData,
    listenForDataUpdates
} from "@/lib/dataService";

export default function Home() {
    const [activeSection, setActiveSection] = useState("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [personalInfo, setPersonalInfo] = useState(getPersonalInfo());
    const [experiences, setExperiences] = useState(getExperiences());
    const [portfolioItems, setPortfolioItems] = useState(getPortfolioItems());

    const {
        theme,
        toggleTheme
    } = useTheme();

    const navLinks = [{
        id: "home",
        label: "首页"
    }, {
        id: "about",
        label: "关于我"
    }, {
        id: "portfolio",
        label: "作品集"
    }, {
        id: "contact",
        label: "联系方式"
    }];

    // 初始化时拉取云端最新数据
    useEffect(() => {
        refreshData();
        refreshResumeData().then(() => refreshData());
        
        // 监听数据更新通知
        const cleanup = listenForDataUpdates((dataType) => {
            refreshData();
        });
        
        return cleanup;
    }, []);

    // 刷新数据
    const refreshData = () => {
        setPersonalInfo(getPersonalInfo());
        setExperiences(getExperiences());
        setPortfolioItems(getPortfolioItems());
    };

     return (
        <div
            className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-br from-gray-950 to-gray-900 text-gray-200" : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800"}`}>
            <nav
                className={`fixed top-0 left-0 right-0 backdrop-blur-md z-50 border-b ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}>
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div
                        className={`text-xl font-bold bg-gradient-to-r ${theme === "dark" ? "from-white to-purple-400" : "from-purple-700 to-purple-500"} text-transparent bg-clip-text`}>{personalInfo.name}| {personalInfo.title.split(" | ")[1] || "AI产品经理"}</div>
                    {}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={e => {
                                e.preventDefault();
                                setActiveSection(link.id);

                                document.getElementById(link.id)?.scrollIntoView({
                                    behavior: "smooth"
                                });
                            }}
                            className={`text-sm font-medium transition-colors ${activeSection === link.id ? "text-purple-400" : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                            {link.label}
                        </a>)}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme">
                            {theme === "dark" ? "🌞" : "🌙"}
                        </button>
                         <a
                            href="/admin/login/"
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${theme === "dark" ? "bg-purple-900/30 text-purple-300 hover:bg-purple-800/50" : "bg-purple-100 text-purple-800 hover:bg-purple-200"}`}>管理员登录
                                                     </a>
                    </div>
                    {}
                    <button
                        className={`md:hidden p-2 rounded-full transition-colors ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Open menu">
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                {}
                <AnimatePresence>
                    {mobileMenuOpen && <motion.div
                        initial={{
                            opacity: 0,
                            height: 0
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto"
                        }}
                        exit={{
                            opacity: 0,
                            height: 0
                        }}
                        className={`md:hidden backdrop-blur-md border-b ${theme === "dark" ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"}`}>
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {navLinks.map(link => <button
                                key={link.id}
                                onClick={() => {
                                    setActiveSection(link.id);
                                    setMobileMenuOpen(false);

                                    document.getElementById(link.id)?.scrollIntoView({
                                        behavior: "smooth"
                                    });
                                }}
                                className={`p-2 text-left rounded-lg transition-colors ${activeSection === link.id ? "bg-purple-900/30 text-purple-400" : "text-gray-400 hover:bg-gray-700/50 hover:text-white"}`}>
                                 {/* 移动端菜单链接 */}
                                 {link.label}
                            </button>)}
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    setMobileMenuOpen(false);
                                }}
                                className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2">
                                {theme === "dark" ? "🌞 切换到亮色模式" : "🌙 切换到暗色模式"}
                            </button>
                             <a
                                href="/admin/login/"
                                className="p-2 rounded-lg bg-purple-900/50 text-purple-300 hover:bg-purple-800 transition-colors flex items-center gap-2">🔒 管理员登录
                                                                     </a>
                        </div>
                    </motion.div>}
                </AnimatePresence>
            </nav>
            {}
            <div id="home" className="scroll-mt-24"></div>
            <main className="container mx-auto px-4 pt-24 pb-16">
                {}
                <section className="py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.6
                                }}>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                    <span className="block">你好，我是</span>
                                    <span
                                        className={`bg-gradient-to-r ${theme === "dark" ? "from-white to-purple-400" : "from-purple-700 to-purple-500"} text-transparent bg-clip-text`}>{personalInfo.name}
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-400">{personalInfo.title}</p>
                            </motion.div>
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.2
                                }}
                                className="flex flex-wrap gap-4">
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${theme === "dark" ? "bg-purple-900/30 text-purple-300 border-purple-800/50" : "bg-purple-100 text-purple-800 border-purple-200"}`}>
                                    <Briefcase size={16} />{personalInfo.title.split(" | ")[1] || "产品经理"}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${theme === "dark" ? "bg-gray-800 text-gray-300 border-gray-700/50" : "bg-gray-200 text-gray-700 border-gray-300"}`}>
                                    <Calendar size={16} />{personalInfo.availableTime}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${theme === "dark" ? "bg-gray-800 text-gray-300 border-gray-700/50" : "bg-gray-200 text-gray-700 border-gray-300"}`}>
                                    <MapPin size={16} />{personalInfo.city}
                                </span>
                            </motion.div>
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.4
                                }}
                                className="flex flex-wrap gap-3">
                                <a
                                    href="#contact"
                                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">联系我
                                                                                                                                                                                                      <Mail size={18} />
                                </a>
                                <a
                                    href="#portfolio"
                                    className={`px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2 border ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-700" : "bg-white hover:bg-gray-100 text-gray-800 border-gray-300"}`}>查看作品集
                                                                                                                                                                                                       <BookOpen size={18} />
                                </a>
                            </motion.div>
                        </div>
                        {}
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.8
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 0.3
                            }}
                            className="relative w-full max-w-xs flex justify-center items-center">
                            <div
                                className="w-64 h-64 floating relative"
                                style={{
                                    animation: "float 6s ease-in-out infinite"
                                }}>
                                <div
                                    className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl"></div>
                                <img
                                    src="https://s.coze.cn/t/du62k-zTTMY/"
                                    alt="赵梓皓的卡通形象"
                                    className="w-full h-full object-contain relative z-10" />
                            </div>
                        </motion.div>
                    </div>
                </section>
                {}
                <section id="about" className="py-16 border-t border-gray-800">
                    <motion.div
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
                            duration: 0.6
                        }}
                        className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">关于我</h2>
                        <p
                            className={`max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                            {personalInfo.aboutMe || "我是一名热情的AI产品经理，拥有交通工程和自动驾驶领域的专业背景，擅长从用户需求出发，结合技术可行性，打造优秀的产品体验。"}
                        </p>
                    </motion.div>
                    <div className="flex justify-center">
                        {}
                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -20
                            }}
                            whileInView={{
                                opacity: 1,
                                x: 0
                            }}
                            viewport={{
                                once: true
                            }}
                            transition={{
                                duration: 0.6
                            }}
                            className="space-y-6 max-w-xl w-full">
                            {}
                            {}
                            <div
                                className={`backdrop-blur-md rounded-xl p-6 border ${theme === "dark" ? "bg-gray-900/50 border-gray-800" : "bg-white/70 border-gray-200"}`}>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Users size={20} className="text-purple-400" />基本信息
                                                                    </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <span
                                            className={theme === "dark" ? "w-24 text-gray-500" : "w-24 text-gray-400"}>姓名</span>
                                        <span>{personalInfo.name}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span
                                            className={theme === "dark" ? "w-24 text-gray-500" : "w-24 text-gray-400"}>年龄</span>
                                        <span>{personalInfo.age}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span
                                            className={theme === "dark" ? "w-24 text-gray-500" : "w-24 text-gray-400"}>性别</span>
                                        <span>{personalInfo.gender}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span
                                            className={theme === "dark" ? "w-24 text-gray-500" : "w-24 text-gray-400"}>城市</span>
                                        <span>{personalInfo.city}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span
                                            className={theme === "dark" ? "w-24 text-gray-500" : "w-24 text-gray-400"}>研究方向</span>
                                        <span>{personalInfo.researchDirection}</span>
                                    </li>
                                </ul>
                            </div>
                            {}
                            <div
                                className={`backdrop-blur-md rounded-xl p-6 border ${theme === "dark" ? "bg-gray-900/50 border-gray-800" : "bg-white/70 border-gray-200"}`}>
                                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen size={20} className="text-purple-400" />教育背景
                                                                    </h3>
                                <ul className="space-y-4">
                                    {personalInfo.education.map((edu, index) => <li
                                        key={index}
                                        className={index < personalInfo.education.length - 1 ? "pb-4 border-b border-gray-800" : ""}>
                                        <div className="flex justify-between">
                                            <h4 className="font-medium">{edu.level}- {edu.school}</h4>
                                            <span
                                                className={theme === "dark" ? "text-sm text-gray-400" : "text-sm text-gray-500"}>{edu.period}</span>
                                        </div>
                                        <p
                                            className={theme === "dark" ? "text-gray-400 mt-1" : "text-gray-500 mt-1"}>
                                            {edu.major} {edu.description ? edu.description : ""}
                                        </p>
                                    </li>)}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </section>
                {}
                <section id="portfolio" className="py-16 border-t border-gray-800">
                    <motion.div
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
                            duration: 0.6
                        }}
                        className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">作品集</h2>
                        <p
                            className={`max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>这里展示了我在产品经理实习和项目工作中的部分成果，
                                                            包括需求挖掘、产品设计、数据分析等方面的工作。
                                                        </p>
                    </motion.div>
     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioItems.map(item => <PortfolioCard key={item.id} item={item} />)}
                    </div>
                </section>
                {}
                <section className="py-16 border-t border-gray-800">
                    <motion.div
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
                            duration: 0.6
                        }}
                        className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">实习与项目经验</h2>
                        <></>
                    </motion.div>
     <div className="space-y-8">
        {experiences.map((experience, index) => <ExperienceCard key={index} item={experience} />)}
                    </div>
                </section>
                {}
                <section id="contact" className="py-16 border-t border-gray-800">
                    <motion.div
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
                            duration: 0.6
                        }}
                        className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">联系方式</h2>
                        <p
                            className={`max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>如果您对我的经历和能力感兴趣，欢迎随时联系我，我会尽快回复您。
                                                        </p>
                    </motion.div>
                    <motion.div
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
                            duration: 0.6,
                            delay: 0.2
                        }}
                        className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
                        <ContactCard
                            icon={<Phone size={20} />}
                            title="电话"
                            value={personalInfo.phone}
                            href={`tel:${personalInfo.phone}`} />
                        <ContactCard
                            icon={<Mail size={20} />}
                            title="邮箱"
                            value={personalInfo.email}
                            href={`mailto:${personalInfo.email}`} />
                        {personalInfo.wechat && <ContactCard
                            icon={<svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>}
                            title="微信"
                            value={personalInfo.wechat}
                            href="#" />}
                        <ContactCard
                            icon={<Linkedin size={20} />}
                            title="LinkedIn"
                            value="linkedin.com/in/zhaozhihao"
                            href="#" />
                    </motion.div>
                </section>
            </main>
            {}
            <footer
                className={`backdrop-blur-md border-t py-8 ${theme === "dark" ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-gray-200"}`}>
                <div className="container mx-auto px-4 text-center">
                    <p
                        className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>© 2026 赵梓皓 - AI产品经理个人简历 | 使用React + TypeScript + Tailwind CSS构建</p>
                </div>
            </footer>
        </div>
    );
}
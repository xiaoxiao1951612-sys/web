import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { getPersonalInfo, getExperiences, getPortfolioItems, refreshResumeData } from "@/lib/dataService";

// 创建RAG相关的数据处理逻辑
const createKnowledgeBase = () => {
  // 获取个人信息
  const personalInfo = getPersonalInfo();
  const experiences = getExperiences();
  const projects = getPortfolioItems();
  
  // 构建知识库
  const knowledgeBase = {
    personalInfo: `
      姓名: ${personalInfo.name}
      职位: ${personalInfo.title}
      年龄: ${personalInfo.age}
      性别: ${personalInfo.gender}
      城市: ${personalInfo.city}
      研究方向: ${personalInfo.researchDirection}
      邮箱: ${personalInfo.email}
      电话: ${personalInfo.phone}
      微信: ${personalInfo.wechat || '未提供'}
      到岗时间: ${personalInfo.availableTime}
      个人介绍: ${personalInfo.aboutMe || '未提供'}
      
      教育背景:
      ${personalInfo.education.map((edu, index) => `
        ${index + 1}. ${edu.level} - ${edu.school}
        专业: ${edu.major}
        时间: ${edu.period}
        ${edu.description ? `补充: ${edu.description}` : ''}
      `).join('\n')}
    `,
    
    experiences: experiences.map((exp, index) => `
      实习经历 ${index + 1}:
      公司: ${exp.company}
      职位: ${exp.role}
      时间: ${exp.period}
      工作内容: ${exp.responsibilities.join('; ')}
    `).join('\n\n'),
    
    projects: projects.map((project, index) => `
      项目 ${index + 1}:
      标题: ${project.title}
      类别: ${project.category}
      时间: ${project.date}
      描述: ${project.description}
      概述: ${project.details.overview}
      功能: ${project.details.features.join('; ')}
      技术: ${project.details.technologies.join(', ')}
      成果: ${project.details.results}
    `).join('\n\n')
  };
  
  return knowledgeBase;
};

// 简单的匹配函数，从知识库中查找相关内容
const searchKnowledgeBase = (query: string, knowledgeBase: any) => {
  const lowerQuery = query.toLowerCase();
  let relevantContent = '';
  
  // 检查个人信息部分
  if (lowerQuery.includes('姓名') || lowerQuery.includes('年龄') || lowerQuery.includes('性别') || 
      lowerQuery.includes('城市') || lowerQuery.includes('介绍') || lowerQuery.includes('教育') ||
      lowerQuery.includes('邮箱') || lowerQuery.includes('电话') || lowerQuery.includes('微信')) {
    relevantContent += knowledgeBase.personalInfo + '\n\n';
  }
  
  // 检查实习经历部分
  if (lowerQuery.includes('实习') || lowerQuery.includes('工作') || lowerQuery.includes('经历')) {
    relevantContent += knowledgeBase.experiences + '\n\n';
  }
  
  // 检查项目部分
  if (lowerQuery.includes('项目') || lowerQuery.includes('作品') || lowerQuery.includes('技术')) {
    relevantContent += knowledgeBase.projects + '\n\n';
  }
  
  // 如果没有找到明确匹配，返回全部知识库
  if (relevantContent === '') {
    relevantContent = `${knowledgeBase.personalInfo}\n\n${knowledgeBase.experiences}\n\n${knowledgeBase.projects}`;
  }
  
  return relevantContent;
};

export const ChatInterface = () => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState<Array<{
        text: string;
        isUser: boolean;
    }>>([]);

    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // 初始化欢迎消息
    useEffect(() => {
      refreshResumeData();
      // 只有在没有消息时才显示欢迎消息
      if (messages.length === 0) {
        setMessages([{
          text: "您好！我是AI助手，可以为您介绍赵梓皓的个人信息、教育背景、实习经历和项目经验。请问您想了解什么？",
          isUser: false
        }]);
      }
    }, []);

    const handleSendMessage = () => {
        if (!inputText.trim())
            return;

        const newMessage = {
            text: inputText,
            isUser: true
        };

        setMessages([...messages, newMessage]);
        setInputText("");
        setIsTyping(true);

     // 调用DeepSeek API获取AI回复，并结合RAG
     const fetchAIResponse = async () => {
       try {
         if (!import.meta.env.VITE_DEEPSEEK_API_KEY) {
           throw new Error("缺少 VITE_DEEPSEEK_API_KEY");
         }

         // 构建知识库
         const knowledgeBase = createKnowledgeBase();
         
         // 在知识库中搜索相关内容
         const relevantKnowledge = searchKnowledgeBase(inputText, knowledgeBase);
         
         // 构建提示词，结合RAG上下文
         const systemPrompt = `你是一个个人信息介绍助手，负责根据提供的知识库回答关于赵梓皓的问题。请严格基于知识库内容回答，不要编造信息。如果你无法从知识库中找到答案，请直接表示无法回答该问题。`;
         
         // 获取当前对话历史，构建上下文
         const conversationHistory = messages.map(msg => ({
           role: msg.isUser ? "user" : "assistant",
           content: msg.text
         }));
         
         // 构建包含RAG上下文的完整对话历史
         const fullHistory = [
           { role: "system", content: systemPrompt },
           { role: "system", content: `知识库信息：${relevantKnowledge}` },
           ...conversationHistory,
           { role: "user", content: inputText }
         ];
         
         // 调用DeepSeek API
         const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY || ""}`
           },
           body: JSON.stringify({
             model: "deepseek-chat",
             messages: fullHistory,
             max_tokens: 1024,
             temperature: 0.7
           })
         });
         
         if (!response.ok) {
           throw new Error(`API请求失败: ${response.status}`);
         }
         
         const data = await response.json();
         const aiResponse = data.choices[0]?.message?.content || "抱歉，我无法回答这个问题。";
         
         setMessages(prev => [...prev, {
           text: aiResponse,
           isUser: false
         }]);
       } catch (error) {
         console.error("调用DeepSeek API失败:", error);
         toast.error("抱歉，AI助手暂时无法使用，请稍后再试。");
         setMessages(prev => [...prev, {
           text: "抱歉，AI助手暂时无法使用，请稍后再试。",
           isUser: false
         }]);
       } finally {
         setIsTyping(false);
       }
     };
     
     fetchAIResponse();
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

     return (
        <div className={`w-full flex flex-col min-h-[300px] max-h-[400px] ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto mb-4 space-y-3 p-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex max-w-[80%]",
                            msg.isUser ? "ml-auto justify-end" : "mr-auto justify-start"
                        )}>
                        <div
                            className={cn(
                                "px-4 py-2 rounded-lg",
                                 msg.isUser 
                                     ? "bg-purple-600 text-white" 
                                     : theme === 'dark' ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"
                            )}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="mr-auto justify-start max-w-[80%]">
                         <div className={`px-4 py-2 rounded-lg flex gap-1 ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                        }`}>
                            <span className="animate-bounce">•</span>
                            <span
                                className="animate-bounce"
                                style={{
                                    animationDelay: "0.2s"
                                }}>•</span>
                            <span
                                className="animate-bounce"
                                style={{
                                    animationDelay: "0.4s"
                                }}>•</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex gap-2 p-4 pt-0">
                <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                    placeholder="请问您想了解赵梓皓的哪些信息？"
                     className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-purple-500 ${
                        theme === 'dark' 
                            ? 'bg-gray-800 text-white border-gray-700' 
                            : 'bg-white text-gray-800 border-gray-300'
                    }`} />
                <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">发送
                </button>
            </div>
        </div>
    );
};
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface ContactCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  href: string;
}

export const ContactCard = ({ icon, title, value, href }: ContactCardProps) => {
  const { theme } = useTheme();
  
  // 处理微信点击事件
  const handleWechatClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (title === '微信') {
      e.preventDefault();
      // 在实际应用中，这里可以显示二维码
      alert(`微信号：${value}`);
    }
  };
  
  return (
    <motion.a 
      href={href}
      onClick={handleWechatClick}
      target={href.startsWith('mailto:') || href.startsWith('tel:') ? '_self' : '_blank'}
      rel="noopener noreferrer"
        className={`backdrop-blur-md rounded-xl p-6 border transition-all flex items-center gap-4 group ${
        theme === 'dark' 
            ? 'bg-gray-900/80 border-gray-800 hover:border-purple-500/50' 
            : 'bg-white/90 border-gray-200 hover:border-purple-400'
    }`}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
         <div className={`w-12 h-12 rounded-full flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors ${
            theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
        }`}>
         {icon}
      </div>
      <div>
         <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
         <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{value}</p>
      </div>
    </motion.a>
  );
}
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  responsibilities: string[];
}

export const ExperienceCard = ({ item }: { item: ExperienceItem }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
       className={`backdrop-blur-md rounded-xl p-6 border ${
         theme === 'dark' 
             ? 'bg-gray-900/80 border-gray-800' 
             : 'bg-white border-gray-200'
     }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
           <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.company}</h3>
           <p className="text-purple-400">{item.role}</p>
        </div>
         <span className={`mt-2 md:mt-0 text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>{item.period}</span>
      </div>
       <ul className={`space-y-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
        {item.responsibilities.map((responsibility, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-purple-500 mt-1">•</span>
            <span>{responsibility}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
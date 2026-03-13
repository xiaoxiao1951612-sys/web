// 导入toast组件用于显示通知
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

// 数据类型定义
export interface PersonalInfo {
  name: string;
  title: string;
  age: string;
  gender: string;
  city: string;
  researchDirection: string;
  email: string;
  phone: string;
  wechat?: string;
  availableTime: string;
  aboutMe?: string;
  education: {
    level: string;
    school: string;
    major: string;
    period: string;
    description?: string;
  }[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  responsibilities: string[];
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  image: string;
  images: string[];
  details: {
    overview: string;
    features: string[];
    technologies: string[];
    results: string;
  };
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: ExperienceItem[];
  portfolioItems: PortfolioItem[];
}

const RESUME_TABLE = 'resume_content';
const RESUME_ID = 1;

// localStorage缓存（用于首屏与离线兜底）
const CACHE_PERSONAL_INFO_KEY = 'personalInfo';
const CACHE_EXPERIENCES_KEY = 'experiences';
const CACHE_PORTFOLIO_ITEMS_KEY = 'portfolioItems';
const CACHE_LAST_SYNC_AT_KEY = 'resume_last_sync_at';

// BroadcastChannel用于同设备不同标签页间的数据同步
let broadcastChannel: BroadcastChannel | null = null;

// 初始化BroadcastChannel
const initBroadcastChannel = () => {
  if (!broadcastChannel && typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel('resume_data_channel');
  }
  return broadcastChannel;
};

// 发送数据更新通知
const notifyDataUpdate = (dataType: string) => {
  const channel = initBroadcastChannel();
  if (channel) {
    channel.postMessage({
      type: 'data_updated',
      dataType,
      timestamp: Date.now(),
    });
  }
};

// 监听数据更新通知
export const listenForDataUpdates = (callback: (dataType: string) => void) => {
  const channel = initBroadcastChannel();
  if (channel) {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'data_updated') {
        callback(event.data.dataType);
      }
    };
    
    channel.addEventListener('message', handleMessage);
    
    // 返回清理函数
    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }
  return () => {};
};

export const getDefaultData = (): ResumeData => {
  const defaultData: ResumeData = {
    personalInfo: {
      name: "赵梓皓",
      title: "求职意向 | 产品经理 ",
      age: "25岁",
      gender: "男",
      city: "浙江",
      researchDirection: "自动驾驶",
      email: "2431867@tongji.edu.cn",
      phone: "19857523357",
      availableTime: "可实习3-6个月",
      aboutMe: "加载中",
      education: [
        {
          level: "硕士",
          school: "同济大学",
          major: "交通运输专业 自动驾驶方向（推免）",
          period: "2024.09-至今"
        },
        {
          level: "本科",
          school: "同济大学",
          major: "交通工程专业 智能交通系统工程方向",
          period: "2019.09-2024.06",
          description: "GPA：4.56/5(前15%）"
        }
      ]
    } as PersonalInfo,
    
    experiences: [
      {
        company: "上海元卓信息科技有限公司",
        role: "产品经理",
        period: "2023.09-2023.10",
        responsibilities: [
          "需求挖掘与市场验证：通过结构化分析97份政府规划/招标/验收报告，精准锁定数据中台、数据治理、物联网感知层三大核心需求",
          "竞品对标与资料库构建：深度对标行业竞品技术架构与落地策略，主导建立结构化竞品资料库",
          "产品功能决策与输出：深入交通、环境、应急三大场景，输出20份深度分析报告，直接推动自有数据产品功能规划"
        ]
      },
      {
        company: "岚图汽车科技有限公司",
        role: "智驾感知评测开发",
        period: "2025.09-2025.11",
        responsibilities: [
          "体验评测指标设计：主导设计并落地感知稳定性评测体系，将用户体验痛点转化为可量化的产品评测指标",
          "规模化数据验证：统筹410个真实测试案例、21万+帧场景数据验证，精准识别14%的异常跳变帧",
          "工具链产品化建设：主导开发板端一致性自动化验证流程，将多场景实测通过率稳定在98%"
        ]
      },
      {
        company: "TOPS自动驾驶人机共融实验室",
        role: "智驾自动化数据采集平台 (AI运维)",
        period: "2025.10-2026.1",
        responsibilities: [
          "数据链路产品化：主导设计统一Web控制台，将数据全链路操作抽象为标准化任务流，数据管理效率提升超300%",
          "可视化产品设计：结合Three.js+roslib.js设计多传感器数据统一可视化方案，提升数据排查效率",
          "AI能力产品规划：设计AI运维助手产品功能，基于本地知识库对海量运行日志进行智能解析"
        ]
      }
    ] as ExperienceItem[],
    
    portfolioItems: [
      {
        id: 1,
        title: "智驾自动化数据采集平台",
        category: "项目",
        description: "针对自动驾驶测试中的数据采集分散、命令行复杂、回放困难等问题，主导设计统一Web控制台",
        date: "2025.10 - 2026.1",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=smart%20driving%20data%20platform%20dashboard&sign=2d496870621531338d20d62f7d3d553b",
        images: [
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=smart%20driving%20data%20platform%20dashboard&sign=2d496870621531338d20d62f7d3d553b",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=autonomous%20driving%20data%20visualization&sign=484429ad113d45b955b5ecc71919f929",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=AI%20data%20analysis%20dashboard&sign=ebb1e6166ed2fa2b963a509d15d6ae82"
        ],
        details: {
          overview: "该平台旨在解决自动驾驶测试过程中的数据采集与管理难题，通过统一的Web控制台提供全链路的数据操作能力。",
          features: [
            "数据链路产品化：将数据全链路操作抽象为标准化任务流，数据管理效率提升超300%",
            "可视化产品设计：结合Three.js+roslib.js设计多传感器数据统一可视化方案，提升数据排查效率",
            "AI能力产品规划：设计AI运维助手产品功能，基于本地知识库对海量运行日志进行智能解析"
          ],
          technologies: ["React", "Three.js", "Node.js", "MongoDB"],
          results: "成功将数据采集效率提升300%，AI辅助日志分析准确率达到92%，团队整体工作效率提升显著。"
        }
      },
      {
        id: 2,
        title: "市场调研与产品定义",
        category: "项目",
        description: "深入调研上海外滩水域交通现状，通过150+份用户问卷与访谈数据，构建核心用户画像",
        date: "2022.09 - 2023.06",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=market%20research%20analysis%20dashboard&sign=b9d2a5c54a855ac9e285de4b544429b5",
        images: [
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=market%20research%20analysis%20dashboard&sign=b9d2a5c54a855ac9e285de4b544429b5",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=user%20survey%20data%20visualization&sign=c714102022bd1b4311053cee07fc2f55",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=user%20persona%20creation&sign=923d759f61b5d5e0943c701e7e14d4ca"
        ],
        details: {
          overview: "本项目通过系统性的市场调研方法，深入了解上海外滩水域交通现状，并基于调研数据进行产品定义与规划。",
          features: [
            "用户需求挖掘：设计并分发150+份结构化问卷，深度访谈20+位行业专家与用户",
            "数据分析与洞察：运用统计学方法分析调研数据，提取关键用户需求与痛点",
            "用户画像构建：基于数据构建3类核心用户画像，明确产品定位与方向"
          ],
          technologies: ["市场调研", "数据分析", "用户研究", "产品设计"],
          results: "成功为水域交通管理系统提供清晰的产品定位与功能规划，为后续开发奠定了坚实基础。"
        }
      },
      {
        id: 3,
        title: "感知稳定性评测体系",
        category: "实习",
        description: "针对智驾系统在雨天/夜间等复杂工况下的输出抖动问题，主导设计并落地感知稳定性评测体系",
        date: "2025.09 - 2025.11",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=autonomous%20driving%20sensor%20evaluation&sign=d61b92c62784264fc624d475dfe44c5c",
        images: [
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=autonomous%20driving%20sensor%20evaluation&sign=d61b92c62784264fc624d475dfe44c5c",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=testing%20scenarios%20in%20rainy%20conditions&sign=34059d99fdcdd92317e6191e9925aff6",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=performance%20metrics%20dashboard&sign=5d6b3d26f74c5174d78ac441a9a981a3"
        ],
        details: {
          overview: "该项目旨在解决智驾系统在复杂工况下的感知稳定性问题，通过建立科学的评测体系，提升系统可靠性。",
          features: [
            "体验评测指标设计：主导设计并落地感知稳定性评测体系，将用户体验痛点转化为可量化的产品评测指标",
            "规模化数据验证：统筹410个真实测试案例、21万+帧场景数据验证，精准识别14%的异常跳变帧",
            "工具链产品化建设：主导开发板端一致性自动化验证流程，将多场景实测通过率稳定在98%"
          ],
          technologies: ["自动驾驶", "传感器技术", "数据评测", "自动化测试"],
          results: "成功将感知系统在复杂工况下的稳定性提升至98%，显著改善了用户体验与系统安全性。"
        }
      },
      {
        id: 4,
        title: "智慧城市数据产品规划",
        category: "实习",
        description: "通过结构化分析97份政府规划/招标/验收报告，精准锁定数据中台、数据治理、物联网感知层三大核心需求",
        date: "2023.09 - 2023.10",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=smart%20city%20data%20platform&sign=b6239451e0274592647b840f0d43113b",
        images: [
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=smart%20city%20data%20platform&sign=b6239451e0274592647b840f0d43113b",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=data%20center%20architecture&sign=181eeaf8576296d0782ce73cc311a8dc",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=IoT%20sensors%20network&sign=8f0e02ea55ea3b5f688efffeef000946"
        ],
        details: {
          overview: "本项目通过深入分析政府文档与行业需求，为智慧城市数据产品制定了全面的规划与实施路径。",
          features: [
            "需求挖掘与市场验证：通过结构化分析97份政府规划/招标/验收报告，精准锁定三大核心需求",
            "竞品对标与资料库构建：深度对标行业竞品技术架构与落地策略，主导建立结构化竞品资料库",
            "产品功能决策与输出：深入交通、环境、应急三大场景，输出20份深度分析报告，直接推动产品功能规划"
          ],
          technologies: ["智慧城市", "数据中台", "产品规划", "需求分析"],
          results: "成功为公司的智慧城市数据产品指明了发展方向，并为后续项目落地提供了清晰的实施路径。"
        }
      }
    ] as PortfolioItem[]
  };
  return defaultData;
};

const writeCache = (data: ResumeData) => {
  localStorage.setItem(CACHE_PERSONAL_INFO_KEY, JSON.stringify(data.personalInfo));
  localStorage.setItem(CACHE_EXPERIENCES_KEY, JSON.stringify(data.experiences));
  localStorage.setItem(CACHE_PORTFOLIO_ITEMS_KEY, JSON.stringify(data.portfolioItems));
  localStorage.setItem(CACHE_LAST_SYNC_AT_KEY, String(Date.now()));
};

const ensureCacheInitialized = () => {
  const hasAll =
    !!localStorage.getItem(CACHE_PERSONAL_INFO_KEY) &&
    !!localStorage.getItem(CACHE_EXPERIENCES_KEY) &&
    !!localStorage.getItem(CACHE_PORTFOLIO_ITEMS_KEY);

  if (!hasAll) {
    writeCache(getDefaultData());
  }
};

const readJson = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const fetchRemoteResumeData = async (): Promise<ResumeData | null> => {
  const hasConfig =
    !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!hasConfig) return null;

  const { data, error } = await supabase
    .from(RESUME_TABLE)
    .select('data')
    .eq('id', RESUME_ID)
    .single();

  if (error) {
    console.error('[Supabase] 拉取简历数据失败:', error);
    return null;
  }

  const payload = (data as any)?.data;
  if (!payload || typeof payload !== 'object') return null;

  // 轻量校验，避免把脏数据写进缓存
  if (!payload.personalInfo || !payload.experiences || !payload.portfolioItems) return null;

  return payload as ResumeData;
};

const pushRemoteResumeData = async (data: ResumeData): Promise<boolean> => {
  const hasConfig =
    !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!hasConfig) return false;

  const { error } = await supabase
    .from(RESUME_TABLE)
    .update({ data, updated_at: new Date().toISOString() })
    .eq('id', RESUME_ID);

  if (error) {
    console.error('[Supabase] 保存简历数据失败:', error);
    return false;
  }
  return true;
};

/**
 * 从 Supabase 拉取最新数据并写入本地缓存。
 * - 云端失败时会保持本地缓存不变（仍可渲染）
 */
export const refreshResumeData = async (options?: { toastOnUpdate?: boolean }) => {
  ensureCacheInitialized();
  const remote = await fetchRemoteResumeData();
  if (!remote) return false;

  writeCache(remote);
  if (options?.toastOnUpdate) {
    toast.info('简历内容已更新');
  }
  notifyDataUpdate('all');
  return true;
};

// 兼容旧调用：版本检查改为“拉一下云端”
export const checkAndUpdateDataVersion = () => refreshResumeData({ toastOnUpdate: false });

// 个人信息相关操作
export const getPersonalInfo = (): PersonalInfo => {
  ensureCacheInitialized();
  return readJson<PersonalInfo>(CACHE_PERSONAL_INFO_KEY, getDefaultData().personalInfo);
};

export const savePersonalInfo = async (data: PersonalInfo): Promise<boolean> => {
  ensureCacheInitialized();
  try {
    const current: ResumeData = {
      personalInfo: data,
      experiences: getExperiences(),
      portfolioItems: getPortfolioItems()
    };

    // 先写缓存，保证体验
    writeCache(current);

    // 再写云端（失败不影响本地显示）
    await pushRemoteResumeData(current);

    notifyDataUpdate('personalInfo');
    return true;
  } catch (error) {
    console.error('保存个人信息失败:', error);
    return false;
  }
};

// 实习经历相关操作
export const getExperiences = (): ExperienceItem[] => {
  ensureCacheInitialized();
  return readJson<ExperienceItem[]>(CACHE_EXPERIENCES_KEY, getDefaultData().experiences);
};

export const saveExperiences = async (data: ExperienceItem[]): Promise<boolean> => {
  ensureCacheInitialized();
  try {
    const current: ResumeData = {
      personalInfo: getPersonalInfo(),
      experiences: data,
      portfolioItems: getPortfolioItems()
    };

    writeCache(current);
    await pushRemoteResumeData(current);

    notifyDataUpdate('experiences');
    return true;
  } catch (error) {
    console.error('保存实习经历失败:', error);
    return false;
  }
};

// 项目相关操作
export const getPortfolioItems = (): PortfolioItem[] => {
  ensureCacheInitialized();
  return readJson<PortfolioItem[]>(CACHE_PORTFOLIO_ITEMS_KEY, getDefaultData().portfolioItems);
};

export const savePortfolioItems = async (data: PortfolioItem[]): Promise<boolean> => {
  ensureCacheInitialized();
  try {
    const current: ResumeData = {
      personalInfo: getPersonalInfo(),
      experiences: getExperiences(),
      portfolioItems: data
    };

    writeCache(current);
    await pushRemoteResumeData(current);

    notifyDataUpdate('portfolioItems');
    return true;
  } catch (error) {
    console.error('保存项目数据失败:', error);
    return false;
  }
};

// 管理员重置数据到初始状态
export const resetAllData = async (): Promise<boolean> => {
  try {
    const defaults = getDefaultData();
    writeCache(defaults);
    await pushRemoteResumeData(defaults);
    notifyDataUpdate('all');
    return true;
  } catch (error) {
    console.error('重置数据失败:', error);
    return false;
  }
};
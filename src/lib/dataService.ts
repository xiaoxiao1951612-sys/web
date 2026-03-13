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
      title: "求职意向 | 产品经理 | 27届",
      age: "25岁",
      gender: "男",
      city: "上海",
      wechat:"Z19857523357",
      researchDirection: "自动驾驶",
      email: "2431867@tongji.edu.cn",
      phone: "19857523357",
      availableTime: "可实习3-6个月",
      aboutMe: "你好！我是赵梓皓，一名对产品经理岗位充满热情的研究生。\n\n我的核心竞争力在于“产品思维+工程能力+AI应用能力”的独特组合。\n\n在校期间，我熟练使用Python/SQL进行数据分析，网页开发；也能用Figma、墨刀快速将想法落地为可交互原型。\n\n面对AI浪潮，我不止于理论——我理解大模型基本原理，更是Vibecoding的积极实践者：用ChatGPT辅助调研，用Coze验证想法，用Cursor搭建产品Demo。\n\n我相信，未来的PM不仅要“想得到”，更要能“快速试出来”。\n\n作为应届生，我拥有快速学习的能力、对用户需求的敏锐感知，以及对用AI创造好产品的极致热情。期待加入优秀团队，快速成长，贡献年轻视角。",
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
          "需求挖掘与市场验证：针对政府交通管理部门数据可视化能力不足、决策效率低下痛点，构建从0到1的公交客流数据看板需求挖掘体系。通过结构化拆解97份政府交通规划/招标/验收报告，将抽象政策需求转化为可执行产品方案，为产品立项提供关键依据。 ",
          "竞品分析与策略制定：系统梳理并对比6家厂商的公交客流数据资源目录、车流人流数据标准、跨部门数据共享交换机制及公交诱导场景指标体系，形成20+项量化对比维度，为政府数据看板功能迭代提供详实决策依据。 ",
          "核心成果与功能落地：产出5份场景化需求分析报告，直接指导产品迭代。通过优先级调整，使产品功能与政府实际采购需求匹配度提升，显著增强解决方案在市场投标中的竞争力。"
        ]
      },
      {
        company: "岚图汽车科技有限公司",
        role: "智驾感知评测开发",
        period: "2025.09-2025.11",
        responsibilities: [
          "体验评测指标设计： 针对智驾系统在雨天/夜间等复杂工况下的输出抖动问题，主导设计并落地感知稳定性评测体系。通过定义位置跳变、航向角跳变等核心维度的异常检测标准，将用户体验痛点转化为可量化的产品评测指标，为体验优化提供数据基石。",
          "规模化数据验证： 统筹410个真实测试案例、21万+帧场景数据验证，精准识别14%的异常跳变帧。基于数据结论推动算法团队完成稳定性缺陷修复，显著提升复杂场景下的输出平滑性，闭环优化用户驾乘体验",
          "工具链产品化建设： 为解决算法仿真-实车测试一致性难题，主导开发板端一致性自动化验证流程。通过产品化手段将多场景实测通过率稳定在98%，并将版本验证周期从数天压缩至小时级，该流程现作为核心质量门禁，为算法快速上车与版本交付节奏提供关键决策依据。"
        ]
      },
      {
        company: "TOPS自动驾驶人机共融实验室校企合作项目",
        role: "自动化数据采集平台 (AI运维)",
        period: "2025.10-2026.1",
        responsibilities: [
          "数据链路产品化： 针对自动驾驶测试中的数据采集分散、命令行复杂、回放困难等问题，主导设计统一Web控制台，将采集控制、录制回放、落盘同步、感知分析等数据全链路操作抽象为标准化任务流，数据管理效率提升超300%。 ",
          "可视化设计： 结合Three.js+roslib.js设计多传感器数据统一可视化方案，将点云、图像、轨迹等异构数据融合展示在单一页面，帮助用户直观完成问题定位与场景复现，提升数据排查效率。",
          "AI运维助手设计： 设计AI运维助手产品功能，基于本地知识库对海量运行日志进行智能解析，实现异常模式自动归类与FAQ式建议推送。 将“ROS指令+Bash脚本”的复杂底层操作封装为简单的表单输入，用户仅需填写bagPath即可完成全流程任务配置，大幅降低非技术人员的工具使用门槛。 "
        ]
      }
    ] as ExperienceItem[],
    
    portfolioItems: [
      {
        id: 1,
        title: "自动化数据采集平台（AI运维）",
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
          overview: "针对自动驾驶测试中数据链路复杂、工具门槛高等痛点，主导设计了统一Web控制台。该方案将采集控制、录制回放及感知分析等全流程抽象为标准化任务流，用户仅需填写bagPath即可完成复杂配置，实现数据管理效率超300%的提升；同时结合Three.js与roslib.js实现点云、图像等多传感数据的融合可视化，并设计AI运维助手对运行日志进行智能解析与异常归因，大幅降低了非技术人员的使用门槛，显著提升了数据排查与场景复现的效率。",
          features: [
            "数据链路产品化： 针对自动驾驶测试中的数据采集分散、命令行复杂、回放困难等问题，主导设计统一Web控制台，将采集控制、录制回放、落盘同步、感知分析等数据全链路操作抽象为标准化任务流，数据管理效率提升超300%。",
            "可视化设计： 结合Three.js+roslib.js设计多传感器数据统一可视化方案，将点云、图像、轨迹等异构数据融合展示在单一页面，帮助用户直观完成问题定位与场景复现，提升数据排查效率。",
            "AI运维助手设计： 设计AI运维助手产品功能，基于本地知识库对海量运行日志进行智能解析，实现异常模式自动归类与FAQ式建议推送。 将“ROS指令+Bash脚本”的复杂底层操作封装为简单的表单输入，用户仅需填写bagPath即可完成全流程任务配置，大幅降低非技术人员的工具使用门槛。"
          ],
          technologies: ["React", "Three.js", "Node.js", "MongoDB"],
          results: "成功将数据采集效率提升300%，AI辅助日志分析准确率达到92%，团队整体工作效率提升显著。且有一项软件著作在申。"
        }
      },
      {
        id: 2,
        title: "hydro lounge 一体化出行服务载具",
        category: "项目",
        description: "为解决水陆接驳体验割裂的用户痛点，确立“水陆观光接驳一体化”产品方向。 借助上海内河网络，推出模块化水陆两栖观光系统，将城市通勤升级为沉浸式水上旅游新体验。",
        date: "2022.09 - 2023.06",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=market%20research%20analysis%20dashboard&sign=b9d2a5c54a855ac9e285de4b544429b5",
        images: [
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=market%20research%20analysis%20dashboard&sign=b9d2a5c54a855ac9e285de4b544429b5",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=user%20survey%20data%20visualization&sign=c714102022bd1b4311053cee07fc2f55",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=user%20persona%20creation&sign=923d759f61b5d5e0943c701e7e14d4ca"
        ],
        details: {
          overview: "基于上海陆路交通趋于饱和，水陆换乘体验差的问题，设计团队利用黄浦江等丰富但未充分开发的内河资源，提出将部分交通转移至水上的旅游解决方案。为此，我们设计了一款模块化水陆两栖交通系统。该系统由可分离的乘坐舱与功能载体构成：乘坐舱是连接水陆的纽带，可搭配不同的陆上或水上载体运行。在水上，多个乘坐舱可连接组合，既可保持社交距离，也能满足家庭出游、水上会议等多样化需求。内饰方面，乘坐舱采用悬浮式座椅，配合光影与投影效果，营造漂浮水面的沉浸体验。用户还可通过APP定制外部载体，集成瑜伽、钓鱼、餐饮等模块，使这一交通工具更具普适性，服务不同人群。",
          features: [
            "市场调研与产品定义： 深入调研上海外滩水域交通现状，通过150+份用户问卷与访谈数据，构建核心用户画像，精准锚定“水陆接驳体验割裂”的用户痛点，确立“水陆观光接驳一体化”产品方向。",
            "体验设计与效率提升： 设计模块化载具端到端使用流程，输出用户流程图及交互方案，通过动线优化与关键节点交互升级，实现水陆无缝切换，预计提升单次出行效率40%。",
            "商业模型与可行性验证： 搭建成本收益测算模型，完成票价组合策略及广告、联名等增值模块的收益评估，从商业维度验证产品可行性，为决策提供量化依据。 联动设计团队完成软件界面与交互流程设计，重点优化约车、支付环节体验；编写展示视频脚本并统筹拍摄，以叙事化方式呈现产品价值。"
          ],
          technologies: ["市场调研", "数据分析", "figma", "墨刀"],
          results: "获IDEEA设计大赛最佳工业设计奖"
        }
      },
      {
        id: 3,
        title: "基于意图误判的可控背景交通流仿真",
        category: "论文",
        description: "针对智驾仿真中背景车过于理性的问题，本文提出了一种基于意图误判的可控交通流生成方法，能够有效生成高交互性和高风险的测试场景。",
        date: "2025.09 - 2025.11",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=autonomous%20driving%20sensor%20evaluation&sign=d61b92c62784264fc624d475dfe44c5c",
        images: [
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=autonomous%20driving%20sensor%20evaluation&sign=d61b92c62784264fc624d475dfe44c5c",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=testing%20scenarios%20in%20rainy%20conditions&sign=34059d99fdcdd92317e6191e9925aff6",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=performance%20metrics%20dashboard&sign=5d6b3d26f74c5174d78ac441a9a981a3"
        ],
        details: {
          overview: "本文提出了一种基于意图判断的可控交通流生成方法，通过transfomer+Bilstm架构模拟背景车辆对主车意图的误判，能够有效生成高交互性和高风险的测试场景，实验显示其生成场景的事故率达正常场景的1.69倍。",
          features: [
            "高效的“场景挖掘机”：能够主动、可控地生成大量因“意图误判”导致的高风险场景，解决了真实路测中这类危险场景难以遇见的痛点，大幅提升算法迭代效率。",
            "可配置的“变量调节器”：通过调节意图判断的参数，可以系统性地模拟从“谨慎保守”到“激进误判”的连续交互行为，为产品定义不同风格的测试工况提供了灵活的工程工具。",
            "安全的“压力测试器”：通过模拟背景车误判,例如：主车打灯变道，但背景车认为主车会让行从而不减速，在虚拟环境中低成本、可重复地考验主车的安全冗余和决策极限，从而在上市前规避真实世界中的潜在事故风险。"
          ],
          technologies: ["transformer", "Pytorch", "数据分析", "自动化测试"],
          results: "论文投稿2026年ITSC会议"
        }
      },
      {
        id: 4,
        title: "BEE测温无人机",
        category: "项目",
        description: "2019年新冠疫情爆发，为了防止工作人员感染，我们让以“BEE”命名的无人机探测公共区域，找出体温异常的人。因此，我们可以及时发现和隔离疑似病例。",
        date: "2021.03 - 2022.6",
        image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=smart%20city%20data%20platform&sign=b6239451e0274592647b840f0d43113b",
        images: [
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=smart%20city%20data%20platform&sign=b6239451e0274592647b840f0d43113b",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=data%20center%20architecture&sign=181eeaf8576296d0782ce73cc311a8dc",
          "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=IoT%20sensors%20network&sign=8f0e02ea55ea3b5f688efffeef000946"
        ],
        details: {
          overview: "自新冠疫情爆发以来，非接触式测温和大范围人员监测成为疫情防控的关键手段。传统的固定式测温枪或立式测温门存在效率低下、人员聚集风险高、覆盖范围有限等问题。在此背景下，本项目旨在利用无人机的高机动性与灵活性，结合红外热成像技术和移动互联网应用，打造一套“空中移动哨兵”系统，实现对区域内人员的高效体温筛查与行为监测，降低交叉感染风险，提升防疫管理的智能化水平。",
          features: [
            "非接触广域测温： 利用无人机搭载红外热成像镜头，在人群上方进行远距离、大范围的移动测温。",
            "实时预警与定位： 自动识别体温异常人员，并实时记录其位置信息。",
            "APP远程监管： 开发配套的手机APP，使防疫管理人员能够远程查看实时画面、接收报警信息并统计疫情数据。"
          ],
          technologies: ["CAD", "Figma", "墨刀", "blender"],
          results: "申请一项实用新型专利"
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
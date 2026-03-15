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
        image: "/picture/自动化数据采集平台/placeholder.png",
        images: [
          "/picture/自动化数据采集平台/数采 (1).png",
          "/picture/自动化数据采集平台/数采 (2).png",
          "/picture/自动化数据采集平台/数采 (3).png",
          "/picture/自动化数据采集平台/数采 (4).png",
          "/picture/自动化数据采集平台/数采 (5).png",
          "/picture/自动化数据采集平台/数采 (6).png"
        ],
        details: {
          overview: "聚焦自动驾驶研发测试与数据闭环场景。在路测数据采集、算法迭代验证、问题追溯复现等环节，工程师需要频繁处理海量的传感器数据（如激光点云、图像）、复杂的ROS通信链路以及繁琐的配置参数，传统工具链往往分散且技术门槛高。\n\n解决什么问题？\n核心解决\"数据链路复杂、工具门槛高\"两大痛点。具体来说：一是传统流程中采集、录制、回放、分析各环节割裂，配置繁琐，非专业人员难以快速上手；二是多传感数据可视化不直观，问题排查依赖手动翻查日志，效率低下；三是环境搭建和参数配置耗时，拖累数据迭代速度。\n\n怎么做？\n主导设计了一套统一的Web控制台。首先，将采集控制、录制回放、感知分析等全流程抽象为标准化任务流，用户只需填写\"bagPath\"（数据包路径）即可自动完成复杂的环境配置和参数加载。其次，基于Three.js和roslib.js实现点云、图像等多传感数据的融合可视化，让数据更直观。最后，引入AI运维助手，对运行日志进行智能解析和异常归因，自动定位问题根因，大幅降低排查门槛。\n\n效果如何？\n该方案实现了数据管理效率超300%的提升。标准化任务流将原本需要数小时的配置工作压缩至分钟级，AI运维助手让非技术人员也能快速定位数据异常，显著提升了数据排查与场景复现的效率，有效支撑了自动驾驶算法的快速迭代。",
          features: [
            "数据链路产品化： 针对自动驾驶测试中的数据采集分散、命令行复杂、回放困难等问题，主导设计统一Web控制台，将采集控制、录制回放、落盘同步、感知分析等数据全链路操作抽象为标准化任务流，数据管理效率提升超300%。",
            "可视化设计： 结合Three.js+roslib.js设计多传感器数据统一可视化方案，将点云、图像、轨迹等异构数据融合展示在单一页面，帮助用户直观完成问题定位与场景复现，提升数据排查效率。",
            "AI运维助手设计： 设计AI运维助手产品功能，基于本地知识库对海量运行日志进行智能解析，实现异常模式自动归类与FAQ式建议推送。 将“ROS指令+Bash脚本”的复杂底层操作封装为简单的表单输入，用户仅需填写bagPath即可完成全流程任务配置，大幅降低非技术人员的工具使用门槛。"
          ],
          technologies: ["React", "Three.js", "Node.js", "MongoDB"],
          results: "成功将数据采集效率提升300%，一项软件著作在申。"
        }
      },
      {
        id: 2,
        title: "hydro lounge 一体化出行服务载具",
        category: "项目",
        description: "为解决水陆接驳体验割裂的用户痛点，确立“水陆观光接驳一体化”产品方向。 借助上海内河网络，推出模块化水陆两栖观光系统，将城市通勤升级为沉浸式水上旅游新体验。",
        date: "2022.09 - 2023.06",
        image: "/picture/hydro lounge 一体化出行服务载具/hylo (0).png",
        images: [
          "/picture/hydro lounge 一体化出行服务载具/hylo (0).png",
          "/picture/hydro lounge 一体化出行服务载具/hylo (1).jpg",
          "/picture/hydro lounge 一体化出行服务载具/hylo (2).png",
          "/picture/hydro lounge 一体化出行服务载具/hylo (3).png",
          "/picture/hydro lounge 一体化出行服务载具/hylo (4).png",
          "/picture/hydro lounge 一体化出行服务载具/hylo (5).png"
        ],
        details: {
          overview: "聚焦上海外滩及黄浦江沿岸的核心水域与陆域交汇处。当前这些区域水陆交通割裂——游客在外滩看完夜景想换乘游船，往往需要长距离步行、重复购票、长时间等待，导致水陆联游体验差、效率低。\n\n解决什么问题？\n核心解决\"水陆接驳体验割裂\"的痛点。具体来说：一是物理衔接不畅，水陆换乘动线混乱；二是功能单一，现有游船无法满足家庭出游、水上会议、瑜伽健身等多样化需求；三是资源闲置，黄浦江丰富的内河资源未被充分用于缓解陆上交通压力。\n\n怎么做？\n设计了一套模块化水陆两栖交通系统。乘坐舱可分离，既能搭配陆上底盘行驶，也能连接水上浮体航行；水上时可多舱组合，满足社交距离、家庭聚会等不同场景。内饰采用悬浮式座椅，配合光影营造沉浸体验；用户可通过APP定制瑜伽、钓鱼、餐饮等外部载体模块，实现\"交通工具+场景空间\"的融合。团队还完成了150+份问卷调研、用户流程图设计、成本收益测算及展示视频制作，从市场、体验、商业三端同步验证。\n\n效果如何？\n通过动线优化和交互升级，预计单次出行效率提升40%；模块化设计降低了单一功能的运营成本，票价组合与增值模块（广告、联名）带来多元收益；更重要的是，将部分陆上交通转移至水上，为上海陆路交通趋于饱和提供了可落地的分流方案。",
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
        image: "/picture/基于意图误判的可控背景交通流仿真/placeholder.png",
        images: [
          "/picture/基于意图误判的可控背景交通流仿真/误判图1.png",
          "/picture/基于意图误判的可控背景交通流仿真/误判图2.png",
          "/picture/基于意图误判的可控背景交通流仿真/误判图3.png",
          "/picture/基于意图误判的可控背景交通流仿真/误判图4.png",
          "/picture/基于意图误判的可控背景交通流仿真/误判图5.png",
          "/picture/基于意图误判的可控背景交通流仿真/误判图6.png"
        ],
        details: {
          overview: "这项技术聚焦于自动驾驶路测中那些\"差点出事\"的高危交互瞬间。比如，当主车准备变道或减速转弯时，周围的背景车却误判了主车的意图——本该让行的它反而加速抢行，导致两车逼近危险距离。这类因\"意图误解\"引发的博弈场景，正是现实交通事故的主要诱因。\n\n解决什么问题？\n它要解决的是自动驾驶测试中\"危险场景难复现、人类司机难配合\"的痛点。真实路测很难遇到且不敢重复测试这类高风险场景，而传统仿真又过于规矩，无法模拟人类驾驶员\"误判\"和\"不配合\"的非理性行为，导致自动驾驶系统缺乏足够的对抗训练，安全隐患难以暴露。\n\n怎么做？\n研究团队设计了一个\"会读心也会使坏\"的交通流生成模型。该模型采用编码器-解码器架构：编码器负责分析主车与周围车辆的动态关系，解码器则据此生成每辆背景车的未来轨迹。最关键的是，模型引入了\"意图判断调节参数\"，可以人为控制背景车对主车意图的误解程度，从而系统性地制造出各种\"误判型\"高风险场景。\n\n效果如何？\n在多模态仿真和闭环测试中，该模型生成的交互场景事故率显著上升，达到正常场景的1.69倍。这意味着，它成功将自动驾驶系统置于更严苛的\"压力测试\"环境中，有效暴露了系统在意图博弈中的决策短板，为提升自动驾驶的安全冗余提供了实用的验证手段。",
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
        image: "/picture/BEE测温无人机/BEE (0).png",
        images: [
          "/picture/BEE测温无人机/BEE (0).png",
          "/picture/BEE测温无人机/BEE (1).png",
          "/picture/BEE测温无人机/BEE (2).png",
          "/picture/BEE测温无人机/BEE (3).png",
          "/picture/BEE测温无人机/BEE (4).png",
          "/picture/BEE测温无人机/BEE (5).png"
        ],
        details: {
          overview: "聚焦社区、园区、交通枢纽等人员流动密集的公共区域。在疫情防控期间，这些场所需要对大范围流动人员进行体温筛查和行为监测，但传统的固定测温点容易造成人员聚集排队，且覆盖范围有限，难以应对突发性人流变化。\n\n解决什么问题？\n核心解决\"固定式测温效率低与人员聚集风险高\"的矛盾。具体来说：一是传统测温枪和立式测温门需要人员逐个通过，效率低下；二是固定点位容易形成排队聚集，反而增加交叉感染风险；三是固定设备覆盖范围有限，无法对园区、社区等大范围区域进行机动巡查和实时监测。\n\n怎么做？\n研发一套\"空中移动哨兵\"无人机测温系统。利用无人机搭载红外热成像模组，对区域内人员进行非接触式远距离测温，同时通过机载AI实现人脸检测与行为识别（如口罩佩戴、人员聚集）。无人机可按照预设航线自动巡航，发现体温异常或违规行为时，实时回传告警信息至管理后台，并通过移动端APP通知一线防疫人员精准处置，实现\"空中巡查—智能识别—实时预警—快速处置\"的全流程闭环。\n\n效果如何？\n相比传统固定点测温，无人机机动巡检大幅提升了覆盖范围和响应速度，单次飞行可完成数千平方米区域的人员筛查，有效避免了人员聚集排队带来的交叉感染风险；同时，智能化的行为监测（如口罩识别、聚集预警）减轻了一线人员的值守压力，提升了防疫管理的精准度和智能化水平。",
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
  try {
    // 尝试清除旧缓存
    localStorage.removeItem(CACHE_PERSONAL_INFO_KEY);
    localStorage.removeItem(CACHE_EXPERIENCES_KEY);
    localStorage.removeItem(CACHE_PORTFOLIO_ITEMS_KEY);
    localStorage.removeItem(CACHE_LAST_SYNC_AT_KEY);
    
    // 重新存储数据
    localStorage.setItem(CACHE_PERSONAL_INFO_KEY, JSON.stringify(data.personalInfo));
    localStorage.setItem(CACHE_EXPERIENCES_KEY, JSON.stringify(data.experiences));
    localStorage.setItem(CACHE_PORTFOLIO_ITEMS_KEY, JSON.stringify(data.portfolioItems));
    localStorage.setItem(CACHE_LAST_SYNC_AT_KEY, String(Date.now()));
  } catch (error) {
    console.error('写入本地缓存失败:', error);
    // 如果是存储空间不足错误，尝试清理缓存
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('本地存储空间不足，清理缓存...');
      try {
        // 只保留最新的项目数据，清除其他缓存
        localStorage.clear();
        // 重新尝试存储
        localStorage.setItem(CACHE_PORTFOLIO_ITEMS_KEY, JSON.stringify(data.portfolioItems));
        localStorage.setItem(CACHE_LAST_SYNC_AT_KEY, String(Date.now()));
        console.warn('缓存清理成功，只保留了项目数据');
      } catch (cleanupError) {
        console.error('清理缓存失败:', cleanupError);
      }
    }
  }
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

    // 尝试保存到 Supabase 数据库
    const remoteSuccess = await pushRemoteResumeData(current);
    
    // 只有远程保存成功后，才更新本地缓存
    if (remoteSuccess) {
      writeCache(current);
      notifyDataUpdate('portfolioItems');
      return true;
    } else {
      // 如果远程保存失败，返回 false
      throw new Error('远程保存失败');
    }
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

// 检查 Supabase Storage 桶是否存在，如果不存在则创建
export const checkStorageBucket = async (bucketName: string): Promise<boolean> => {
  const hasConfig = 
    !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!hasConfig) return false;

  try {
    // 检查存储桶是否存在
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error) {
      // 如果存储桶不存在，尝试创建
      if (error.code === 'storage/bucket-not-found') {
        console.log(`[Supabase] 存储桶 ${bucketName} 不存在，尝试创建...`);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          fileSizeLimit: 5 * 1024 * 1024 // 5MB
        });
        
        if (createError) {
          console.error(`[Supabase] 创建存储桶 ${bucketName} 失败:`, createError);
          return false;
        }
        console.log(`[Supabase] 存储桶 ${bucketName} 创建成功`);
        return true;
      } else {
        console.error(`[Supabase] 检查存储桶 ${bucketName} 失败:`, error);
        return false;
      }
    }
    
    console.log(`[Supabase] 存储桶 ${bucketName} 存在`);
    return true;
  } catch (error) {
    console.error(`[Supabase] 检查存储桶 ${bucketName} 时出错:`, error);
    return false;
  }
};
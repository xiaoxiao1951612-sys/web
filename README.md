# 个人简历网站 - 赵梓皓

这是一个基于React + TypeScript + Tailwind CSS构建的个人简历网站，展示了AI产品经理赵梓皓的个人信息、教育背景、项目经历和联系方式。

## 快速开始

### 前提条件
- 确保您已安装Node.js (v18或更高版本)
- 安装了pnpm包管理器

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

开发服务器将在 http://localhost:3000 启动，您可以在浏览器中访问此地址查看网站。

## 部署指南

如果您想将网站部署到互联网上，让任何人都可以通过URL访问，请参考完整的[部署指南](DEPLOYMENT_GUIDE.md)。

### 推荐部署方式：Vercel

1. 访问 [Vercel官网](https://vercel.com/) 并使用您的GitHub账号登录

2. 点击"New Project"按钮，选择您的简历项目仓库

3. 在项目配置页面，设置以下选项：
   - Build Command: `pnpm build`
   - Output Directory: `dist/static`

4. 点击"Deploy"按钮，等待部署完成

5. 部署成功后，您将获得一个免费域名（如 `your-resume-xxxx.vercel.app`）

## 管理员后台

部署后，您可以通过 `/admin/login` 访问管理后台来更新简历内容：
- 用户名: `admin`
- 密码: `admin123`

## 数据存储说明

本项目使用浏览器的localStorage存储数据，这意味着：
- 所有内容都存储在访问者的浏览器本地
- 管理后台的更改只会影响您自己的浏览器数据
- 如果需要实现数据同步，您需要添加后端服务

## 更多帮助

如果您在部署过程中遇到任何问题，请参考完整的[部署指南](DEPLOYMENT_GUIDE.md)或在搜索引擎中搜索解决方案。

## 项目结构

```
src/
├── components/        # 可复用组件
├── contexts/          # React上下文
├── hooks/             # 自定义钩子
├── lib/               # 工具函数
├── pages/             # 页面组件
├── App.tsx            # 应用主组件
├── index.css          # 全局样式
└── main.tsx           # 应用入口
```

## 主要功能

1. **个人信息展示**：展示个人基本信息、教育背景
2. **项目作品集**：展示项目经历和实习经验
3. **联系方式**：提供多种联系方式
4. **暗黑模式**：支持亮色/暗色主题切换
5. **管理后台**：支持编辑个人信息和项目内容

## 管理后台

网站包含一个简单的管理后台，可用于编辑个人信息和项目内容。

### 访问管理后台
1. 打开 http://localhost:3000/admin/login
2. 使用以下凭证登录：
   - 用户名：admin
   - 密码：admin123

### 管理功能
- 编辑个人信息
- 添加/编辑项目
- 添加/编辑实习经历

## 部署指南

### 构建项目
```bash
pnpm build
```

构建后的文件将生成在 `dist` 目录中。

### 部署选项
您可以将构建后的文件部署到任何静态网站托管服务，例如：
- Netlify
- Vercel
- GitHub Pages
- 阿里云OSS
- 腾讯云COS

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- Vite
- Framer Motion (动画效果)
- React Router (路由)
- Lucide React (图标)

## 数据存储

本项目使用浏览器的 localStorage 存储数据，包括个人信息、项目和实习经历。

## 注意事项

1. 项目启动后，默认会加载预设的模拟数据
2. 通过管理后台编辑的内容将保存在浏览器的本地存储中
3. 如果遇到esbuild相关的警告，可以运行`pnpm approve-builds`来允许运行构建脚本
4. 如需清除所有数据，可以清除浏览器的本地存储
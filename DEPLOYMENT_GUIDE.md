# 个人简历网站部署指南

本指南将详细介绍如何将个人简历网站部署到互联网上，让任何人都可以通过URL访问您的简历。我们提供了多种部署方案，您可以根据自己的需求和技术水平选择最适合的方式。

## 部署前准备

在开始部署之前，请确保完成以下准备工作：

1. **本地构建测试**：确保您的项目能在本地正常构建
   ```bash
   pnpm build
   ```

2. **代码托管**：将项目代码上传到GitHub、GitLab或Gitee等代码托管平台
   ```bash
   # 如果还没有初始化git仓库
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

3. **自定义域名（可选）**：如果您想使用自己的域名，请确保已注册域名并准备好DNS配置

## 部署方式

### 1. Vercel 部署（推荐）

Vercel 是部署 React 应用的最佳选择之一，提供简单的部署流程、优秀的性能和免费的基本服务。

**部署步骤：**

1. 访问 [Vercel官网](https://vercel.com/) 并使用您的GitHub/GitLab/Gitee账号登录

2. 点击"New Project"按钮，从列表中选择您的简历项目仓库

  在项目配置页面，设置以下选项：
   - Application Preset: 选择 React (Vite)
   - Framework: React
   - Root Directory: 保持默认
   - Build Command: `pnpm build`
   - Output Directory: `dist/static`
   - Environment Variables: 无需额外配置

4. 点击"Deploy"按钮，等待部署完成

5. 部署成功后，您将获得一个类似 `your-resume-xxxx.vercel.app` 的免费域名

6. **配置自定义域名（可选）**：
   - 在Vercel项目设置中找到"Domains"选项
   - 添加您的自定义域名（例如：`resume.yourdomain.com`）
   - 按照Vercel提供的DNS记录配置指引，在您的域名注册商处添加相应的DNS记录
   - 等待DNS记录生效（通常需要几分钟到几小时）
   - Vercel会自动为您的域名配置SSL证书，提供HTTPS支持

### 2. Netlify 部署

Netlify 也是一个流行的静态网站托管平台，同样提供简单的部署流程和免费的基本服务。

**部署步骤：**

1. 访问 [Netlify官网](https://www.netlify.com/) 并使用您的GitHub/GitLab/Gitee账号登录

2. 点击"Add new site"按钮，选择"Import an existing project"

3. 选择您的代码托管平台，然后从列表中选择您的简历项目仓库

  在构建配置页面，设置以下选项：
   - Branch to deploy: `main` 或您的主要分支
   - Build Command: `pnpm build`
   - Publish directory: `dist/static`
   - Framework preset: 选择 Vite 或 Create React App

  5. 点击"Deploy site"按钮，等待部署完成

6. 部署成功后，您将获得一个类似 `your-resume-name.netlify.app` 的免费域名

7. **配置自定义域名（可选）**：
   - 在Netlify项目设置中找到"Domain settings"选项
   - 添加您的自定义域名
   - 按照Netlify提供的DNS记录配置指引完成设置
   - Netlify会自动为您配置SSL证书

### 3. GitHub Pages 部署

如果您希望直接在GitHub上托管您的简历，可以使用GitHub Pages功能。

**部署步骤：**

1. 首先，修改 `vite.config.ts` 文件，添加base配置（确保该文件有写权限）：
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/', // 替换为您的仓库名称
     // 其他配置保持不变
   })
   ```

2. 在项目根目录创建一个 `deploy.sh` 脚本文件，内容如下：
   ```bash
   #!/usr/bin/env bash
   # 确保脚本抛出遇到的错误
   set -e
   
   # 构建项目
   pnpm build
   
   # 进入构建产物目录
   cd dist/static
   
   # 如果是发布到自定义域名，请取消下面这行的注释并替换为您的域名
   # echo 'www.yourdomain.com' > CNAME
   
   git init
   git add -A
   git commit -m 'deploy to GitHub Pages'
   
   # 推送到 GitHub Pages 分支（请替换为您的仓库地址）
   git push -f git@github.com:your-username/your-repo-name.git master:gh-pages
   
   cd -
   ```

3. 使脚本可执行：
   ```bash
   chmod +x deploy.sh
   ```

4. 运行部署脚本：
   ```bash
   ./deploy.sh
   ```

5. 部署完成后，在GitHub仓库的设置中，找到"Pages"选项，确保源设置为 `gh-pages` 分支

6. 等待几分钟，您的简历将可以通过 `https://your-username.github.io/your-repo-name/` 访问

### 4. 手动服务器部署

如果您有自己的服务器或VPS，也可以选择手动部署。

**部署步骤：**

1. 在本地构建项目：
   ```bash
   pnpm build
   ```

2. 构建完成后，将 `dist/static` 目录中的所有文件上传到您的服务器上的Web根目录（通常是 `/var/www/html` 或类似目录）

3. 确保您的Web服务器（如Nginx、Apache）已正确配置，指向您上传文件的目录

4. 对于Nginx，您可以使用以下基本配置：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

5. 重新加载Web服务器配置：
   ```bash
   sudo systemctl reload nginx
   ```

6. （推荐）为您的域名配置SSL证书，启用HTTPS，可以使用Let's Encrypt提供的免费证书

## 环境变量配置

本项目目前不需要特殊的环境变量配置，所有数据都存储在浏览器的localStorage中。这意味着：

1. 所有简历内容（个人信息、项目经历等）都存储在访问者的浏览器本地
2. 管理后台的更改只会影响您自己的浏览器数据
3. 如果需要实现多用户数据同步，您可能需要添加后端服务和数据库支持

## 部署后的维护

成功部署后，您可以通过以下方式维护您的网站：

1. **更新内容**：通过管理后台(`/admin/login`，用户名: `admin`，密码: `admin123`)更新您的个人信息、项目和实习经历
    
2. **监控网站状态**：
   - Vercel和Netlify都提供内置的网站监控工具
   - 您也可以使用Uptime Robot等第三方服务监控网站可用性
    
3. **网站性能优化**：
   - 压缩图片文件大小
   - 考虑使用CDN加速静态资源
   - 定期更新项目依赖，确保安全性和性能

4. **数据备份**：
   - 定期通过管理后台导出您的数据
   - 您可以手动备份localStorage中的数据：打开浏览器控制台，输入 `localStorage.getItem('personalInfo')` 等命令获取数据

## 常见问题解答

### Q: 部署后管理后台还能正常使用吗？
A: 是的，管理后台功能完全不受部署方式影响，您仍然可以通过 `/admin/login` 访问并更新简历内容。

### Q: 为什么我更新了内容，但别人访问时没有看到变化？
A: 这是因为所有数据都存储在浏览器的localStorage中。您的更改只会影响您自己的浏览器，其他人需要在他们的浏览器中重新输入数据。如果需要实现数据同步，您需要添加后端服务。

### Q: 如何让我的网站在搜索引擎中被发现？
A: 您可以：
1. 添加适当的meta标签和结构化数据到`index.html`
2. 创建sitemap.xml文件并提交到Google Search Console、Bing Webmaster Tools等搜索引擎平台
3. 确保您的网站内容具有良好的SEO优化（合适的标题、描述、关键词等）

### Q: 部署后访问速度很慢怎么办？
A: 提升访问速度的方法包括：
1. 使用CDN加速静态资源
2. 优化图片大小和格式
3. 减少不必要的JavaScript和CSS
4. 启用Gzip压缩
5. 考虑使用Vercel或Netlify等提供全球CDN的平台

### Q: 网站可以在移动设备上正常显示吗？
A: 是的，这个简历网站采用了响应式设计，可以在手机、平板和桌面设备上良好显示。

如果您在部署过程中遇到任何问题，请参考相应平台的官方文档或在搜索引擎中搜索解决方案。
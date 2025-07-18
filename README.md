# ShipAny Template One

Ship Any AI SaaS Startups in hours.
在数小时内启动任何 AI SaaS 初创项目。

![preview](preview.png)

## Quick Start 快速启动

1. Clone the repository
克隆代码

```bash
git clone https://github.com/shipanyai/shipany-template-one.git
```

2. Install dependencies
安装依赖
安装nodejs, npm
Install nodejs, npm
安装pnpm和加载依赖
Install pnpm and load dependencies

```bash
npm install -g pnpm --legacy-peer-deps
pnpm install
```

3. Run the development server
运行开发服务器

```bash
pnpm dev
```

## Customize
自定义

- Set your environment variables
设置你的环境变量

```bash
cp .env.example .env.development
```

- Set your theme in `src/app/theme.css`
在 `src/app/theme.css` 中设置你的主题

[tweakcn](https://tweakcn.com/editor/theme)

- Set your landing page content in `src/i18n/pages/landing`
在 `src/i18n/pages/landing` 中设置你的首页内容

- Set your i18n messages in `src/i18n/messages`
在 `src/i18n/messages` 中设置你的多语言消息

## Deploy
部署

- Deploy to Vercel
部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshipanyai%2Fshipany-template-one&project-name=my-shipany-project&repository-name=my-shipany-project&redirect-url=https%3A%2F%2Fshipany.ai&demo-title=ShipAny&demo-description=Ship%20Any%20AI%20Startup%20in%20hours%2C%20not%20days&demo-url=https%3A%2F%2Fshipany.ai&demo-image=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FGgGSW3La8AAGJgU%3Fformat%3Djpg%26name%3Dlarge)

- Deploy to Cloudflare
部署到 Cloudflare

for new project, clone with branch "cloudflare"
对于新项目，使用 "cloudflare" 分支进行克隆

```shell
git clone -b cloudflare https://github.com/shipanyai/shipany-template-one.git
```

for exist project, checkout to branch "cloudflare"
对于已有项目，切换到 "cloudflare" 分支

```shell
git checkout cloudflare
```

1. Customize your environment variables
自定义你的环境变量

```bash
cp .env.example .env.production
cp wrangler.toml.example wrangler.toml
```

edit your environment variables in `.env.production`
在 `.env.production` 文件中编辑你的环境变量

and put all the environment variables under `[vars]` in `wrangler.toml`
并将所有环境变量放在 `wrangler.toml` 文件的 `[vars]` 下

2. Deploy
部署

```bash
npm run cf:deploy
```

## Community
社区

- [ShipAny](https://shipany.ai)
- [Documentation](https://docs.shipany.ai)

## License
许可证

- [ShipAny AI SaaS Boilerplate License Agreement](LICENSE)


# 项目主要功能说明

本项目是一个基于 Next.js 和 TypeScript 的多语言网站应用，主要实现以下功能：

- 支持多语言（包括英语、简体中文、繁体中文、韩语、日语、俄语、法语、德语、意大利语、葡萄牙语、西班牙语）切换和国际化内容展示。
- 用户注册、登录、认证（集成 next-auth）。
- 支持 Stripe 支付功能，用户可在线购买服务或产品。
- 提供丰富的前端页面和组件，采用 Tailwind CSS 和 Shadcn UI 实现响应式设计。
- 提供后台管理功能，包括用户、订单、反馈等管理。
- 支持 API 接口，供前端与后端数据交互。
- 采用 React Context 进行全局状态管理。
- 具备详细的页面布局、区块组件、数据模型、服务逻辑等模块化设计，便于维护和扩展。

---


# 目录结构与说明

## 1. src 目录

### 1.1 src/app/
- **含义**：Next.js 应用的主目录，包含所有页面、API 路由、全局样式等。
- **主要用途**：负责页面渲染、路由、API 接口、全局样式等核心功能。

#### 1.1.1 src/app/[locale]/
- **含义**：多语言页面目录，按不同语言分文件夹。
- **主要用途**：支持不同语言的页面内容和路由。

#### 1.1.2 src/app/[locale]/(admin)/
- **含义**：后台管理相关页面。
- **主要用途**：实现后台管理功能，如用户、订单、反馈、文章等管理页面。

#### 1.1.3 src/app/[locale]/(default)/
- **含义**：普通用户前台页面。
- **主要用途**：展示用户操作相关页面，如控制台、价格、展示、文章等。

#### 1.1.4 src/app/api/
- **含义**：API 路由目录。
- **主要用途**：实现后端接口，如用户信息、支付、反馈、演示等。

---

### 1.2 src/components/
- **含义**：前端 React 组件目录。
- **主要用途**：存放所有可复用的 UI 组件和页面区块。

#### 1.2.1 src/components/blocks/
- **含义**：页面区块组件。
- **主要用途**：如头部、底部、功能区、展示区、表单、价格、统计等页面常用区块。

#### 1.2.2 src/components/ui/
- **含义**：基础 UI 组件。
- **主要用途**：如按钮、输入框、表单、弹窗、标签、头像、表格等基础组件，便于复用。

#### 1.2.3 src/components/dashboard/
- **含义**：仪表盘相关组件。
- **主要用途**：实现后台仪表盘的布局、侧边栏、表单、表格等功能。

#### 1.2.4 src/components/console/
- **含义**：控制台相关组件。
- **主要用途**：实现用户控制台的布局、侧边栏、表单、表格等功能。

---

### 1.3 src/contexts/
- **含义**：React 全局上下文目录。
- **主要用途**：用于全局状态管理，如应用主题、用户信息等。

---

### 1.4 src/i18n/
- **含义**：国际化相关目录。
- **主要用途**：存放多语言配置、翻译文件、路由国际化等。

#### 1.4.1 src/i18n/messages/
- **含义**：全局多语言消息文件。
- **主要用途**：存放各语言的全局翻译内容。

#### 1.4.2 src/i18n/pages/
- **含义**：页面级多语言文件。
- **主要用途**：针对不同页面的多语言翻译内容。

---

### 1.5 src/models/
- **含义**：数据模型目录。
- **主要用途**：定义和操作数据库中的数据模型，如用户、订单、反馈等。

---

### 1.6 src/services/
- **含义**：业务逻辑服务目录。
- **主要用途**：实现具体的业务逻辑，如用户服务、订单服务、积分服务等。

---

### 1.7 src/types/
- **含义**：TypeScript 类型定义目录。
- **主要用途**：存放全局和各模块的类型定义，提升类型安全。

#### 1.7.1 src/types/blocks/
- **含义**：区块组件类型定义。
- **主要用途**：为页面区块组件提供类型支持。

#### 1.7.2 src/types/pages/
- **含义**：页面类型定义。
- **主要用途**：为不同页面的数据结构提供类型支持。

---

### 1.8 src/lib/
- **含义**：自定义工具库目录。
- **主要用途**：存放通用工具函数，如缓存、加密、时间处理等。

---

### 1.9 src/db/
- **含义**：数据库相关目录。
- **主要用途**：数据库配置、迁移脚本、数据表结构定义等。

---

### 1.10 src/hooks/
- **含义**：自定义 React Hooks 目录。
- **主要用途**：存放项目中用到的自定义 Hook，如移动端检测、媒体查询等。

---

### 1.11 src/providers/
- **含义**：全局 Provider 目录。
- **主要用途**：如主题 Provider，提供全局上下文支持。

---

## 2. public 目录

- **含义**：静态资源目录。
- **主要用途**：存放图片、图标、logo、robots.txt、sitemap.xml 等静态文件，供前端页面直接访问。

---

## 3. 其他根目录文件

- **README.md**：项目说明文档。
- **package.json**：项目依赖和脚本配置。
- **next.config.mjs**：Next.js 配置文件。
- **tsconfig.json**：TypeScript 配置文件。
- **postcss.config.mjs**：PostCSS 配置文件。
- **vercel.json**：Vercel 部署配置文件。
- **Dockerfile**：Docker 镜像构建文件。

---

# 备注

## 主题选择：https://tweakcn.com/editor/theme
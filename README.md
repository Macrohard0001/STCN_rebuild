# 智教联盟论坛（SMART-TEACH UNION Forum）

基于 **Next.js 16 + React 19 + Prisma (SQLite) + Tailwind CSS 4** 从零重建的智教联盟论坛，
完整复刻原 Flarum 论坛（forum.smart-teach.cn）的功能与设计风格，并修复了原站的历史问题。

## 功能总览

**浏览与内容**
- 主题列表：置顶帖优先、四种排序（最新回复 / 热门主题 / 新鲜出炉 / 陈年旧贴）、分页加载更多
- 标签系统：完整镜像原站的标签树（44 个标签，父子两级，含官方简介与配色），侧栏树形导航可展开收起、按标签筛选（选父标签会包含其子标签下的主题）、发帖时分组选择标签
- 楼层流：Markdown 渲染（XSS 消毒）、引用回复、回复关系链、时间线 Scrubber 快速导航
- 搜索：头部实时下拉联想 + 搜索结果页
- 中英双语 i18n、亮/暗双主题（记忆用户偏好）、移动端响应式（860px / 520px 断点）

**账号与互动（登录后）**
- 注册 / 登录 / 退出，bcrypt 加密 + httpOnly Cookie 会话（30 天）
- 发布主题、回复、编辑 / 删除自己的帖子
- 声望投票（fof-gamification 风格，⚡等级徽章）
- 表情回应（fof-reactions 风格：👍❤️😆😮😢）
- **星标主题**（flarum/stars）：列表行星标按钮 + 主题页星标 + 「我的星标」筛选视图
- **关注主题**（flarum/subscriptions）：主题页一键关注，新回复自动通知
- **关注用户**（fof/follow-users）：个人页 / 用户卡片关注，对方发主题自动通知
- **关注标签**（fof/follow-tags）：侧栏标签一键关注，标签下新主题自动通知
- **用户设置页**（`#/settings`）：修改密码（其他会话自动下线）、个人简介、8 项通知偏好开关
- **@提及**：编辑器输入 `@` 自动补全用户，被提及者收到通知
- **用户悬浮卡片**：悬停头像 / 用户名展示等级、声望、简介、关注者数与快捷关注
- 通知中心：回复 / 提及 / 点赞 / 回应 / 投票 / 关注 / 关注联动，未读角标 30s 轮询
- 管理员：置顶 / 锁定 / 隐藏主题、编辑标题、管理任意帖子

**生产加固**
- 登录 / 注册 / 改密码限流（滑动窗口）
- 所有写操作均要求登录，权限（作者 / 管理员）服务端校验
- 输入长度上限与校验、API 响应禁缓存、`nosniff` / `Referrer-Policy` 安全响应头
- `/api/health` 健康检查端点（含数据库探活）
- XSS：Markdown 渲染经 DOMPurify 消毒；SQL 注入：Prisma 参数化查询

## 快速开始

```bash
npm install          # 或 bun install
npx prisma generate  # 生成数据库客户端
npm run dev          # 开发模式，http://localhost:3000
```

> 数据库文件位于 `db/custom.db`，`.env` 中 `DATABASE_URL=file:../db/custom.db`（相对 prisma 目录）。
> 若端口或路径有调整，仅需修改 `.env`。

## 演示账号

| 账号 | 密码 | 说明 |
|------|------|------|
| `admin` | `12345678` | 管理员（可置顶 / 锁定 / 删除主题） |
| `test01` ~ `test04` | `12345678` | 测试用户（含星标 / 关注 / 通知演示数据） |

种子数据为**功能测试环境**：1 个管理员 + 4 个测试账号、44 个镜像自原站的真实标签、
5 篇功能测试主题（含测试公告、互动演示帖）与少量互动数据。
所有帖子均为明确的测试内容，不虚构任何真实用户发言。

> 更换为正式环境时：注册真实管理员账号后，删除 `test01`~`test04` 与测试帖即可（管理员可在界面直接操作）。

## 重置数据库

```bash
bun prisma/seed.ts   # 或 npx tsx prisma/seed.ts
```

## 生产部署

```bash
npm run build        # 构建独立产物（standalone）
npm start            # 默认以 3000 端口启动
```

- `npm start` 使用 `.next/standalone/server.js`（bun 或 node 均可）。
- 建议前置 Nginx / Caddy 做 HTTPS 反代，并开启 HTTP 缓存静态资源。
- 健康检查：`GET /api/health` → `{"ok":true}`。
- 首次部署确认 `.env` 的 `DATABASE_URL` 指向正确的数据库文件路径。

## 技术栈

Next.js 16 (App Router) · React 19 · TypeScript 5 · Prisma + SQLite · Tailwind CSS 4 ·
zustand · marked + isomorphic-dompurify · bcryptjs

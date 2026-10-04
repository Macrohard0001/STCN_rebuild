/**
 * 智教联盟论坛 — 种子数据（测试环境）
 *
 * - 标签：完整镜像原站 forum.smart-teach.cn 的标签树（名称/slug/颜色/简介/父子关系），
 *   共 44 个标签，描述文字取自原站官方数据
 * - 用户：1 个管理员 + 4 个测试账号（密码均为 12345678）
 * - 内容：少量高质量功能测试帖，不虚构任何"真实用户发言"
 *
 * 运行: bun prisma/seed.ts   (或 npx tsx prisma/seed.ts)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const HOUR = 3600 * 1000;
const now = Date.now();
const ago = (h: number) => new Date(now - h * HOUR);

/* ------------------------------------------------------------------ */
/* 标签树 — 镜像自原站 /api/tags（2026-10）                              */
/* ------------------------------------------------------------------ */
interface TagSeed {
  name: string;
  slug: string;
  color: string;
  parent: string | null;
  description: string;
}

const TAG_TREE: TagSeed[] = [
  { name: "ClassIsland", slug: "classisland", color: "#00bfff", parent: "courseScheduleApp", description: "一款适用于班级多媒体屏幕的课表的信息显示工具，可以一目了然地显示各种信息。" },
  { name: "Inkways", slug: "inkways", color: "#00A76F", parent: "inkApp", description: "Inkways 是一款由 iNKORE Studios 开发的集成式墨迹套件，你可以将它用于记录笔记，文稿演示，批注演示文稿，视频展台等，旨在将 Ink，Presentation，Flow 等核心概念融合在一起并无缝带入到生活和工作流程的各个角落。" },
  { name: "CSES规范", slug: "cses", color: "#d60000", parent: "schema", description: "课程计划可交换格式，由社区支持，具有各语言的支持库" },
  { name: "Class Widgets", slug: "class-widgets", color: "#00C2D0", parent: "courseScheduleApp", description: "一款能够显示当前课程的桌面组件应用程序。其提供了易用课程表编辑和美观的桌面组件。" },
  { name: "智绘教Inkeys", slug: "inkeys", color: "#ff6e42", parent: "inkApp", description: "Windows 屏幕批注工具，拥有高效批注和丰富功能，让屏幕演示变得简单，让教学授课变得高效，适用于触摸设备和PC端。" },
  { name: "规范", slug: "schema", color: "#feb4b4", parent: null, description: "该类别包含所有值得讨论的教育领域开发规范。" },
  { name: "课表软件", slug: "courseScheduleApp", color: "#49e9e6", parent: null, description: "该类别包含所有课程表软件，也包含和计划强相关的软件。" },
  { name: "屏幕批注软件", slug: "inkApp", color: "#0b4c18", parent: null, description: "该类别包含所有用于在屏幕上批注的软件。" },
  { name: "技术分享", slug: "tech-stacks", color: "#00ffbf", parent: null, description: "该类别包含部分开发相关技术，可以在此讨论。" },
  { name: "ExamAware", slug: "examaware", color: "#669d34", parent: "courseScheduleApp", description: "一款能在考试时显示考试信息的跨平台软件。" },
  { name: "站务版", slug: "siteaffairs", color: "#668299", parent: null, description: "站务版是管理团队发布网站重要信息（公告、规则、活动、广告等）的地方，普通用户无法在此发帖。" },
  { name: "灌水区", slug: "relevantaffairs", color: "#668299", parent: null, description: "灌水区可以发布水帖，其话题应当具有足够信息量、值得讨论，且和电教管理、学习生活有关。" },
  { name: "公告", slug: "announcement", color: "#ea0bbe", parent: "siteaffairs", description: "此板块发布所有有关智教联盟服务的维护公告。" },
  { name: "OrbiBoard", slug: "orbiboard", color: "#136864", parent: "generalAuxTool", description: "" },
  { name: "综合辅助工具", slug: "generalAuxTool", color: "#5e4140", parent: null, description: "本板块包含教育相关用途的综合工具。" },
  { name: "Ink-Canvas-Plus", slug: "ink-canvas-plus", color: "#353435", parent: "inkApp", description: "Ink Canvas Plus (IC+) 是一款由 Clover Yan 维护的屏幕批注软件。" },
  { name: "ZongziTEK 黑板贴", slug: "zongzitek", color: "#00f2f8", parent: "generalAuxTool", description: "用于白板一体机的桌面部件，有小黑板（布置作业）、启动台、课程表等功能。" },
  { name: "ElectronClassSchedule", slug: "ECS", color: "#ff3a3a", parent: "courseScheduleApp", description: "电子桌面课程表，可用于学校电子白板。" },
  { name: "StickyHomeworks2", slug: "stickyhomeworks2", color: "#ffb400", parent: "generalAuxTool", description: "StickyHomeworks2 是一款用于展示作业的工具。" },
  { name: "全能班辅", slug: "qnbf", color: "#0a0472", parent: "generalAuxTool", description: "一款用于班级大屏的集班级管理与辅助教师使用一体机的软件，拥有课表，上下课提醒等功能。" },
  { name: "问题求助专区", slug: "faq-section", color: "#6b1852", parent: null, description: "任何问题均可以在此处求助。本板块允许楼主与管理员选择最佳答案。" },
  { name: "资源共享区", slug: "resource-share", color: "#dd9454", parent: null, description: "共享一些一体机维护资源。禁止分享任何盗版/破解版/开心版以及来路不明的软件。" },
  { name: "经验交流区", slug: "experience-share", color: "#5e2433", parent: null, description: "交流维护经验。" },
  { name: "论坛规则", slug: "forum-rules", color: "#0a669b", parent: "siteaffairs", description: "论坛发言规则。" },
  { name: "活动专区", slug: "activities", color: "#49485e", parent: null, description: "论坛举办的活动等。" },
  { name: "支持库", slug: "supporter", color: "#e96df2", parent: "schema", description: "本板块对于各类规范提供实现的支持库的相关讨论内容。" },
  { name: "规范工具", slug: "schemaTools", color: "#c9abb5", parent: "schema", description: "本板块包含对于规范及其支持库和衍生产品的利用可能借助到的工具的讨论。" },
  { name: "Ink-Canvas-Artistry", slug: "ica", color: "#b1ef5b", parent: "inkApp", description: "InkCanvas 出色的 WPF/C# 实现，由 WXRIW 原作改编。" },
  { name: "InkCanvas", slug: "ic", color: "#abb9db", parent: "inkApp", description: "InkCanvas 系列开山鼻祖，WXRIW 官方原作。" },
  { name: "AI生成", slug: "ai-generate", color: "#2f758c", parent: null, description: "由AI辅助生成的内容。不建议单独使用本标签发帖。" },
  { name: "ICE冰核智能教务", slug: "ice", color: "#6fba2c", parent: "generalAuxTool", description: "该系统为课堂课程表管理提供智能化支持，创造性地对传统电子课表软件的课表管理逻辑进行了改进。" },
  { name: "InkCanvasForClass Community Edition", slug: "icc-ce", color: "#00FFFF", parent: "inkApp", description: "基于ICC延续开发的一款更好用的屏幕批注软件。" },
  { name: "其他社区与平台", slug: "otherPlatform", color: "#1c4382", parent: null, description: "本板块包含其他智教联盟旗下和其他所有者的社区与平台，定位和面向不同的人群。" },
  { name: "电教委员指南", slug: "CNEL", color: "#334FAE", parent: "otherPlatform", description: "教你如何做一名优秀的电教委员。" },
  { name: "SecRandom", slug: "secrandom", color: "#ccf7ff", parent: "generalAuxTool", description: "一款简洁、便捷、高效、多功能的点名软件。" },
  { name: "Dlass", slug: "dlass", color: "#2e5dea", parent: "generalAuxTool", description: "一个教师与白板即时通信平台与班级下学生社区。" },
  { name: "HugoAura", slug: "hugoaura", color: "#009EFF", parent: "generalAuxTool", description: "下一代希沃管家修改方案。" },
  { name: "Classworks", slug: "classworks", color: "#f5e0bb", parent: "generalAuxTool", description: "Classworks 项目集群，包括 Classworks 作业板等。" },
  { name: "课堂窗-ClassWindow", slug: "classwindow", color: "#FFFFFF", parent: "generalAuxTool", description: "一个美丽，精巧的桌面悬浮窗。" },
  { name: "万演", slug: "kazuha", color: "#3275f5", parent: "generalAuxTool", description: "一款适用于PowerPoint演示的综合辅助工具。" },
  { name: "ClassScreenLock", slug: "classscreenlock", color: "#daeeff", parent: "generalAuxTool", description: "为班级大屏电脑打造的一款安全防护工具，实现设备锁保护，守护教学用机使用安全与整洁。" },
  { name: "阑山桌面", slug: "LanMountainDesktop", color: "#2A9D8F", parent: "generalAuxTool", description: "一个现代化的组件化桌面/信息看板。" },
  { name: "AssignSticker", slug: "assignsticker", color: "#0cb5df", parent: "generalAuxTool", description: "一款使用Pywebview的桌面作业看板。" },
  { name: "莫宁岛", slug: "MornheIsland", color: "#A6C2F7", parent: "generalAuxTool", description: "ClassIsland 的非官方集控服务器，提供强大的管理能力和高度自定义化的控制。" },
];

/* ------------------------------------------------------------------ */
/* 用户 — 测试账号                                                      */
/* ------------------------------------------------------------------ */
const USERS = [
  { username: "admin", email: "admin@smart-teach.cn", role: "admin", color: "#4D6FA8", score: 25, joinedH: 240 * 24, seenH: 2, bio: "智教联盟管理团队" },
  { username: "test01", email: "test01@smart-teach.cn", color: "#237BB0", score: 12, joinedH: 90 * 24, seenH: 5, bio: "测试账号 · 折腾课表软件中" },
  { username: "test02", email: "test02@smart-teach.cn", color: "#C6746B", score: 6, joinedH: 60 * 24, seenH: 8, bio: "测试账号 · 正在体验论坛功能" },
  { username: "test03", email: "test03@smart-teach.cn", color: "#6cae4d", score: 9, joinedH: 45 * 24, seenH: 3, bio: "测试账号 · 维护工具清单" },
  { username: "test04", email: "test04@smart-teach.cn", color: "#B0954D", score: 4, joinedH: 20 * 24, seenH: 30, bio: "测试账号" },
];

/* ------------------------------------------------------------------ */
/* 测试主题                                                            */
/* ------------------------------------------------------------------ */
interface ReplySeed {
  author: string;
  content: string;
  hoursAgo: number;
  replyTo?: number; // post number
}
interface DiscSeed {
  key: string;
  title: string;
  author: string;
  tags: string[];
  createdAtH: number;
  editedH?: number;
  sticky?: boolean;
  views: number;
  content: string;
  replies: ReplySeed[];
}

const DISCS: DiscSeed[] = [
  {
    key: "d1",
    title: "智教联盟论坛（新版）测试公告",
    author: "admin",
    tags: ["announcement"],
    createdAtH: 50,
    sticky: true,
    views: 85,
    content: `大家好，我是本站管理员。

老论坛基于 Flarum 搭建，运行多年后版本老旧、历史遗留问题较多，搜索等功能长期无法正常使用。为了给大家一个更稳定的讨论环境，我们基于 Next.js 对论坛进行了整体重建，目前新站已进入公开测试阶段。

## 已实现的功能

- **主题与楼层**：Markdown 排版、引用回复、时间线快速跳转、草稿自动保存
- **互动**：声望投票、表情回应、@提及（输入 @ 后可搜索用户）
- **登录后功能**：星标主题、关注主题、关注用户、关注标签，全部联动通知中心
- **个性化**：亮色/暗色主题、简体中文/English、通知偏好与资料设置
- **管理**：置顶、锁定、隐藏等基础管理操作

## 测试期间请大家帮忙

1. 注册一个账号，体验发帖、回复、投票与表情回应；
2. 试试星标与关注（主题 / 用户 / 标签），确认通知是否及时准确；
3. 切换暗色模式与 English，检查样式和文案；
4. 用手机访问，看看响应式布局是否正常。

## 几点说明

- 本站目前是测试环境，数据可能随版本更新重置，请不要发布只存在本地的重要内容；
- 原 Flarum 站的历史数据尚未迁移，方案确定后会另行公告；
- 目前帖子内容均为功能测试数据，与任何真实用户无关。

遇到问题欢迎直接在本帖回复，或在「问题求助专区」发帖并 @admin。感谢每一位帮忙测试的朋友！`,
    replies: [
      { author: "test01", hoursAgo: 44, content: "收到！已注册试了一圈：发帖、星标、通知、暗色模式都正常，体验比老站流畅不少。期待历史数据迁移方案。" },
      { author: "test02", hoursAgo: 40, content: "咨询一下：测试阶段注册需要邀请码吗？想拉同学一起来测。" },
      { author: "admin", hoursAgo: 30, replyTo: 3, content: "暂时不需要，目前开放注册。后续如有调整会提前在本帖更新。" },
    ],
  },
  {
    key: "d2",
    title: "用 Next.js 重建论坛：技术选型与实现要点",
    author: "admin",
    tags: ["tech-stacks"],
    createdAtH: 140,
    views: 42,
    content: `趁着测试阶段，把这次重建的技术选型和几个实现要点记录下来，方便感兴趣的朋友交流，也欢迎指正。

## 技术栈

- **框架**：Next.js（App Router）+ React
- **数据库**：Prisma ORM + SQLite，单文件数据库便于备份与迁移
- **认证**：密码哈希 + httpOnly Cookie 会话
- **排版**：Markdown 渲染，服务端统一消毒，防 XSS
- **状态管理**：zustand

## 几个实现要点

**通知扇出**：回复、@提及、关注（用户 / 标签 / 主题）都会产生通知，扇出逻辑统一收敛在服务端，按接收人的通知偏好过滤，避免打扰。

**声望投票**：参考 fof-gamification 的计分思路，帖子收到赞/踩时同步维护作者的声望值。

**内容安全**：所有用户输入在渲染前经过白名单消毒，代码块、图片、引用都走受支持的标签。

后续计划补全部署文档，并完善数据库备份方案。有建议欢迎回复。`,
    replies: [
      { author: "test03", hoursAgo: 120, content: "想请教一下：目前页面是客户端渲染为主吗？弱网环境下首屏体验怎么样？" },
      { author: "admin", hoursAgo: 96, replyTo: 2, content: "对，主体是客户端 SPA。首屏有骨架屏兜底，列表数据也有缓存，后续计划对列表页做流式渲染优化。" },
    ],
  },
  {
    key: "d3",
    title: "大家平时都用哪些课表软件？",
    author: "test01",
    tags: ["relevantaffairs", "courseScheduleApp"],
    createdAtH: 70,
    views: 66,
    content: `最近在给班级大屏换课表软件，想听听大家的搭配。

我目前在用 **ClassIsland**，单屏信息密度很够用，课表、倒计时、天气预报一屏全放得下。之前也试过 **Class Widgets**，组件样式更细腻，不过当时编辑器用得还不太顺手。

大家的方案是什么？欢迎分享一下使用心得和踩坑记录，给其他同学做个参考。`,
    replies: [
      { author: "test02", hoursAgo: 60, content: "我们班用的 Class Widgets，主要看中桌面组件的样式，新版的课程表编辑器已经好用很多了。" },
      { author: "test03", hoursAgo: 48, content: "智绘教 Inkeys + ClassIsland 的组合：批注和课表各管各的，互不干扰，上课体验比较稳。" },
      { author: "test04", hoursAgo: 36, content: "用过 ElectronClassSchedule，主打轻量，机房里的老机器也能跑得动。" },
    ],
  },
  {
    key: "d4",
    title: "功能测试：@提及、引用回复与表情回应",
    author: "test02",
    tags: ["faq-section"],
    createdAtH: 26,
    views: 31,
    content: `正式灌水之前，先把论坛的互动功能完整测一遍，顺便给大家做个演示。

@test01 请查收这条提及，你的通知中心应该会出现一条未读。

下面演示引用回复（点击楼层右上角的「引用」按钮即可带上原帖内容）：

> 大家平时都用哪些课表软件？

以及表情回应：把鼠标悬停在「回应」按钮上，可以选择不同的表情；声望投票则会直接影响作者的声望值。

有疑问的同学直接回复本帖即可。`,
    replies: [
      { author: "test01", hoursAgo: 20, content: "收到提及，通知已经到达，体验正常。" },
      { author: "test03", hoursAgo: 12, replyTo: 1, content: "引用样式确认无误。表情回应也试了一下，悬停选择面板正常弹出。" },
    ],
  },
  {
    key: "d5",
    title: "电教常用工具清单（测试数据，持续整理中）",
    author: "test03",
    tags: ["resource-share"],
    createdAtH: 300,
    editedH: 200,
    views: 120,
    content: `整理了一份电教管理常用工具清单，本帖同时用于测试资源区的排版效果。以下介绍均取自各项目官方说明。

## 课表显示

- **ClassIsland** —— 适用于班级多媒体屏幕的课表信息显示工具，可以一目了然地显示各种信息
- **Class Widgets** —— 桌面课表组件应用，提供易用的课程表编辑器和美观的桌面组件
- **ElectronClassSchedule** —— 电子桌面课程表，可用于学校电子白板

## 屏幕批注

- **智绘教 Inkeys** —— Windows 屏幕批注工具，拥有高效批注和丰富功能
- **InkCanvas 系列** —— 老牌批注方案，社区维护多个分支（Ink-Canvas-Plus、Ink-Canvas-Artistry 等）

## 班级辅助

- **ZongziTEK 黑板贴** —— 用于白板一体机的桌面部件：小黑板（布置作业）、启动台、课程表
- **SecRandom** —— 简洁、便捷、高效、多功能的点名软件

欢迎大家回复补充，我会不定期更新到正文。`,
    replies: [
      { author: "test01", hoursAgo: 240, content: "补充一个：**ExamAware**，一款能在考试时显示考试信息的跨平台软件。" },
      { author: "test03", hoursAgo: 8, content: "已把 ExamAware 加进正文，感谢补充。清单持续收集中，欢迎继续回复。" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 互动演示数据                                                         */
/* ------------------------------------------------------------------ */

// [主题key, 楼层号, 用户, 值] — 声望投票
const VOTES: [string, number, string, number][] = [
  ["d5", 1, "test01", 1],
  ["d5", 1, "test04", 1],
  ["d5", 1, "admin", 1],
  ["d3", 1, "test02", 1],
  ["d3", 1, "test03", 1],
  ["d4", 1, "test01", 1],
  ["d4", 1, "test03", 1],
  ["d2", 1, "test01", 1],
  ["d4", 2, "admin", 1],
];

// [主题key, 楼层号, 用户, 表情] — 表情回应
const REACTIONS: [string, number, string, string][] = [
  ["d3", 1, "test02", "like"],
  ["d3", 1, "test04", "heart"],
  ["d4", 1, "test01", "like"],
  ["d4", 1, "test03", "laugh"],
  ["d4", 2, "admin", "like"],
  ["d5", 1, "test04", "like"],
  ["d5", 1, "test02", "surprise"],
];

// 星标（flarum/stars）
const STARRED: [string, string][] = [
  ["d1", "test01"],
  ["d3", "test01"],
  ["d5", "test02"],
  ["d3", "test03"],
];

// 订阅 / 关注主题（flarum/subscriptions）
const SUBSCRIBED: [string, string][] = [
  ["d1", "admin"],
  ["d1", "test01"],
  ["d1", "test02"],
  ["d4", "test02"],
  ["d4", "test03"],
  ["d4", "admin"],
  ["d3", "test04"],
];

// 关注用户（fof/follow-users）
const USER_FOLLOWS: [string, string][] = [
  ["test02", "test01"],
  ["test03", "test01"],
  ["test01", "admin"],
  ["test04", "test03"],
];

// 关注标签（fof/follow-tags）
const TAG_FOLLOWS: [string, string][] = [
  ["test01", "relevantaffairs"],
  ["test01", "tech-stacks"],
  ["test02", "announcement"],
  ["test03", "inkApp"],
  ["test04", "courseScheduleApp"],
];

// 最佳答案（fof/best-answer）— 楼主将某条回复选为最佳答案：[主题, 楼层]
const BEST_ANSWERS: [string, number][] = [
  ["d3", 2], // test01 将 test02 的 Class Widgets 回复选为最佳答案
];

// 举报演示（flarum/flags）— [主题, 楼层, 举报人, 原因, 补充说明]
const FLAGS: [string, number, string, string, string][] = [
  ["d5", 2, "test04", "other", "测试数据：用于验证举报队列与后台处理流程，管理员可直接忽略。"],
];

// 已读进度（flarum core read tracking）— [主题, 用户, 最后读到的楼层]
const READ_STATE: [string, string, number][] = [
  ["d1", "test01", 3], // d1 共 4 楼 → test01 还有 1 条未读
  ["d1", "test02", 4],
  ["d4", "test02", 1], // d4 共 3 楼 → test02 还有 2 条未读
  ["d4", "test03", 3],
  ["d3", "test04", 2],
];

/* ------------------------------------------------------------------ */
/* 执行                                                                 */
/* ------------------------------------------------------------------ */
async function main() {
  console.log("Cleaning database...");
  await db.notification.deleteMany();
  await db.flag.deleteMany();
  await db.postRevision.deleteMany();
  await db.postReaction.deleteMany();
  await db.postVote.deleteMany();
  await db.discussionState.deleteMany();
  await db.userFollow.deleteMany();
  await db.tagFollow.deleteMany();
  await db.post.deleteMany();
  await db.tagDiscussion.deleteMany();
  await db.discussion.deleteMany();
  await db.tag.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();

  console.log("Seeding tags (mirrored from forum.smart-teach.cn)...");
  const tagIds: Record<string, string> = {};
  for (const [i, t] of TAG_TREE.entries()) {
    const created = await db.tag.create({
      data: {
        name: t.name,
        slug: t.slug,
        color: t.color,
        description: t.description || null,
        position: i,
      },
    });
    tagIds[t.slug] = created.id;
  }
  // second pass: link parents (children may appear before parents in the list)
  for (const t of TAG_TREE) {
    if (t.parent) {
      await db.tag.update({
        where: { slug: t.slug },
        data: { parentId: tagIds[t.parent] },
      });
    }
  }

  console.log("Seeding users...");
  const pw = await bcrypt.hash("12345678", 10);
  const users: Record<string, string> = {};
  for (const u of USERS) {
    const c = await db.user.create({
      data: {
        username: u.username,
        email: u.email,
        passwordHash: pw,
        role: u.role ?? "user",
        avatarColor: u.color,
        bio: u.bio,
        score: u.score,
        createdAt: ago(u.joinedH),
        lastSeenAt: ago(u.seenH),
      },
    });
    users[u.username] = c.id;
  }

  console.log("Seeding discussions...");
  const discIds: Record<string, string> = {};
  const postIds: Record<string, Record<number, string>> = {};
  const counters: Record<string, { d: number; c: number }> = {};
  for (const u of Object.keys(users)) counters[u] = { d: 0, c: 0 };

  for (const D of DISCS) {
    const createdAt = ago(D.createdAtH);
    const disc = await db.discussion.create({
      data: {
        title: D.title,
        authorId: users[D.author],
        createdAt,
        lastPostedAt: createdAt,
        commentCount: 1,
        viewCount: D.views,
        isSticky: !!D.sticky,
        stickyOrder: D.sticky ? 0 : undefined,
        tags: { create: D.tags.map((s) => ({ tagId: tagIds[s] })) },
        states: { create: { userId: users[D.author], subscribed: true } },
      },
    });
    discIds[D.key] = disc.id;
    postIds[D.key] = {};

    const op = await db.post.create({
      data: {
        number: 1,
        discussionId: disc.id,
        authorId: users[D.author],
        content: D.content,
        createdAt,
        editedAt: D.editedH ? ago(D.editedH) : null,
      },
    });
    postIds[D.key][1] = op.id;
    counters[D.author].d += 1;
    counters[D.author].c += 1;

    let n = 1;
    for (const r of D.replies) {
      n += 1;
      const at = ago(r.hoursAgo);
      const parentPost = r.replyTo ? postIds[D.key][r.replyTo] : undefined;
      const p = await db.post.create({
        data: {
          number: n,
          discussionId: disc.id,
          authorId: users[r.author],
          content: r.content,
          createdAt: at,
          replyToPostId: parentPost ?? null,
        },
      });
      postIds[D.key][n] = p.id;
      await db.discussion.update({
        where: { id: disc.id },
        data: { lastPostedAt: at, commentCount: { increment: 1 } },
      });
      counters[r.author].c += 1;
    }
  }

  console.log("Seeding interactions...");
  for (const [dk, num, uname, value] of VOTES) {
    await db.postVote.create({
      data: { postId: postIds[dk][num], userId: users[uname], value, createdAt: ago(6) },
    });
  }
  for (const [dk, num, uname, type] of REACTIONS) {
    await db.postReaction.create({
      data: { postId: postIds[dk][num], userId: users[uname], type, createdAt: ago(5) },
    });
  }
  for (const [dk, uname] of STARRED) {
    await db.discussionState.upsert({
      where: { userId_discussionId: { userId: users[uname], discussionId: discIds[dk] } },
      update: { starred: true },
      create: { userId: users[uname], discussionId: discIds[dk], starred: true },
    });
  }
  for (const [dk, uname] of SUBSCRIBED) {
    await db.discussionState.upsert({
      where: { userId_discussionId: { userId: users[uname], discussionId: discIds[dk] } },
      update: { subscribed: true },
      create: { userId: users[uname], discussionId: discIds[dk], subscribed: true },
    });
  }
  for (const [follower, followee] of USER_FOLLOWS) {
    await db.userFollow.create({
      data: { followerId: users[follower], followingId: users[followee], createdAt: ago(70) },
    });
  }
  for (const [uname, slug] of TAG_FOLLOWS) {
    await db.tagFollow.create({
      data: { userId: users[uname], tagId: tagIds[slug], createdAt: ago(65) },
    });
  }

  // 最佳答案（fof/best-answer）
  console.log("Seeding best answers...");
  for (const [dk, num] of BEST_ANSWERS) {
    await db.post.update({
      where: { id: postIds[dk][num] },
      data: { isBestAnswer: true, bestAnswerSetAt: ago(30) },
    });
  }

  // 编辑历史（flarum/edit-history）：d5 楼 1 有编辑记录，补一份编辑前快照
  console.log("Seeding edit history...");
  {
    const op = await db.post.findUnique({ where: { id: postIds.d5[1] }, select: { content: true } });
    if (op) {
      await db.postRevision.create({
        data: {
          postId: postIds.d5[1],
          userId: users.test03,
          content: op.content.replace(
            "欢迎大家回复补充，我会不定期更新到正文。",
            "初版清单：前 5 项，持续补充中。\n\n—— 这是编辑前的历史版本，用于演示编辑历史功能。"
          ),
          createdAt: ago(200),
        },
      });
    }
  }

  // 举报（flarum/flags）
  console.log("Seeding flags...");
  for (const [dk, num, uname, reason, comment] of FLAGS) {
    await db.flag.create({
      data: { postId: postIds[dk][num], userId: users[uname], reason, comment, createdAt: ago(3) },
    });
  }

  // 已读进度（flarum core read tracking）
  console.log("Seeding read state...");
  for (const [dk, uname, lastNum] of READ_STATE) {
    await db.discussionState.upsert({
      where: { userId_discussionId: { userId: users[uname], discussionId: discIds[dk] } },
      update: { lastReadPostNumber: lastNum, lastReadAt: ago(20) },
      create: { userId: users[uname], discussionId: discIds[dk], lastReadPostNumber: lastNum, lastReadAt: ago(20) },
    });
  }

  console.log("Seeding notifications...");
  const notif = (userId: string, type: string, actorId: string | null, dk: string | null, postNum: number | null, hoursAgo: number, read = false) =>
    db.notification.create({
      data: {
        userId,
        type,
        actorId: actorId ?? undefined,
        discussionId: dk ? discIds[dk] : undefined,
        postId: dk && postNum ? postIds[dk][postNum] : undefined,
        createdAt: ago(hoursAgo),
        readAt: read ? ago(hoursAgo - 1) : null,
      },
    });

  await notif(users.test01, "follow", users.test02, null, null, 50);
  await notif(users.test01, "follow", users.test03, null, null, 90, true);
  await notif(users.test01, "mention", users.test02, "d4", 1, 26);
  await notif(users.test01, "vote", users.admin, "d4", 2, 10);
  await notif(users.test02, "reply", users.test01, "d4", 2, 20);
  await notif(users.test02, "bestAnswer", users.test01, "d3", 2, 30);
  await notif(users.test03, "newPost", users.test01, "d4", 2, 20);
  await notif(users.admin, "reply", users.test01, "d1", 2, 44, true);
  await notif(users.admin, "reply", users.test02, "d1", 3, 40);

  console.log("Updating user counters...");
  for (const [uname, c] of Object.entries(counters)) {
    await db.user.update({
      where: { username: uname },
      data: { discussionCount: c.d, commentCount: c.c },
    });
  }

  console.log("Done: 5 users, 44 tags, 5 discussions, 15 posts.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

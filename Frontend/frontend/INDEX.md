# 📑 CampusGo 前端文档索引

> **快速导航**: 找到你需要的文档和文件

---

## 🚀 新手入门

如果你是第一次使用本项目，请按以下顺序阅读:

1. **📖 本文件** (你正在这里)
2. **🚀 [QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - 5 分钟速成 (推荐!)
3. **📝 [FRONTEND_DEV_GUIDE.md](FRONTEND_DEV_GUIDE.md)** - 完整开发指南
4. **💻 [src/pages/merchants/MerchantsPage.tsx](src/pages/merchants/MerchantsPage.tsx)** - 代码示例

---

## 📚 文档总览

### 核心文档

| 文档 | 用途 | 长度 | 难度 |
|------|------|------|------|
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | 常用代码和API查询 | 短 | 🟢 简单 |
| **[FRONTEND_DEV_GUIDE.md](FRONTEND_DEV_GUIDE.md)** | 完整的开发指南 | 长 | 🟡 中等 |
| **[API_INTEGRATION_SUMMARY.md](API_INTEGRATION_SUMMARY.md)** | 集成总结 | 中 | 🟡 中等 |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | 项目总体概览 | 长 | 🟡 中等 |
| **[CHECKLIST.md](CHECKLIST.md)** | 完成清单和任务列表 | 长 | 🟢 简单 |
| **[DELIVERY_REPORT.md](DELIVERY_REPORT.md)** | 交付报告 | 中 | 🟢 简单 |

### 快速查找

**我想要...**

- ✅ **快速查看常用代码** → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- ✅ **了解如何开发页面** → [FRONTEND_DEV_GUIDE.md](FRONTEND_DEV_GUIDE.md#-页面开发建议)
- ✅ **查看所有 API** → [FRONTEND_DEV_GUIDE.md](FRONTEND_DEV_GUIDE.md#-api-服务使用示例)
- ✅ **知道下一步做什么** → [CHECKLIST.md](CHECKLIST.md#-后续开发建议)
- ✅ **了解认证流程** → [FRONTEND_DEV_GUIDE.md](FRONTEND_DEV_GUIDE.md#-认证流程)
- ✅ **查看交付内容** → [DELIVERY_REPORT.md](DELIVERY_REPORT.md)
- ✅ **找到文件位置** → 本文档下方的 [文件位置速查](#-文件位置速查)

---

## 📂 项目文件结构

### 新创建的文件

```
src/
├── types/
│   └── api.ts                          ← ⭐ 所有API类型定义
│
├── lib/
│   ├── authService.ts                 ← ⭐ 认证服务
│   ├── userService.ts                 ← ⭐ 用户服务
│   ├── merchantService.ts             ← ⭐ 商家服务
│   ├── runnerService.ts               ← ⭐ 配送员服务
│   ├── orderService.ts                ← ⭐ 订单服务
│   ├── paymentService.ts              ← ⭐ 支付服务
│   └── notificationService.ts         ← ⭐ 通知服务
│
├── pages/
│   ├── Login.tsx                       ← ✅ 已更新
│   └── merchants/
│       └── MerchantsPage.tsx           ← ✅ 已更新
│
├── services/api/
│   └── client.ts                       ← ✅ Axios HTTP客户端
│
└── ...

项目根目录/
├── QUICK_REFERENCE.md                  ← 📖 快速参考
├── FRONTEND_DEV_GUIDE.md               ← 📖 开发指南
├── API_INTEGRATION_SUMMARY.md          ← 📖 集成总结
├── PROJECT_SUMMARY.md                  ← 📖 项目总结
├── CHECKLIST.md                        ← 📖 完成清单
├── DELIVERY_REPORT.md                  ← 📖 交付报告
└── INDEX.md                            ← 📖 本文件
```

---

## 🔍 文件位置速查

### 当我需要...

| 需求 | 文件位置 | 描述 |
|------|---------|------|
| API 类型定义 | `src/types/api.ts` | 所有 DTO、enum 等类型 |
| 认证功能 | `src/lib/authService.ts` | login, logout, token管理 |
| 商家列表 API | `src/lib/merchantService.ts` | CRUD 操作 |
| 配送员 API | `src/lib/runnerService.ts` | 含位置更新 |
| 订单 API | `src/lib/orderService.ts` | 创建和查看订单 |
| 支付 API | `src/lib/paymentService.ts` | 支付管理 |
| 通知 API | `src/lib/notificationService.ts` | 推送消息 |
| HTTP 配置 | `src/services/api/client.ts` | Axios 拦截器 |
| 登录页面 | `src/pages/Login.tsx` | 登录界面实现 |
| 示例页面 | `src/pages/merchants/MerchantsPage.tsx` | 页面开发参考 |

---

## 📖 按主题查找

### 认证和安全
- 📚 [FRONTEND_DEV_GUIDE.md - 认证流程](FRONTEND_DEV_GUIDE.md#-认证流程)
- 📚 [FRONTEND_DEV_GUIDE.md - 令牌管理](FRONTEND_DEV_GUIDE.md#令牌存储位置)
- 📚 [PROJECT_SUMMARY.md - 安全性](PROJECT_SUMMARY.md#-安全性)
- 💻 [src/lib/authService.ts](src/lib/authService.ts)

### API 集成
- 📚 [FRONTEND_DEV_GUIDE.md - API 使用](FRONTEND_DEV_GUIDE.md#-api-服务使用示例)
- 📚 [QUICK_REFERENCE.md - API 速查](QUICK_REFERENCE.md#api-速查表)
- 📚 [PROJECT_SUMMARY.md - API 映射表](PROJECT_SUMMARY.md#-后端-api-端点映射表)
- 💻 [src/lib/*.ts](src/lib/)

### 页面开发
- 📚 [FRONTEND_DEV_GUIDE.md - 页面开发建议](FRONTEND_DEV_GUIDE.md#-开发最佳实践)
- 📚 [PROJECT_SUMMARY.md - 页面开发模板](PROJECT_SUMMARY.md#-页面开发模板)
- 💻 [src/pages/merchants/MerchantsPage.tsx](src/pages/merchants/MerchantsPage.tsx)

### 错误处理
- 📚 [QUICK_REFERENCE.md - 错误处理](QUICK_REFERENCE.md#错误处理)
- 📚 [PROJECT_SUMMARY.md - 调试技巧](PROJECT_SUMMARY.md#-调试技巧)
- 📚 [FRONTEND_DEV_GUIDE.md - 常见问题](FRONTEND_DEV_GUIDE.md#常见问题)

### 项目结构和任务
- 📚 [CHECKLIST.md - 后续开发](CHECKLIST.md#-后续开发建议)
- 📚 [PROJECT_SUMMARY.md - 后续任务](PROJECT_SUMMARY.md#-后续开发任务)
- 📚 [DELIVERY_REPORT.md - 集成步骤](DELIVERY_REPORT.md#-后续集成步骤)

---

## 🎯 按角色查找

### 🆕 新手开发者
**建议阅读顺序:**
1. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 5分钟快速上手
2. [FRONTEND_DEV_GUIDE.md](FRONTEND_DEV_GUIDE.md) - 完整指南
3. [src/pages/merchants/MerchantsPage.tsx](src/pages/merchants/MerchantsPage.tsx) - 代码示例
4. [CHECKLIST.md](CHECKLIST.md) - 了解下一步

**关键文件:**
- `src/types/api.ts` - 理解数据结构
- `src/lib/merchantService.ts` - 理解服务模式
- `src/pages/Login.tsx` - 理解完整流程

### 👨‍💻 有经验的开发者
**建议阅读顺序:**
1. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 架构概览
2. [API_INTEGRATION_SUMMARY.md](API_INTEGRATION_SUMMARY.md) - 集成细节
3. 直接查看源代码

**关键文件:**
- `src/types/api.ts` - 数据结构定义
- `src/lib/` - 服务实现
- `src/services/api/client.ts` - HTTP配置

### 🏗️ 架构师/技术负责人
**建议阅读顺序:**
1. [DELIVERY_REPORT.md](DELIVERY_REPORT.md) - 交付概览
2. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 完整架构
3. 查看 src/ 目录结构

**关键文件:**
- `PROJECT_SUMMARY.md` - 完整的技术细节
- `DELIVERY_REPORT.md` - 交付统计
- `src/` - 源代码

---

## 📋 常用代码片段位置

### 登录
```typescript
// 快速参考: QUICK_REFERENCE.md#登录
// 完整指南: FRONTEND_DEV_GUIDE.md#认证流程
// 源代码: src/pages/Login.tsx
// 服务: src/lib/authService.ts
```

### 查询商家
```typescript
// 快速参考: QUICK_REFERENCE.md#常用代码片段
// 完整指南: FRONTEND_DEV_GUIDE.md#商家服务
// 示例页面: src/pages/merchants/MerchantsPage.tsx
// 服务: src/lib/merchantService.ts
```

### 创建订单
```typescript
// 快速参考: QUICK_REFERENCE.md#常用代码片段
// 完整指南: FRONTEND_DEV_GUIDE.md#订单服务
// 服务: src/lib/orderService.ts
```

### 页面开发模板
```typescript
// 模板: PROJECT_SUMMARY.md#页面开发模板
// 完整例子: src/pages/merchants/MerchantsPage.tsx
// 类型: src/types/api.ts
```

---

## 🚀 快速开始

### 5 分钟快速开始
1. 阅读 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) (3分钟)
2. 查看 [src/pages/merchants/MerchantsPage.tsx](src/pages/merchants/MerchantsPage.tsx) (2分钟)
3. 开始编码! 🚀

### 30 分钟深度学习
1. 阅读 [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. 阅读 [FRONTEND_DEV_GUIDE.md](FRONTEND_DEV_GUIDE.md)
3. 查看源代码: `src/lib/` 和 `src/types/`
4. 尝试修改示例代码

### 1-2 小时完整学习
1. 按顺序阅读所有文档
2. 详细查看所有源代码
3. 动手实现一个简单页面

---

## 📞 故障排查

**找不到什么东西?**

1. ✅ 先检查 [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. ✅ 再检查 [文件位置速查](#-文件位置速查)
3. ✅ 查看 [按主题查找](#-按主题查找)
4. ✅ 搜索源代码中的文件名

**有技术问题?**

1. ✅ 查看 [FRONTEND_DEV_GUIDE.md - 常见问题](FRONTEND_DEV_GUIDE.md#常见问题)
2. ✅ 查看 [PROJECT_SUMMARY.md - 调试技巧](PROJECT_SUMMARY.md#-调试技巧)
3. ✅ 查看源代码注释

---

## 📊 文档统计

| 文档 | 文件名 | 行数 | 类型 |
|------|--------|------|------|
| 快速参考 | QUICK_REFERENCE.md | ~150 | 参考 |
| 开发指南 | FRONTEND_DEV_GUIDE.md | ~400 | 教程 |
| 集成总结 | API_INTEGRATION_SUMMARY.md | ~300 | 总结 |
| 项目总结 | PROJECT_SUMMARY.md | ~600 | 综合 |
| 完成清单 | CHECKLIST.md | ~350 | 任务 |
| 交付报告 | DELIVERY_REPORT.md | ~400 | 报告 |
| 本文件 | INDEX.md | ~300 | 导航 |
| **总计** | - | **~2500** | - |

---

## ✅ 交付清单

- ✅ 6 个业务服务
- ✅ 40+ 个 TypeScript 类型
- ✅ 2 个更新的页面
- ✅ 100+ 个 API 方法
- ✅ 5 份详细文档
- ✅ ~2500 行文档
- ✅ 完整的代码示例
- ✅ 快速参考指南

---

## 🎓 推荐学习路径

### 路径 1: 快速上手 (30分钟)
```
QUICK_REFERENCE.md 
  → src/types/api.ts
  → src/pages/merchants/MerchantsPage.tsx
  → 开始编码!
```

### 路径 2: 系统学习 (2小时)
```
FRONTEND_DEV_GUIDE.md
  → PROJECT_SUMMARY.md
  → 查看源代码
  → CHECKLIST.md (了解任务)
  → 开始项目!
```

### 路径 3: 深度研究 (4小时)
```
阅读所有文档
  → 研究所有源代码
  → 理解设计模式
  → 参考示例代码
  → 完全掌握框架
```

---

## 📞 联系和支持

### 文档位置
- 项目文档: 本项目根目录
- 源代码: `src/` 目录

### 外部资源
- 后端 GitHub: https://github.com/chenjiajin13/CampusGo
- React 官方文档: https://react.dev
- TypeScript 官方文档: https://www.typescriptlang.org

### 获取帮助
1. 查阅相关文档
2. 查看代码注释
3. 检查示例代码
4. 查看源代码实现

---

## 🎉 你已准备好!

你现在拥有了:
- ✅ 完整的 API 集成框架
- ✅ 详细的文档和指南
- ✅ 可运行的示例代码
- ✅ 快速参考手册
- ✅ 学习路径和任务清单

**开始构建你的 CampusGo 应用吧!** 🚀

---

## 📌 最后更新

**日期**: 2026-01-29  
**版本**: 1.0  
**状态**: ✅ 完成

**建议**: 将本文件放在浏览器书签中，作为快速导航！

---

**感谢使用 CampusGo 前端项目!** 💙

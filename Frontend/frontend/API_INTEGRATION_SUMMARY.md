# 🎯 根据后端构建前端 - 完整总结

## ✅ 已完成的工作

我已经基于你的后端 CampusGo 微服务架构，为你的前端项目创建了完整的 API 集成层。

### 📁 创建的新文件

```
src/
├── types/
│   └── api.ts                    # 所有 API 类型定义
├── lib/
│   ├── authService.ts            # 认证服务（登录、令牌管理）
│   ├── userService.ts            # 用户服务
│   ├── merchantService.ts        # 商家服务
│   ├── runnerService.ts          # 配送员服务
│   ├── orderService.ts           # 订单服务
│   ├── paymentService.ts         # 支付服务
│   └── notificationService.ts    # 通知服务
└── pages/
    └── Login.tsx                 # 已更新 (改进认证流程)

FRONTEND_DEV_GUIDE.md              # 完整开发指南
```

### 🔧 改进的内容

1. **类型安全** - 完整的 TypeScript 类型定义
2. **API 客户端** - 为每个服务创建了独立的 API 客户端
3. **认证管理** - 统一的令牌管理和刷新逻辑
4. **错误处理** - 规范的错误处理方式
5. **代码复用** - 高度模块化的服务层

---

## 🚀 快速开始

### 1. 启动后端
```bash
# 确保后端运行在 http://localhost:8080
cd Backend
docker-compose up -d
```

### 2. 启动前端
```bash
cd Frontend/frontend
pnpm dev
```

### 3. 测试登录
访问 `http://localhost:5173`，使用后端的测试账号登录：
- **User**: username=`user1`, password=`user123`
- **Merchant**: username=`merchant1`, password=`merchant123`
- **Runner**: username=`runner1`, password=`runner123`
- **Admin**: username=`admin1`, password=`admin123`

---

## 📊 后端 API 总体结构

| 服务 | 端口 | 主要端点 |
|------|------|---------|
| **Auth Service** | 8000 | `/api/auth/login`, `/api/auth/register` |
| **User Service** | 8001 | `/api/users/{id}` |
| **Merchant Service** | 8002 | `/api/merchants`, `/api/merchants/{id}` |
| **Runner Service** | 8003 | `/api/runners`, `/api/runners/{id}` |
| **Order Service** | 8004 | `/api/orders/{id}`, `/api/orders` |
| **Payment Service** | 8005 | `/api/payments/{id}` |
| **Notification Service** | 8006 | `/api/notifications/inbox/*` |
| **Admin Service** | 8007 | `/api/admins` (内部使用) |
| **API Gateway** | 8080 | 统一网关 |

---

## 💻 使用示例

### 登录
```typescript
import { authService } from '@/lib/authService'

// 登录
const tokenPair = await authService.login('user1', 'user123')
authService.saveTokens(tokenPair)

// 获取用户信息
const user = authService.getUser()
```

### 查询商家
```typescript
import { merchantService } from '@/lib/merchantService'

// 获取所有商家
const merchants = await merchantService.listMerchants()

// 搜索商家
const results = await merchantService.listMerchants('星巴克')

// 获取商家详情
const merchant = await merchantService.getMerchant(1)
```

### 创建配送员
```typescript
import { runnerService } from '@/lib/runnerService'

const runner = await runnerService.createRunner({
  username: 'runner2',
  password: 'password',
  phone: '98765432',
  vehicleType: 'BIKE'
})
```

### 获取通知
```typescript
import { notificationService } from '@/lib/notificationService'

const notifications = await notificationService.getUserNotifications(userId)
```

---

## 🎨 前端页面开发建议

### 已有的页面
- ✅ `Login.tsx` - 已更新，支持多角色登录
- ✅ `UserDashboard.tsx` - 用户仪表板
- ✅ `NotificationsPage.tsx` - 通知页面

### 需要开发的页面

1. **商家列表页面** - `pages/merchants/MerchantsPage.tsx`
   ```typescript
   import { merchantService } from '@/lib/merchantService'
   
   // 使用 merchantService.listMerchants()
   // 使用 merchantService.getMerchant(id)
   ```

2. **订单页面** - `pages/orders/OrderPage.tsx`
   ```typescript
   import { orderService } from '@/lib/orderService'
   
   // 使用 orderService.createOrder(userId, merchantId)
   // 使用 orderService.getOrder(id)
   ```

3. **支付页面** - `pages/payments/PaymentsPage.tsx`
   ```typescript
   import { paymentService } from '@/lib/paymentService'
   
   // 使用 paymentService.getPayment(id)
   ```

4. **配送员页面** - `pages/runner/RunnerPage.tsx`
   ```typescript
   import { runnerService } from '@/lib/runnerService'
   
   // 使用 runnerService.updateRunnerLocation()
   // 使用 runnerService.getRunner(id)
   ```

---

## 🔐 认证令牌管理

### 令牌存储位置
- `access_token` - localStorage 中的访问令牌
- `refresh_token` - localStorage 中的刷新令牌

### 自动令牌注入
所有请求通过 `src/services/api/client.ts` 的拦截器自动添加：
```
Authorization: Bearer <access_token>
```

### 令牌刷新
```typescript
if (authService.isLoggedIn()) {
  const refreshToken = authService.getRefreshToken()
  const newTokenPair = await authService.refresh(refreshToken)
  authService.saveTokens(newTokenPair)
}
```

---

## 🐛 调试技巧

### 检查网络请求
在浏览器开发者工具的 **Network** 标签中：
1. 检查 `Authorization` 头是否包含 token
2. 查看响应状态码 (401 = 令牌过期)
3. 检查响应体的错误信息

### 查看 localStorage
```javascript
// 在浏览器控制台
console.log(localStorage.getItem('access_token'))
console.log(JSON.parse(localStorage.getItem('user') || '{}'))
```

### 测试 API 端点
```bash
# 使用 curl 测试
curl -X GET http://localhost:8080/api/merchants \
  -H "Authorization: Bearer <token>"
```

---

## 📚 文件位置速查

| 需求 | 文件位置 |
|------|---------|
| 类型定义 | `src/types/api.ts` |
| 认证服务 | `src/lib/authService.ts` |
| 商家服务 | `src/lib/merchantService.ts` |
| 配送员服务 | `src/lib/runnerService.ts` |
| 订单服务 | `src/lib/orderService.ts` |
| 登录页面 | `src/pages/Login.tsx` |
| 开发指南 | `FRONTEND_DEV_GUIDE.md` |

---

## ✨ 后续步骤

1. **完成各页面实现**
   - 使用提供的服务客户端完成 MerchantsPage、OrderPage 等页面

2. **集成状态管理** (可选)
   - 考虑使用 Redux/Zustand 管理全局状态
   - 存储用户信息、通知、购物车等

3. **添加 React Query**
   - 已在 package.json 中，可用于数据缓存和同步

4. **集成 UI 库**
   - Ant Design 已安装，用于统一的 UI 组件

5. **实现实时功能**
   - WebSocket 连接用于实时位置更新
   - Server-Sent Events 用于实时通知

6. **错误边界和加载状态**
   - 为每个页面添加错误处理和加载状态

---

## 🎓 参考资源

- **后端代码**: https://github.com/chenjiajin13/CampusGo
- **API 文档**: `FRONTEND_DEV_GUIDE.md` (项目内)
- **类型定义**: `src/types/api.ts`

---

**现在你已经拥有完整的前端-后端集成框架！🎉**

开始构建你的 CampusGo 前端应用吧！

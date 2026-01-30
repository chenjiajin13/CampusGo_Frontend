# 🚀 快速参考 - CampusGo 前端开发

## 常用导入语句

```typescript
// 认证
import { authService } from '@/lib/authService'

// 业务服务
import { userService } from '@/lib/userService'
import { merchantService } from '@/lib/merchantService'
import { runnerService } from '@/lib/runnerService'
import { orderService } from '@/lib/orderService'
import { paymentService } from '@/lib/paymentService'
import { notificationService } from '@/lib/notificationService'

// 类型
import { 
  TokenPairResponse, UserDTO, MerchantDTO, RunnerDTO, 
  OrderDTO, PaymentDTO, NotificationDTO 
} from '@/types/api'

// React 钩子
import { useAuth } from '@/state/AuthContext'
import { useCart } from '@/state/CartContext'
```

---

## 常用代码片段

### 登录
```typescript
const tokenPair = await authService.login(username, password)
authService.saveTokens(tokenPair)
const user = authService.getUser()
```

### 查询商家
```typescript
const merchants = await merchantService.listMerchants()
const merchant = await merchantService.getMerchant(id)
```

### 创建订单
```typescript
const order = await orderService.createOrder(userId, merchantId, address)
```

### 获取通知
```typescript
const notifications = await notificationService.getUserNotifications(userId)
```

### 更新配送员位置
```typescript
await runnerService.updateRunnerLocation(runnerId, latitude, longitude)
```

### 页面组件模板
```typescript
import { useEffect, useState } from 'react'
import { merchantService } from '@/lib/merchantService'
import { MerchantDTO } from '@/types/api'

export default function MyPage() {
  const [data, setData] = useState<MerchantDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const result = await merchantService.listMerchants()
        setData(result)
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>
  
  return <div>{/* 您的 UI 代码 */}</div>
}
```

---

## 错误处理

```typescript
try {
  const data = await merchantService.listMerchants()
} catch (e: any) {
  // 错误消息
  const message = e?.response?.data?.message || e.message
  
  // 检查状态码
  if (e?.response?.status === 401) {
    // 令牌过期 - 刷新或重定向到登录
  }
  
  console.error(message)
}
```

---

## API 速查表

| 操作 | 代码 |
|------|------|
| 登录 | `authService.login(u, p)` |
| 登出 | `authService.logout(refreshToken)` |
| 获取商家 | `merchantService.listMerchants()` |
| 搜索商家 | `merchantService.listMerchants('关键词')` |
| 创建商家 | `merchantService.createMerchant(req)` |
| 删除商家 | `merchantService.deleteMerchant(id)` |
| 列出配送员 | `runnerService.listRunners()` |
| 更新位置 | `runnerService.updateRunnerLocation(id, lat, lng)` |
| 创建订单 | `orderService.createOrder(userId, merchantId, address)` |
| 获取订单 | `orderService.getOrder(id)` |
| 获取用户通知 | `notificationService.getUserNotifications(userId)` |
| 获取商家通知 | `notificationService.getMerchantNotifications(merchantId)` |

---

## 环境变量

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 项目文件位置

| 内容 | 位置 |
|------|------|
| 类型定义 | `src/types/api.ts` |
| 认证 | `src/lib/authService.ts` |
| 商家服务 | `src/lib/merchantService.ts` |
| 配送员服务 | `src/lib/runnerService.ts` |
| 订单服务 | `src/lib/orderService.ts` |
| 支付服务 | `src/lib/paymentService.ts` |
| 通知服务 | `src/lib/notificationService.ts` |
| 用户服务 | `src/lib/userService.ts` |
| 登录页面 | `src/pages/Login.tsx` |
| 商家页面 | `src/pages/merchants/MerchantsPage.tsx` |
| API 客户端 | `src/services/api/client.ts` |
| 认证上下文 | `src/state/AuthContext.tsx` |
| 购物车上下文 | `src/state/CartContext.tsx` |

---

## 快速命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 类型检查
pnpm tsc -b

# 生成 API 客户端 (需要后端运行)
pnpm openapi:gen
```

---

## 通用类型

```typescript
// 令牌响应
interface TokenPairResponse {
  token: string
  expiresAt: number
  refreshToken: string
  refreshExpiresAt: number
}

// 商家
interface MerchantDTO {
  id: number
  name: string
  phone: string
  address: string
  status: string
  latitude?: number
  longitude?: number
  rating?: number
}

// 配送员
interface RunnerDTO {
  id: number
  username: string
  phone: string
  vehicleType: 'BIKE' | 'CAR' | 'ELECTRIC'
  status: string
  latitude?: number
  longitude?: number
}

// 订单
interface OrderDTO {
  id: number
  userId: number
  merchantId: number
  status: string
  totalPrice: number
  address: string
}

// 通知
interface NotificationDTO {
  id: number
  targetType: 'USER' | 'MERCHANT' | 'RUNNER'
  targetId: number
  title: string
  content: string
  read: boolean
}
```

---

## 调试技巧

### 查看网络请求
```
浏览器 → DevTools (F12) → Network → 查看请求
```

### 查看 localStorage
```javascript
console.log(localStorage.getItem('access_token'))
console.log(JSON.parse(localStorage.getItem('user')))
```

### 测试 API
```bash
curl -X GET http://localhost:8080/api/merchants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 清除缓存
```javascript
localStorage.clear()
sessionStorage.clear()
```

---

## 文档快速导航

- 📖 **开发指南**: `FRONTEND_DEV_GUIDE.md`
- 📖 **集成总结**: `API_INTEGRATION_SUMMARY.md`
- ✅ **完成清单**: `CHECKLIST.md`
- 📝 **项目总结**: `PROJECT_SUMMARY.md`
- 🚀 **本文件**: `QUICK_REFERENCE.md`

---

## 有用的链接

- 后端 GitHub: https://github.com/chenjiajin13/CampusGo
- React 官方文档: https://react.dev
- TypeScript 官方文档: https://www.typescriptlang.org
- Vite 官方文档: https://vitejs.dev

---

**提示**: 这个快速参考卡片可以打印出来放在你的桌子上！😊

**最后更新**: 2026-01-29

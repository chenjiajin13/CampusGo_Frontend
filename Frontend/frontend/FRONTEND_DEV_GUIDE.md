# CampusGo 前端开发指南

根据后端微服务架构，这个指南帮助你快速集成API并开发前端功能。

## 🏗️ 后端架构总览

```
CampusGo Backend (Microservices)
├── Auth Service (端口: 8000) - JWT 认证、令牌管理
├── User Service (端口: 8001) - 用户信息
├── Merchant Service (端口: 8002) - 商家管理
├── Runner Service (端口: 8003) - 配送员管理
├── Order Service (端口: 8004) - 订单管理
├── Payment Service (端口: 8005) - 支付管理
├── Notification Service (端口: 8006) - 通知系统
└── Admin Service (端口: 8007) - 管理员管理

Gateway: http://localhost:8080 (API 网关)
```

## 🔑 认证流程

### 1. 登录

```typescript
import { authService } from '@/lib/authService'

// 普通用户登录
const tokenPair = await authService.login('username', 'password')
// Response: { token, expiresAt, refreshToken, refreshExpiresAt }

// 或管理员登录
const adminToken = await authService.adminLogin('admin', 'password')

// 自动保存令牌
authService.saveTokens(tokenPair)
```

### 2. 使用令牌

令牌自动添加到每个 API 请求的 `Authorization` 头中（由拦截器处理）：

```
Authorization: Bearer <token>
```

### 3. 刷新令牌

```typescript
const newTokenPair = await authService.refresh(refreshToken)
authService.saveTokens(newTokenPair)
```

### 4. 登出

```typescript
await authService.logout(refreshToken)
// 清除本地存储的所有认证信息
```

## 📚 API 服务使用示例

### 用户服务

```typescript
import { userService } from '@/lib/userService'

// 获取用户信息
const user = await userService.getUser(userId)
```

### 商家服务

```typescript
import { merchantService } from '@/lib/merchantService'

// 列出商家
const merchants = await merchantService.listMerchants()
const filtered = await merchantService.listMerchants('搜索关键词')

// 获取商家详情
const merchant = await merchantService.getMerchant(merchantId)

// 创建商家
const newMerchant = await merchantService.createMerchant({
  username: 'merchant1',
  password: 'password',
  name: '星巴克',
  phone: '1234567890',
  address: '南京大学鼓楼校区',
  latitude: 1.234,
  longitude: 5.678,
  tags: ['coffee', 'breakfast']
})

// 更新商家信息
await merchantService.updateMerchant(merchantId, {
  name: '新名称',
  address: '新地址',
})

// 更新商家状态
await merchantService.updateMerchantStatus(merchantId, 'ACTIVE')

// 删除商家
await merchantService.deleteMerchant(merchantId)
```

### 配送员服务

```typescript
import { runnerService } from '@/lib/runnerService'

// 列出配送员
const runners = await runnerService.listRunners()

// 创建配送员
const runner = await runnerService.createRunner({
  username: 'runner1',
  password: 'password',
  phone: '9876543210',
  vehicleType: 'BIKE' // 或 'CAR', 'ELECTRIC'
})

// 更新位置 (实时定位)
await runnerService.updateRunnerLocation(runnerId, 1.234, 5.678)
```

### 订单服务

```typescript
import { orderService } from '@/lib/orderService'

// 获取订单
const order = await orderService.getOrder(orderId)

// 创建订单
const newOrder = await orderService.createOrder(userId, merchantId, '交付地址')
```

### 支付服务

```typescript
import { paymentService } from '@/lib/paymentService'

// 获取支付信息
const payment = await paymentService.getPayment(paymentId)

// 更新支付状态 (仅测试)
await paymentService.updatePaymentStatus(paymentId, 'COMPLETED')
```

### 通知服务

```typescript
import { notificationService } from '@/lib/notificationService'

// 获取用户通知
const notifications = await notificationService.getUserNotifications(userId)

// 获取商家通知
const merchantNotifications = await notificationService.getMerchantNotifications(merchantId)

// 发送通知 (测试)
await notificationService.sendNotification({
  targetType: 'USER',
  targetId: userId,
  channel: 'EMAIL',
  title: '订单已完成',
  content: '您的订单已成功配送',
  data: { orderId: 123 }
})
```

## 📋 数据类型

所有数据类型定义在 `src/types/api.ts` 中，包括：

- `TokenPairResponse` - 认证响应
- `UserDTO` - 用户信息
- `MerchantDTO` - 商家信息
- `RunnerDTO` - 配送员信息
- `OrderDTO` - 订单信息
- `PaymentDTO` - 支付信息
- `NotificationDTO` - 通知信息

## 🔄 HTTP 拦截器

所有请求都通过 `src/services/api/client.ts` 发送，已配置：
- ✅ 自动添加 `Authorization` 头
- ✅ 自动处理 JWT 令牌
- ✅ 错误处理和响应拦截

## 🧪 测试 API

### 启动后端
```bash
cd CampusGo/Backend
docker-compose up -d
# 或根据你的后端设置启动
```

### 启动前端开发服务器
```bash
cd CampusGo_Frontend/Frontend/frontend
pnpm dev
```

### 访问应用
```
http://localhost:5173
```

### 通过 Vite 代理访问 API
```
前端: http://localhost:5173/api/*
代理到: http://localhost:8080/*
```

## 📝 常见问题

### 1. 401 Unauthorized

**原因**: 令牌过期或无效

**解决方案**:
```typescript
// 自动刷新令牌
const refreshToken = authService.getRefreshToken()
const newTokenPair = await authService.refresh(refreshToken)
authService.saveTokens(newTokenPair)
```

### 2. CORS 错误

**原因**: 后端未配置 CORS

**确保后端配置**:
```yaml
# application.yml
cors:
  allowed-origins: http://localhost:5173
  allowed-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
  allowed-headers: '*'
```

### 3. API 响应格式不匹配

**检查**: 
- 后端实际返回的格式
- `src/types/api.ts` 中定义的类型是否正确

**调试**:
```typescript
try {
  const data = await merchantService.listMerchants()
  console.log('Response:', data) // 查看实际响应
} catch (error) {
  console.error('Error:', error.response?.data)
}
```

## 🚀 开发最佳实践

### 1. 创建新页面

```typescript
// pages/MyPage.tsx
import { useEffect, useState } from 'react'
import { merchantService } from '@/lib/merchantService'
import { MerchantDTO } from '@/types/api'

export default function MyPage() {
  const [merchants, setMerchants] = useState<MerchantDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true)
        const data = await merchantService.listMerchants()
        setMerchants(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMerchants()
  }, [])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <div>
      {merchants.map(m => (
        <div key={m.id}>{m.name}</div>
      ))}
    </div>
  )
}
```

### 2. 错误处理

```typescript
try {
  const result = await merchantService.createMerchant(data)
} catch (e: any) {
  const errorMessage = e.response?.data?.message || e.message
  console.error('创建失败:', errorMessage)
  setError(errorMessage)
}
```

### 3. 类型安全

始终使用从 `src/types/api.ts` 导入的类型：

```typescript
import { MerchantDTO, MerchantCreateRequest } from '@/types/api'

const createNewMerchant = (req: MerchantCreateRequest): Promise<MerchantDTO> => {
  return merchantService.createMerchant(req)
}
```

## 📞 联系和支持

- 后端 Repository: https://github.com/chenjiajin13/CampusGo
- 前端 Repository: 当前项目

---

**最后更新**: 2026-01-29

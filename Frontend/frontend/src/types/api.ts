/**
 * 根据后端 CampusGo API 定义的类型
 */

// 认证相关
export interface LoginRequest {
  username: string
  password: string
}

export interface TokenPairResponse {
  token: string
  expiresAt: number
  refreshToken: string
  refreshExpiresAt: number
}

export interface UserAuthDTO {
  id: number
  username: string
  phone?: string
  enabled: boolean
}

// 用户相关
export interface UserDTO {
  id: number
  username: string
  email?: string
  phone?: string
  enabled: boolean
}

// 商家相关
export interface MerchantDTO {
  id: number
  name: string
  phone: string
  address: string
  status: string
  latitude?: number
  longitude?: number
  rating?: number
  finishedOrders?: number
  tags?: string[]
}

export interface MerchantCreateRequest {
  username: string
  password: string
  name: string
  phone: string
  address: string
  latitude?: number
  longitude?: number
  tags?: string[]
}

export interface MerchantUpdateRequest {
  name?: string
  phone?: string
  address?: string
  latitude?: number
  longitude?: number
  tags?: string[]
}

// 配送员相关
export enum VehicleType {
  BIKE = 'BIKE',
  CAR = 'CAR',
  ELECTRIC = 'ELECTRIC'
}

export interface RunnerDTO {
  id: number
  username: string
  phone: string
  vehicleType: VehicleType
  status: string
  latitude?: number
  longitude?: number
  rating?: number
}

export interface RunnerCreateRequest {
  username: string
  password: string
  phone: string
  vehicleType: VehicleType
}

export interface RunnerUpdateRequest {
  phone?: string
  vehicleType?: VehicleType
}

export interface UpdateLocationRequest {
  latitude: number
  longitude: number
}

// 订单相关
export interface OrderDTO {
  id: number
  userId: number
  merchantId: number
  status: string
  items?: OrderItem[]
  totalPrice: number
  address: string
  createdAt: string
}

export interface OrderItem {
  id: number
  productName: string
  quantity: number
  price: number
}

// 支付相关
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface PaymentDTO {
  id: number
  orderId: number
  amount: number
  status: PaymentStatus
  method?: string
  createdAt: string
}

export interface UpdateStatusRequest {
  status?: PaymentStatus | string
  enabled?: boolean
}

// 通知相关
export enum NotificationTargetType {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
  RUNNER = 'RUNNER'
}

export interface NotificationDTO {
  id: number
  targetType: NotificationTargetType
  targetId: number
  channel: string
  title: string
  content: string
  data?: any
  read: boolean
  createdAt: string
}

export interface NotificationCreateRequest {
  targetType: NotificationTargetType
  targetId: number
  channel: string
  title: string
  content: string
  data?: any
}

// 响应包装类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 管理员相关
export enum AdminRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR'
}

export interface AdminDTO {
  id: number
  username: string
  email: string
  phone: string
  role: AdminRole
  enabled: boolean
}

export interface AdminCreateRequest {
  username: string
  password: string
  email: string
  phone: string
  role?: AdminRole
}

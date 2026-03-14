export interface LoginRequest {
  username: string
  password: string
}

export interface TokenPairResponse {
  accessToken: string
  accessExpiresAt: number
  refreshToken: string
  refreshExpiresAt: number
}

export interface UserAuthDTO {
  id: number
  username: string
  phone?: string
  enabled: boolean
}

export interface UserDTO {
  id: number
  username: string
  email?: string
  phone?: string
  address?: string
  enabled?: boolean
}

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

export interface MenuItemDTO {
  id: number
  merchantId: number
  name: string
  priceCents: number
  enabled: boolean
}

export interface MenuItemUpsertRequest {
  name: string
  priceCents: number
  enabled?: boolean
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

export enum VehicleType {
  FOOT = 'FOOT',
  BICYCLE = 'BICYCLE',
  E_SCOOTER = 'E_SCOOTER',
  MOTORBIKE = 'MOTORBIKE',
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

export interface OrderDTO {
  id?: number
  orderId?: number
  userId?: number
  merchantId?: number
  status: string
  createdAt?: string
}

export interface OrderDetailDTO {
  orderId: number
  userId?: number
  merchantId?: number
  runnerId?: number | null
  user?: UserDTO
  customerName?: string
  customerPhone?: string
  customerAddress?: string
  status: string
  amountCents?: number
  paymentStatus?: string | null
  runnerCanComplete?: boolean
}

export interface BatchCheckoutItemDTO {
  orderId: number
  merchantId: number
  runnerId?: number | null
  orderStatus: string
  amountCents: number
  paymentStatus?: string | null
}

export interface BatchCheckoutResponse {
  orderCount: number
  totalAmountCents: number
  allPaid: boolean
  orders: BatchCheckoutItemDTO[]
}

export interface CartItemRequest {
  merchantId: number
  menuItemId: number
  quantity: number
}

export interface CartItemDTO {
  merchantId?: number | null
  menuItemId: number
  name: string
  unitPriceCents: number
  quantity: number
  subtotalCents: number
}

export interface CartSummaryDTO {
  merchantId: number | null
  items: CartItemDTO[]
  totalQuantity: number
  totalCents: number
}

export interface QuickOrderRequest {
  merchantId: number
  address?: string
  autoPay?: boolean
  items: CartItemRequest[]
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface PaymentDTO {
  id: number
  orderId: number
  userId?: number
  merchantId?: number
  amountCents: number
  currency?: string
  status: PaymentStatus
  method?: string
  createdAt?: string
}

export enum WalletOwnerType {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
  RUNNER = 'RUNNER',
}

export enum WalletDirection {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum WalletBizType {
  TOPUP = 'TOPUP',
  PAY_ORDER = 'PAY_ORDER',
  REFUND = 'REFUND',
  SETTLE_MERCHANT = 'SETTLE_MERCHANT',
  SETTLE_RUNNER = 'SETTLE_RUNNER',
  ADJUST = 'ADJUST',
}

export interface WalletAccountDTO {
  ownerType: WalletOwnerType
  ownerId: number
  balanceCents: number
  frozenCents: number
}

export interface WalletTransactionDTO {
  id: number
  bizType: WalletBizType
  direction: WalletDirection
  amountCents: number
  orderId?: number | null
  remark?: string | null
  createdAt?: string
}

export interface UpdateStatusRequest {
  status?: PaymentStatus | string
  enabled?: boolean
}

export enum NotificationTargetType {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
  RUNNER = 'RUNNER',
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

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export enum AdminRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
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
export interface MerchantDailyRevenueDTO {
  day: string
  amountCents: number
}

export interface MerchantItemShareDTO {
  itemName: string
  quantity: number
  amountCents: number
}

export interface MerchantAnalyticsDTO {
  weekStart: string
  weekEnd: string
  selectedWeekRevenueCents: number
  lifetimeRevenueCents: number
  annualRevenueCents: number
  completedOrderCount: number
  dailyRevenue: MerchantDailyRevenueDTO[]
  itemShare: MerchantItemShareDTO[]
}


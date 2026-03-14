import api from '../services/api/client'
import {
  BatchCheckoutResponse,
  CartSummaryDTO,
  CartItemRequest,
  MerchantAnalyticsDTO,
  OrderDetailDTO,
  QuickOrderRequest,
} from '@/types/api'

export type CheckoutPayMethod = 'WALLET' | 'CREDIT_CARD' | 'WECHAT' | 'PAYPAL'

export const orderService = {
  async getOrder(id: number): Promise<OrderDetailDTO> {
    const response = await api.get<OrderDetailDTO>(`/orders/${id}`)
    return response.data
  },

  async getCart(): Promise<CartSummaryDTO> {
    const response = await api.get<CartSummaryDTO>('/orders/cart')
    return response.data
  },

  async addCartItem(req: CartItemRequest): Promise<CartSummaryDTO> {
    const response = await api.post<CartSummaryDTO>('/orders/cart/items', req)
    return response.data
  },

  async removeCartItem(menuItemId: number): Promise<CartSummaryDTO> {
    const response = await api.delete<CartSummaryDTO>(`/orders/cart/items/${menuItemId}`)
    return response.data
  },

  async clearCart(): Promise<void> {
    await api.delete('/orders/cart')
  },

  async checkoutCart(address?: string, autoPay = false): Promise<OrderDetailDTO> {
    const response = await api.post<OrderDetailDTO>('/orders/cart/checkout', null, {
      params: { address, autoPay },
      headers: {
        'Idempotency-Key': `cart-${Date.now()}`,
      },
    })
    return response.data
  },

  async checkoutCartBatch(
    address?: string,
    autoPay = false,
    payMethod?: CheckoutPayMethod
  ): Promise<BatchCheckoutResponse> {
    const response = await api.post<BatchCheckoutResponse>('/orders/cart/checkout-batch', null, {
      params: { address, autoPay, payMethod },
      headers: {
        'Idempotency-Key': `cart-batch-${Date.now()}`,
      },
    })
    return response.data
  },

  async quickOrder(req: QuickOrderRequest): Promise<OrderDetailDTO> {
    const response = await api.post<OrderDetailDTO>('/orders/quick', req, {
      headers: {
        'Idempotency-Key': `quick-${Date.now()}`,
      },
    })
    return response.data
  },

  async listMyOrders(): Promise<OrderDetailDTO[]> {
    const response = await api.get<OrderDetailDTO[]>('/orders/my')
    return response.data
  },

  async listMerchantOrders(): Promise<OrderDetailDTO[]> {
    const response = await api.get<OrderDetailDTO[]>('/orders/merchant/me')
    return response.data
  },

  async getMerchantAnalytics(weekStart?: string): Promise<MerchantAnalyticsDTO> {
    const response = await api.get<MerchantAnalyticsDTO>('/orders/merchant/me/analytics', {
      params: { weekStart },
    })
    return response.data
  },

  async listRunnerOrders(): Promise<OrderDetailDTO[]> {
    const response = await api.get<OrderDetailDTO[]>('/orders/runner/me')
    return response.data
  },

  async completeRunnerOrder(orderId: number): Promise<OrderDetailDTO> {
    const response = await api.post<OrderDetailDTO>(`/orders/runner/me/${orderId}/complete`)
    return response.data
  },
}

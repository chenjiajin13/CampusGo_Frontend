import api from '../services/api/client'
import { PaymentDTO } from '@/types/api'

export type PaymentInitResponse = {
  paymentId: number
  payUrl?: string
  qrcodeUrl?: string
}

export const paymentService = {
  async getPayment(id: number): Promise<PaymentDTO> {
    const response = await api.get<PaymentDTO>(`/payments/${id}`)
    return response.data
  },

  async createPayment(params: {
    orderId: number
    userId: number
    merchantId: number
    amountCents: number
    currency?: string
    method?: 'WALLET' | 'CREDIT_CARD' | 'WECHAT' | 'Paypal'
  }): Promise<PaymentInitResponse> {
    const response = await api.post<PaymentInitResponse>('/payments', {
      ...params,
      currency: params.currency ?? 'SGD',
      method: params.method ?? 'CREDIT_CARD',
    })
    return response.data
  },

  async updatePaymentStatus(id: number, status: string): Promise<PaymentDTO> {
    const response = await api.patch<PaymentDTO>(`/payments/${id}/status`, {
      status,
    })
    return response.data
  },
}

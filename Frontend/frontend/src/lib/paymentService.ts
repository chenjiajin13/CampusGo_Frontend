/**
 * 支付服务 API 客户端
 */
import api from '../services/api/client'
import { PaymentDTO, UpdateStatusRequest } from '@/types/api'

export const paymentService = {
  /**
   * 获取支付详情
   */
  async getPayment(id: number): Promise<PaymentDTO> {
    const response = await api.get<PaymentDTO>(`/api/payments/${id}`)
    return response.data
  },

  /**
   * 更新支付状态 (仅测试用)
   */
  async updatePaymentStatus(id: number, status: string): Promise<PaymentDTO> {
    const response = await api.patch<PaymentDTO>(`/api/payments/${id}/status`, {
      status,
    })
    return response.data
  },
}

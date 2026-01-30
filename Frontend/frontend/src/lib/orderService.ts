/**
 * 订单服务 API 客户端
 */
import api from '../services/api/client'
import { OrderDTO } from '@/types/api'

export const orderService = {
  /**
   * 获取订单详情
   */
  async getOrder(id: number): Promise<OrderDTO> {
    const response = await api.get<OrderDTO>(`/api/orders/${id}`)
    return response.data
  },

  /**
   * 创建订单
   */
  async createOrder(
    userId: number,
    merchantId: number,
    address?: string
  ): Promise<OrderDTO> {
    const params: any = { userId, merchantId }
    if (address) params.address = address

    const response = await api.post<OrderDTO>('/api/orders', null, { params })
    return response.data
  },
}

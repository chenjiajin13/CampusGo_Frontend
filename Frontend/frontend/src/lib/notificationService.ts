/**
 * 通知服务 API 客户端
 */
import api from '../services/api/client'
import { NotificationDTO, NotificationCreateRequest } from '@/types/api'

export const notificationService = {
  /**
   * 获取用户通知收件箱
   */
  async getUserNotifications(userId: number): Promise<NotificationDTO[]> {
    const response = await api.get<NotificationDTO[]>(
      `/api/notifications/inbox/user/${userId}`
    )
    return response.data
  },

  /**
   * 获取商家通知收件箱
   */
  async getMerchantNotifications(merchantId: number): Promise<NotificationDTO[]> {
    const response = await api.get<NotificationDTO[]>(
      `/api/notifications/inbox/merchant/${merchantId}`
    )
    return response.data
  },

  /**
   * 发送通知 (测试用)
   */
  async sendNotification(req: NotificationCreateRequest): Promise<NotificationDTO> {
    const response = await api.post<NotificationDTO>('/api/notifications', req)
    return response.data
  },
}

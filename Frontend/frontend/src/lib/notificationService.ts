import api from '../services/api/client'
import { NotificationDTO, NotificationCreateRequest } from '@/types/api'

export const notificationService = {
  async getUserNotifications(userId: number): Promise<NotificationDTO[]> {
    const response = await api.get<NotificationDTO[]>(`/notifications/inbox/user/${userId}`)
    return response.data
  },

  async getMerchantNotifications(merchantId: number): Promise<NotificationDTO[]> {
    const response = await api.get<NotificationDTO[]>(`/notifications/inbox/merchant/${merchantId}`)
    return response.data
  },

  async sendNotification(req: NotificationCreateRequest): Promise<NotificationDTO> {
    const response = await api.post<NotificationDTO>('/notifications', req)
    return response.data
  },
}

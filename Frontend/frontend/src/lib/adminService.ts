import api from '../services/api/client'
import { AdminDTO } from '@/types/api'

export type AdminProfileUpdateRequest = {
  email?: string
  phone?: string
}

export const adminService = {
  async getMe(): Promise<AdminDTO> {
    const response = await api.get<AdminDTO>('/admins/me')
    return response.data
  },

  async updateMe(req: AdminProfileUpdateRequest): Promise<AdminDTO> {
    const response = await api.put<AdminDTO>('/admins/me', req)
    return response.data
  },

  async updateMyPassword(newPassword: string): Promise<void> {
    await api.put('/admins/me/password', { newPassword })
  },
}

/**
 * 用户服务 API 客户端
 */
import api from '../services/api/client'
import { UserDTO } from '@/types/api'

export const userService = {
  /**
   * 获取用户信息
   */
  async getUser(id: number): Promise<UserDTO> {
    const response = await api.get<UserDTO>(`/api/users/${id}`)
    return response.data
  },
}

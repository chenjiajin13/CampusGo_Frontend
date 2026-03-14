import api from '../services/api/client'
import { UserDTO } from '@/types/api'

export type UserProfileUpdateRequest = {
  phone?: string
  address?: string
  email?: string
}

export type AdminUserUpdateRequest = {
  phone?: string
  address?: string
  email?: string
  enabled?: boolean
}

export const userService = {
  async listUsers(): Promise<UserDTO[]> {
    const response = await api.get<UserDTO[]>('/users')
    return response.data
  },

  async getUser(id: number): Promise<UserDTO> {
    const response = await api.get<UserDTO>(`/users/${id}`)
    return response.data
  },

  async getMe(): Promise<UserDTO> {
    const response = await api.get<UserDTO>('/users/me')
    return response.data
  },

  async updateMe(payload: UserProfileUpdateRequest): Promise<UserDTO> {
    const response = await api.put<UserDTO>('/users/me', payload)
    return response.data
  },

  async updateMyPassword(newPassword: string): Promise<void> {
    await api.put('/users/me/password', { newPassword })
  },

  async updateUser(id: number, payload: AdminUserUpdateRequest): Promise<UserDTO> {
    const response = await api.put<UserDTO>(`/users/${id}`, payload)
    return response.data
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}

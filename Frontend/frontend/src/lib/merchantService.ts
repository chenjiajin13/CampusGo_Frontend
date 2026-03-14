import api from '../services/api/client'
import {
  MerchantDTO,
  MerchantCreateRequest,
  MerchantUpdateRequest,
  MenuItemDTO,
  MenuItemUpsertRequest,
} from '@/types/api'

export const merchantService = {
  async listMerchants(keyword?: string): Promise<MerchantDTO[]> {
    const params = keyword ? { q: keyword } : {}
    const response = await api.get<MerchantDTO[]>('/merchants', { params })
    return response.data
  },

  async getMerchant(id: number): Promise<MerchantDTO> {
    const response = await api.get<MerchantDTO>(`/merchants/${id}`)
    return response.data
  },

  async getMe(): Promise<MerchantDTO> {
    const response = await api.get<MerchantDTO>('/merchants/me')
    return response.data
  },

  async getMerchantMenu(id: number): Promise<MenuItemDTO[]> {
    const response = await api.get<MenuItemDTO[]>(`/merchants/${id}/menu`)
    return response.data
  },

  async addMenuItem(merchantId: number, req: MenuItemUpsertRequest): Promise<MenuItemDTO> {
    const response = await api.post<MenuItemDTO>(`/merchants/${merchantId}/menu`, req)
    return response.data
  },

  async updateMenuItem(merchantId: number, itemId: number, req: MenuItemUpsertRequest): Promise<MenuItemDTO> {
    const response = await api.put<MenuItemDTO>(`/merchants/${merchantId}/menu/${itemId}`, req)
    return response.data
  },

  async deleteMenuItem(merchantId: number, itemId: number): Promise<void> {
    await api.delete(`/merchants/${merchantId}/menu/${itemId}`)
  },

  async createMerchant(req: MerchantCreateRequest): Promise<MerchantDTO> {
    const response = await api.post<MerchantDTO>('/merchants', req)
    return response.data
  },

  async updateMerchant(id: number, req: MerchantUpdateRequest): Promise<MerchantDTO> {
    const response = await api.put<MerchantDTO>(`/merchants/${id}`, req)
    return response.data
  },

  async updateMe(req: MerchantUpdateRequest): Promise<MerchantDTO> {
    const response = await api.put<MerchantDTO>('/merchants/me', req)
    return response.data
  },

  async updateMyPassword(newPassword: string): Promise<void> {
    await api.put('/merchants/me/password', { newPassword })
  },

  async updateMerchantStatus(id: number, status: string): Promise<MerchantDTO> {
    const response = await api.patch<MerchantDTO>(`/merchants/${id}/status`, { status })
    return response.data
  },

  async deleteMerchant(id: number): Promise<void> {
    await api.delete(`/merchants/${id}`)
  },
}

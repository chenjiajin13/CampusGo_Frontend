/**
 * 商家服务 API 客户端
 */
import api from '../services/api/client'
import {
  MerchantDTO,
  MerchantCreateRequest,
  MerchantUpdateRequest,
  UpdateStatusRequest,
} from '@/types/api'

export const merchantService = {
  /**
   * 列出所有商家 (支持搜索)
   */
  async listMerchants(keyword?: string): Promise<MerchantDTO[]> {
    const params = keyword ? { q: keyword } : {}
    const response = await api.get<MerchantDTO[]>('/api/merchants', { params })
    return response.data
  },

  /**
   * 获取商家详情
   */
  async getMerchant(id: number): Promise<MerchantDTO> {
    const response = await api.get<MerchantDTO>(`/api/merchants/${id}`)
    return response.data
  },

  /**
   * 创建商家
   */
  async createMerchant(req: MerchantCreateRequest): Promise<MerchantDTO> {
    const response = await api.post<MerchantDTO>('/api/merchants', req)
    return response.data
  },

  /**
   * 更新商家基本信息
   */
  async updateMerchant(id: number, req: MerchantUpdateRequest): Promise<MerchantDTO> {
    const response = await api.put<MerchantDTO>(`/api/merchants/${id}`, req)
    return response.data
  },

  /**
   * 更新商家状态
   */
  async updateMerchantStatus(id: number, status: string): Promise<MerchantDTO> {
    const response = await api.patch<MerchantDTO>(
      `/api/merchants/${id}/status`,
      { status }
    )
    return response.data
  },

  /**
   * 删除商家
   */
  async deleteMerchant(id: number): Promise<void> {
    await api.delete(`/api/merchants/${id}`)
  },
}

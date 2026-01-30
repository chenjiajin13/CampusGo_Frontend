/**
 * 配送员服务 API 客户端
 */
import api from '../services/api/client'
import {
  RunnerDTO,
  RunnerCreateRequest,
  RunnerUpdateRequest,
  UpdateLocationRequest,
} from '@/types/api'

export const runnerService = {
  /**
   * 列出所有配送员
   */
  async listRunners(): Promise<RunnerDTO[]> {
    const response = await api.get<RunnerDTO[]>('/api/runners')
    return response.data
  },

  /**
   * 获取配送员详情
   */
  async getRunner(id: number): Promise<RunnerDTO> {
    const response = await api.get<RunnerDTO>(`/api/runners/${id}`)
    return response.data
  },

  /**
   * 创建配送员
   */
  async createRunner(req: RunnerCreateRequest): Promise<RunnerDTO> {
    const response = await api.post<RunnerDTO>('/api/runners', req)
    return response.data
  },

  /**
   * 更新配送员基本信息
   */
  async updateRunner(id: number, req: RunnerUpdateRequest): Promise<RunnerDTO> {
    const response = await api.put<RunnerDTO>(`/api/runners/${id}`, req)
    return response.data
  },

  /**
   * 更新配送员位置
   */
  async updateRunnerLocation(
    id: number,
    latitude: number,
    longitude: number
  ): Promise<RunnerDTO> {
    const response = await api.patch<RunnerDTO>(`/api/runners/${id}/location`, {
      latitude,
      longitude,
    })
    return response.data
  },

  /**
   * 删除配送员
   */
  async deleteRunner(id: number): Promise<void> {
    await api.delete(`/api/runners/${id}`)
  },
}

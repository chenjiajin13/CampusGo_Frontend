import api from '../services/api/client'
import {
  RunnerDTO,
  RunnerCreateRequest,
  RunnerUpdateRequest,
} from '@/types/api'

export const runnerService = {
  async listRunners(): Promise<RunnerDTO[]> {
    const response = await api.get<RunnerDTO[]>('/runners')
    return response.data
  },

  async getRunner(id: number): Promise<RunnerDTO> {
    const response = await api.get<RunnerDTO>(`/runners/${id}`)
    return response.data
  },

  async getMe(): Promise<RunnerDTO> {
    const response = await api.get<RunnerDTO>('/runners/me')
    return response.data
  },

  async createRunner(req: RunnerCreateRequest): Promise<RunnerDTO> {
    const response = await api.post<RunnerDTO>('/runners', req)
    return response.data
  },

  async updateRunner(id: number, req: RunnerUpdateRequest): Promise<RunnerDTO> {
    const response = await api.put<RunnerDTO>(`/runners/${id}`, req)
    return response.data
  },

  async updateMe(req: RunnerUpdateRequest): Promise<RunnerDTO> {
    const response = await api.put<RunnerDTO>('/runners/me', req)
    return response.data
  },

  async updateMyPassword(newPassword: string): Promise<void> {
    await api.put('/runners/me/password', { newPassword })
  },

  async updateRunnerLocation(
    id: number,
    latitude: number,
    longitude: number
  ): Promise<RunnerDTO> {
    const response = await api.patch<RunnerDTO>(`/runners/${id}/location`, {
      latitude,
      longitude,
    })
    return response.data
  },

  async deleteRunner(id: number): Promise<void> {
    await api.delete(`/runners/${id}`)
  },
}

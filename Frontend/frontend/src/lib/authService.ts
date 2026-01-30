/**
 * 认证服务 - 处理登录、令牌管理、权限等
 */
import api from '../services/api/client'
import {
  LoginRequest,
  TokenPairResponse,
  UserAuthDTO,
  AdminRole,
} from '@/types/api'

const AUTH_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

export const authService = {
  /**
   * 用户登录 (USER/MERCHANT/RUNNER)
   * 注意：api client 若 baseURL 已是 "/api"，这里不要再写 "/api/..."
   */
  async login(username: string, password: string): Promise<TokenPairResponse> {
    const response = await api.post<TokenPairResponse>('/auth/login', {
      username,
      password,
    })
    return response.data
  },

  /**
   * 管理员登录
   */
  async adminLogin(username: string, password: string): Promise<TokenPairResponse> {
    const response = await api.post<TokenPairResponse>('/auth/admin/login', {
      username,
      password,
    })
    return response.data
  },

  /**
   * 用户注册
   */
  async register(
    username: string,
    password: string,
    phone?: string
  ): Promise<UserAuthDTO> {
    const response = await api.post<UserAuthDTO>('/auth/register', {
      username,
      password,
      phone,
    })
    return response.data
  },

  /**
   * 刷新令牌
   */
  async refresh(refreshToken: string): Promise<TokenPairResponse> {
    const response = await api.post<TokenPairResponse>(
      '/auth/refresh',
      null,
      { params: { refreshToken } }
    )
    return response.data
  },

  /**
   * 登出
   */
  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', null, { params: { refreshToken } })
    this.clearTokens()
  },

  /**
   * 保存令牌
   * 后端返回字段：accessToken / refreshToken
   */
  saveTokens(tokenPair: TokenPairResponse): void {
    // 兼容：如果你 types 里仍叫 token，这里也尽量兜底
    const access =
      (tokenPair as any).accessToken ?? (tokenPair as any).token ?? null
    const refresh =
      (tokenPair as any).refreshToken ?? (tokenPair as any).refresh ?? null

    if (access) localStorage.setItem(AUTH_TOKEN_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  },

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  /**
   * 清除令牌
   */
  clearTokens(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return !!this.getAccessToken()
  },

  /**
   * 保存用户信息
   */
  saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  /**
   * 获取用户信息
   */
  getUser(): any {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },
}

import api from '../services/api/client'
import { WalletAccountDTO, WalletTransactionDTO } from '@/types/api'

export const walletService = {
  async getMyWallet(): Promise<WalletAccountDTO> {
    const response = await api.get<WalletAccountDTO>('/payments/wallet/me')
    return response.data
  },

  async getMyTransactions(limit = 8): Promise<WalletTransactionDTO[]> {
    const response = await api.get<WalletTransactionDTO[]>('/payments/wallet/me/transactions', {
      params: { limit },
    })
    return response.data
  },

  async topup(amountCents: number, remark?: string): Promise<WalletAccountDTO> {
    const response = await api.post<WalletAccountDTO>('/payments/wallet/me/topup', {
      amountCents,
      idempotencyKey: `wallet-topup-${Date.now()}`,
      remark,
    })
    return response.data
  },
}

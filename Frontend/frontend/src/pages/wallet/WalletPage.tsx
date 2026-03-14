import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/state/AuthContext'
import { walletService } from '@/lib/walletService'
import { Role } from '@/types/role'
import { WalletTransactionDTO } from '@/types/api'

function centsToMoney(cents?: number): string {
  return `$${((cents ?? 0) / 100).toFixed(2)}`
}

function formatTime(value?: string): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export default function WalletPage() {
  const { user } = useAuth()
  const role = (user?.role as Role | undefined) ?? Role.USER
  const canTopup = role === Role.USER

  const [balanceCents, setBalanceCents] = useState(0)
  const [frozenCents, setFrozenCents] = useState(0)
  const [transactions, setTransactions] = useState<WalletTransactionDTO[]>([])
  const [amount, setAmount] = useState('20')
  const [loading, setLoading] = useState(false)
  const [topupLoading, setTopupLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadWallet = useCallback(async () => {
    try {
      setErr(null)
      setLoading(true)
      const [account, txs] = await Promise.all([
        walletService.getMyWallet(),
        walletService.getMyTransactions(8),
      ])
      setBalanceCents(account.balanceCents ?? 0)
      setFrozenCents(account.frozenCents ?? 0)
      setTransactions(txs ?? [])
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to load wallet')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWallet()
  }, [loadWallet])

  async function onTopup() {
    const amountNum = Number(amount)
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setErr('Please enter a valid top-up amount.')
      return
    }

    try {
      setErr(null)
      setSuccess(null)
      setTopupLoading(true)
      const updated = await walletService.topup(Math.round(amountNum * 100), 'User topup')
      setBalanceCents(updated.balanceCents ?? 0)
      setFrozenCents(updated.frozenCents ?? 0)
      const txs = await walletService.getMyTransactions(8)
      setTransactions(txs ?? [])
      setSuccess(`Top-up successful: $${amountNum.toFixed(2)}`)
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Top-up failed')
    } finally {
      setTopupLoading(false)
    }
  }

  const txTitle = useMemo(() => {
    if (role === Role.RUNNER) return 'Recent Transactions (Income / Settlement / Refund)'
    if (role === Role.MERCHANT) return 'Recent Transactions (Settlement / Refund / Payment)'
    return 'Recent Transactions (Top-up / Payment / Refund / Settlement)'
  }, [role])

  return (
    <div>
      <div className="orders-top">
        <h2 className="page-title">Wallet</h2>
        <button className="btn btn-outline" onClick={loadWallet} disabled={loading || topupLoading}>
          Refresh
        </button>
      </div>

      {err ? <div className="error">{err}</div> : null}
      {success ? <div className="success">{success}</div> : null}

      <section className="wallet-balance-grid">
        <div className="wallet-balance-card">
          <div className="wallet-balance-label">Available Balance</div>
          <div className="wallet-balance-value">{centsToMoney(balanceCents)}</div>
        </div>
        <div className="wallet-balance-card wallet-balance-card-muted">
          <div className="wallet-balance-label">Frozen</div>
          <div className="wallet-balance-value">{centsToMoney(frozenCents)}</div>
        </div>
      </section>

      {canTopup ? (
        <section className="wallet-topup-panel">
          <h3 className="wallet-section-title">Top Up</h3>
          <div className="wallet-topup-row">
            <input
              className="input"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount in SGD"
            />
            <button className="btn" onClick={onTopup} disabled={topupLoading}>
              {topupLoading ? 'Processing...' : 'Top Up'}
            </button>
          </div>
        </section>
      ) : null}

      <section className="wallet-tx-panel">
        <h3 className="wallet-section-title">{txTitle}</h3>
        {loading ? <div className="muted">Loading...</div> : null}
        {!loading && transactions.length === 0 ? <div className="muted">No transactions yet.</div> : null}
        {!loading && transactions.length > 0 ? (
          <ul className="wallet-tx-list">
            {transactions.map((tx) => (
              <li key={tx.id} className="wallet-tx-item">
                <div className="wallet-tx-main">
                  <div className="wallet-tx-type">{tx.bizType}</div>
                  <div className="wallet-tx-meta">
                    {tx.orderId ? `Order #${tx.orderId}` : 'No order'} {tx.remark ? `· ${tx.remark}` : ''}
                  </div>
                </div>
                <div className={`wallet-tx-amount ${tx.direction === 'CREDIT' ? 'in' : 'out'}`}>
                  {tx.direction === 'CREDIT' ? '+' : '-'}
                  {centsToMoney(tx.amountCents)}
                </div>
                <div className="wallet-tx-time">{formatTime(tx.createdAt)}</div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  )
}

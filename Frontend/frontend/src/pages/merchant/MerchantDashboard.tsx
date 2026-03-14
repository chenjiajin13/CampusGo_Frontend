import { useEffect, useMemo, useState } from 'react'
import { orderService } from '@/lib/orderService'
import { MerchantAnalyticsDTO } from '@/types/api'

function centsToMoney(cents?: number): string {
  return `$${((cents ?? 0) / 100).toFixed(2)}`
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function toIsoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function isoWeekToMonday(isoWeek: string): string | null {
  const m = isoWeek.match(/^(\d{4})-W(\d{2})$/)
  if (!m) return null
  const year = Number(m[1])
  const week = Number(m[2])
  if (!Number.isFinite(year) || !Number.isFinite(week) || week < 1 || week > 53) return null

  const jan4 = new Date(Date.UTC(year, 0, 4))
  const jan4Day = jan4.getUTCDay() || 7
  const firstMonday = new Date(jan4)
  firstMonday.setUTCDate(jan4.getUTCDate() - jan4Day + 1)

  const monday = new Date(firstMonday)
  monday.setUTCDate(firstMonday.getUTCDate() + (week - 1) * 7)
  return monday.toISOString().slice(0, 10)
}

function niceScaleMax(value: number): number {
  if (value <= 0) return 1000
  const exponent = Math.floor(Math.log10(value))
  const magnitude = Math.pow(10, exponent)
  const normalized = value / magnitude
  if (normalized <= 1) return magnitude
  if (normalized <= 2) return 2 * magnitude
  if (normalized <= 5) return 5 * magnitude
  return 10 * magnitude
}

export default function MerchantDashboard() {
  const [analytics, setAnalytics] = useState<MerchantAnalyticsDTO | null>(null)
  const [weekInput, setWeekInput] = useState(() => toIsoWeek(getMonday(new Date())))
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function loadData(weekStart?: string) {
    try {
      setErr(null)
      setLoading(true)
      const data = await orderService.getMerchantAnalytics(weekStart)
      setAnalytics(data)
      if (data?.weekStart) {
        const nextWeek = toIsoWeek(new Date(`${data.weekStart}T00:00:00`))
        setWeekInput((prev) => (prev === nextWeek ? prev : nextWeek))
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to load merchant analytics')
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const monday = isoWeekToMonday(weekInput)
    if (!monday) return
    loadData(monday)
  }, [weekInput])

  const weekRevenueRows = useMemo(() => analytics?.dailyRevenue ?? [], [analytics])
  const maxDaily = useMemo(() => Math.max(0, ...weekRevenueRows.map((x) => x.amountCents ?? 0)), [weekRevenueRows])
  const scaleMax = useMemo(() => niceScaleMax(maxDaily), [maxDaily])
  const yTicks = useMemo(() => {
    const part = scaleMax / 4
    return [4, 3, 2, 1, 0].map((n) => Math.round(part * n))
  }, [scaleMax])

  const pieInfo = useMemo(() => {
    const rows = analytics?.itemShare ?? []
    const total = rows.reduce((s, x) => s + (x.quantity ?? 0), 0)
    if (!rows.length || total <= 0) {
      return {
        gradient: 'conic-gradient(#e2e8f0 0deg 360deg)',
        rows: [] as Array<{ label: string; percent: number; color: string; qty: number; amountCents: number }>,
      }
    }

    const palette = ['#2563eb', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#0ea5e9']
    let cursor = 0
    const detail = rows.map((r, idx) => {
      const qty = r.quantity ?? 0
      const percent = qty <= 0 ? 0 : (qty / total) * 100
      const color = palette[idx % palette.length]
      const start = cursor
      const end = cursor + percent * 3.6
      cursor = end
      return {
        label: r.itemName || `Item ${idx + 1}`,
        percent,
        color,
        qty,
        amountCents: r.amountCents ?? 0,
        start,
        end,
      }
    })

    const gradient = `conic-gradient(${detail.map((x) => `${x.color} ${x.start}deg ${x.end}deg`).join(', ')})`
    return { gradient, rows: detail }
  }, [analytics])

  const topRows = useMemo(() => {
    const base = pieInfo.rows.slice(0, 5)
    while (base.length < 5) {
      base.push({ label: '-', percent: 0, color: '#cbd5e1', qty: 0, amountCents: 0 })
    }
    return base
  }, [pieInfo])

  return (
    <div>
      <div className="orders-top">
        <h2 className="page-title">Merchant Dashboard</h2>
        <button
          className="btn btn-outline"
          onClick={() => loadData(isoWeekToMonday(weekInput) || undefined)}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {err ? <div className="error">{err}</div> : null}

      <section className="merchant-kpi-panel">
        <div className="merchant-kpi-grid">
          <div className="merchant-kpi-card">
            <div className="merchant-kpi-label">Total Revenue</div>
            <div className="merchant-kpi-value">{centsToMoney(analytics?.lifetimeRevenueCents)}</div>
          </div>
          <div className="merchant-kpi-card merchant-kpi-card-alt">
            <div className="merchant-kpi-label">Last 12 Months</div>
            <div className="merchant-kpi-value">{centsToMoney(analytics?.annualRevenueCents)}</div>
          </div>
          <div className="merchant-kpi-card merchant-kpi-card-dark">
            <div className="merchant-kpi-label">Completed Orders</div>
            <div className="merchant-kpi-value">{analytics?.completedOrderCount ?? 0}</div>
          </div>
        </div>

        <div className="merchant-kpi-table-wrap">
          <table className="merchant-kpi-table">
            <thead>
              <tr>
                <th>Revenue Summary</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>All-time</td>
                <td>{centsToMoney(analytics?.lifetimeRevenueCents)}</td>
              </tr>
              <tr>
                <td>Last 12 months</td>
                <td>{centsToMoney(analytics?.annualRevenueCents)}</td>
              </tr>
              <tr>
                <td>Selected week ({analytics?.weekStart || '-'})</td>
                <td>{centsToMoney(analytics?.selectedWeekRevenueCents)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="merchant-chart-grid">
        <div className="merchant-chart-panel merchant-chart-panel-equal">
          <div className="merchant-chart-head">
            <h3 className="merchant-chart-title">Weekly Revenue</h3>
            <div className="merchant-week-picker">
              <input
                className="input"
                type="week"
                value={weekInput}
                onChange={(e) => setWeekInput(e.target.value)}
              />
            </div>
          </div>

          <div className="merchant-week-range">
            {analytics?.weekStart || '-'} to {analytics?.weekEnd || '-'}
          </div>

          <div className="merchant-weekly-body">
            <div className="merchant-y-axis">
              {yTicks.map((tick) => (
                <div key={tick} className="merchant-y-tick">{centsToMoney(tick)}</div>
              ))}
            </div>
            <div className="merchant-bar-chart">
              {weekRevenueRows.map((x) => {
                const value = x.amountCents ?? 0
                const h = Math.max(8, Math.round((value / Math.max(1, scaleMax)) * 180))
                return (
                  <div key={x.day} className="merchant-bar-item">
                    <div className="merchant-bar-value">{centsToMoney(value)}</div>
                    <div className="merchant-bar-track">
                      <div className="merchant-bar" style={{ height: `${h}px` }} />
                    </div>
                    <div className="merchant-bar-label">{x.day.slice(5)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="merchant-chart-panel merchant-chart-panel-equal">
          <h3 className="merchant-chart-title">Item Share (Completed Orders)</h3>

          {pieInfo.rows.length === 0 ? (
            <div className="muted" style={{ marginTop: 20 }}>No completed-item data yet.</div>
          ) : (
            <div className="merchant-pie-layout">
              <div className="merchant-pie-wrap">
                <div className="merchant-pie" style={{ background: pieInfo.gradient }} />
              </div>

              <div className="merchant-top-items">
                {topRows.map((r, idx) => (
                  <div className="merchant-top-row" key={`${r.label}-${idx}`}>
                    <div className="merchant-top-name">
                      <span className="dot" style={{ background: r.color }} />
                      <span>{r.label}</span>
                    </div>
                    <div className="merchant-top-bar-wrap">
                      <div className="merchant-top-bar" style={{ width: `${Math.max(0, Math.min(100, r.percent))}%` }} />
                    </div>
                    <div className="merchant-top-meta">{r.percent.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

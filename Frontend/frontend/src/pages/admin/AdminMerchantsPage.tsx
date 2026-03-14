import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { merchantService } from '@/lib/merchantService'
import { MerchantDTO } from '@/types/api'

export default function AdminMerchantsPage() {
  const nav = useNavigate()
  const [rows, setRows] = useState<MerchantDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setErr(null)
      const data = await merchantService.listMerchants()
      setRows(data ?? [])
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to load merchants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onDelete(m: MerchantDTO) {
    if (!window.confirm(`Delete merchant ${m.name || m.id}?`)) return
    try {
      setActionId(m.id)
      setErr(null)
      await merchantService.deleteMerchant(m.id)
      await load()
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to delete merchant')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <div className="orders-top">
        <h2 className="page-title">Merchants</h2>
        <button className="btn btn-outline" onClick={load} disabled={loading}>Refresh</button>
      </div>
      {err ? <div className="error">{err}</div> : null}
      {loading ? <div className="muted">Loading...</div> : null}
      {!loading ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td>{x.name || '-'}</td>
                  <td>{x.phone || '-'}</td>
                  <td>{x.address || '-'}</td>
                  <td>{x.status || '-'}</td>
                  <td>
                    <div className="admin-action-row">
                      <button className="btn btn-outline" onClick={() => nav(`/admin/merchants/${x.id}`)} disabled={actionId === x.id}>Edit</button>
                      <button className="btn" onClick={() => onDelete(x)} disabled={actionId === x.id}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? <div className="muted">No merchants found.</div> : null}
        </div>
      ) : null}
    </div>
  )
}

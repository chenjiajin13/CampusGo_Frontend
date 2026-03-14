import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { runnerService } from '@/lib/runnerService'
import { RunnerDTO } from '@/types/api'

function locationText(r: RunnerDTO): string {
  if (r.latitude == null || r.longitude == null) return '-'
  return `${r.latitude}, ${r.longitude}`
}

export default function AdminRunnersPage() {
  const nav = useNavigate()
  const [rows, setRows] = useState<RunnerDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setErr(null)
      const data = await runnerService.listRunners()
      setRows(data ?? [])
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to load runners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onDelete(r: RunnerDTO) {
    if (!window.confirm(`Delete runner ${r.username || r.id}?`)) return
    try {
      setActionId(r.id)
      setErr(null)
      await runnerService.deleteRunner(r.id)
      await load()
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to delete runner')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <div className="orders-top">
        <h2 className="page-title">Runners</h2>
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
                <th>Vehicle</th>
                <th>Status</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td>{x.username || '-'}</td>
                  <td>{x.phone || '-'}</td>
                  <td>{x.vehicleType || '-'}</td>
                  <td>{x.status || '-'}</td>
                  <td>{locationText(x)}</td>
                  <td>
                    <div className="admin-action-row">
                      <button className="btn btn-outline" onClick={() => nav(`/admin/runners/${x.id}`)} disabled={actionId === x.id}>Edit</button>
                      <button className="btn" onClick={() => onDelete(x)} disabled={actionId === x.id}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? <div className="muted">No runners found.</div> : null}
        </div>
      ) : null}
    </div>
  )
}

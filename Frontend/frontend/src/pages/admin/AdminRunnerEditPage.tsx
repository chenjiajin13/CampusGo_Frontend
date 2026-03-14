import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { runnerService } from '@/lib/runnerService'
import { VehicleType } from '@/types/api'

export default function AdminRunnerEditPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const runnerId = Number(id)
  const [form, setForm] = useState({ username: '', phone: '', vehicleType: VehicleType.BICYCLE })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const r = await runnerService.getRunner(runnerId)
        setForm({
          username: r.username || '',
          phone: r.phone || '',
          vehicleType: (r.vehicleType as VehicleType) || VehicleType.BICYCLE,
        })
      } catch (e: any) {
        setErr(e?.response?.data?.message || e?.message || 'Failed to load runner')
      } finally {
        setLoading(false)
      }
    })()
  }, [runnerId])

  async function save(e: FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setErr(null)
      await runnerService.updateRunner(runnerId, {
        phone: form.phone || undefined,
        vehicleType: form.vehicleType,
      })
      nav('/admin/runners')
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to save runner')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="page-title">Edit Runner</h2>
      {err ? <div className="error">{err}</div> : null}
      {loading ? <div className="muted">Loading...</div> : null}
      {!loading ? (
        <form className="profile-card" onSubmit={save}>
          <div className="profile-grid">
            <div className="field"><label className="label">Username</label><input className="input" value={form.username} readOnly /></div>
            <div className="field"><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="field"><label className="label">Vehicle Type</label><select className="input" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value as VehicleType })}><option value={VehicleType.FOOT}>FOOT</option><option value={VehicleType.BICYCLE}>BICYCLE</option><option value={VehicleType.E_SCOOTER}>E_SCOOTER</option><option value={VehicleType.MOTORBIKE}>MOTORBIKE</option></select></div>
          </div>
          <div className="profile-actions" style={{ gap: 10 }}>
            <button className="btn btn-outline" type="button" onClick={() => nav('/admin/runners')}>Cancel</button>
            <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

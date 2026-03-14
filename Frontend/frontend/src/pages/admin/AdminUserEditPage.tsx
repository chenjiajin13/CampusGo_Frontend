import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { userService } from '@/lib/userService'

export default function AdminUserEditPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const userId = Number(id)
  const [form, setForm] = useState({ username: '', email: '', phone: '', address: '', enabled: true })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const u = await userService.getUser(userId)
        setForm({
          username: u.username || '',
          email: u.email || '',
          phone: u.phone || '',
          address: u.address || '',
          enabled: u.enabled !== false,
        })
      } catch (e: any) {
        setErr(e?.response?.data?.message || e?.message || 'Failed to load user')
      } finally {
        setLoading(false)
      }
    })()
  }, [userId])

  async function save(e: FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setErr(null)
      await userService.updateUser(userId, {
        email: form.email || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        enabled: form.enabled,
      })
      nav('/admin/users')
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="page-title">Edit User</h2>
      {err ? <div className="error">{err}</div> : null}
      {loading ? <div className="muted">Loading...</div> : null}
      {!loading ? (
        <form className="profile-card" onSubmit={save}>
          <div className="profile-grid">
            <div className="field"><label className="label">Username</label><input className="input" value={form.username} readOnly /></div>
            <div className="field"><label className="label">Email</label><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="field"><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="field"><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="field"><label className="label">Enabled</label><select className="input" value={form.enabled ? 'true' : 'false'} onChange={(e) => setForm({ ...form, enabled: e.target.value === 'true' })}><option value="true">true</option><option value="false">false</option></select></div>
          </div>
          <div className="profile-actions" style={{ gap: 10 }}>
            <button className="btn btn-outline" type="button" onClick={() => nav('/admin/users')}>Cancel</button>
            <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

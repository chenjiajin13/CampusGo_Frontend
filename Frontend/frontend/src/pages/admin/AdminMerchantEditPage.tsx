import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { merchantService } from '@/lib/merchantService'

export default function AdminMerchantEditPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const merchantId = Number(id)
  const [form, setForm] = useState({ name: '', phone: '', address: '', tagsText: '' })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const m = await merchantService.getMerchant(merchantId)
        setForm({
          name: m.name || '',
          phone: m.phone || '',
          address: m.address || '',
          tagsText: (m.tags || []).join(', '),
        })
      } catch (e: any) {
        setErr(e?.response?.data?.message || e?.message || 'Failed to load merchant')
      } finally {
        setLoading(false)
      }
    })()
  }, [merchantId])

  async function save(e: FormEvent) {
    e.preventDefault()
    try {
      setSaving(true)
      setErr(null)
      await merchantService.updateMerchant(merchantId, {
        name: form.name || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined,
        tags: form.tagsText ? form.tagsText.split(',').map((x) => x.trim()).filter(Boolean) : undefined,
      })
      nav('/admin/merchants')
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to save merchant')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="page-title">Edit Merchant</h2>
      {err ? <div className="error">{err}</div> : null}
      {loading ? <div className="muted">Loading...</div> : null}
      {!loading ? (
        <form className="profile-card" onSubmit={save}>
          <div className="profile-grid">
            <div className="field"><label className="label">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="field"><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="field"><label className="label">Address</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="field"><label className="label">Tags</label><input className="input" value={form.tagsText} onChange={(e) => setForm({ ...form, tagsText: e.target.value })} /></div>
          </div>
          <div className="profile-actions" style={{ gap: 10 }}>
            <button className="btn btn-outline" type="button" onClick={() => nav('/admin/merchants')}>Cancel</button>
            <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

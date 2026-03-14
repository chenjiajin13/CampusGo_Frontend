import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/state/AuthContext'
import { Role } from '@/types/role'
import { VehicleType } from '@/types/api'
import { userService } from '@/lib/userService'
import { runnerService } from '@/lib/runnerService'
import { merchantService } from '@/lib/merchantService'
import { adminService } from '@/lib/adminService'

type FormState = {
  username: string
  name: string
  email: string
  phone: string
  address: string
  vehicleType: VehicleType
  tagsText: string
  password: string
}

const initialForm: FormState = {
  username: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  vehicleType: VehicleType.BICYCLE,
  tagsText: '',
  password: '',
}

export default function UserProfilePage() {
  const { user, setUser } = useAuth()
  const role = ((user as any)?.role || Role.USER) as Role

  const [form, setForm] = useState<FormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        if (role === Role.USER) {
          const profile = await userService.getMe()
          setForm((prev) => ({
            ...prev,
            username: profile.username || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
          }))
          return
        }

        if (role === Role.RUNNER) {
          const profile = await runnerService.getMe()
          setForm((prev) => ({
            ...prev,
            username: profile.username || '',
            phone: profile.phone || '',
            vehicleType: profile.vehicleType || VehicleType.BICYCLE,
          }))
          return
        }

        if (role === Role.MERCHANT) {
          const profile = await merchantService.getMe()
          setForm((prev) => ({
            ...prev,
            name: profile.name || '',
            phone: profile.phone || '',
            address: profile.address || '',
            tagsText: (profile.tags || []).join(', '),
          }))
          return
        }

        if (role === Role.ADMIN) {
          const profile = await adminService.getMe()
          setForm((prev) => ({
            ...prev,
            username: profile.username || '',
            email: profile.email || '',
            phone: profile.phone || '',
          }))
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    })()
  }, [role])

  const canSubmit = useMemo(() => !saving, [saving])

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      if (role === Role.USER) {
        const updated = await userService.updateMe({
          email: form.email || undefined,
          phone: form.phone || undefined,
          address: form.address || undefined,
        })
        const mergedUser = { ...(user || {}), username: updated.username || form.username }
        setUser(mergedUser as any)
        localStorage.setItem('user', JSON.stringify(mergedUser))
      } else if (role === Role.RUNNER) {
        const updated = await runnerService.updateMe({
          phone: form.phone || undefined,
          vehicleType: form.vehicleType,
        })
        const mergedUser = { ...(user || {}), username: updated.username || form.username }
        setUser(mergedUser as any)
        localStorage.setItem('user', JSON.stringify(mergedUser))
      } else if (role === Role.MERCHANT) {
        await merchantService.updateMe({
          name: form.name || undefined,
          phone: form.phone || undefined,
          address: form.address || undefined,
          tags: form.tagsText ? form.tagsText.split(',').map((x) => x.trim()).filter(Boolean) : undefined,
        })
      } else if (role === Role.ADMIN) {
        const updated = await adminService.updateMe({
          email: form.email || undefined,
          phone: form.phone || undefined,
        })
        const mergedUser = { ...(user || {}), username: updated.username || form.username }
        setUser(mergedUser as any)
        localStorage.setItem('user', JSON.stringify(mergedUser))
      }

      if ((form.password || '').trim()) {
        if (role === Role.USER) await userService.updateMyPassword(form.password.trim())
        if (role === Role.RUNNER) await runnerService.updateMyPassword(form.password.trim())
        if (role === Role.MERCHANT) await merchantService.updateMyPassword(form.password.trim())
        if (role === Role.ADMIN) await adminService.updateMyPassword(form.password.trim())
      }

      setSuccess('Profile updated successfully.')
      updateField('password', '')
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const showEmail = role === Role.USER || role === Role.ADMIN
  const showAddress = role === Role.USER || role === Role.MERCHANT
  const showVehicle = role === Role.RUNNER
  const showTags = role === Role.MERCHANT
  const showUsername = role === Role.USER || role === Role.RUNNER || role === Role.ADMIN
  const showStoreName = role === Role.MERCHANT

  return (
    <div>
      <h2 className="page-title">My Profile</h2>

      {loading ? <div className="muted">Loading profile...</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {success ? <div className="success">{success}</div> : null}

      <form className="profile-card" onSubmit={onSubmit}>
        <div className="profile-grid">
          {showUsername ? (
            <div className="field">
              <label className="label">Username</label>
              <input className="input" value={form.username} readOnly />
            </div>
          ) : null}

          {showStoreName ? (
            <div className="field">
              <label className="label">Store Name</label>
              <input className="input" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            </div>
          ) : null}

          {showEmail ? (
            <div className="field">
              <label className="label">Email</label>
              <input className="input" value={form.email} onChange={(e) => updateField('email', e.target.value)} />
            </div>
          ) : null}

          <div className="field">
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
          </div>

          {showAddress ? (
            <div className="field">
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={(e) => updateField('address', e.target.value)} />
            </div>
          ) : null}

          {showVehicle ? (
            <div className="field">
              <label className="label">Vehicle Type</label>
              <select className="input" value={form.vehicleType} onChange={(e) => updateField('vehicleType', e.target.value as VehicleType)}>
                <option value={VehicleType.FOOT}>FOOT</option>
                <option value={VehicleType.BICYCLE}>BICYCLE</option>
                <option value={VehicleType.E_SCOOTER}>E_SCOOTER</option>
                <option value={VehicleType.MOTORBIKE}>MOTORBIKE</option>
              </select>
            </div>
          ) : null}

          {showTags ? (
            <div className="field">
              <label className="label">Tags (comma separated)</label>
              <input className="input" value={form.tagsText} onChange={(e) => updateField('tagsText', e.target.value)} />
            </div>
          ) : null}

          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label className="label">New Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              placeholder="Enter new password (optional)"
            />
            <div className="muted" style={{ marginTop: 6 }}>Leave blank if you do not want to change password.</div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn" disabled={!canSubmit} type="submit">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

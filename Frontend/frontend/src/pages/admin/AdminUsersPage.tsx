import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '@/lib/userService'
import { UserDTO } from '@/types/api'

export default function AdminUsersPage() {
  const nav = useNavigate()
  const [rows, setRows] = useState<UserDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState<number | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setErr(null)
      const data = await userService.listUsers()
      setRows(data ?? [])
    } catch (e: any) {
      const code = e?.response?.status
      if (code === 404 || code === 405 || code === 403) {
        setErr('User list API is not available for admin yet. Backend needs a list endpoint.')
      } else {
        setErr(e?.response?.data?.message || e?.message || 'Failed to load users')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onDelete(u: UserDTO) {
    if (!window.confirm(`Delete user ${u.username || u.id}?`)) return
    try {
      setActionId(u.id)
      setErr(null)
      await userService.deleteUser(u.id)
      await load()
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to delete user')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div>
      <div className="orders-top">
        <h2 className="page-title">Users</h2>
        <button className="btn btn-outline" onClick={load} disabled={loading}>Refresh</button>
      </div>
      {err ? <div className="error">{err}</div> : null}
      {loading ? <div className="muted">Loading...</div> : null}
      {!loading && rows.length > 0 ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Email</th>
                <th>Enabled</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id}>
                  <td>{x.username || '-'}</td>
                  <td>{x.phone || '-'}</td>
                  <td>{x.address || '-'}</td>
                  <td>{x.email || '-'}</td>
                  <td>{x.enabled === false ? 'No' : 'Yes'}</td>
                  <td>
                    <div className="admin-action-row">
                      <button className="btn btn-outline" onClick={() => nav(`/admin/users/${x.id}`)} disabled={actionId === x.id}>Edit</button>
                      <button className="btn" onClick={() => onDelete(x)} disabled={actionId === x.id}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {!loading && !err && rows.length === 0 ? <div className="muted">No users found.</div> : null}
    </div>
  )
}

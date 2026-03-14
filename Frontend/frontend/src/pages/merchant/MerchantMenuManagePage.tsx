import { FormEvent, useEffect, useMemo, useState } from 'react'
import { merchantService } from '@/lib/merchantService'
import { MenuItemDTO } from '@/types/api'

type RowEditState = {
  id: number
  name: string
  priceText: string
  enabled: boolean
}

function centsToMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function mapToEditState(items: MenuItemDTO[]): RowEditState[] {
  return (items || []).map((x) => ({
    id: x.id,
    name: x.name,
    priceText: (x.priceCents / 100).toFixed(2),
    enabled: !!x.enabled,
  }))
}

export default function MerchantMenuManagePage() {
  const [merchantId, setMerchantId] = useState<number | null>(null)

  const [rows, setRows] = useState<MenuItemDTO[]>([])
  const [drafts, setDrafts] = useState<Record<number, RowEditState>>({})

  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newEnabled, setNewEnabled] = useState(true)

  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const totalEnabled = useMemo(() => rows.filter((x) => x.enabled).length, [rows])

  async function loadMerchantIdAndMenu() {
    try {
      setLoading(true)
      setError(null)

      const me = await merchantService.getMe()
      if (!me?.id) {
        throw new Error('Merchant id not found in profile')
      }
      setMerchantId(me.id)

      const menu = await merchantService.getMerchantMenu(me.id)
      setRows(menu ?? [])
      const mapped = mapToEditState(menu ?? [])
      const dict: Record<number, RowEditState> = {}
      mapped.forEach((x) => {
        dict[x.id] = x
      })
      setDrafts(dict)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load menu')
      setRows([])
      setDrafts({})
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMerchantIdAndMenu()
  }, [])

  function updateDraft(id: number, patch: Partial<RowEditState>) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }))
  }

  function isRowChanged(item: MenuItemDTO): boolean {
    const d = drafts[item.id]
    if (!d) return false
    const draftPrice = Number(d.priceText)
    if (!Number.isFinite(draftPrice)) return true
    return d.name.trim() !== (item.name || '').trim() || Math.round(draftPrice * 100) !== item.priceCents || d.enabled !== !!item.enabled
  }

  async function addItem(e: FormEvent) {
    e.preventDefault()
    if (!merchantId) {
      setError('Merchant identity not ready, please refresh')
      return
    }

    const p = Number(newPrice)
    if (!newName.trim() || !Number.isFinite(p) || p <= 0) {
      setError('Please enter a valid item name and price')
      return
    }

    try {
      setCreating(true)
      setError(null)
      setSuccess(null)
      await merchantService.addMenuItem(merchantId, {
        name: newName.trim(),
        priceCents: Math.round(p * 100),
        enabled: newEnabled,
      })
      setNewName('')
      setNewPrice('')
      setNewEnabled(true)
      setSuccess('Item added')
      await loadMerchantIdAndMenu()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to add item')
    } finally {
      setCreating(false)
    }
  }

  async function saveRow(item: MenuItemDTO) {
    if (!merchantId) return
    const d = drafts[item.id]
    if (!d) return

    const p = Number(d.priceText)
    if (!d.name.trim() || !Number.isFinite(p) || p <= 0) {
      setError('Each item must have a valid name and price')
      return
    }

    try {
      setSavingId(item.id)
      setError(null)
      setSuccess(null)
      await merchantService.updateMenuItem(merchantId, item.id, {
        name: d.name.trim(),
        priceCents: Math.round(p * 100),
        enabled: d.enabled,
      })
      setSuccess(`Saved: ${d.name}`)
      await loadMerchantIdAndMenu()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to save item')
    } finally {
      setSavingId(null)
    }
  }

  async function removeItem(item: MenuItemDTO) {
    if (!merchantId) return
    if (!window.confirm(`Delete ${item.name}?`)) return

    try {
      setDeletingId(item.id)
      setError(null)
      setSuccess(null)
      await merchantService.deleteMenuItem(merchantId, item.id)
      setSuccess(`Deleted: ${item.name}`)
      await loadMerchantIdAndMenu()
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete item')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="orders-top">
        <h2 className="page-title">Menu Management</h2>
        <button className="btn btn-outline" onClick={loadMerchantIdAndMenu} disabled={loading || creating || savingId != null}>
          Refresh
        </button>
      </div>

      <div className="menu-admin-summary">
        <div className="chip">Total items: <strong>{rows.length}</strong></div>
        <div className="chip">Enabled: <strong>{totalEnabled}</strong></div>
      </div>

      {error ? <div className="error">{error}</div> : null}
      {success ? <div className="success">{success}</div> : null}

      <form className="menu-admin-create" onSubmit={addItem}>
        <h3 className="menu-admin-title">Add New Item</h3>
        <div className="menu-admin-row menu-admin-row-create">
          <div className="menu-admin-row-main">
            <div className="field">
              <label className="label">Item Name</label>
              <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Chicken Burger" />
            </div>
            <div className="field">
              <label className="label">Price (SGD)</label>
              <input className="input" type="number" min="0.1" step="0.1" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 7.90" />
            </div>
            <div className="field">
              <label className="label">Enabled</label>
              <select className="input" value={newEnabled ? 'true' : 'false'} onChange={(e) => setNewEnabled(e.target.value === 'true')}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>
          <div className="menu-admin-row-actions menu-admin-create-action">
            <button className="btn" type="submit" disabled={creating || loading}>
              {creating ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </div>
      </form>

      <section className="menu-admin-list-wrap">
        <h3 className="menu-admin-title">Existing Items</h3>
        {loading ? <div className="muted">Loading...</div> : null}

        {!loading && rows.length === 0 ? <div className="muted">No menu items yet.</div> : null}

        {!loading && rows.length > 0 ? (
          <div className="menu-admin-list">
            {rows.map((item) => {
              const d = drafts[item.id] || {
                id: item.id,
                name: item.name,
                priceText: (item.priceCents / 100).toFixed(2),
                enabled: item.enabled,
              }
              const changed = isRowChanged(item)
              const busy = savingId === item.id || deletingId === item.id
              return (
                <div className="menu-admin-row" key={item.id}>
                  <div className="menu-admin-row-main">
                    <div className="field">
                      <label className="label">Name</label>
                      <input className="input" value={d.name} onChange={(e) => updateDraft(item.id, { name: e.target.value })} />
                    </div>

                    <div className="field">
                      <label className="label">Price (SGD)</label>
                      <input
                        className="input"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={d.priceText}
                        onChange={(e) => updateDraft(item.id, { priceText: e.target.value })}
                      />
                      <div className="muted" style={{ marginTop: 6 }}>Current: {centsToMoney(item.priceCents)}</div>
                    </div>

                    <div className="field">
                      <label className="label">Status</label>
                      <select className="input" value={d.enabled ? 'true' : 'false'} onChange={(e) => updateDraft(item.id, { enabled: e.target.value === 'true' })}>
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    </div>
                  </div>

                  <div className="menu-admin-row-actions">
                    <button className="btn btn-outline" disabled={!changed || busy} onClick={() => saveRow(item)}>
                      {savingId === item.id ? 'Saving...' : 'Save'}
                    </button>
                    <button className="btn" disabled={busy} onClick={() => removeItem(item)}>
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </section>
    </div>
  )
}

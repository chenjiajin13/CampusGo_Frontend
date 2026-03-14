import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { merchantService } from '@/lib/merchantService';
import { orderService } from '@/lib/orderService';
import { MenuItemDTO, MerchantDTO } from '@/types/api';
import { useCart } from '@/state/CartContext';

function formatCents(v: number): string {
  return `$${(v / 100).toFixed(2)}`;
}

export default function MerchantMenuPage() {
  const { merchantId } = useParams();
  const nav = useNavigate();
  const { setSummary } = useCart();

  const merchantIdNum = Number(merchantId);
  const [merchant, setMerchant] = useState<MerchantDTO | null>(null);
  const [menu, setMenu] = useState<MenuItemDTO[]>([]);
  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});
  const [address, setAddress] = useState('NUS Campus');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!merchantIdNum) return;

    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const [merchantData, menuData] = await Promise.all([
          merchantService.getMerchant(merchantIdNum),
          merchantService.getMerchantMenu(merchantIdNum),
        ]);
        setMerchant(merchantData);
        setMenu(menuData.filter((x) => x.enabled !== false));
      } catch (e: any) {
        setErr(e?.response?.data?.message || e.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    })();
  }, [merchantIdNum]);

  const selected = useMemo(() => {
    return menu
      .map((m) => ({ item: m, qty: qtyMap[m.id] || 0 }))
      .filter((x) => x.qty > 0);
  }, [menu, qtyMap]);

  const totalQty = useMemo(() => selected.reduce((s, x) => s + x.qty, 0), [selected]);
  const totalCents = useMemo(() => selected.reduce((s, x) => s + x.item.priceCents * x.qty, 0), [selected]);

  function changeQty(id: number, next: number) {
    setQtyMap((prev) => ({ ...prev, [id]: Math.max(0, next) }));
  }

  async function addSelectedToCart() {
    if (!selected.length) {
      setErr('Please select at least one item.');
      return;
    }

    try {
      setErr(null);
      setSubmitting(true);

      for (const row of selected) {
        await orderService.addCartItem({
          merchantId: merchantIdNum,
          menuItemId: row.item.id,
          quantity: row.qty,
        });
      }

      const summary = await orderService.getCart();
      setSummary(summary);
      nav('/user/checkout');
    } catch (e: any) {
      if (e?.response?.status === 401) {
        setErr('Session expired. Please login again.');
      } else {
        setErr(e?.response?.data?.message || e.message || 'Add to cart failed');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function payByWallet() {
    if (!selected.length) {
      setErr('Please select at least one item.');
      return;
    }

    try {
      setErr(null);
      setSubmitting(true);
      const detail = await orderService.quickOrder({
        merchantId: merchantIdNum,
        address,
        autoPay: true,
        items: selected.map((x) => ({
          merchantId: merchantIdNum,
          menuItemId: x.item.id,
          quantity: x.qty,
        })),
      });
      if (detail?.orderId != null) {
        localStorage.setItem('last_order_id', String(detail.orderId));
      }
      nav('/user/orders');
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Pay by wallet failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="muted">Loading menu...</div>;

  return (
    <div>
      <button className="btn btn-outline" onClick={() => nav('/user/merchants')}>Back to merchants</button>

      <h2 className="page-title" style={{ marginTop: 16 }}>{merchant?.name ?? 'Merchant Menu'}</h2>
      <p className="muted" style={{ marginTop: -8 }}>{merchant?.address ?? ''}</p>

      {err && <div className="error">{err}</div>}

      <div className="menu-layout">
        <section className="menu-panel">
          {menu.length === 0 ? (
            <div className="muted">No menu items available.</div>
          ) : (
            <ul className="menu-list">
              {menu.map((m) => {
                const qty = qtyMap[m.id] || 0;
                return (
                  <li key={m.id} className="menu-item-row">
                    <div>
                      <div className="menu-name">{m.name}</div>
                      <div className="menu-price">{formatCents(m.priceCents)}</div>
                    </div>
                    <div className="qty-stepper">
                      <button onClick={() => changeQty(m.id, qty - 1)}>-</button>
                      <span>{qty}</span>
                      <button onClick={() => changeQty(m.id, qty + 1)}>+</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="summary-panel">
          <h3>Selected Items</h3>
          {selected.length === 0 ? (
            <div className="muted">Select quantity to start.</div>
          ) : (
            <ul className="selected-list">
              {selected.map((x) => (
                <li key={x.item.id}>
                  <span>{x.item.name} x {x.qty}</span>
                  <strong>{formatCents(x.item.priceCents * x.qty)}</strong>
                </li>
              ))}
            </ul>
          )}

          <div className="summary-total">Total ({totalQty}): {formatCents(totalCents)}</div>

          <label className="label" style={{ marginTop: 12 }}>Delivery Address</label>
          <input
            className="input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter delivery address"
          />

          <div className="summary-actions">
            <button className="btn" disabled={submitting || selected.length === 0} onClick={addSelectedToCart}>
              Add to Cart
            </button>
            <button className="btn btn-secondary" disabled={submitting || selected.length === 0} onClick={payByWallet}>
              Pay by Wallet
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

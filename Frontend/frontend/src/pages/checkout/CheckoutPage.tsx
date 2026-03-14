import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../state/CartContext';
import { orderService } from '../../lib/orderService';
import { BatchCheckoutResponse } from '../../types/api';

function formatCents(v: number): string {
  return `$${(v / 100).toFixed(2)}`;
}

export default function CheckoutPage() {
  const nav = useNavigate();
  const { merchantId, items, totalCents, totalQuantity, setSummary, reset } = useCart();
  const [address, setAddress] = useState('NUS Campus');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<BatchCheckoutResponse | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const summary = await orderService.getCart();
        setSummary(summary);
      } catch {
        reset();
      }
    })();
  }, [setSummary, reset]);

  async function removeItem(menuItemId: number) {
    try {
      setErr(null);
      const summary = await orderService.removeCartItem(menuItemId);
      setSummary(summary);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Failed to remove item');
    }
  }

  async function clearCart() {
    try {
      setErr(null);
      await orderService.clearCart();
      reset();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Failed to clear cart');
    }
  }

  async function checkout(autoPay: boolean, payMethod?: 'WALLET' | 'CREDIT_CARD' | 'WECHAT' | 'PAYPAL') {
    try {
      setErr(null);
      setLoading(true);
      const detail = await orderService.checkoutCartBatch(address, autoPay, payMethod);
      setCheckoutResult(detail);
      reset();
      if (detail?.orders?.length) {
        localStorage.setItem('last_order_id', String(detail.orders[0].orderId));
      }
      nav('/user/orders');
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="page-title">Cart & Checkout</h2>
      {err && <div className="error">{err}</div>}
      {checkoutResult ? (
        <div className="success">
          Created {checkoutResult.orderCount} order(s), total {formatCents(checkoutResult.totalAmountCents)}.
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="muted">Your cart is empty. Go to merchants and pick menu items first.</div>
      ) : (
        <>
          <div className="cart-summary-top">
            <div>Merchant ID: <strong>{merchantId}</strong></div>
            <div>Total items: <strong>{totalQuantity}</strong></div>
            <div>Total: <strong>{formatCents(totalCents)}</strong></div>
          </div>

          <ul className="checkout-list">
            {items.map((i) => (
              <li key={i.menuItemId} className="checkout-item">
                <div>
                  <div className="item-title">{i.name}</div>
                  <div className="item-sub">{i.quantity} x {formatCents(i.unitPriceCents)}</div>
                </div>
                <div className="checkout-right">
                  <div>{formatCents(i.subtotalCents)}</div>
                  <button className="btn btn-outline" onClick={() => removeItem(i.menuItemId)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="checkout-actions">
            <div style={{ flex: 1 }}>
              <label className="label">Delivery Address</label>
              <input
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter delivery address"
              />
            </div>
            <button className="btn btn-outline" disabled={loading} onClick={clearCart}>Clear Cart</button>
            <button className="btn" disabled={loading} onClick={() => checkout(false)}>Place Order</button>
            <button className="btn" disabled={loading} onClick={() => checkout(true, 'WALLET')}>Pay by Wallet</button>
          </div>
        </>
      )}
    </div>
  );
}

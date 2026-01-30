import { useState } from 'react';
import { useCart } from '../../state/CartContext';
import { useAuth } from '../../state/AuthContext';
import api from '../../services/api/client';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const cart = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    try {
      setErr(null); setLoading(true);
      if (!user?.id) throw new Error('Not logged in');
      if (!cart.merchantId || cart.items.length === 0) throw new Error('Cart is empty');

      // 1) 创建订单（PENDING）
      const orderRes = await api.post('/orders', {
        userId: user.id,
        merchantId: cart.merchantId,
        items: cart.items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
        amount: cart.total
      });
      const order = orderRes.data?.data ?? orderRes.data;
      const orderId = order?.id;
      if (!orderId) throw new Error('Create order failed');

      // 2) 发起支付（选择公开 or internal 的发起接口，取决于你的后端暴露）
      const payRes = await api.post('/payments', { orderId, amount: cart.total, method: 'CARD' });
      const payment = payRes.data?.data ?? payRes.data;
      const paymentId = payment?.id;

      // 3) 开发/联调：模拟支付成功
      if (paymentId) {
        await api.post(`/internal/payments/${paymentId}/simulate/success`);
      }

      cart.clear();
      nav('/user/orders');
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="page-title">Checkout</h2>
      {err && <div className="error">{err}</div>}

      {!cart.items.length ? (
        <div className="muted">Your cart is empty.</div>
      ) : (
        <>
          <ul className="mb-4">
            {cart.items.map(i => (
              <li key={i.id} className="item mb-2">
                <div className="item-title">{i.name} × {i.qty}</div>
                <div className="item-sub">${(i.price * i.qty).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className="font-medium mb-4">Total: ${cart.total.toFixed(2)}</div>
          <button className="btn btn-primary" onClick={pay} disabled={loading}>
            {loading ? 'Processing…' : 'Pay & Place Order'}
          </button>
        </>
      )}
    </div>
  );
}

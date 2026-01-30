import { useEffect, useState } from 'react';
import { useAuth } from '../../state/AuthContext';
import api from '../../services/api/client';

type Order = {
  id: number;
  merchantId: number;
  amount: number;
  status: string;
  createdAt?: string;
  items?: string;
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        if (!user?.id) {
          setList([]);
          return;
        }
  
        const res = await api.get(`/orders`, { params: { userId: user.id } });
        setList(res.data?.data ?? res.data ?? []);
      } catch (e: any) {
        const msg = e?.response?.data?.message || e?.message || 'Failed to load orders';
        setErr(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  return (
    <div>
      <h2 className="page-title">Orders</h2>

      {err && <div className="error">{err}</div>}

      {loading ? (
        <div className="muted">Loading…</div>
      ) : list.length === 0 ? (
        <div className="muted">No orders yet.</div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((o) => (
            <li key={o.id} className="item">
              <div className="item-title">Order #{o.id}</div>
              <div className="item-sub">Merchant: {o.merchantId}</div>
              <div className="item-sub">Amount: {o.amount}</div>
              {o.items && <div className="item-sub">Items: {o.items}</div>}
              <div className="badge">{o.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

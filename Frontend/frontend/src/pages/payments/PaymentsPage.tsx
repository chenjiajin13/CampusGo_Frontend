import { useEffect, useState } from 'react';
import api from '../../services/api/client';
import { Spinner, ErrorText, Button } from '../../components/UI';
import { useAuth } from '../../state/AuthContext';

type Payment = {
  id: number;
  orderId: number;
  amountCents: number;
  status: string;
  createdAt?: string;
};

function toArray<T>(d: any): T[] {
  if (!d) return [];
  if (Array.isArray(d)) return d as T[];
  return [d as T];
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [list, setList] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setErr(null);

        const res = await api.get('/payments', {
          params: { userId: user.id },
        });

        const raw = res.data?.data ?? res.data ?? [];
        setList(toArray<Payment>(raw));
      } catch (e: any) {
        setErr(e?.response?.data?.message || e.message || 'Load payments failed');
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  async function searchByOrder() {
    if (!orderId.trim()) {
      setErr('Please enter an order ID.');
      return;
    }
    try {
      setLoading(true);
      setErr(null);

      const res = await api.get(`/payments/order/${orderId.trim()}`);
      const raw = res.data?.data ?? res.data ?? [];
      setList(toArray<Payment>(raw));
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setErr(`No payment found for order ${orderId.trim()}.`);
      } else {
        setErr(e?.response?.data?.message || e.message || 'Search failed');
      }
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="card">
      <h2 className="card-title">Payments</h2>
      {err && <ErrorText msg={err} />}

      <div className="flex gap-2 items-center mb-4">
        <input
          className="input flex-1"
          placeholder="Enter order ID, e.g. 1001"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <Button onClick={searchByOrder}>Search</Button>
      </div>

      {list.length === 0 ? (
        <div>No payments.</div>
      ) : (
        <ul className="list">
          {list.map((p) => (
            <li key={p.id} className="list-item">
              <div>
                <div className="font-medium">Payment #{p.id}</div>
                <div className="text-sm opacity-70">Order: {p.orderId}</div>
              </div>
              <div>
                ${(p.amountCents / 100).toFixed(2)} - {p.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

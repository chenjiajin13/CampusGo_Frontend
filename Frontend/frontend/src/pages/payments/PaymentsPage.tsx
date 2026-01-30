import { useEffect, useState } from 'react';
import api from '../../services/api/client';
import { Spinner, ErrorText, Button } from '../../components/UI';

type Payment = {
  id: number;
  orderId: number;
  amount: number;
  status: string;
  createdAt?: string;
};

function toArray<T>(d: any): T[] {
  if (!d) return [];
  if (Array.isArray(d)) return d as T[];
  return [d as T];
}

export default function PaymentsPage() {
  const [list, setList] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [orderId, setOrderId] = useState('');
  const [hint, setHint] = useState<string | null>(null); 

  
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        setHint(null);

        const res = await api.get('/payments', {
          params: { page: 0, size: 20, sort: 'createdAt,desc' },
        });

        const raw = res.data?.data ?? res.data?.content ?? res.data ?? [];
        setList(toArray<Payment>(raw));
      } catch (e: any) {
        if (e?.response?.status === 400) {
        
          setHint(
            'The server requires querying payments by orderId. ' +
              'Please search below with an order ID.'
          );
        } else {
          setErr(e?.response?.data?.message || e.message || 'Load payments failed');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function searchByOrder() {
    if (!orderId.trim()) {
      setErr('Please enter an order ID.');
      return;
    }
    try {
      setLoading(true);
      setErr(null);
      setHint(null);

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

      
      {hint && <p className="text-slate-500 mb-3">{hint}</p>}

      
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
                ${p.amount?.toFixed?.(2) ?? p.amount} • {p.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

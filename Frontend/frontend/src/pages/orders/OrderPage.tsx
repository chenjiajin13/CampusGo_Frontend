import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';
import api from '../../services/api/client';
import { orderService } from '../../lib/orderService';
import { Role } from '../../types/role';
import { OrderDetailDTO } from '../../types/api';

function formatCents(v?: number): string {
  if (v == null) return '-';
  return `$${(v / 100).toFixed(2)}`;
}

function isDoneStatus(status?: string): boolean {
  const s = (status || '').toUpperCase();
  return s.includes('DELIVERED') || s.includes('COMPLETED');
}

export default function OrdersPage() {
  const nav = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const role = (user?.role as Role | undefined) ?? Role.USER;

  const [orders, setOrders] = useState<OrderDetailDTO[]>([]);
  const [order, setOrder] = useState<OrderDetailDTO | null>(null);
  const [orderId, setOrderId] = useState(localStorage.getItem('last_order_id') || '');
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const title = useMemo(() => {
    if (role === Role.MERCHANT) return 'Merchant Orders';
    if (role === Role.RUNNER) return 'Runner Orders';
    return 'My Orders';
  }, [role]);

  async function loadList() {
    try {
      setErr(null);
      setLoading(true);
      setOrder(null);

      let data: OrderDetailDTO[] = [];
      if (role === Role.MERCHANT) {
        data = await orderService.listMerchantOrders();
      } else if (role === Role.RUNNER) {
        data = await orderService.listRunnerOrders();
      } else {
        data = await orderService.listMyOrders();
      }

      const sorted = [...(data ?? [])].sort((a, b) => (b.orderId ?? 0) - (a.orderId ?? 0));
      setOrders(sorted);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load orders';
      setErr(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    loadList();
    const timer = window.setInterval(() => {
      loadList();
    }, 8000);
    return () => window.clearInterval(timer);
  }, [isAuthenticated, role]);

  async function loadOrder(rawId: string) {
    if (!rawId.trim()) {
      setErr('Please enter an order ID.');
      setOrder(null);
      return;
    }

    try {
      setErr(null);
      setLoading(true);
      const res = await api.get(`/orders/${rawId.trim()}`);
      const data = res.data?.data ?? res.data;
      setOrder(data ?? null);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load order';
      setErr(msg);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  async function completeOrder(orderIdValue?: number) {
    if (role !== Role.RUNNER || !orderIdValue) return;
    try {
      setErr(null);
      setActionLoadingId(orderIdValue);
      await orderService.completeRunnerOrder(orderIdValue);
      await loadList();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to complete order');
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div>
      <div className="orders-top">
        <h2 className="page-title">{title}</h2>
        <button className="btn btn-outline" onClick={loadList} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="search-row">
        <input
          className="input search-input"
          placeholder="Enter order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button className="btn" onClick={() => loadOrder(orderId)} disabled={loading}>
          Query
        </button>
      </div>

      {err && <div className="error">{err}</div>}

      {loading ? <div className="muted">Loading...</div> : null}

      {order ? (
        <div className="item" style={{ marginBottom: 12 }}>
          <div className="item-title">Order #{order.orderId}</div>
          <div className="item-sub">Status: {order.status}</div>
          <div className="item-sub">Amount: {formatCents(order.amountCents)}</div>
          {order.paymentStatus ? <div className="item-sub">Payment: {order.paymentStatus}</div> : null}
        </div>
      ) : null}

      {orders.length === 0 && !loading && !order ? (
        <div className="muted">No orders found.</div>
      ) : null}

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((x, idx) => (
            <div className="item" key={x.orderId ?? idx}>
              <div className="item-title">Order #{x.orderId}</div>
              <div className="item-sub">Status: {x.status}</div>
              <div className="item-sub">Amount: {formatCents(x.amountCents)}</div>
              {x.paymentStatus ? <div className="item-sub">Payment: {x.paymentStatus}</div> : null}
              {role === Role.MERCHANT || role === Role.RUNNER ? (
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-outline" onClick={() => x.orderId && nav(`/user/orders/${x.orderId}`)}>
                    View Order
                  </button>
                </div>
              ) : null}
              {role === Role.RUNNER ? (
                <div style={{ marginTop: 10 }}>
                  <button
                    className="btn"
                    disabled={
                      actionLoadingId === x.orderId ||
                      isDoneStatus(x.status)
                    }
                    onClick={() => completeOrder(x.orderId)}
                  >
                    {actionLoadingId === x.orderId || isDoneStatus(x.status) ? 'Completed' : 'Complete Delivery'}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

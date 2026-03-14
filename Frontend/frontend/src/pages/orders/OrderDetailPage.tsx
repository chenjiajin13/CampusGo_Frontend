import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderService } from '@/lib/orderService';
import { merchantService } from '@/lib/merchantService';
import { MerchantDTO, OrderDetailDTO } from '@/types/api';

function formatCents(v?: number): string {
  if (v == null) return '-';
  return `$${(v / 100).toFixed(2)}`;
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetailDTO | null>(null);
  const [merchant, setMerchant] = useState<MerchantDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const idNum = Number(orderId);
    if (!idNum) {
      setErr('Invalid order ID.');
      return;
    }

    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const detail = await orderService.getOrder(idNum);
        setOrder(detail);
        if (detail?.merchantId) {
          try {
            const m = await merchantService.getMerchant(detail.merchantId);
            setMerchant(m);
          } catch {
            setMerchant(null);
          }
        } else {
          setMerchant(null);
        }
      } catch (e: any) {
        setErr(e?.response?.data?.message || e?.message || 'Failed to load order detail');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  return (
    <div>
      <div className="orders-top">
        <h2 className="page-title">Order Detail</h2>
        <Link to="/user/orders" className="btn btn-outline">Back to Orders</Link>
      </div>

      {err ? <div className="error">{err}</div> : null}
      {loading ? <div className="muted">Loading...</div> : null}

      {order ? (
        <div className="order-detail-grid">
          <section className="item">
            <div className="item-title">Order #{order.orderId}</div>
            <div className="item-sub">Status: {order.status}</div>
            <div className="item-sub">Amount: {formatCents(order.amountCents)}</div>
            {order.paymentStatus ? <div className="item-sub">Payment: {order.paymentStatus}</div> : null}
          </section>

          <section className="item">
            <div className="item-title">Customer</div>
            <div className="item-sub">Name: {order.customerName || order.user?.username || '-'}</div>
            <div className="item-sub">Phone: {order.customerPhone || order.user?.phone || '-'}</div>
            <div className="item-sub">Address: {order.customerAddress || order.user?.address || '-'}</div>
          </section>

          <section className="item">
            <div className="item-title">Merchant</div>
            <div className="item-sub">Name: {merchant?.name || (order.merchantId ? `#${order.merchantId}` : '-')}</div>
            <div className="item-sub">Address: {merchant?.address || '-'}</div>
            <div className="item-sub">Phone: {merchant?.phone || '-'}</div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

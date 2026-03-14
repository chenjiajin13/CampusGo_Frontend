import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api/client';
import { Spinner } from '../../components/UI';
import { useAuth } from '../../state/AuthContext';
import { Role } from '../../types/role';

type InboxItem = {
  id: number;
  title: string;
  content: string;
  createdAt?: string;
  read?: boolean;
};

function formatTime(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

function initials(title: string): string {
  const trimmed = (title || '').trim();
  if (!trimmed) return 'N';
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const role = (user?.role as Role | undefined) ?? Role.USER;
  const roleType = useMemo(() => {
    if (role === Role.MERCHANT) return 'MERCHANT';
    if (role === Role.RUNNER) return 'RUNNER';
    if (role === Role.ADMIN) return 'ADMIN';
    return 'USER';
  }, [role]);

  async function loadInbox() {
    try {
      setLoading(true);
      setErr(null);
      const res = await api.get('/notifications/inbox/me', { params: { type: roleType } });
      setItems(res.data?.data ?? res.data ?? []);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Load inbox failed');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInbox();
  }, [roleType]);

  if (loading) return <Spinner />;

  return (
    <section className="mailbox-wrap">
      <div className="mailbox-head">
        <h2 className="page-title" style={{ marginBottom: 0 }}>Inbox</h2>
        <button className="btn btn-outline" onClick={loadInbox}>Refresh</button>
      </div>
      {err ? <div className="error" style={{ padding: '10px 18px 0' }}>{err}</div> : null}

      {items.length === 0 ? (
        <div className="mailbox-empty">No notifications yet.</div>
      ) : (
        <ul className="mailbox-list">
          {items.map((x) => (
            <li key={x.id} className={`mail-item ${x.read ? 'is-read' : 'is-unread'}`}>
              <div className="mail-avatar">{initials(x.title)}</div>
              <div className="mail-main">
                <div className="mail-subject">{x.title}</div>
                <div className="mail-preview">{x.content}</div>
              </div>
              <div className="mail-time">{formatTime(x.createdAt)}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

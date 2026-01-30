import { useEffect, useState } from 'react';
import api from '../../services/api/client';
import { useAuth } from '../../state/AuthContext';
import { Spinner, ErrorText } from '../../components/UI';

type InboxItem = {
  id: number;
  title: string;
  message: string;
  createdAt?: string;
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await api.get(`/notifications/inbox/user/${user.id}`);
        setItems(res.data?.data ?? res.data ?? []);
      } catch (e: any) {
        setErr(e?.response?.data?.message || e.message || 'Load inbox failed');
      } finally { setLoading(false); }
    })();
  }, [user?.id]);

  if (loading) return <Spinner />;
  if (err) return <ErrorText msg={err} />;

  return (
    <div>
      <h2 className="text-2xl mb-4">My Inbox</h2>
      {items.length === 0 ? <div>No notifications yet.</div> : (
        <ul className="space-y-2">
          {items.map(x => (
            <li key={x.id} className="p-3 rounded bg-slate-800/40">
              <div className="font-medium">{x.title}</div>
              <div className="opacity-80 text-sm">{x.message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

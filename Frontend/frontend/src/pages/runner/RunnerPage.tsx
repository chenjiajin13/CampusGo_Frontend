import { useState } from 'react';
import api from '../../services/api/client';
import { useAuth } from '../../state/AuthContext';
import { Button, ErrorText } from '../../components/UI';

type Runner = { id: number; username: string; status: string };

export default function RunnerPage() {
  const { user } = useAuth();
  const [runner, setRunner] = useState<Runner | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function assignAny() {
    try {
      setErr(null);
      const res = await api.get('/internal/runners/assign/any-available');
      setRunner(res.data?.data ?? res.data ?? null);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Assign failed');
    }
  }

  async function whoAmIRunner() {
    try {
      setErr(null);
      const res = await api.get(`/internal/runners/by-username/${user?.username}`);
      setRunner(res.data?.data ?? res.data ?? null);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Query failed');
    }
  }

  return (
    <div>
      <h2 className="text-2xl mb-4">Runner</h2>
      <div className="flex gap-3 mb-4">
        <Button onClick={assignAny}>Assign Any Available</Button>
        <Button onClick={whoAmIRunner}>My Runner</Button>
      </div>
      {err && <ErrorText msg={err} />}
      {runner ? (
        <div className="p-4 rounded bg-slate-800/40">
          <div>Runner #{runner.id}</div>
          <div>{runner.username}</div>
          <div>Status: {runner.status}</div>
        </div>
      ) : (
        <div>No runner info.</div>
      )}
    </div>
  );
}

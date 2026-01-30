import { useState } from 'react';
import api from '../services/api/client';
import { authService } from '../lib/authService';
import { useAuth } from '../state/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types/role';

export default function Login() {
  const [role, setRole] = useState<Role>(Role.USER);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { setUser, setIsAuthenticated } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setErr(null);
  try {
    setSubmitting(true);

    
    const url = role === 'ADMIN' ? '/auth/admin/login' : '/auth/login';
    const res = await api.post(url, { username, password });

    
    const data = res.data ?? {};
    const body = data.data ?? data.result ?? data; 
    let token: string | undefined;

    
    token =
      body?.token ||
      body?.accessToken ||
      body?.access_token;

   
    if (!token) {
      const h = res.headers || {};
      const authHeader = h['authorization'] || h['Authorization'];
      if (authHeader && typeof authHeader === 'string') {
        token = authHeader.replace(/^Bearer\s+/i, '');
      }
    }

    
    if (!token) {
      
      token = 'DEV_DUMMY_TOKEN';
      console.warn('[login] No token from backend; using DEV_DUMMY_TOKEN for UI dev.');
    }
    // -------------------------------------------------------------

    localStorage.setItem('access_token', token);
    const u = { id: body?.id, username: body?.username || username, role: (body?.role as any) ?? role };
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('isAuthenticated', 'true');

    setUser(u);
    setIsAuthenticated(true);

    
    nav('/user/notifications', { replace: true });
  } catch (e: any) {
    setErr(e?.response?.data?.message || e.message || 'Login failed');
  } finally {
    setSubmitting(false);
  }
}

  async function onRegister() {
    setErr(null);
    setSuccess(null);
    if (!username || !password) {
      setErr('Username and password are required for registration');
      return;
    }
    try {
      setRegistering(true);
      await authService.register(username, password, phone || undefined);
      setSuccess('Registration successful. Please sign in.');
      setPassword('');
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  }

  return (
    <div className="page-center">
      <form className="card" onSubmit={onSubmit}>
        <h1 className="title" style={{marginBottom: 8}}>CampusGo</h1>

        
        <div style={{marginBottom: 16}}>
          <div className="tabs">
            {(['USER','MERCHANT','RUNNER','ADMIN'] as Role[]).map(r => (
              <div
                key={r}
                className={`tab ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="label">Username</label>
          <input
            className="input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="e.g. Alice"
            required
          />
        </div>

        <div className="field">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="label">Phone (optional)</label>
          <input
            className="input"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. +6591234567"
          />
        </div>

        {err && <div className="error">{err}</div>}
        {success && <div className="success">{success}</div>}

        <div style={{marginTop: 12, display: 'flex', gap: 10}}>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : `Sign in as ${role}`}
          </button>
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => { setUsername(''); setPassword(''); setErr(null); }}
          >
            Clear
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onRegister}
            disabled={registering}
          >
            {registering ? 'Registering…' : `Register as ${role}`}
          </button>
        </div>

        <div className="muted" style={{marginTop: 12, fontSize: 13}}>
          Gateways used: /api/auth/login, /api/auth/admin/login via Vite proxy → http://localhost:8080
        </div>
      </form>
    </div>
  );
}

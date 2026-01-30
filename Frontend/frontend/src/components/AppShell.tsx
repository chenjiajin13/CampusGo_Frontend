import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { Role } from '../types/role';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

type NavItem = {
  label: string;
  path: string;
  allowed: Role[];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Menu', path: '/user/merchants', allowed: [Role.USER, Role.ADMIN] },
  { label: 'Orders', path: '/user/orders', allowed: [Role.USER, Role.MERCHANT, Role.RUNNER, Role.ADMIN] },
  { label: 'Payments', path: '/user/payments', allowed: [Role.ADMIN, Role.MERCHANT] },
  { label: 'Inbox', path: '/user/notifications', allowed: [Role.USER, Role.MERCHANT, Role.RUNNER, Role.ADMIN] },
  { label: 'Runner', path: '/runner', allowed: [Role.RUNNER, Role.ADMIN] },
  { label: 'Merchant Dashboard', path: '/merchant/dashboard', allowed: [Role.MERCHANT] },
  { label: 'Admin', path: '/admin', allowed: [Role.ADMIN] },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const role = (user as any)?.role as Role | undefined;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const visible = NAV_ITEMS.filter((n) => {
    if (!role) return false;
    return n.allowed.includes(role);
  });

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">CampusGo</div>

          <nav className="navbar-links">
            {visible.map((n) => (
              <NavLink key={n.path} to={n.path} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-user">
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <div style={{width: 36, height: 36, borderRadius: 18, background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>
                {(user?.username || 'G').charAt(0).toUpperCase()
              }</div>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontWeight: 600}}>{user?.username || 'Guest'}</span>
                <small style={{opacity: 0.8}}>{role ?? ''}</small>
              </div>
              <button className="logout-btn" onClick={() => setConfirmOpen(true)}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>
      {confirmOpen && (
        <ConfirmDialog
          title="Logout"
          message="Are you sure you want to logout?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => { setConfirmOpen(false); logout(); }}
        />
      )}
    </>
  );
}

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { Role } from '../types/role';
import { useEffect, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import { useCart } from '../state/CartContext';
import { orderService } from '@/lib/orderService';

type NavItem = {
  label: string;
  path: string;
  allowed: Role[];
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Menu', path: '/user/merchants', allowed: [Role.USER, Role.ADMIN] },
  { label: 'Orders', path: '/user/orders', allowed: [Role.USER, Role.MERCHANT, Role.RUNNER, Role.ADMIN] },
  { label: 'Wallet', path: '/user/wallet', allowed: [Role.USER, Role.MERCHANT, Role.RUNNER] },
  { label: 'Cart', path: '/user/checkout', allowed: [Role.USER] },
  { label: 'Inbox', path: '/user/notifications', allowed: [Role.USER, Role.MERCHANT, Role.RUNNER, Role.ADMIN] },
  { label: 'Merchant Dashboard', path: '/merchant/dashboard', allowed: [Role.MERCHANT] },
  { label: 'Menu', path: '/merchant/menu', allowed: [Role.MERCHANT] },
  { label: 'Admin', path: '/admin', allowed: [Role.ADMIN] },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Merchant', path: '/admin/merchants', allowed: [Role.ADMIN] },
  { label: 'Runner', path: '/admin/runners', allowed: [Role.ADMIN] },
  { label: 'User', path: '/admin/users', allowed: [Role.ADMIN] },
  { label: 'Inbox', path: '/admin/inbox', allowed: [Role.ADMIN] },
];

export default function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalQuantity, setSummary, reset } = useCart();
  const role = (user as any)?.role as Role | undefined;
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (role !== Role.USER) return;
    orderService.getCart().then(setSummary).catch(() => reset());
  }, [role, setSummary, reset]);

  const source = role === Role.ADMIN ? ADMIN_NAV_ITEMS : NAV_ITEMS;
  const visible = source.filter((n) => {
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
                {n.path === '/user/checkout' && totalQuantity > 0 ? (
                  <span className="cart-badge">{totalQuantity}</span>
                ) : null}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-user">
            <button className="avatar-btn" onClick={() => navigate('/user/profile')}>
              <span className="avatar-circle">{(user?.username || 'G').charAt(0).toUpperCase()}</span>
              <span className="avatar-meta">
                <span className="avatar-name">{user?.username || 'Guest'}</span>
                <small className="avatar-role">{role ?? ''}</small>
              </span>
            </button>
            <button className="logout-btn" onClick={() => setConfirmOpen(true)}>Logout</button>
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
          onConfirm={() => {
            setConfirmOpen(false);
            reset();
            logout();
          }}
        />
      )}
    </>
  );
}


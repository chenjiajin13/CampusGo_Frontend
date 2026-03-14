import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Role } from './types/role';

import Login from './pages/Login';
import OrdersPage from './pages/orders/OrderPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import MerchantsPage from './pages/merchants/MerchantsPage';
import MerchantMenuPage from './pages/merchants/MerchantMenuPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import RunnerPage from './pages/runner/RunnerPage';
import RunnerDashboard from './pages/runner/RunnerDashboard';
import AppShell from './components/AppShell';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import MerchantMenuManagePage from './pages/merchant/MerchantMenuManagePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRunnersPage from './pages/admin/AdminRunnersPage';
import AdminMerchantsPage from './pages/admin/AdminMerchantsPage';
import AdminUserEditPage from './pages/admin/AdminUserEditPage';
import AdminRunnerEditPage from './pages/admin/AdminRunnerEditPage';
import AdminMerchantEditPage from './pages/admin/AdminMerchantEditPage';
import UserProfilePage from './pages/user/UserProfilePage';
import WalletPage from './pages/wallet/WalletPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={[Role.USER, Role.MERCHANT, Role.RUNNER, Role.ADMIN]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="notifications" replace />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetailPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="merchants" element={<MerchantsPage />} />
        <Route path="merchants/:merchantId" element={<MerchantMenuPage />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute allowedRoles={[Role.USER]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="profile" element={<UserProfilePage />} />
        <Route
          path="wallet"
          element={
            <ProtectedRoute allowedRoles={[Role.USER, Role.MERCHANT, Role.RUNNER]}>
              <WalletPage />
            </ProtectedRoute>
          }
        />
        <Route path="runner" element={<RunnerPage />} />
      </Route>

      <Route
        path="/runner"
        element={
          <ProtectedRoute allowedRoles={[Role.RUNNER, Role.ADMIN]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RunnerDashboard />} />
      </Route>

      <Route
        path="/merchant"
        element={
          <ProtectedRoute allowedRoles={[Role.MERCHANT, Role.ADMIN]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<MerchantDashboard />} />
        <Route path="menu" element={<MerchantMenuManagePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="merchants" replace />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:id" element={<AdminUserEditPage />} />
        <Route path="runners" element={<AdminRunnersPage />} />
        <Route path="runners/:id" element={<AdminRunnerEditPage />} />
        <Route path="merchants" element={<AdminMerchantsPage />} />
        <Route path="merchants/:id" element={<AdminMerchantEditPage />} />
        <Route path="inbox" element={<NotificationsPage />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

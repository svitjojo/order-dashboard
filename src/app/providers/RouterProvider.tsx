import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/widgets/app-shell/ui/AppShell';
import { OrdersPage } from '@/pages/orders/ui/OrdersPage';
import { NewOrderPage } from '@/pages/orders/ui/NewOrderPage';
import { OrderDetailPage } from '@/pages/orders/ui/OrderDetailPage';
import { EditOrderPage } from '@/pages/orders/ui/EditOrderPage';
import { NotFoundPage } from '@/pages/orders/ui/NotFoundPage';

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/orders" replace />} />
        <Route element={<AppShell />}>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/orders/:id/edit" element={<EditOrderPage />} />
        </Route>
        <Route element={<Outlet />}>
          <Route path="/orders/new" element={<NewOrderPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

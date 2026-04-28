import { NavLink, Outlet } from 'react-router-dom';
import { TruckIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-accent text-accent-foreground'
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  );

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <NavLink
            to="/orders"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <TruckIcon className="h-4 w-4 text-blue-600" />
            TMS Orders
          </NavLink>
          <NavLink to="/orders" end className={navLinkClass}>
            Orders
          </NavLink>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

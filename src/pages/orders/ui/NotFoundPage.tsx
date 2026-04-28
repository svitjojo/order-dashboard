import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-sm text-muted-foreground">Page not found.</p>
      <Button variant="outline" onClick={() => navigate('/orders')}>
        Back to Orders
      </Button>
    </div>
  );
}

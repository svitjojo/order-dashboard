import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast: 'bg-background border-border text-foreground',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
    />
  );
}

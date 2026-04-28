import { Provider } from 'react-redux';
import { store } from '@/app/store/store';
import { RouterProvider } from '@/app/providers/RouterProvider';
import { Toaster } from '@/shared/ui/sonner';

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider />
      <Toaster />
    </Provider>
  );
}

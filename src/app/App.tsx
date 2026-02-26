import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AchievementProvider } from './context/AchievementContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AdminAuthProvider>
      <AchievementProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(30, 39, 73, 0.95)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </AchievementProvider>
    </AdminAuthProvider>
  );
}

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AchievementProvider } from './context/AchievementContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <AchievementProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </AchievementProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

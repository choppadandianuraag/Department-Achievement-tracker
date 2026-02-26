import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const StudentPortal = lazy(() => import('./pages/StudentPortal').then(m => ({ default: m.StudentPortal })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const PendingApprovals = lazy(() => import('./pages/admin/PendingApprovals').then(m => ({ default: m.PendingApprovals })));
const AllAchievements = lazy(() => import('./pages/admin/AllAchievements').then(m => ({ default: m.AllAchievements })));
const Analytics = lazy(() => import('./pages/admin/Analytics').then(m => ({ default: m.Analytics })));
const Settings = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.Settings })));

const Fallback = () => null;

const wrap = (el: React.ReactNode) => <Suspense fallback={<Fallback />}>{el}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        {wrap(<Home />)}
      </Layout>
    ),
  },
  {
    path: '/student',
    element: (
      <Layout>
        {wrap(<StudentPortal />)}
      </Layout>
    ),
  },
  {
    path: '/admin/login',
    element: wrap(<AdminLogin />),
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: wrap(<Dashboard />) },
      { path: 'pending', element: wrap(<PendingApprovals />) },
      { path: 'achievements', element: wrap(<AllAchievements />) },
      { path: 'analytics', element: wrap(<Analytics />) },
      { path: 'settings', element: wrap(<Settings />) },
    ],
  },
  {
    path: '*',
    element: (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-white mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            404 — Page Not Found
          </h1>
          <p className="text-white/60 mb-8">The page you're looking for doesn't exist.</p>
          <a href="/" className="text-[#0ea5e9] hover:underline">
            Go back home
          </a>
        </div>
      </Layout>
    ),
  },
]);

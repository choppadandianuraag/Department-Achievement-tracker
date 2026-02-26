import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAchievements } from '../context/AchievementContext';
import {
  LayoutDashboard,
  Clock,
  Database,
  BarChart2,
  Settings,
  LogOut,
  Award,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Pending Approvals', path: '/admin/pending', icon: Clock, badge: true },
  { label: 'All Achievements', path: '/admin/achievements', icon: Database },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const { isLoggedIn, logout } = useAdminAuth();
  const { achievements } = useAchievements();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingCount = achievements.filter((a) => a.status === 'pending').length;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path || location.pathname === '/admin/';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-[#0ea5e9]/20 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
          >
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">Achievement</p>
            <p className="text-[#0ea5e9] text-xs">Tracker · Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ label, path, icon: Icon, badge, exact }) => {
          const active = isActive(path, exact);
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${
                  active
                    ? 'text-[#0ea5e9]'
                    : 'text-white/55 hover:text-white/90'
                }
              `}
              style={
                active
                  ? {
                      background: 'rgba(14,165,233,0.12)',
                      borderLeft: '2px solid #0ea5e9',
                      paddingLeft: '10px',
                    }
                  : {
                      borderLeft: '2px solid transparent',
                    }
              }
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#0ea5e9]' : ''}`} />
              <span className="text-sm font-medium">{label}</span>
              {badge && pendingCount > 0 && (
                <span className="ml-auto bg-[#f59e0b] text-[#0a1128] text-xs rounded-full px-2 py-0.5 font-bold min-w-[20px] text-center">
                  {pendingCount}
                </span>
              )}
              {!badge && active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#0ea5e9]/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — logout */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex relative" style={{ background: '#0a1128' }}>
      {/* Grid background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-56 flex-shrink-0 flex-col fixed top-0 bottom-0 left-0 z-20"
        style={{
          background: 'rgba(8, 14, 34, 0.97)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar ──────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="relative z-40 w-56 flex flex-col h-full"
            style={{
              background: 'rgba(8, 14, 34, 0.98)',
              borderRight: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-56 relative z-10 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-0 z-10"
          style={{
            background: 'rgba(8, 14, 34, 0.95)',
            borderColor: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
            >
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-semibold">Achievement Tracker</span>
          </div>
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

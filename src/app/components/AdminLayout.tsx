import { useEffect, useState } from 'react';
import vnrLogo from '/vnrvjiet_logo.jpeg';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAchievements } from '../context/AchievementContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Clock,
  Database,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/adminaccess', icon: LayoutDashboard, exact: true },
  { label: 'Pending Approvals', path: '/adminaccess/pending', icon: Clock, badge: true },
  { label: 'All Achievements', path: '/adminaccess/achievements', icon: Database },
  { label: 'Analytics', path: '/adminaccess/analytics', icon: BarChart2 },
  { label: 'Settings', path: '/adminaccess/settings', icon: Settings },
];

export function AdminLayout() {
  const { isLoggedIn, logout } = useAdminAuth();
  const { achievements } = useAchievements();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingCount = achievements.filter((a) => a.status === 'pending').length;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/adminaccess/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path || location.pathname === '/adminaccess/';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={vnrLogo}
            alt="VNRVJIET Logo"
            className="w-10 h-10 rounded-xl object-cover shadow-lg flex-shrink-0"
          />
          <div>
            <p className="text-foreground text-xs font-semibold leading-tight">VNR Vignana Jyothi</p>
            <p className="text-foreground text-xs font-semibold leading-tight">Institute of Engg &amp; Tech</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">Admin Panel</p>
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
                ${active
                  ? 'text-foreground bg-accent border-l-2 border-foreground pl-[10px]'
                  : 'text-muted-foreground hover:text-foreground border-l-2 border-transparent'
                }
              `}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-foreground' : ''}`} />
              <span className="text-sm font-medium">{label}</span>
              {badge && pendingCount > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs rounded-full px-2 py-0.5 font-bold min-w-[20px] text-center">
                  {pendingCount}
                </span>
              )}
              {!badge && active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — theme toggle + logout */}
      <div className="p-3 border-t border-border space-y-0.5">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={() => {
            logout();
            navigate('/adminaccess/login');
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex relative bg-background">
      {/* Grid background */}
      <div
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-56 flex-shrink-0 flex-col fixed top-0 bottom-0 left-0 z-20 bg-sidebar border-r border-sidebar-border backdrop-blur-xl"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar ──────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-40 w-56 flex flex-col h-full bg-sidebar border-r border-sidebar-border">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
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
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img
              src={vnrLogo}
              alt="VNRVJIET Logo"
              className="w-7 h-7 rounded-lg object-cover shadow-sm flex-shrink-0"
            />
            <span className="text-foreground text-sm font-semibold">VNRVJIET Achievement Tracker</span>
          </div>
          <button
            onClick={toggleTheme}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

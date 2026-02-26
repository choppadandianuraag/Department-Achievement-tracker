import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { Award, LayoutDashboard, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isStudentPortal = location.pathname.startsWith('/student');
  const isAdminDashboard = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-[rgba(30,39,73,0.4)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center shadow-lg shadow-[#0ea5e9]/20">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-white">
                  Achievement Tracker
                </h1>
                <p className="text-xs text-white/60">Engineering Excellence</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/student">
                <Button
                  variant={isStudentPortal ? 'default' : 'ghost'}
                  className={
                    isStudentPortal
                      ? 'bg-[#0ea5e9] text-white hover:bg-[#0284c7]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                >
                  <Award className="w-4 h-4 mr-2" />
                  Student Portal
                </Button>
              </Link>
              <Link to="/admin">
                <Button
                  variant={isAdminDashboard ? 'default' : 'ghost'}
                  className={
                    isAdminDashboard
                      ? 'bg-[#0ea5e9] text-white hover:bg-[#0284c7]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#1e2749] border-white/10">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/student">
                    <Button
                      variant={isStudentPortal ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Student Portal
                    </Button>
                  </Link>
                  <Link to="/admin">
                    <Button
                      variant={isAdminDashboard ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
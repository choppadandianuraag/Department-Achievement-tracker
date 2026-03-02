import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { Award, Menu, Sun, Moon } from 'lucide-react';
import vnrLogo from '/vnrvjiet_logo.jpeg';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isStudentPortal = location.pathname.startsWith('/student');

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Grid Background */}
      <div
        className="fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Gradient Overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, var(--accent) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--muted) 0%, transparent 50%)
          `,
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border backdrop-blur-xl bg-card/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={vnrLogo}
                alt="VNRVJIET Logo"
                className="w-12 h-12 rounded-xl object-cover shadow-lg flex-shrink-0"
              />
              <div>
                <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-sm leading-tight text-foreground">
                  VNR Vignana Jyothi Institute of
                </h1>
                <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm leading-tight text-foreground">
                  Engineering and Technology
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/student">
                <Button
                  variant={isStudentPortal ? 'default' : 'ghost'}
                  className={
                    isStudentPortal
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }
                >
                  <Award className="w-4 h-4 mr-2" />
                  Student Portal
                </Button>
              </Link>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-card border-border">
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
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
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
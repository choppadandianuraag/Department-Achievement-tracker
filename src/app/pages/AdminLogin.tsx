import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Lock,
  Eye,
  EyeOff,
  Award,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminLogin() {
  const { login } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const success = login(email, password);
    if (success) {
      toast.success('Welcome back, Admin!');
      navigate('/adminaccess');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
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
      {/* Gradient overlays */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, var(--accent) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--muted) 0%, transparent 50%)
          `,
        }}
      />

      {/* Theme toggle — floating */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>


      {/* ── Login Form (full width) ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        {/* Back to home */}
        <div className="w-full max-w-md mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Lock badge */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
              {/* Green dot badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <h2
            className="text-foreground text-center mb-1"
            style={{ fontSize: '1.75rem', fontWeight: 700 }}
          >
            Admin Portal
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Sign in to access the admin dashboard
          </p>

          {/* Form card */}
          <div className="rounded-2xl border border-border p-8 bg-card backdrop-blur-xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-foreground/90">
                  Email / Employee ID
                </Label>
                <div className="relative">
                  <Input
                    id="admin-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-input-background border-border text-foreground placeholder:text-muted-foreground/50
                      focus:border-foreground focus:ring-1 focus:ring-foreground/30 pl-10"
                  />
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-foreground/90">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-input-background border-border text-foreground placeholder:text-muted-foreground/50
                      focus:border-foreground focus:ring-1 focus:ring-foreground/30 pl-10 pr-10"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg h-11 mt-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Login to Dashboard
                  </>
                )}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

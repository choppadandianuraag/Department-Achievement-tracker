import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  GraduationCap,
  Award,
  BarChart2,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminLogin() {
  const { login } = useAdminAuth();
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
      navigate('/admin');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: '#0a1128' }}
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      {/* Gradient overlays */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(56, 189, 248, 0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Left Panel ─────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[55%] relative z-10 flex-col items-center justify-center p-16"
        style={{
          background:
            'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(10,17,40,0.6) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.15), transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.1), transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center">
          {/* College logo */}
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#0ea5e9]/30"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            }}
          >
            <GraduationCap className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-white mb-3" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Department Achievement
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tracker
            </span>
          </h1>
          <p className="text-white/55 text-base leading-relaxed mb-12">
            Manage, approve and recognize student achievements across all departments
            from a single, powerful dashboard.
          </p>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {[
              { icon: Award, label: 'Track Achievements' },
              { icon: ShieldCheck, label: 'Secure Access' },
              { icon: BarChart2, label: 'Live Analytics' },
              { icon: GraduationCap, label: 'Multi-Department' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/10 text-left"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="w-9 h-9 rounded-lg bg-[#0ea5e9]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#0ea5e9]" />
                </div>
                <span className="text-white/75 text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* Demo credentials hint */}
          <div
            className="p-4 rounded-xl border border-[#0ea5e9]/25"
            style={{ background: 'rgba(14,165,233,0.08)' }}
          >
            <p className="text-[#7dd3fc] text-sm">
              Demo credentials:{' '}
              <span className="text-white font-medium">admin@college.edu</span>
              {' / '}
              <span className="text-white font-medium">admin123</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        {/* Back to home */}
        <div className="w-full max-w-md mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Lock badge */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#0ea5e9]/30"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
              >
                <Lock className="w-8 h-8 text-white" />
              </div>
              {/* Green dot badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#10b981] border-2 border-[#0a1128] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <h2
            className="text-white text-center mb-1"
            style={{ fontSize: '1.75rem', fontWeight: 700 }}
          >
            Admin Portal
          </h2>
          <p className="text-white/50 text-center mb-8 text-sm">
            Sign in to access the admin dashboard
          </p>

          {/* Form card */}
          <div
            className="rounded-2xl border border-white/10 p-8"
            style={{
              background: 'rgba(20, 28, 60, 0.75)',
              backdropFilter: 'blur(20px)',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.4)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-white/90">
                  Email / Employee ID
                </Label>
                <div className="relative">
                  <Input
                    id="admin-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@college.edu"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30
                      focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30 pl-10"
                  />
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-white/90">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30
                      focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30 pl-10 pr-10"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
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
                className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#075985] text-white shadow-lg shadow-[#0ea5e9]/20 h-11 mt-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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

          {/* Mobile credentials hint */}
          <div
            className="mt-4 p-3 rounded-xl border border-[#0ea5e9]/20 lg:hidden"
            style={{ background: 'rgba(14,165,233,0.08)' }}
          >
            <p className="text-[#7dd3fc] text-sm text-center">
              Demo: admin@college.edu / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

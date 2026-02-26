import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Award, LayoutDashboard, TrendingUp, Shield, Zap, Users } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8">
            <div className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
            <span className="text-sm text-white/80">Engineering College Achievement Management</span>
          </div>
          
          <h1 className="font-['Plus_Jakarta_Sans'] text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Track & Celebrate
            <span className="block bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] bg-clip-text text-transparent">
              Student Excellence
            </span>
          </h1>
          
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            A modern platform for students to submit their achievements and for administrators to efficiently manage and recognize academic excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/student">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#075985] text-white shadow-lg shadow-[#0ea5e9]/20 px-8 py-6 text-lg"
              >
                <Award className="w-5 h-5 mr-2" />
                Student Portal
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-xl px-8 py-6 text-lg"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Built with modern technology to provide a seamless experience for both students and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl hover:shadow-[#0ea5e9]/10 transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-white mb-2">
                  Fast & Efficient
                </h3>
                <p className="text-white/60">
                  Submit achievements in seconds with our streamlined submission process and instant status updates.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl hover:shadow-[#0ea5e9]/10 transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-white mb-2">
                  Secure & Reliable
                </h3>
                <p className="text-white/60">
                  Your data is protected with enterprise-grade security and automatic backups.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl hover:shadow-[#0ea5e9]/10 transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-white mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-white/60">
                  Track submissions, approvals, and department-wise statistics with comprehensive dashboards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl hover:shadow-[#0ea5e9]/10 transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-white mb-2">
                  Multi-Department
                </h3>
                <p className="text-white/60">
                  Manage achievements across all engineering departments from a single unified platform.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl hover:shadow-[#0ea5e9]/10 transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-white mb-2">
                  Achievement Types
                </h3>
                <p className="text-white/60">
                  Support for hackathons, research papers, competitions, sports, internships, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl hover:shadow-[#0ea5e9]/10 transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ec4899] to-[#db2777] flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-white mb-2">
                  Admin Controls
                </h3>
                <p className="text-white/60">
                  Powerful admin dashboard with filtering, search, and batch approval capabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16">
        <Card className="border-white/10 bg-gradient-to-br from-[rgba(30,39,73,0.8)] to-[rgba(14,165,233,0.2)] backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
          <CardContent className="p-8 sm:p-12 text-center">
            <Award className="w-16 h-16 text-[#0ea5e9] mx-auto mb-6" />
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of students already using our platform to showcase their achievements and build their academic portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/student">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#075985] text-white shadow-lg shadow-[#0ea5e9]/20 px-8"
                >
                  Submit Your First Achievement
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border backdrop-blur-xl mb-8">
            <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            <span className="text-sm text-muted-foreground">Department of CSE-(DS,CYS) &amp; AI&amp;DS</span>
          </div>

          <h1 className="font-['Plus_Jakarta_Sans'] text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Track & Celebrate
            <span className="block text-muted-foreground">
              Student Excellence
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            A modern platform for students to submit their achievements and for administrators to efficiently manage and recognize academic excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/student">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8 py-6 text-lg"
              >
                <Award className="w-5 h-5 mr-2" />
                Submit Your Achievement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with modern technology to provide a seamless experience for both students and administrators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Fast & Efficient', desc: 'Submit achievements in seconds with our streamlined submission process and instant status updates.' },
              { icon: Shield, title: 'Secure & Reliable', desc: 'Your data is protected with enterprise-grade security and automatic backups.' },
              { icon: TrendingUp, title: 'Real-time Analytics', desc: 'Track submissions, approvals, and department-wise statistics with comprehensive dashboards.' },
              { icon: Users, title: 'Multi-Department', desc: 'Manage achievements across all engineering departments from a single unified platform.' },
              { icon: Award, title: 'Achievement Types', desc: 'Support for hackathons, research papers, competitions, sports, internships, and more.' },
              { icon: LayoutDashboard, title: 'Admin Controls', desc: 'Powerful admin dashboard with filtering, search, and batch approval capabilities.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-border bg-card backdrop-blur-xl shadow-2xl hover:shadow-foreground/5 transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground">
                    {desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-16">
        <Card className="border-border bg-card backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
          <CardContent className="p-8 sm:p-12 text-center">
            <Award className="w-16 h-16 text-foreground mx-auto mb-6" />
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of students already using our platform to showcase their achievements and build their academic portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/student">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8"
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

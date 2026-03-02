import { useAchievements } from '../../context/AchievementContext';
import { Link } from 'react-router';
import {
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Globe,
  ChevronRight,
  Users,
  FileText,
  XCircle,
} from 'lucide-react';

export function Dashboard() {
  const { achievements, loading } = useAchievements();

  const total = achievements.length;
  const pending = achievements.filter((a) => a.status === 'pending').length;
  const approved = achievements.filter((a) => a.status === 'approved').length;
  const international = achievements.filter(
    (a) => a.achievementLevel === 'International' && a.status === 'approved'
  ).length;

  const thisMonth = achievements.filter((a) => {
    const d = new Date(a.submittedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const streamColor: Record<string, string> = {
    'AI&DS': 'var(--foreground)',
    'Data Science': '#8b5cf6',
    Cybersecurity: '#ef4444',
  };

  const recentPending = achievements
    .filter((a) => a.status === 'pending')
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const recentApproved = achievements
    .filter((a) => a.status === 'approved')
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const statCards = [
    {
      label: 'Total Achievements',
      value: total,
      icon: FileText,
      colorClass: 'text-foreground',
      bgClass: 'bg-primary',
      note: 'All time',
      noteIcon: TrendingUp,
    },
    {
      label: 'Pending Approvals',
      value: pending,
      icon: Clock,
      colorClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-500/20',
      note: 'Requires action',
      noteIcon: Clock,
    },
    {
      label: "This Month's",
      value: thisMonth,
      icon: Award,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-500/20',
      note: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      noteIcon: TrendingUp,
    },
    {
      label: 'International Awards',
      value: international,
      icon: Globe,
      colorClass: 'text-violet-600 dark:text-violet-400',
      bgClass: 'bg-violet-500/20',
      note: 'Approved',
      noteIcon: CheckCircle2,
    },
  ];

  const StreamBadge = ({ stream }: { stream?: string }) => (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-border bg-secondary text-muted-foreground"
    >
      {stream || 'N/A'}
    </span>
  );

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Dashboard
        </h1>
        <p className="text-primary font-semibold text-sm mt-0.5">
          Department of CSE-(DS,CYS) &amp; AI&amp;DS
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of achievement submissions and approvals
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, colorClass, bgClass, note, noteIcon: NoteIcon }) => (
          <div
            key={label}
            className="rounded-2xl border border-border p-5 flex flex-col gap-4 bg-card backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm leading-tight">{label}</p>
              <div
                className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-5 h-5 ${bgClass === 'bg-primary' ? 'text-primary-foreground' : colorClass}`} />
              </div>
            </div>
            <div>
              <p className="text-foreground" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
                {value}
              </p>
              <p className={`text-xs mt-2 flex items-center gap-1 ${colorClass}`}>
                <NoteIcon className="w-3 h-3" />
                {note}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Approvals — preview */}
        <div className="rounded-2xl border border-border overflow-hidden bg-card backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-foreground">Pending Approvals</h3>
              {pending > 0 && (
                <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                  {pending}
                </span>
              )}
            </div>
            <Link
              to="/adminaccess/pending"
              className="text-foreground text-xs flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentPending.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No pending approvals!</p>
              </div>
            ) : (
              recentPending.map((a) => (
                <div
                  key={a.id}
                  className="px-6 py-3.5 flex items-center gap-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-foreground text-sm font-medium">{a.studentName}</p>
                      <StreamBadge stream={a.stream} />
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5 truncate">
                      {a.awardName} · {a.eventName}
                    </p>
                  </div>
                  <span className="text-muted-foreground/50 text-xs whitespace-nowrap">
                    {new Date(a.submittedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Approved */}
        <div className="rounded-2xl border border-border overflow-hidden bg-card backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-foreground">Recently Approved</h3>
            </div>
            <Link
              to="/adminaccess/achievements"
              className="text-foreground text-xs flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentApproved.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-muted-foreground text-sm">No approved achievements yet.</p>
              </div>
            ) : (
              recentApproved.map((a) => (
                <div
                  key={a.id}
                  className="px-6 py-3.5 flex items-center gap-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-foreground text-sm font-medium">{a.studentName}</p>
                      <StreamBadge stream={a.stream} />
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5 truncate">
                      {a.awardName} · {a.achievementLevel}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="rounded-2xl border border-border p-6 bg-card backdrop-blur-xl">
        <h3 className="text-foreground mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          Achievements by Stream
        </h3>
        <div className="space-y-4">
          {['AI&DS', 'Data Science', 'Cybersecurity'].map((stream) => {
            const count = achievements.filter((a) => a.stream === stream && a.status === 'approved').length;
            const pct = approved > 0 ? Math.round((count / approved) * 100) : 0;
            const color = streamColor[stream];
            return (
              <div key={stream}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-muted-foreground text-sm">{stream}</span>
                  <span className="text-muted-foreground/60 text-xs">{count} approved</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

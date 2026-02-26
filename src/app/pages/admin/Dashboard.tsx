import { useAchievements } from '../../context/AchievementContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
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
  const { achievements } = useAchievements();

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
    'AI & DS': '#0ea5e9',
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
      color: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      note: 'All time',
      noteIcon: TrendingUp,
    },
    {
      label: 'Pending Approvals',
      value: pending,
      icon: Clock,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      note: 'Requires action',
      noteIcon: Clock,
    },
    {
      label: "This Month's",
      value: thisMonth,
      icon: Award,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      note: 'Feb 2026',
      noteIcon: TrendingUp,
    },
    {
      label: 'International Awards',
      value: international,
      icon: Globe,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      note: 'Approved',
      noteIcon: CheckCircle2,
    },
  ];

  const StreamBadge = ({ stream }: { stream?: string }) => (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: `${streamColor[stream || ''] || '#6b7280'}20`,
        color: streamColor[stream || ''] || '#9ca3af',
        border: `1px solid ${streamColor[stream || ''] || '#6b7280'}40`,
      }}
    >
      {stream || 'N/A'}
    </span>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-white"
          style={{ fontSize: '1.75rem', fontWeight: 700 }}
        >
          Dashboard
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Overview of achievement submissions and approvals
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, gradient, color, note, noteIcon: NoteIcon }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/8 p-5 flex flex-col gap-4"
            style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-white/55 text-sm leading-tight">{label}</p>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: gradient }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p
                className="text-white"
                style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}
              >
                {value}
              </p>
              <p
                className="text-xs mt-2 flex items-center gap-1"
                style={{ color }}
              >
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
        <div
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f59e0b]" />
              <h3 className="text-white">Pending Approvals</h3>
              {pending > 0 && (
                <span className="bg-[#f59e0b] text-[#0a1128] text-xs rounded-full px-2 py-0.5 font-bold">
                  {pending}
                </span>
              )}
            </div>
            <Link
              to="/admin/pending"
              className="text-[#0ea5e9] text-xs flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {recentPending.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#10b981] mx-auto mb-2" />
                <p className="text-white/50 text-sm">No pending approvals!</p>
              </div>
            ) : (
              recentPending.map((a) => (
                <div
                  key={a.id}
                  className="px-6 py-3.5 flex items-center gap-3 hover:bg-white/3 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.15)' }}
                  >
                    <Users className="w-4 h-4 text-[#f59e0b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium">{a.studentName}</p>
                      <StreamBadge stream={a.stream} />
                    </div>
                    <p className="text-white/50 text-xs mt-0.5 truncate">
                      {a.awardName} · {a.eventName}
                    </p>
                  </div>
                  <span className="text-white/30 text-xs whitespace-nowrap">
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
        <div
          className="rounded-2xl border border-white/8 overflow-hidden"
          style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
        >
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <h3 className="text-white">Recently Approved</h3>
            </div>
            <Link
              to="/admin/achievements"
              className="text-[#0ea5e9] text-xs flex items-center gap-1 hover:underline"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {recentApproved.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-white/50 text-sm">No approved achievements yet.</p>
              </div>
            ) : (
              recentApproved.map((a) => (
                <div
                  key={a.id}
                  className="px-6 py-3.5 flex items-center gap-3 hover:bg-white/3 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.15)' }}
                  >
                    <Award className="w-4 h-4 text-[#10b981]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white text-sm font-medium">{a.studentName}</p>
                      <StreamBadge stream={a.stream} />
                    </div>
                    <p className="text-white/50 text-xs mt-0.5 truncate">
                      {a.awardName} · {a.achievementLevel}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div
        className="rounded-2xl border border-white/8 p-6"
        style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
      >
        <h3 className="text-white mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#0ea5e9]" />
          Achievements by Stream
        </h3>
        <div className="space-y-4">
          {['AI & DS', 'Data Science', 'Cybersecurity'].map((stream) => {
            const count = achievements.filter((a) => a.stream === stream && a.status === 'approved').length;
            const pct = approved > 0 ? Math.round((count / approved) * 100) : 0;
            const color = streamColor[stream];
            return (
              <div key={stream}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/70 text-sm">{stream}</span>
                  <span className="text-white/50 text-xs">{count} approved</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
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

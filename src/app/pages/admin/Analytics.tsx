import { useAchievements } from '../../context/AchievementContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Award,
  Clock,
  Globe,
  TrendingUp,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';

const STREAM_COLORS: Record<string, string> = {
  'AI & DS': '#0ea5e9',
  'Data Science': '#8b5cf6',
  Cybersecurity: '#ef4444',
};

const LEVEL_COLORS: Record<string, string> = {
  'Inter-University': '#14b8a6',
  State: '#0ea5e9',
  National: '#6366f1',
  International: '#8b5cf6',
};

const YEAR_COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl border border-white/10 px-4 py-3 text-sm"
        style={{ background: 'rgba(20,28,60,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((p: { name: string; value: number; color: string }) => (
          <p key={p.name} className="text-white font-medium">
            {p.name}: <span style={{ color: p.color }}>{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PieCustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div
        className="rounded-xl border border-white/10 px-4 py-3 text-sm"
        style={{ background: 'rgba(20,28,60,0.95)', backdropFilter: 'blur(12px)' }}
      >
        <p className="text-white font-medium">{name}</p>
        <p className="text-white/60">{value} achievement{value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
}

export function Analytics() {
  const { achievements } = useAchievements();

  // Stat cards data
  const total = achievements.length;
  const pending = achievements.filter((a) => a.status === 'pending').length;
  const international = achievements.filter(
    (a) => a.achievementLevel === 'International' && a.status === 'approved'
  ).length;
  const thisMonth = achievements.filter((a) => {
    const d = new Date(a.submittedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Year-wise data
  const yearData = ['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year, idx) => ({
    year: year.replace(' Year', ''),
    count: achievements.filter((a) => a.year === year && a.status === 'approved').length,
    fill: YEAR_COLORS[idx],
  }));

  // Stream data
  const streamData = Object.keys(STREAM_COLORS).map((stream) => ({
    name: stream,
    value: achievements.filter((a) => a.stream === stream && a.status === 'approved').length,
    color: STREAM_COLORS[stream],
  }));

  // Level data (horizontal bar)
  const levelData = Object.keys(LEVEL_COLORS).map((level) => ({
    level: level,
    count: achievements.filter((a) => a.achievementLevel === level && a.status === 'approved').length,
    fill: LEVEL_COLORS[level],
  }));

  // Recent approvals
  const recentApprovals = [...achievements]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 10);

  const statusConfig = {
    approved: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: CheckCircle2 },
    pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', icon: Clock },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', icon: XCircle },
  };

  const statCards = [
    {
      label: 'Total Achievements',
      value: total,
      icon: FileText,
      gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      note: 'All submissions',
      noteColor: '#0ea5e9',
    },
    {
      label: 'Pending Approvals',
      value: pending,
      icon: Clock,
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      note: 'Requires action',
      noteColor: '#f59e0b',
    },
    {
      label: "This Month's",
      value: thisMonth,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      note: 'Submissions in Feb',
      noteColor: '#10b981',
    },
    {
      label: 'International Awards',
      value: international,
      icon: Globe,
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      note: 'Approved only',
      noteColor: '#8b5cf6',
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-white" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Analytics
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Data insights across departments, years, and achievement levels
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, gradient, note, noteColor }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/8 p-5"
            style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/55 text-sm leading-snug">{label}</p>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: gradient }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p
              className="text-white"
              style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}
            >
              {value}
            </p>
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: noteColor }}>
              <TrendingUp className="w-3 h-3" />
              {note}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart - Year-wise */}
        <div
          className="rounded-2xl border border-white/8 p-6"
          style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
        >
          <h3 className="text-white mb-1">Achievements by Year</h3>
          <p className="text-white/40 text-xs mb-6">Approved achievements per academic year</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData} barCategoryGap="35%">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Achievements" radius={[6, 6, 0, 0]}>
                  {yearData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart - Stream-wise */}
        <div
          className="rounded-2xl border border-white/8 p-6"
          style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
        >
          <h3 className="text-white mb-1">Achievements by Stream</h3>
          <p className="text-white/40 text-xs mb-4">Distribution across all departments</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={streamData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                >
                  {streamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PieCustomTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{value}</span>
                  )}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 - Level-wise horizontal bar */}
      <div
        className="rounded-2xl border border-white/8 p-6"
        style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
      >
        <h3 className="text-white mb-1">Level-wise Distribution</h3>
        <p className="text-white/40 text-xs mb-6">Number of approved achievements per competition level</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={levelData} layout="vertical" barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="level"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Approved" radius={[0, 6, 6, 0]}>
                {levelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Approvals Table */}
      <div
        className="rounded-2xl border border-white/8 overflow-hidden"
        style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
      >
        <div
          className="px-6 py-4 border-b flex items-center gap-2"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <Award className="w-4 h-4 text-[#0ea5e9]" />
          <h3 className="text-white">Recent Submissions</h3>
          <span className="ml-auto text-white/40 text-xs">Last 10</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Student Name', 'Stream', 'Award', 'Event', 'Level', 'Date', 'Status'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs text-white/40 font-medium"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentApprovals.map((a) => {
                const sc = statusConfig[a.status];
                const Icon = sc.icon;
                const streamC = STREAM_COLORS[a.stream || ''];
                return (
                  <tr
                    key={a.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background =
                        'rgba(255,255,255,0.03)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background = '')
                    }
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-white text-sm font-medium">{a.studentName}</p>
                      <p className="text-white/35 text-xs font-mono mt-0.5">
                        {a.hallTicketNumber || a.rollNumber}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: streamC ? `${streamC}20` : 'rgba(255,255,255,0.08)',
                          color: streamC || 'rgba(255,255,255,0.6)',
                          border: `1px solid ${streamC ? `${streamC}40` : 'rgba(255,255,255,0.1)'}`,
                        }}
                      >
                        {a.stream}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white/80 text-sm">{a.awardName || a.title}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white/60 text-sm truncate max-w-[140px]">
                        {a.eventName || a.description}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs font-medium"
                        style={{ color: LEVEL_COLORS[a.achievementLevel || ''] || 'rgba(255,255,255,0.5)' }}
                      >
                        {a.achievementLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white/50 text-sm">
                        {new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div
          className="px-6 py-4 flex items-center justify-between border-t"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <p className="text-white/40 text-sm">
            Showing 1–{recentApprovals.length} of {achievements.length}
          </p>
          <div className="flex gap-2">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-sm transition-all ${
                  p === 1
                    ? 'bg-[#0ea5e9] text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

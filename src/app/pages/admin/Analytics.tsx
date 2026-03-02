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

// Color palettes — used dynamically
const STREAM_PALETTE = [
  '#6366f1', '#8b5cf6', '#ef4444', '#14b8a6', '#f59e0b', '#10b981', '#3b82f6', '#ec4899',
];

const LEVEL_COLORS: Record<string, string> = {
  'Inter-University': '#14b8a6',
  'Inter University': '#14b8a6',
  State: '#6366f1',
  National: '#3b82f6',
  International: '#8b5cf6',
};

const YEAR_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

const STATUS_CLASS: Record<string, { className: string; icon: typeof CheckCircle2 }> = {
  approved: { className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30', icon: CheckCircle2 },
  pending: { className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30', icon: Clock },
  rejected: { className: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30', icon: XCircle },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border px-4 py-3 text-sm bg-card backdrop-blur-xl">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: { name: string; value: number; color: string }) => (
          <p key={p.name} className="text-foreground font-medium">
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
      <div className="rounded-xl border border-border px-4 py-3 text-sm bg-card backdrop-blur-xl">
        <p className="text-foreground font-medium">{name}</p>
        <p className="text-muted-foreground">{value} achievement{value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
}

export function Analytics() {
  const { achievements, loading } = useAchievements();

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

  // Year-wise data — dynamic from actual data values
  const allYears = [...new Set(achievements.map((a) => a.year).filter((y): y is string => !!y))].sort();
  const yearData = allYears.map((year, idx) => ({
    year,
    count: achievements.filter((a) => a.year === year).length,
    fill: YEAR_COLORS[idx % YEAR_COLORS.length],
  }));

  // Stream data — dynamic, built from actual unique stream values in data
  const allStreams = [...new Set(achievements.map((a) => a.stream).filter((s): s is string => !!s))].sort();
  const streamData = allStreams
    .map((stream, idx) => ({
      name: stream,
      value: achievements.filter((a) => a.stream === stream).length,
      color: STREAM_PALETTE[idx % STREAM_PALETTE.length],
    }))
    .filter((d) => d.value > 0);

  // Normalize helper: split ';'-joined levels, trim, map aliases
  const normalizeLevel = (raw: string): string[] =>
    raw
      .split(';')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => (l === 'Inter University' ? 'Inter-University' : l));

  // Level data — split multi-level entries so each canonical level gets its own bar
  const levelCountMap: Record<string, number> = {};
  achievements.forEach((a) => {
    if (!a.achievementLevel) return;
    normalizeLevel(a.achievementLevel).forEach((level) => {
      levelCountMap[level] = (levelCountMap[level] ?? 0) + 1;
    });
  });
  const LEVEL_ORDER = ['Inter-University', 'International', 'National', 'State'];
  const allLevels = [
    ...LEVEL_ORDER.filter((l) => levelCountMap[l] !== undefined),
    ...Object.keys(levelCountMap).filter((l) => !LEVEL_ORDER.includes(l)).sort(),
  ];
  const levelData = allLevels.map((level, idx) => ({
    level,
    count: levelCountMap[level],
    fill: LEVEL_COLORS[level] ?? STREAM_PALETTE[idx % STREAM_PALETTE.length],
  }));

  // Recent submissions
  const recentSubmissions = [...achievements]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 10);

  const statCards = [
    { label: 'Total Achievements', value: total, icon: FileText, colorClass: 'text-foreground', bgClass: 'bg-primary', note: 'All submissions' },
    { label: 'Pending Approvals', value: pending, icon: Clock, colorClass: 'text-amber-600 dark:text-amber-400', bgClass: 'bg-amber-500/20', note: 'Requires action' },
    { label: "This Month's", value: thisMonth, icon: TrendingUp, colorClass: 'text-emerald-600 dark:text-emerald-400', bgClass: 'bg-emerald-500/20', note: 'Current month' },
    { label: 'International Awards', value: international, icon: Globe, colorClass: 'text-violet-600 dark:text-violet-400', bgClass: 'bg-violet-500/20', note: 'Approved only' },
  ];

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
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Data insights across departments, years, and achievement levels
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, colorClass, bgClass, note }) => (
          <div
            key={label}
            className="rounded-2xl border border-border p-5 bg-card backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-sm leading-snug">{label}</p>
              <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${bgClass === 'bg-primary' ? 'text-primary-foreground' : colorClass}`} />
              </div>
            </div>
            <p className="text-foreground" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
              {value}
            </p>
            <p className={`text-xs mt-2 flex items-center gap-1 ${colorClass}`}>
              <TrendingUp className="w-3 h-3" />
              {note}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart - Year-wise */}
        <div className="rounded-2xl border border-border p-6 bg-card backdrop-blur-xl">
          <h3 className="text-foreground mb-1">Achievements by Year</h3>
          <p className="text-muted-foreground text-xs mb-6">Approved achievements per academic year</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearData} barCategoryGap="35%" style={{ background: 'transparent' }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent)', radius: 6 }} />
                <Bar dataKey="count" name="Achievements" radius={[6, 6, 0, 0]} minPointSize={2}>
                  {yearData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart - Stream-wise */}
        <div className="rounded-2xl border border-border p-6 bg-card backdrop-blur-xl">
          <h3 className="text-foreground mb-1">Achievements by Stream</h3>
          <p className="text-muted-foreground text-xs mb-4">Distribution across all departments</p>
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
                    <span className="text-muted-foreground text-xs">{value}</span>
                  )}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 - Level-wise */}
      <div className="rounded-2xl border border-border p-6 bg-card backdrop-blur-xl">
        <h3 className="text-foreground mb-1">Level-wise Distribution</h3>
        <p className="text-muted-foreground text-xs mb-6">Number of approved achievements per competition level</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={levelData} layout="vertical" barCategoryGap="30%" style={{ background: 'transparent' }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="level"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent)' }} />
              <Bar dataKey="count" name="Total" radius={[0, 6, 6, 0]} minPointSize={2}>
                {levelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card backdrop-blur-xl">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Award className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-foreground">Recent Submissions</h3>
          <span className="ml-auto text-muted-foreground text-xs">Last 10</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Student Name', 'Stream', 'Award', 'Event', 'Level', 'Date', 'AY', 'Status'].map(
                  (h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-muted-foreground font-medium">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((a) => {
                const sc = STATUS_CLASS[a.status];
                const Icon = sc.icon;
                return (
                  <tr
                    key={a.id}
                    className="transition-colors border-b border-border hover:bg-accent/50"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-foreground text-sm font-medium">{a.studentName}</p>
                      <p className="text-muted-foreground/50 text-xs font-mono mt-0.5">
                        {a.hallTicketNumber || a.rollNumber}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
                        {a.stream}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-foreground/80 text-sm">{a.awardName || a.title}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-muted-foreground text-sm truncate max-w-[140px]">
                        {a.eventName || a.description}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        {a.achievementLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-muted-foreground text-sm">
                        {a.date ? new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        }) : '—'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-muted-foreground text-xs">{a.academicYear}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${sc.className}`}>
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
      </div>
    </div>
  );
}

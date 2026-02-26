import { useState, useMemo } from 'react';
import { useAchievements, type Achievement } from '../../context/AchievementContext';
import {
  Search,
  Download,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Hash,
  GraduationCap,
  BookOpen,
  Star,
  Trophy,
  Globe,
  Calendar,
  Link2,
  Users,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

const STREAM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'AI & DS': { bg: 'rgba(14,165,233,0.15)', text: '#0ea5e9', border: 'rgba(14,165,233,0.3)' },
  'Data Science': { bg: 'rgba(139,92,246,0.15)', text: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  Cybersecurity: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
};

const STATUS_CONFIG = {
  approved: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: CheckCircle2 },
  pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', icon: Clock },
  rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', icon: XCircle },
};

type SortKey = 'studentName' | 'year' | 'stream' | 'achievementLevel' | 'date' | 'status';
type SortDir = 'asc' | 'desc';

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  const sc = STREAM_COLORS[achievement.stream || ''];
  const sta = STATUS_CONFIG[achievement.status];
  const SIcon = sta.icon;

  const rows = [
    { icon: User, label: 'Student Name', value: achievement.studentName },
    { icon: Hash, label: 'Hall Ticket No.', value: achievement.hallTicketNumber || achievement.rollNumber },
    { icon: GraduationCap, label: 'Year', value: achievement.year },
    { icon: BookOpen, label: 'Stream', value: achievement.stream },
    { icon: Mail, label: 'Email', value: achievement.email },
    { icon: Star, label: 'Award / Medal', value: achievement.awardName || achievement.title },
    {
      icon: Users,
      label: 'Team/Individual',
      value: achievement.teamType
        ? achievement.teamType.charAt(0).toUpperCase() + achievement.teamType.slice(1)
        : '—',
    },
    { icon: Globe, label: 'Achievement Level', value: achievement.achievementLevel },
    { icon: Trophy, label: 'Event Name', value: achievement.eventName || achievement.description },
    {
      icon: Calendar,
      label: 'Event Date',
      value: new Date(achievement.date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(12, 18, 45, 0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div>
            <h3 className="text-white">{achievement.studentName}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {sc && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                >
                  {achievement.stream}
                </span>
              )}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                style={{ background: sta.bg, color: sta.color, border: `1px solid ${sta.border}` }}
              >
                <SIcon className="w-3 h-3" />
                {achievement.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors p-2 rounded-xl hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="w-7 h-7 rounded-lg bg-[#0ea5e9]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-[#0ea5e9]" />
              </div>
              <div className="min-w-0">
                <p className="text-white/40 text-xs">{label}</p>
                <p className="text-white text-sm mt-0.5 break-all">{value || '—'}</p>
              </div>
            </div>
          ))}

          {achievement.certificateLink && (
            <a
              href={achievement.certificateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
              style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}
            >
              <Link2 className="w-4 h-4 text-[#0ea5e9] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/40 text-xs">Certificate Link</p>
                <p className="text-[#0ea5e9] text-sm mt-0.5 truncate">{achievement.certificateLink}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0ea5e9] flex-shrink-0" />
            </a>
          )}

          {achievement.eventImageLink && (
            <a
              href={achievement.eventImageLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
              style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}
            >
              <Link2 className="w-4 h-4 text-[#0ea5e9] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white/40 text-xs">Event Image Link</p>
                <p className="text-[#0ea5e9] text-sm mt-0.5 truncate">{achievement.eventImageLink}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[#0ea5e9] flex-shrink-0" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AllAchievements() {
  const { achievements } = useAchievements();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStream, setFilterStream] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedRow, setSelectedRow] = useState<Achievement | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    return achievements
      .filter((a) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          a.studentName.toLowerCase().includes(q) ||
          (a.hallTicketNumber || '').toLowerCase().includes(q) ||
          (a.rollNumber || '').toLowerCase().includes(q) ||
          (a.awardName || '').toLowerCase().includes(q) ||
          (a.eventName || '').toLowerCase().includes(q);
        const matchStatus = filterStatus === 'all' || a.status === filterStatus;
        const matchStream = filterStream === 'all' || a.stream === filterStream;
        const matchLevel = filterLevel === 'all' || a.achievementLevel === filterLevel;
        return matchSearch && matchStatus && matchStream && matchLevel;
      })
      .sort((a, b) => {
        let valA: string = '';
        let valB: string = '';
        if (sortKey === 'studentName') { valA = a.studentName; valB = b.studentName; }
        else if (sortKey === 'year') { valA = a.year || ''; valB = b.year || ''; }
        else if (sortKey === 'stream') { valA = a.stream || ''; valB = b.stream || ''; }
        else if (sortKey === 'achievementLevel') { valA = a.achievementLevel || ''; valB = b.achievementLevel || ''; }
        else if (sortKey === 'date') { valA = a.date; valB = b.date; }
        else if (sortKey === 'status') { valA = a.status; valB = b.status; }
        const cmp = valA.localeCompare(valB);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [achievements, search, filterStatus, filterStream, filterLevel, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const exportCSV = () => {
    const headers = [
      '#', 'Name', 'Hall Ticket', 'Year', 'Stream', 'Award', 'Event',
      'Level', 'Team/Individual', 'Date', 'Certificate Link', 'Image Link', 'Status',
    ];
    const rows = filtered.map((a, i) => [
      i + 1,
      a.studentName,
      a.hallTicketNumber || a.rollNumber,
      a.year || '',
      a.stream || '',
      a.awardName || a.title,
      a.eventName || a.description,
      a.achievementLevel || '',
      a.teamType || '',
      a.date,
      a.certificateLink || '',
      a.eventImageLink || '',
      a.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'achievements.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-white/20" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[#0ea5e9]" />
      : <ChevronDown className="w-3 h-3 text-[#0ea5e9]" />;
  };

  const SortableHeader = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-white/50 cursor-pointer select-none hover:text-white/80 transition-colors"
      onClick={() => handleSort(col)}
    >
      <span className="flex items-center gap-1">
        {label} <SortIcon col={col} />
      </span>
    </th>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            All Achievements
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Complete database of all student achievement submissions
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            bg-[#0ea5e9]/15 text-[#0ea5e9] border border-[#0ea5e9]/30
            hover:bg-[#0ea5e9]/25 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl border border-white/8 p-4"
        style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search name, ticket, award..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm text-white placeholder:text-white/30
                bg-white/5 border border-white/10 focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors"
            />
          </div>
          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
              focus:border-[#0ea5e9] focus:outline-none transition-colors"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          {/* Stream */}
          <select
            value={filterStream}
            onChange={(e) => { setFilterStream(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
              focus:border-[#0ea5e9] focus:outline-none transition-colors"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Streams</option>
            {['AI & DS', 'Data Science', 'Cybersecurity'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {/* Level */}
          <select
            value={filterLevel}
            onChange={(e) => { setFilterLevel(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
              focus:border-[#0ea5e9] focus:outline-none transition-colors"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Levels</option>
            {['Inter-University', 'State', 'National', 'International'].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Active filters */}
        {(search || filterStatus !== 'all' || filterStream !== 'all' || filterLevel !== 'all') && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-white/40 text-xs">Active filters:</span>
            {search && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0ea5e9]/15 text-[#0ea5e9] text-xs border border-[#0ea5e9]/25">
                "{search}"
                <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs border border-white/15">
                {filterStatus}
                <button onClick={() => setFilterStatus('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterStream !== 'all' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs border border-white/15">
                {filterStream}
                <button onClick={() => setFilterStream('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterLevel !== 'all' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs border border-white/15">
                {filterLevel}
                <button onClick={() => setFilterLevel('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results summary */}
      <p className="text-white/40 text-sm">
        <span className="text-white/70">{filtered.length}</span> records found
      </p>

      {/* Table */}
      <div
        className="rounded-2xl border border-white/8 overflow-hidden"
        style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50 w-10">#</th>
                <SortableHeader col="studentName" label="Name" />
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50">Hall Ticket</th>
                <SortableHeader col="year" label="Year" />
                <SortableHeader col="stream" label="Stream" />
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50">Award</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50">Event</th>
                <SortableHeader col="achievementLevel" label="Level" />
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50">Type</th>
                <SortableHeader col="date" label="Date" />
                <th className="px-4 py-3 text-left text-xs font-medium text-white/50">Cert.</th>
                <SortableHeader col="status" label="Status" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-white/40 text-sm">
                    No achievements match your search/filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((a, idx) => {
                  const sc = STREAM_COLORS[a.stream || ''];
                  const sta = STATUS_CONFIG[a.status];
                  const SIcon = sta.icon;
                  return (
                    <tr
                      key={a.id}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onClick={() => setSelectedRow(a)}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.03)')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLTableRowElement).style.background = '')
                      }
                    >
                      <td className="px-4 py-3.5 text-white/30 text-sm">
                        {(page - 1) * perPage + idx + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white text-sm font-medium whitespace-nowrap">{a.studentName}</p>
                        <p className="text-white/35 text-xs mt-0.5">{a.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-white/60 text-xs font-mono">
                          {a.hallTicketNumber || a.rollNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-white/60 text-sm whitespace-nowrap">{a.year}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {sc ? (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                            style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                          >
                            {a.stream}
                          </span>
                        ) : (
                          <span className="text-white/50 text-sm">{a.stream}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white/80 text-sm whitespace-nowrap">{a.awardName || a.title}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white/60 text-sm truncate max-w-[120px]">
                          {a.eventName || a.description}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-white/60 text-sm whitespace-nowrap">{a.achievementLevel}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-white/50 text-xs capitalize">{a.teamType || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-white/50 text-sm whitespace-nowrap">
                          {new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {a.certificateLink ? (
                          <a
                            href={a.certificateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0ea5e9] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-white/25">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap"
                          style={{ background: sta.bg, color: sta.color, border: `1px solid ${sta.border}` }}
                        >
                          <SIcon className="w-3 h-3" />
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="px-6 py-4 flex items-center justify-between border-t gap-4 flex-wrap"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <p className="text-white/40 text-sm">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white/60 border border-white/10
                  hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      page === p
                        ? 'bg-[#0ea5e9] text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-white/60 border border-white/10
                  hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedRow && (
        <DetailModal achievement={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </div>
  );
}

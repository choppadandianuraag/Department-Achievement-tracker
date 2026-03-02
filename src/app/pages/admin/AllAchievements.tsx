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
  Users,
  Mail,
  Image,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { className: string; icon: typeof CheckCircle2 }> = {
  approved: { className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30', icon: CheckCircle2 },
  pending: { className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30', icon: Clock },
  rejected: { className: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30', icon: XCircle },
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
      value: achievement.date ? new Date(achievement.date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }) : '—',
    },
    { icon: Calendar, label: 'Academic Year', value: achievement.academicYear },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl overflow-hidden bg-card border border-border backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
          <div>
            <h3 className="text-foreground">{achievement.studentName}</h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">
                {achievement.stream}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${sta.className}`}
              >
                <SIcon className="w-3 h-3" />
                {achievement.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 p-3 rounded-xl bg-accent/50"
            >
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="text-foreground text-sm mt-0.5 break-all">{value || '—'}</p>
              </div>
            </div>
          ))}

          {/* Certificate image/link */}
          {achievement.certificateLink && (
            <div className="p-3 rounded-xl bg-accent/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-muted-foreground text-xs">Certificate</p>
              </div>
              {achievement.certificateLink.match(/\.(png|jpg|jpeg)$/i) || achievement.certificateLink.includes('supabase') ? (
                <img src={achievement.certificateLink} alt="Certificate" className="w-full rounded-lg border border-border" />
              ) : (
                <a
                  href={achievement.certificateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm flex items-center gap-1 hover:underline break-all"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  View Certificate
                </a>
              )}
            </div>
          )}

          {achievement.eventImageLink && (
            <div className="p-3 rounded-xl bg-accent/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Image className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-muted-foreground text-xs">Event Image</p>
              </div>
              {achievement.eventImageLink.match(/\.(png|jpg|jpeg)$/i) || achievement.eventImageLink.includes('supabase') ? (
                <img src={achievement.eventImageLink} alt="Event" className="w-full rounded-lg border border-border" />
              ) : (
                <a
                  href={achievement.eventImageLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm flex items-center gap-1 hover:underline break-all"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  View Image
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AllAchievements() {
  const { achievements, deleteAchievement } = useAchievements();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStream, setFilterStream] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterAcademicYear, setFilterAcademicYear] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedRow, setSelectedRow] = useState<Achievement | null>(null);
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const perPage = 10;

  const academicYears = [...new Set(achievements.map((a) => a.academicYear).filter((y): y is string => !!y))].sort().reverse();
  const studentYears = [...new Set(achievements.map((a) => a.year).filter((y): y is string => !!y))].sort();
  const streams = [...new Set(achievements.map((a) => a.stream).filter((s): s is string => !!s))].sort();

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
        const matchYear = filterYear === 'all' || a.year === filterYear;
        const matchAcademicYear = filterAcademicYear === 'all' || a.academicYear === filterAcademicYear;
        return matchSearch && matchStatus && matchStream && matchLevel && matchYear && matchAcademicYear;
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
  }, [achievements, search, filterStatus, filterStream, filterLevel, filterYear, filterAcademicYear, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const exportCSV = () => {
    const headers = [
      '#', 'Name', 'Hall Ticket', 'Year', 'Stream', 'Award', 'Event',
      'Level', 'Team/Individual', 'Date', 'Academic Year', 'Certificate Link', 'Image Link', 'Status',
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
      a.academicYear,
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
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 text-muted-foreground/30" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-foreground" />
      : <ChevronDown className="w-3 h-3 text-foreground" />;
  };

  const SortableHeader = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
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
          <h1 className="text-foreground" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            All Achievements
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete database of all student achievement submissions
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            bg-primary/10 text-foreground border border-border
            hover:bg-primary/20 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border p-4 bg-card backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search name, ticket, award..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50
                bg-input-background border border-border focus:border-foreground focus:outline-none focus:ring-1 focus:ring-ring/30 transition-colors"
            />
          </div>
          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl text-sm text-foreground bg-input-background border border-border
              focus:border-foreground focus:outline-none transition-colors"
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
            className="px-3 py-2 rounded-xl text-sm text-foreground bg-input-background border border-border
              focus:border-foreground focus:outline-none transition-colors"
          >
            <option value="all">All Streams</option>
            {streams.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {/* Level */}
          <select
            value={filterLevel}
            onChange={(e) => { setFilterLevel(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl text-sm text-foreground bg-input-background border border-border
              focus:border-foreground focus:outline-none transition-colors"
          >
            <option value="all">All Levels</option>
            {['Inter-University', 'State', 'National', 'International'].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {/* Student Year */}
          <select
            value={filterYear}
            onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl text-sm text-foreground bg-input-background border border-border
              focus:border-foreground focus:outline-none transition-colors"
          >
            <option value="all">All Years</option>
            {studentYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {/* Academic Year */}
          <select
            value={filterAcademicYear}
            onChange={(e) => { setFilterAcademicYear(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-xl text-sm text-foreground bg-input-background border border-border
              focus:border-foreground focus:outline-none transition-colors"
          >
            <option value="all">All Academic Years</option>
            {academicYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Active filters */}
        {(search || filterStatus !== 'all' || filterStream !== 'all' || filterLevel !== 'all' || filterAcademicYear !== 'all') && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-muted-foreground text-xs">Active filters:</span>
            {search && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-foreground text-xs border border-border">
                "{search}"
                <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs border border-border">
                {filterStatus}
                <button onClick={() => setFilterStatus('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterStream !== 'all' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs border border-border">
                {filterStream}
                <button onClick={() => setFilterStream('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterLevel !== 'all' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs border border-border">
                {filterLevel}
                <button onClick={() => setFilterLevel('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterYear !== 'all' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs border border-border">
                {filterYear}
                <button onClick={() => setFilterYear('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterAcademicYear !== 'all' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs border border-border">
                {filterAcademicYear}
                <button onClick={() => setFilterAcademicYear('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results summary */}
      <p className="text-muted-foreground text-sm">
        <span className="text-foreground">{filtered.length}</span> records found
      </p>

      {/* Table */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-10">#</th>
                <SortableHeader col="studentName" label="Name" />
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Hall Ticket</th>
                <SortableHeader col="year" label="Year" />
                <SortableHeader col="stream" label="Stream" />
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Award</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Event</th>
                <SortableHeader col="achievementLevel" label="Level" />
                <SortableHeader col="date" label="Date" />
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">AY</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Cert.</th>
                <SortableHeader col="status" label="Status" />
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground w-20">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No achievements match your search/filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((a, idx) => {
                  const sta = STATUS_CONFIG[a.status];
                  const SIcon = sta.icon;
                  return (
                    <tr
                      key={a.id}
                      className="cursor-pointer transition-colors border-b border-border hover:bg-accent/50"
                      onClick={() => setSelectedRow(a)}
                    >
                      <td className="px-4 py-3.5 text-muted-foreground text-sm">
                        {(page - 1) * perPage + idx + 1}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-foreground text-sm font-medium whitespace-nowrap">{a.studentName}</p>
                        <p className="text-muted-foreground/60 text-xs mt-0.5">{a.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-muted-foreground text-xs font-mono">
                          {a.hallTicketNumber || a.rollNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-muted-foreground text-sm whitespace-nowrap">{a.year}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-secondary text-muted-foreground border border-border">
                          {a.stream}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-foreground/80 text-sm whitespace-nowrap">{a.awardName || a.title}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-muted-foreground text-sm truncate max-w-[120px]">
                          {a.eventName || a.description}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-muted-foreground text-sm whitespace-nowrap">{a.achievementLevel}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-muted-foreground text-sm whitespace-nowrap">
                          {a.date ? new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                          }) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-muted-foreground text-xs whitespace-nowrap">{a.academicYear}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {a.certificateLink ? (
                          <a
                            href={a.certificateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${sta.className}`}
                        >
                          <SIcon className="w-3 h-3" />
                          {a.status}
                        </span>
                      </td>
                      {/* Delete */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        {deleteConfirm === a.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={async () => {
                                await deleteAchievement(a.id);
                                setDeleteConfirm(null);
                                toast.success('Record deleted');
                              }}
                              className="px-2 py-1 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 rounded-lg text-xs bg-secondary text-muted-foreground border border-border hover:bg-accent transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(a.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
          <div className="px-6 py-4 flex items-center justify-between border-t border-border gap-4 flex-wrap">
            <p className="text-muted-foreground text-sm">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm bg-secondary text-muted-foreground border border-border
                  hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${page === p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:bg-accent border border-border'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm bg-secondary text-muted-foreground border border-border
                  hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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

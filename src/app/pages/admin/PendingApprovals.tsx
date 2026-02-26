import { useState } from 'react';
import { useAchievements, type Achievement } from '../../context/AchievementContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  X,
  User,
  Mail,
  Hash,
  GraduationCap,
  BookOpen,
  Star,
  Trophy,
  Globe,
  Calendar,
  Link2,
  Users,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

const streamColor: Record<string, { bg: string; text: string; border: string }> = {
  'AI & DS': { bg: 'rgba(14,165,233,0.15)', text: '#0ea5e9', border: 'rgba(14,165,233,0.3)' },
  'Data Science': {
    bg: 'rgba(139,92,246,0.15)',
    text: '#8b5cf6',
    border: 'rgba(139,92,246,0.3)',
  },
  Cybersecurity: {
    bg: 'rgba(239,68,68,0.15)',
    text: '#ef4444',
    border: 'rgba(239,68,68,0.3)',
  },
};

const levelColor: Record<string, string> = {
  'Inter-University': '#14b8a6',
  State: '#0ea5e9',
  National: '#6366f1',
  International: '#8b5cf6',
};

function DetailDrawer({
  achievement,
  onClose,
  onApprove,
  onReject,
}: {
  achievement: Achievement;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const sc = streamColor[achievement.stream || ''];
  const lc = levelColor[achievement.achievementLevel || ''];

  const rows = [
    { icon: User, label: 'Student Name', value: achievement.studentName },
    { icon: Hash, label: 'Hall Ticket No.', value: achievement.hallTicketNumber || achievement.rollNumber },
    { icon: GraduationCap, label: 'Year', value: achievement.year },
    { icon: BookOpen, label: 'Stream', value: achievement.stream },
    { icon: Mail, label: 'Email', value: achievement.email },
    { icon: Star, label: 'Award / Medal', value: achievement.awardName || achievement.title },
    {
      icon: Users,
      label: 'Participation',
      value:
        achievement.teamType
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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className="relative z-10 w-full max-w-md h-full flex flex-col overflow-hidden"
        style={{
          background: 'rgba(12, 18, 45, 0.98)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div>
            <h3 className="text-white">Achievement Details</h3>
            <p className="text-white/40 text-xs mt-0.5">Full submission review</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors p-2 rounded-xl hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {sc && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
              >
                {achievement.stream}
              </span>
            )}
            {lc && (
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: `${lc}20`,
                  color: lc,
                  border: `1px solid ${lc}40`,
                }}
              >
                {achievement.achievementLevel}
              </span>
            )}
          </div>

          {rows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(14,165,233,0.15)' }}
              >
                <Icon className="w-3.5 h-3.5 text-[#0ea5e9]" />
              </div>
              <div className="min-w-0">
                <p className="text-white/40 text-xs">{label}</p>
                <p className="text-white text-sm mt-0.5 break-all">{value || '—'}</p>
              </div>
            </div>
          ))}

          {/* Links */}
          {achievement.certificateLink && (
            <div
              className="p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Link2 className="w-3.5 h-3.5 text-[#0ea5e9]" />
                <p className="text-white/40 text-xs">Certificate Link</p>
              </div>
              <a
                href={achievement.certificateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0ea5e9] text-sm flex items-center gap-1 hover:underline break-all"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                {achievement.certificateLink}
              </a>
            </div>
          )}
          {achievement.eventImageLink && (
            <div
              className="p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Link2 className="w-3.5 h-3.5 text-[#0ea5e9]" />
                <p className="text-white/40 text-xs">Event Image Link</p>
              </div>
              <a
                href={achievement.eventImageLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0ea5e9] text-sm flex items-center gap-1 hover:underline break-all"
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                {achievement.eventImageLink}
              </a>
            </div>
          )}

          <div
            className="p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-white/40 text-xs mb-1">Submitted on</p>
            <p className="text-white text-sm">
              {new Date(achievement.submittedAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex gap-3 px-6 py-5 border-t flex-shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={() => {
              onApprove();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm
              bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30
              hover:bg-[#10b981]/30 transition-all duration-200"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => {
              onReject();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm
              bg-transparent text-[#ef4444] border border-[#ef4444]/40
              hover:bg-[#ef4444]/10 transition-all duration-200"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingCard({
  achievement,
  onApprove,
  onReject,
  onOpenDrawer,
}: {
  achievement: Achievement;
  onApprove: () => void;
  onReject: () => void;
  onOpenDrawer: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sc = streamColor[achievement.stream || ''];
  const lc = levelColor[achievement.achievementLevel || ''];

  return (
    <div
      className="rounded-2xl border border-white/8 overflow-hidden transition-all duration-200"
      style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
    >
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Name + hall ticket */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <p className="text-white font-semibold">{achievement.studentName}</p>
              <span className="text-white/40 text-xs font-mono">
                {achievement.hallTicketNumber || achievement.rollNumber}
              </span>
            </div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {sc && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                >
                  {achievement.stream}
                </span>
              )}
              {lc && (
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: `${lc}20`,
                    color: lc,
                    border: `1px solid ${lc}40`,
                  }}
                >
                  {achievement.achievementLevel}
                </span>
              )}
              {achievement.year && (
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/8 text-white/60 border border-white/10">
                  {achievement.year}
                </span>
              )}
            </div>

            <p className="text-white/80 text-sm">
              <span className="text-white font-medium">
                {achievement.awardName || achievement.title}
              </span>
              {achievement.eventName && (
                <span className="text-white/50"> · {achievement.eventName}</span>
              )}
            </p>
          </div>

          {/* Submitted date */}
          <div className="text-right flex-shrink-0">
            <p className="text-white/40 text-xs">Submitted</p>
            <p className="text-white/60 text-xs mt-0.5">
              {new Date(achievement.submittedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30
              hover:bg-[#10b981]/25 transition-all duration-200"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              bg-transparent text-[#ef4444] border border-[#ef4444]/35
              hover:bg-[#ef4444]/10 transition-all duration-200"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={onOpenDrawer}
            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/50
              hover:text-white/80 hover:bg-white/5 transition-all duration-200 border border-white/8"
          >
            View Details
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-white/50
              hover:text-white/80 hover:bg-white/5 transition-all duration-200 border border-white/8"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="border-t px-5 py-4 grid sm:grid-cols-2 gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
        >
          {[
            { label: 'Email', value: achievement.email },
            { label: 'Event Date', value: achievement.date ? new Date(achievement.date + 'T00:00:00').toLocaleDateString('en-IN') : '—' },
            { label: 'Team/Individual', value: achievement.teamType ? achievement.teamType.charAt(0).toUpperCase() + achievement.teamType.slice(1) : '—' },
            { label: 'Certificate', value: achievement.certificateLink ? 'Provided' : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-white/35 text-xs">{label}</p>
              <p className="text-white/70 text-sm mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PendingApprovals() {
  const { achievements, updateAchievementStatus } = useAchievements();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterStream, setFilterStream] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const handleApprove = (id: string) => {
    updateAchievementStatus(id, 'approved');
    toast.success('Achievement approved successfully!');
  };

  const handleReject = (id: string) => {
    updateAchievementStatus(id, 'rejected');
    toast.error('Achievement rejected.');
  };

  const pending = achievements
    .filter((a) => a.status === 'pending')
    .filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        a.studentName.toLowerCase().includes(q) ||
        (a.hallTicketNumber || '').toLowerCase().includes(q) ||
        (a.awardName || '').toLowerCase().includes(q) ||
        (a.eventName || '').toLowerCase().includes(q);
      const matchYear = filterYear === 'all' || a.year === filterYear;
      const matchStream = filterStream === 'all' || a.stream === filterStream;
      const matchLevel = filterLevel === 'all' || a.achievementLevel === filterLevel;
      return matchSearch && matchYear && matchStream && matchLevel;
    })
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

  const totalPending = achievements.filter((a) => a.status === 'pending').length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-white" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              Pending Approvals
            </h1>
            {totalPending > 0 && (
              <span className="bg-[#f59e0b] text-[#0a1128] text-sm rounded-full px-3 py-0.5 font-bold">
                {totalPending}
              </span>
            )}
          </div>
          <p className="text-white/50 text-sm mt-1">
            Review and approve student achievement submissions
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="rounded-2xl border border-white/8 p-4"
        style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-[#0ea5e9]" />
          <span className="text-white/70 text-sm font-medium">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm text-white placeholder:text-white/30
                bg-white/5 border border-white/10 focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors"
            />
          </div>
          {/* Year */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
              focus:border-[#0ea5e9] focus:outline-none transition-colors"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all">All Years</option>
            {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {/* Stream */}
          <select
            value={filterStream}
            onChange={(e) => setFilterStream(e.target.value)}
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
            onChange={(e) => setFilterLevel(e.target.value)}
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
      </div>

      {/* Results summary */}
      <p className="text-white/40 text-sm">
        Showing <span className="text-white/70">{pending.length}</span> pending submission
        {pending.length !== 1 ? 's' : ''}
        {searchQuery || filterYear !== 'all' || filterStream !== 'all' || filterLevel !== 'all'
          ? ' (filtered)'
          : ''}
      </p>

      {/* Cards */}
      {pending.length === 0 ? (
        <div
          className="rounded-2xl border border-white/8 p-12 text-center"
          style={{ background: 'rgba(20, 28, 60, 0.70)' }}
        >
          <CheckCircle2 className="w-12 h-12 text-[#10b981] mx-auto mb-4" />
          <h3 className="text-white mb-2">All caught up!</h3>
          <p className="text-white/50 text-sm">
            No pending submissions match your filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((a) => (
            <PendingCard
              key={a.id}
              achievement={a}
              onApprove={() => handleApprove(a.id)}
              onReject={() => handleReject(a.id)}
              onOpenDrawer={() => setSelectedAchievement(a)}
            />
          ))}
        </div>
      )}

      {/* Detail Drawer */}
      {selectedAchievement && (
        <DetailDrawer
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          onApprove={() => handleApprove(selectedAchievement.id)}
          onReject={() => handleReject(selectedAchievement.id)}
        />
      )}
    </div>
  );
}

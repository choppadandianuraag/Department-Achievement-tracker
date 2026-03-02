import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';
import { getAcademicYear } from '../lib/academicYear';

export interface Achievement {
  id: string;
  studentName: string;
  rollNumber: string;
  hallTicketNumber?: string;
  email: string;
  department: string;
  stream?: string;
  year?: string;
  achievementType: string;
  achievementLevel?: string;
  title: string;
  awardName?: string;
  description: string;
  eventName?: string;
  teamType?: 'team' | 'individual';
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  proof?: string;
  certificateLink?: string;
  eventImageLink?: string;
  academicYear: string;
}

interface AchievementContextType {
  achievements: Achievement[];
  loading: boolean;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'status' | 'submittedAt' | 'academicYear'>) => Promise<void>;
  updateAchievementStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  deleteAchievement: (id: string) => Promise<void>;
  refreshAchievements: () => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Normalise legacy stream values so old DB records match new UI labels
function normalizeStream(raw: string | undefined): string {
  if (!raw) return '';
  const map: Record<string, string> = {
    'Data Science': 'Data science',
    'Cybersecurity': 'Cyber security',
  };
  return map[raw] ?? raw;
}

// Map DB snake_case rows to camelCase Achievement
function mapRow(row: Record<string, unknown>): Achievement {
  const stream = normalizeStream((row.stream as string) || '');
  return {
    id: row.id as string,
    studentName: (row.student_name as string) || '',
    rollNumber: (row.hall_ticket_number as string) || '',
    hallTicketNumber: (row.hall_ticket_number as string) || '',
    email: (row.email as string) || '',
    department: stream,
    stream,
    year: (row.year as string) || '',
    achievementType: (row.achievement_level as string) || '',
    achievementLevel: (row.achievement_level as string) || '',
    title: (row.award_name as string) || '',
    awardName: (row.award_name as string) || '',
    description: (row.event_name as string) || '',
    eventName: (row.event_name as string) || '',
    teamType: row.team_type as 'team' | 'individual' | undefined,
    date: (row.date as string) || '',
    status: (row.status as 'pending' | 'approved' | 'rejected') || 'pending',
    submittedAt: (row.submitted_at as string) || '',
    proof: (row.certificate_link as string) || '',
    certificateLink: (row.certificate_link as string) || '',
    eventImageLink: (row.event_image_link as string) || '',
    academicYear: (row.academic_year as string) || (row.date ? getAcademicYear(row.date as string) : 'Unknown'),
  };
}

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = async () => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch achievements:', error);
        setAchievements([]);
      } else {
        setAchievements((data || []).map(mapRow));
      }
    } catch (err) {
      console.error('Supabase fetch error:', err);
      setAchievements([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAchievements().catch(() => {
      // Swallow — errors are already handled inside fetchAchievements.
      // This prevents unhandled promise rejections from crashing the React tree.
    });
  }, []);

  const addAchievement = async (
    achievement: Omit<Achievement, 'id' | 'status' | 'submittedAt' | 'academicYear'>
  ) => {
    const academicYear = achievement.date ? getAcademicYear(achievement.date) : 'Unknown';

    if (!supabaseConfigured) {
      // Offline / demo mode — add to local state only
      const localId = crypto.randomUUID();
      const newAchievement: Achievement = {
        ...achievement,
        id: localId,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        academicYear,
      };
      setAchievements((prev) => [newAchievement, ...prev]);
      return;
    }

    const { error } = await supabase.from('achievements').insert({
      student_name: achievement.studentName,
      hall_ticket_number: achievement.hallTicketNumber,
      email: achievement.email,
      stream: achievement.stream,
      year: achievement.year,
      achievement_level: achievement.achievementLevel,
      award_name: achievement.awardName,
      event_name: achievement.eventName,
      team_type: achievement.teamType,
      date: achievement.date,
      status: 'pending',
      certificate_link: achievement.certificateLink,
      event_image_link: achievement.eventImageLink,
      academic_year: academicYear,
    });

    if (error) {
      console.error('Failed to add achievement:', error);
      throw error;
    }
    await fetchAchievements();
  };

  const updateAchievementStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (!supabaseConfigured) {
      setAchievements((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      return;
    }

    const { error } = await supabase
      .from('achievements')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Failed to update achievement status:', error);
      throw error;
    }
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const deleteAchievement = async (id: string) => {
    if (!supabaseConfigured) {
      setAchievements((prev) => prev.filter((a) => a.id !== id));
      return;
    }

    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete achievement:', error);
      throw error;
    }
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        loading,
        addAchievement,
        updateAchievementStatus,
        deleteAchievement,
        refreshAchievements: fetchAchievements,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}

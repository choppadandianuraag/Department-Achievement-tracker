import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface AchievementContextType {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, 'id' | 'status' | 'submittedAt'>) => void;
  updateAchievementStatus: (id: string, status: 'approved' | 'rejected') => void;
  deleteAchievement: (id: string) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Mock data for demonstration
const mockAchievements: Achievement[] = [
  {
    id: '1',
    studentName: 'Rahul Sharma',
    rollNumber: '21A91A6701',
    hallTicketNumber: '21A91A6701',
    email: 'rahul.sharma@college.edu',
    department: 'AI & DS',
    stream: 'AI & DS',
    year: '3rd Year',
    achievementType: 'National',
    achievementLevel: 'National',
    title: 'Hackathon',
    awardName: 'Hackathon',
    description: 'Smart India Hackathon 2025',
    eventName: 'Smart India Hackathon 2025',
    teamType: 'team',
    date: '2026-02-15',
    status: 'approved',
    submittedAt: '2026-02-18T10:30:00Z',
    proof: 'https://drive.google.com/certificate_sih2025',
    certificateLink: 'https://drive.google.com/certificate_sih2025',
    eventImageLink: 'https://drive.google.com/sih2025_photo',
  },
  {
    id: '2',
    studentName: 'Priya Deshmukh',
    rollNumber: '21A91A6745',
    hallTicketNumber: '21A91A6745',
    email: 'priya.d@college.edu',
    department: 'Data Science',
    stream: 'Data Science',
    year: '3rd Year',
    achievementType: 'International',
    achievementLevel: 'International',
    title: 'Research Paper',
    awardName: 'Research Paper',
    description: 'IEEE International Conference on IoT Security',
    eventName: 'IEEE International Conference on IoT Security',
    teamType: 'individual',
    date: '2026-01-20',
    status: 'approved',
    submittedAt: '2026-01-25T14:20:00Z',
    proof: 'https://drive.google.com/ieee_publication',
    certificateLink: 'https://drive.google.com/ieee_publication',
    eventImageLink: '',
  },
  {
    id: '3',
    studentName: 'Amit Patel',
    rollNumber: '22A91A6834',
    hallTicketNumber: '22A91A6834',
    email: 'amit.patel@college.edu',
    department: 'Cybersecurity',
    stream: 'Cybersecurity',
    year: '2nd Year',
    achievementType: 'State',
    achievementLevel: 'State',
    title: 'Sports',
    awardName: 'Sports',
    description: 'State-Level Inter-College Athletics Championship',
    eventName: 'State-Level Inter-College Athletics Championship',
    teamType: 'individual',
    date: '2026-02-10',
    status: 'pending',
    submittedAt: '2026-02-20T09:15:00Z',
    proof: 'https://drive.google.com/athletics_certificate',
    certificateLink: 'https://drive.google.com/athletics_certificate',
    eventImageLink: 'https://drive.google.com/athletics_photo',
  },
  {
    id: '4',
    studentName: 'Sneha Reddy',
    rollNumber: '21A91A6789',
    hallTicketNumber: '21A91A6789',
    email: 'sneha.reddy@college.edu',
    department: 'AI & DS',
    stream: 'AI & DS',
    year: '4th Year',
    achievementType: 'National',
    achievementLevel: 'National',
    title: 'Internship',
    awardName: 'Internship',
    description: 'Google Software Engineering Internship, Bangalore',
    eventName: 'Google Software Engineering Internship, Bangalore',
    teamType: 'individual',
    date: '2025-08-31',
    status: 'approved',
    submittedAt: '2025-09-05T11:00:00Z',
    proof: 'https://drive.google.com/google_internship_letter',
    certificateLink: 'https://drive.google.com/google_internship_letter',
    eventImageLink: '',
  },
  {
    id: '5',
    studentName: 'Vikram Singh',
    rollNumber: '22A91A6812',
    hallTicketNumber: '22A91A6812',
    email: 'vikram.singh@college.edu',
    department: 'Data Science',
    stream: 'Data Science',
    year: '2nd Year',
    achievementType: 'National',
    achievementLevel: 'National',
    title: 'Hackathon',
    awardName: 'Hackathon',
    description: 'National Robotics Challenge 2026',
    eventName: 'National Robotics Challenge 2026',
    teamType: 'team',
    date: '2026-02-05',
    status: 'pending',
    submittedAt: '2026-02-21T16:45:00Z',
    proof: 'https://drive.google.com/robotics_certificate',
    certificateLink: 'https://drive.google.com/robotics_certificate',
    eventImageLink: 'https://drive.google.com/robotics_photo',
  },
  {
    id: '6',
    studentName: 'Arjun Kumar',
    rollNumber: '23A91A6601',
    hallTicketNumber: '23A91A6601',
    email: 'arjun.kumar@college.edu',
    department: 'AI & DS',
    stream: 'AI & DS',
    year: '1st Year',
    achievementType: 'Inter-University',
    achievementLevel: 'Inter-University',
    title: 'First Prize',
    awardName: 'First Prize',
    description: 'Inter-College Coding Bootcamp 2026',
    eventName: 'Inter-College Coding Bootcamp 2026',
    teamType: 'individual',
    date: '2026-01-15',
    status: 'approved',
    submittedAt: '2026-01-18T09:00:00Z',
    proof: 'https://drive.google.com/bootcamp_cert',
    certificateLink: 'https://drive.google.com/bootcamp_cert',
    eventImageLink: '',
  },
  {
    id: '7',
    studentName: 'Divya Patel',
    rollNumber: '21A91A6722',
    hallTicketNumber: '21A91A6722',
    email: 'divya.patel@college.edu',
    department: 'Cybersecurity',
    stream: 'Cybersecurity',
    year: '3rd Year',
    achievementType: 'International',
    achievementLevel: 'International',
    title: 'Research Paper',
    awardName: 'Research Paper',
    description: 'Springer International Conference on Cyber Defense',
    eventName: 'Springer International Conference on Cyber Defense',
    teamType: 'individual',
    date: '2025-12-10',
    status: 'approved',
    submittedAt: '2025-12-15T12:00:00Z',
    proof: 'https://drive.google.com/springer_cert',
    certificateLink: 'https://drive.google.com/springer_cert',
    eventImageLink: '',
  },
  {
    id: '8',
    studentName: 'Rohan Verma',
    rollNumber: '23A91A6732',
    hallTicketNumber: '23A91A6732',
    email: 'rohan.verma@college.edu',
    department: 'Data Science',
    stream: 'Data Science',
    year: '1st Year',
    achievementType: 'State',
    achievementLevel: 'State',
    title: 'Workshop',
    awardName: 'Workshop',
    description: 'State-Level Data Analytics Workshop by NASSCOM',
    eventName: 'State-Level Data Analytics Workshop',
    teamType: 'team',
    date: '2026-02-01',
    status: 'pending',
    submittedAt: '2026-02-22T10:00:00Z',
    proof: 'https://drive.google.com/workshop_cert',
    certificateLink: 'https://drive.google.com/workshop_cert',
    eventImageLink: '',
  },
  {
    id: '9',
    studentName: 'Kavya Nair',
    rollNumber: '22A91A6856',
    hallTicketNumber: '22A91A6856',
    email: 'kavya.nair@college.edu',
    department: 'AI & DS',
    stream: 'AI & DS',
    year: '2nd Year',
    achievementType: 'National',
    achievementLevel: 'National',
    title: 'First Prize',
    awardName: 'First Prize',
    description: 'National AI Innovation Challenge 2025',
    eventName: 'National AI Innovation Challenge 2025',
    teamType: 'team',
    date: '2025-11-20',
    status: 'approved',
    submittedAt: '2025-11-25T14:00:00Z',
    proof: 'https://drive.google.com/ai_challenge_cert',
    certificateLink: 'https://drive.google.com/ai_challenge_cert',
    eventImageLink: 'https://drive.google.com/ai_challenge_photo',
  },
  {
    id: '10',
    studentName: 'Pranav Mehta',
    rollNumber: '21A91A6771',
    hallTicketNumber: '21A91A6771',
    email: 'pranav.mehta@college.edu',
    department: 'Cybersecurity',
    stream: 'Cybersecurity',
    year: '4th Year',
    achievementType: 'International',
    achievementLevel: 'International',
    title: 'Internship',
    awardName: 'Internship',
    description: 'Cisco Cybersecurity Internship, Bangalore',
    eventName: 'Cisco Cybersecurity Internship',
    teamType: 'individual',
    date: '2025-07-31',
    status: 'approved',
    submittedAt: '2025-08-05T09:30:00Z',
    proof: 'https://drive.google.com/cisco_cert',
    certificateLink: 'https://drive.google.com/cisco_cert',
    eventImageLink: '',
  },
  {
    id: '11',
    studentName: 'Shreya Singh',
    rollNumber: '21A91A6799',
    hallTicketNumber: '21A91A6799',
    email: 'shreya.singh@college.edu',
    department: 'Data Science',
    stream: 'Data Science',
    year: '4th Year',
    achievementType: 'National',
    achievementLevel: 'National',
    title: 'Patent',
    awardName: 'Patent',
    description: 'Indian Patent Office — ML-Based Fraud Detection System',
    eventName: 'Indian Patent Office',
    teamType: 'team',
    date: '2026-01-10',
    status: 'approved',
    submittedAt: '2026-01-12T11:45:00Z',
    proof: 'https://drive.google.com/patent_cert',
    certificateLink: 'https://drive.google.com/patent_cert',
    eventImageLink: '',
  },
  {
    id: '12',
    studentName: 'Aditya Rao',
    rollNumber: '21A91A6710',
    hallTicketNumber: '21A91A6710',
    email: 'aditya.rao@college.edu',
    department: 'AI & DS',
    stream: 'AI & DS',
    year: '3rd Year',
    achievementType: 'State',
    achievementLevel: 'State',
    title: 'Sports',
    awardName: 'Sports',
    description: 'Telangana State Badminton Championship',
    eventName: 'Telangana State Badminton Championship',
    teamType: 'individual',
    date: '2025-12-05',
    status: 'rejected',
    submittedAt: '2025-12-08T15:00:00Z',
    proof: 'https://drive.google.com/badminton_cert',
    certificateLink: 'https://drive.google.com/badminton_cert',
    eventImageLink: '',
  },
  {
    id: '13',
    studentName: 'Meera Krishnan',
    rollNumber: '23A91A6651',
    hallTicketNumber: '23A91A6651',
    email: 'meera.krishnan@college.edu',
    department: 'Cybersecurity',
    stream: 'Cybersecurity',
    year: '1st Year',
    achievementType: 'Inter-University',
    achievementLevel: 'Inter-University',
    title: 'NPTEL',
    awardName: 'NPTEL',
    description: 'NPTEL Ethical Hacking Course — Elite + Silver',
    eventName: 'NPTEL Ethical Hacking',
    teamType: 'individual',
    date: '2026-01-05',
    status: 'approved',
    submittedAt: '2026-01-07T08:30:00Z',
    proof: 'https://drive.google.com/nptel_cert',
    certificateLink: 'https://drive.google.com/nptel_cert',
    eventImageLink: '',
  },
  {
    id: '14',
    studentName: 'Tanvir Ahmed',
    rollNumber: '22A91A6821',
    hallTicketNumber: '22A91A6821',
    email: 'tanvir.ahmed@college.edu',
    department: 'Data Science',
    stream: 'Data Science',
    year: '2nd Year',
    achievementType: 'National',
    achievementLevel: 'National',
    title: 'Hackathon',
    awardName: 'Hackathon',
    description: 'HackWithInfy 2025 National Hackathon',
    eventName: 'HackWithInfy 2025',
    teamType: 'team',
    date: '2025-10-18',
    status: 'pending',
    submittedAt: '2026-02-22T17:00:00Z',
    proof: 'https://drive.google.com/infosys_cert',
    certificateLink: 'https://drive.google.com/infosys_cert',
    eventImageLink: 'https://drive.google.com/infosys_photo',
  },
  {
    id: '15',
    studentName: 'Pooja Sharma',
    rollNumber: '21A91A6703',
    hallTicketNumber: '21A91A6703',
    email: 'pooja.sharma@college.edu',
    department: 'AI & DS',
    stream: 'AI & DS',
    year: '4th Year',
    achievementType: 'International',
    achievementLevel: 'International',
    title: 'Research Paper',
    awardName: 'Research Paper',
    description: 'ACM SIGKDD International Conference on Knowledge Discovery',
    eventName: 'ACM SIGKDD 2025',
    teamType: 'team',
    date: '2025-08-15',
    status: 'approved',
    submittedAt: '2025-08-20T10:00:00Z',
    proof: 'https://drive.google.com/acm_cert',
    certificateLink: 'https://drive.google.com/acm_cert',
    eventImageLink: '',
  },
];

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);

  const addAchievement = (achievement: Omit<Achievement, 'id' | 'status' | 'submittedAt'>) => {
    const newAchievement: Achievement = {
      ...achievement,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setAchievements(prev => [newAchievement, ...prev]);
  };

  const updateAchievementStatus = (id: string, status: 'approved' | 'rejected') => {
    setAchievements(prev =>
      prev.map(achievement =>
        achievement.id === id ? { ...achievement, status } : achievement
      )
    );
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  };

  return (
    <AchievementContext.Provider
      value={{ achievements, addAchievement, updateAchievementStatus, deleteAchievement }}
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

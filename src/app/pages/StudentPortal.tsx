import { useState } from 'react';
import type { ReactNode, ElementType } from 'react';
import { useAchievements } from '../context/AchievementContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Trophy,
  Paperclip,
  GraduationCap,
  Globe,
  Users,
  Link2,
  Calendar,
  Mail,
  Hash,
  BookOpen,
  Star,
  Image,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SubmissionForm {
  // Step 1
  studentName: string;
  hallTicketNumber: string;
  year: string;
  stream: string;
  email: string;
  // Step 2
  awardName: string;
  teamType: 'team' | 'individual' | '';
  achievementLevel: string;
  eventName: string;
  date: string;
  // Step 3
  certificateLink: string;
  eventImageLink: string;
}

const INITIAL_FORM: SubmissionForm = {
  studentName: '',
  hallTicketNumber: '',
  year: '',
  stream: '',
  email: '',
  awardName: '',
  teamType: '',
  achievementLevel: '',
  eventName: '',
  date: '',
  certificateLink: '',
  eventImageLink: '',
};

// Award options from Figma design
const AWARD_OPTIONS = [
  'Cash Prize',
  'First Prize',
  'Second Prize',
  'Third Prize',
  'Scholarship',
  'Internship',
  'Research Paper',
  'Patent',
  'NPTEL',
  'Hackathon',
  'Workshop',
  'Placement/Offer Letter/JOB',
  'Sports',
];

// Achievement level options
const ACHIEVEMENT_LEVELS = [
  'Inter-University',
  'State',
  'National',
  'International',
];

// ─── Step Progress Indicator ──────────────────────────────────────────────────
const steps = [
  { id: 1, label: 'Personal Details', icon: User },
  { id: 2, label: 'Achievement Details', icon: Trophy },
  { id: 3, label: 'Attachments', icon: Paperclip },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300
                  ${isCompleted
                    ? 'bg-[#0ea5e9] border-[#0ea5e9] shadow-lg shadow-[#0ea5e9]/30'
                    : isActive
                    ? 'bg-[#0ea5e9]/15 border-[#0ea5e9] shadow-lg shadow-[#0ea5e9]/20'
                    : 'bg-white/5 border-white/20'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-[#0ea5e9]' : 'text-white/30'}`}
                  />
                )}
              </div>
              <span
                className={`text-xs whitespace-nowrap transition-colors duration-300 ${
                  isActive ? 'text-[#0ea5e9]' : isCompleted ? 'text-white/70' : 'text-white/30'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="relative mx-3 mb-5">
                <div className="w-16 sm:w-24 h-px bg-white/10" />
                <div
                  className="absolute inset-0 h-px bg-[#0ea5e9] transition-all duration-500"
                  style={{ width: currentStep > step.id ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Field Components ─────────────────────────────────────────────────────────
function FieldWrapper({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function FieldLabel({
  htmlFor,
  icon: Icon,
  children,
}: {
  htmlFor: string;
  icon?: ElementType;
  children: ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-white/90 flex items-center gap-2"
    >
      {Icon && <Icon className="w-3.5 h-3.5 text-[#0ea5e9]" />}
      {children}
    </Label>
  );
}

function StyledInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-white/5 border-white/10 text-white placeholder:text-white/30
        focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30
        hover:border-white/20 transition-colors"
    />
  );
}

function StyledSelect({
  id,
  value,
  onChange,
  placeholder,
  children,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className="bg-white/5 border-white/10 text-white hover:border-white/20
          focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-[#1a2240] border-white/10 text-white">
        {children}
      </SelectContent>
    </Select>
  );
}

// ─── Award Radio Group ────────────────────────────────────────────────────────
function AwardRadioGroup({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="rounded-xl border border-white/10 p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {AWARD_OPTIONS.map((option) => {
        const isSelected = value === option;
        return (
          <label
            key={option}
            className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer group
              hover:bg-white/5 transition-colors"
          >
            <input
              type="radio"
              name="awardName"
              value={option}
              checked={isSelected}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {/* Custom radio */}
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                transition-all duration-150
                ${isSelected
                  ? 'border-[#0ea5e9] bg-[#0ea5e9]'
                  : 'border-white/30 bg-transparent group-hover:border-white/50'
                }`}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span
              className={`text-sm transition-colors ${
                isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/80'
              }`}
            >
              {option}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ─── Achievement Level Radio Group ───────────────────────────────────────────
function AchievementLevelGroup({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="rounded-xl border border-white/10 p-4 space-y-1"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {ACHIEVEMENT_LEVELS.map((level) => {
        const isSelected = value === level;
        return (
          <label
            key={level}
            className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer group
              hover:bg-white/5 transition-colors"
          >
            <input
              type="radio"
              name="achievementLevel"
              value={level}
              checked={isSelected}
              onChange={() => onChange(level)}
              className="sr-only"
            />
            {/* Custom checkbox-style indicator (square) */}
            <div
              className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0
                transition-all duration-150
                ${isSelected
                  ? 'border-[#0ea5e9] bg-[#0ea5e9]'
                  : 'border-white/30 bg-transparent group-hover:border-white/50'
                }`}
            >
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              )}
            </div>
            <span
              className={`text-sm transition-colors ${
                isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/80'
              }`}
            >
              {level}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ─── Review Summary ───────────────────────────────────────────────────────────
function ReviewSummary({ data }: { data: SubmissionForm }) {
  const rows: { label: string; value: string; icon: ElementType }[] = [
    { label: 'Student Name', value: data.studentName, icon: User },
    { label: 'Hall Ticket No.', value: data.hallTicketNumber, icon: Hash },
    { label: 'Year', value: data.year, icon: GraduationCap },
    { label: 'Stream / Course', value: data.stream, icon: BookOpen },
    { label: 'Email Address', value: data.email, icon: Mail },
    { label: 'Award / Medal', value: data.awardName, icon: Star },
    {
      label: 'Participation Type',
      value: data.teamType
        ? data.teamType.charAt(0).toUpperCase() + data.teamType.slice(1)
        : '',
      icon: data.teamType === 'team' ? Users : User,
    },
    { label: 'Achievement Level', value: data.achievementLevel, icon: Globe },
    { label: 'Event Name', value: data.eventName, icon: Trophy },
    {
      label: 'Event Date',
      value: data.date
        ? new Date(data.date + 'T00:00:00').toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
      icon: Calendar,
    },
    { label: 'Certificate Link', value: data.certificateLink, icon: Link2 },
    { label: 'Event Image Link', value: data.eventImageLink || '—', icon: Image },
  ];

  return (
    <div className="rounded-xl border border-[#0ea5e9]/20 bg-[#0ea5e9]/5 p-5 space-y-3">
      <h4 className="text-white flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-4 h-4 text-[#0ea5e9]" />
        Review Your Submission
      </h4>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
          >
            <div className="w-7 h-7 rounded-md bg-[#0ea5e9]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-[#0ea5e9]" />
            </div>
            <div className="min-w-0">
              <p className="text-white/50 text-xs">{label}</p>
              <p className="text-white text-sm break-all leading-snug mt-0.5">
                {value || <span className="text-white/30 italic">Not provided</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center shadow-2xl shadow-[#0ea5e9]/30 mb-6">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-white mb-3">Achievement Submitted!</h3>
      <p className="text-white/60 max-w-sm mb-8">
        Your achievement has been submitted successfully and is now pending review by the
        department admin.
      </p>
      <Button
        onClick={onReset}
        className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#075985] text-white shadow-lg shadow-[#0ea5e9]/20 px-8"
      >
        Submit Another Achievement
      </Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function StudentPortal() {
  const { addAchievement } = useAchievements();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SubmissionForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof SubmissionForm) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateStep1 = () => {
    if (!formData.studentName.trim()) { toast.error('Please enter your student name.'); return false; }
    if (!formData.hallTicketNumber.trim()) { toast.error('Please enter your hall ticket number.'); return false; }
    if (!formData.year) { toast.error('Please select your current year.'); return false; }
    if (!formData.stream) { toast.error('Please select your stream/course.'); return false; }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address.'); return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.awardName) { toast.error('Please select the type of award/medal.'); return false; }
    if (!formData.teamType) { toast.error('Please select Team or Individual.'); return false; }
    if (!formData.achievementLevel) { toast.error('Please select the achievement level.'); return false; }
    if (!formData.eventName.trim()) { toast.error('Please enter the event name.'); return false; }
    if (!formData.date) { toast.error('Please select the event date.'); return false; }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.certificateLink.trim()) {
      toast.error('Please provide the Google Drive link for your certificate.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!validateStep3()) return;

    addAchievement({
      studentName: formData.studentName,
      rollNumber: formData.hallTicketNumber,
      hallTicketNumber: formData.hallTicketNumber,
      email: formData.email,
      department: formData.stream,
      stream: formData.stream,
      year: formData.year,
      achievementType: formData.achievementLevel,
      achievementLevel: formData.achievementLevel,
      title: formData.awardName,
      awardName: formData.awardName,
      description: formData.eventName,
      eventName: formData.eventName,
      teamType: formData.teamType as 'team' | 'individual',
      date: formData.date,
      proof: formData.certificateLink,
      certificateLink: formData.certificateLink,
      eventImageLink: formData.eventImageLink,
    });

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setCurrentStep(1);
    setSubmitted(false);
  };

  return (
    <div
      className="min-h-screen pb-16"
      style={{
        background:
          'radial-gradient(ellipse at 60% 0%, rgba(14,165,233,0.08) 0%, transparent 60%)',
      }}
    >
      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <div className="pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Logo row */}
          <div className="flex items-center gap-4 mb-6">
            {/* College logo placeholder */}
            <div
              className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center
                border border-white/10 bg-[rgba(30,39,73,0.7)] backdrop-blur-md shadow-xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(2,132,199,0.15) 100%)',
              }}
            >
              <GraduationCap className="w-8 h-8 text-[#0ea5e9]" />
            </div>

            <div>
              <h1 className="text-white leading-tight">
                Department Achievement Tracker
              </h1>
              <p className="text-white/55 mt-1">
                Submit your academic and extracurricular achievements
              </p>
            </div>
          </div>

          {/* Accent line */}
          <div className="h-px bg-gradient-to-r from-[#0ea5e9] via-[#38bdf8] to-transparent" />
        </div>
      </div>

      {/* ── Form Card ─────────────────────────────────────────────────────── */}
      <div className="px-4">
        <div
          className="max-w-2xl mx-auto rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          style={{
            background: 'rgba(20, 28, 60, 0.70)',
            backdropFilter: 'blur(20px)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.4), 0 0 80px rgba(14,165,233,0.06)',
          }}
        >
          {/* Inner padding */}
          <div className="p-6 sm:p-8">
            {submitted ? (
              <SuccessScreen onReset={handleReset} />
            ) : (
              <>
                {/* Step Indicator */}
                <StepIndicator currentStep={currentStep} />

                {/* Step title */}
                <div className="mb-8 pb-6 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center shadow-lg shadow-[#0ea5e9]/25">
                      {currentStep === 1 && <User className="w-4 h-4 text-white" />}
                      {currentStep === 2 && <Trophy className="w-4 h-4 text-white" />}
                      {currentStep === 3 && <Paperclip className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <h2 className="text-white">
                        {currentStep === 1 && 'Personal Details'}
                        {currentStep === 2 && 'Achievement Details'}
                        {currentStep === 3 && 'Attachments & Review'}
                      </h2>
                      <p className="text-white/45 text-sm mt-0.5">
                        {currentStep === 1 && 'Tell us about yourself'}
                        {currentStep === 2 && 'Describe your achievement'}
                        {currentStep === 3 && 'Upload proof and review before submitting'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── STEP 1 ─────────────────────────────────────────────── */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FieldWrapper>
                        <FieldLabel htmlFor="studentName" icon={User}>
                          Student Name <span className="text-[#0ea5e9]">*</span>
                        </FieldLabel>
                        <StyledInput
                          id="studentName"
                          value={formData.studentName}
                          onChange={set('studentName')}
                          placeholder="Enter your full name"
                        />
                      </FieldWrapper>

                      <FieldWrapper>
                        <FieldLabel htmlFor="hallTicketNumber" icon={Hash}>
                          Hall Ticket Number <span className="text-[#0ea5e9]">*</span>
                        </FieldLabel>
                        <StyledInput
                          id="hallTicketNumber"
                          value={formData.hallTicketNumber}
                          onChange={set('hallTicketNumber')}
                          placeholder="e.g., 21A91A6701"
                        />
                      </FieldWrapper>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FieldWrapper>
                        <FieldLabel htmlFor="year" icon={GraduationCap}>
                          Currently Studying <span className="text-[#0ea5e9]">*</span>
                        </FieldLabel>
                        <StyledSelect
                          id="year"
                          value={formData.year}
                          onChange={set('year')}
                          placeholder="Select year"
                        >
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                        </StyledSelect>
                      </FieldWrapper>

                      <FieldWrapper>
                        <FieldLabel htmlFor="stream" icon={BookOpen}>
                          Stream / Course <span className="text-[#0ea5e9]">*</span>
                        </FieldLabel>
                        <StyledSelect
                          id="stream"
                          value={formData.stream}
                          onChange={set('stream')}
                          placeholder="Select stream"
                        >
                          <SelectItem value="AI & DS">AI &amp; DS</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                        </StyledSelect>
                      </FieldWrapper>
                    </div>

                    <FieldWrapper>
                      <FieldLabel htmlFor="email" icon={Mail}>
                        Email Address <span className="text-[#0ea5e9]">*</span>
                      </FieldLabel>
                      <StyledInput
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={set('email')}
                        placeholder="your.email@college.edu"
                      />
                    </FieldWrapper>
                  </div>
                )}

                {/* ── STEP 2 ─────────────────────────────────────────────── */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Award Name — radio buttons */}
                    <FieldWrapper>
                      <FieldLabel htmlFor="awardName" icon={Star}>
                        Name of the Award / Medal <span className="text-[#0ea5e9]">*</span>
                      </FieldLabel>
                      <AwardRadioGroup
                        value={formData.awardName}
                        onChange={set('awardName')}
                      />
                    </FieldWrapper>

                    {/* Team / Individual Toggle */}
                    <FieldWrapper>
                      <FieldLabel htmlFor="teamType" icon={Users}>
                        Team / Individual <span className="text-[#0ea5e9]">*</span>
                      </FieldLabel>
                      <div className="flex gap-3 mt-1">
                        {(['team', 'individual'] as const).map((type) => {
                          const isSelected = formData.teamType === type;
                          const Icon = type === 'team' ? Users : User;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => set('teamType')(type)}
                              className={`
                                flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                                border-2 transition-all duration-200 cursor-pointer
                                ${isSelected
                                  ? 'bg-[#0ea5e9]/15 border-[#0ea5e9] text-[#0ea5e9] shadow-lg shadow-[#0ea5e9]/10'
                                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
                                }
                              `}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="capitalize">{type}</span>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </FieldWrapper>

                    {/* Achievement Level — checkbox-style radio */}
                    <FieldWrapper>
                      <FieldLabel htmlFor="achievementLevel" icon={Globe}>
                        Achievement Level (Inter-University / State / National / International){' '}
                        <span className="text-[#0ea5e9]">*</span>
                      </FieldLabel>
                      <AchievementLevelGroup
                        value={formData.achievementLevel}
                        onChange={set('achievementLevel')}
                      />
                    </FieldWrapper>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FieldWrapper>
                        <FieldLabel htmlFor="eventName" icon={Trophy}>
                          Name of the Event <span className="text-[#0ea5e9]">*</span>
                        </FieldLabel>
                        <StyledInput
                          id="eventName"
                          value={formData.eventName}
                          onChange={set('eventName')}
                          placeholder="e.g., Smart India Hackathon 2025"
                        />
                      </FieldWrapper>

                      <FieldWrapper>
                        <FieldLabel htmlFor="date" icon={Calendar}>
                          Event Date <span className="text-[#0ea5e9]">*</span>
                        </FieldLabel>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => set('date')(e.target.value)}
                          className="bg-white/5 border-white/10 text-white
                            focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30
                            hover:border-white/20 transition-colors
                            [color-scheme:dark]"
                        />
                      </FieldWrapper>
                    </div>
                  </div>
                )}

                {/* ── STEP 3 ─────────────────────────────────────────────── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Certificate Link */}
                    <FieldWrapper>
                      <FieldLabel htmlFor="certificateLink" icon={Link2}>
                        Certificate of Achievement (Google Drive Link){' '}
                        <span className="text-[#0ea5e9]">*</span>
                      </FieldLabel>
                      <StyledInput
                        id="certificateLink"
                        value={formData.certificateLink}
                        onChange={set('certificateLink')}
                        placeholder="https://drive.google.com/file/d/..."
                      />
                      <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-[#0ea5e9]/8 border border-[#0ea5e9]/20">
                        <Info className="w-3.5 h-3.5 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                        <p className="text-[#7dd3fc] text-xs">
                          Please provide <span className="text-white">edit access</span> to the
                          file before attaching the link.
                        </p>
                      </div>
                    </FieldWrapper>

                    {/* Event Image Link */}
                    <FieldWrapper>
                      <FieldLabel htmlFor="eventImageLink" icon={Image}>
                        Upload Event Image (Google Drive Link)
                        <span className="text-white/40 text-xs ml-1">(Optional)</span>
                      </FieldLabel>
                      <StyledInput
                        id="eventImageLink"
                        value={formData.eventImageLink}
                        onChange={set('eventImageLink')}
                        placeholder="https://drive.google.com/file/d/..."
                      />
                      <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-[#0ea5e9]/8 border border-[#0ea5e9]/20">
                        <Info className="w-3.5 h-3.5 text-[#0ea5e9] flex-shrink-0 mt-0.5" />
                        <p className="text-[#7dd3fc] text-xs">
                          Please provide <span className="text-white">edit access</span> to the
                          file before attaching the link.
                        </p>
                      </div>
                    </FieldWrapper>

                    {/* Review Summary */}
                    <ReviewSummary data={formData} />
                  </div>
                )}

                {/* ── Navigation Buttons ────────────────────────────────── */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/8">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      className="text-white/70 hover:text-white hover:bg-white/5 gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#075985] text-white shadow-lg shadow-[#0ea5e9]/20 gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#075985] text-white shadow-lg shadow-[#0ea5e9]/20 gap-2 px-8"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Submit Achievement
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        {!submitted && (
          <p className="text-center text-white/35 text-xs mt-6 max-w-2xl mx-auto">
            Your submission will be reviewed by the department admin before publishing.
          </p>
        )}
      </div>
    </div>
  );
}

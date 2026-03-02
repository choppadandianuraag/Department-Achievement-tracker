import { useState, useRef } from 'react';
import type { ReactNode, ElementType } from 'react';
import { useAchievements } from '../context/AchievementContext';
import { supabase, supabaseConfigured } from '../lib/supabase';
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
  Calendar,
  Mail,
  Hash,
  BookOpen,
  Star,
  Image,
  Info,
  Upload,
  X,
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
  // Step 3 — files instead of links
  certificateFile: File | null;
  eventImageFile: File | null;
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
  certificateFile: null,
  eventImageFile: null,
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

const ACCEPTED_FILE_TYPES = '.png,.jpg,.jpeg';
const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg'];

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
                    ? 'bg-primary border-primary shadow-lg'
                    : isActive
                      ? 'bg-primary/15 border-primary shadow-lg'
                      : 'bg-secondary border-border'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'text-foreground' : 'text-muted-foreground/50'}`}
                  />
                )}
              </div>
              <span
                className={`text-xs whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-foreground' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/50'
                  }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="relative mx-3 mb-5">
                <div className="w-16 sm:w-24 h-px bg-border" />
                <div
                  className="absolute inset-0 h-px bg-foreground transition-all duration-500"
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
      className="text-foreground/90 flex items-center gap-2"
    >
      {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
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
      className="bg-input-background border-border text-foreground placeholder:text-muted-foreground/50
        focus:border-foreground focus:ring-1 focus:ring-foreground/30
        hover:border-muted-foreground/40 transition-colors"
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
        className="bg-input-background border-border text-foreground hover:border-muted-foreground/40
          focus:border-foreground focus:ring-1 focus:ring-foreground/30 transition-colors"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border text-popover-foreground">
        {children}
      </SelectContent>
    </Select>
  );
}

// ─── File Upload Component ────────────────────────────────────────────────────
function FileUpload({
  id,
  label,
  file,
  onChange,
  required = false,
}: {
  id: string;
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
        toast.error('Only PNG, JPG, and JPEG files are accepted.');
        return;
      }
      onChange(f);
    }
  };

  return (
    <div className="space-y-2">
      {file ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-sm font-medium truncate">{file.name}</p>
            <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-muted-foreground/50 bg-input-background transition-colors cursor-pointer"
        >
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Click to upload {label}
          </span>
          <span className="text-xs text-muted-foreground/60">PNG, JPG, JPEG only</span>
        </button>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        onChange={handleChange}
        className="sr-only"
      />
    </div>
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
      className="rounded-xl border border-border p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 bg-secondary/50"
    >
      {AWARD_OPTIONS.map((option) => {
        const isSelected = value === option;
        return (
          <label
            key={option}
            className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer group
              hover:bg-accent transition-colors"
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
                  ? 'border-foreground bg-foreground'
                  : 'border-muted-foreground/40 bg-transparent group-hover:border-muted-foreground'
                }`}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-background" />
              )}
            </div>
            <span
              className={`text-sm transition-colors ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/80'
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
      className="rounded-xl border border-border p-4 space-y-1 bg-secondary/50"
    >
      {ACHIEVEMENT_LEVELS.map((level) => {
        const isSelected = value === level;
        return (
          <label
            key={level}
            className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer group
              hover:bg-accent transition-colors"
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
                  ? 'border-foreground bg-foreground'
                  : 'border-muted-foreground/40 bg-transparent group-hover:border-muted-foreground'
                }`}
            >
              {isSelected && (
                <svg className="w-3 h-3 text-background" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm transition-colors ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/80'
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
    { label: 'Certificate', value: data.certificateFile?.name || '—', icon: Upload },
    { label: 'Event Image', value: data.eventImageFile?.name || '—', icon: Image },
  ];

  return (
    <div className="rounded-xl border border-border bg-secondary p-5 space-y-3">
      <h4 className="text-foreground flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-4 h-4 text-foreground" />
        Review Your Submission
      </h4>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-3 rounded-lg bg-accent/50"
          >
            <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="text-foreground text-sm break-all leading-snug mt-0.5">
                {value || <span className="text-muted-foreground/50 italic">Not provided</span>}
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
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl mb-6">
        <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
      </div>
      <h3 className="text-foreground mb-3">Achievement Submitted!</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        Your achievement has been submitted successfully and is now pending review by the
        department admin.
      </p>
      <Button
        onClick={onReset}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-8"
      >
        Submit Another Achievement
      </Button>
    </div>
  );
}

// ─── Helper: upload file to Supabase Storage ──────────────────────────────────
async function uploadFile(file: File, folder: string): Promise<string> {
  if (!supabaseConfigured) return '';

  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('achievement-uploads')
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    // Give a human-readable message for the most common bucket error
    const msg = error.message || '';
    if (msg.includes('Bucket not found') || msg.includes('bucket') || msg.includes('storage')) {
      throw new Error(
        'Storage bucket not found. Please create the "achievement-uploads" bucket in your Supabase Dashboard → Storage.'
      );
    }
    throw new Error(`File upload failed: ${msg}`);
  }

  const { data } = supabase.storage
    .from('achievement-uploads')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function StudentPortal() {
  const { addAchievement } = useAchievements();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SubmissionForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field: keyof SubmissionForm) => (value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const setFile = (field: 'certificateFile' | 'eventImageFile') => (file: File | null) =>
    setFormData((prev) => ({ ...prev, [field]: file }));

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
    if (!formData.certificateFile) {
      toast.error('Please upload your certificate image.');
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

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setUploading(true);
    try {
      // Upload files to Supabase Storage (graceful degradation — continue without URL if storage fails)
      let certificateUrl = '';
      let eventImageUrl = '';
      let storageWarning = '';

      if (formData.certificateFile) {
        try {
          certificateUrl = await uploadFile(formData.certificateFile, 'certificates');
        } catch (uploadErr) {
          const msg = uploadErr instanceof Error ? uploadErr.message : 'Unknown upload error';
          console.error('Certificate upload failed:', msg);
          storageWarning = msg;
        }
      }
      if (formData.eventImageFile) {
        try {
          eventImageUrl = await uploadFile(formData.eventImageFile, 'event-images');
        } catch (uploadErr) {
          console.error('Event image upload failed:', uploadErr);
          // Non-critical — just skip the image URL
        }
      }

      await addAchievement({
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
        proof: certificateUrl,
        certificateLink: certificateUrl,
        eventImageLink: eventImageUrl,
      });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Warn about storage issue AFTER successful submission
      if (storageWarning) {
        toast.warning(
          'Achievement saved, but file upload failed. ' +
          'Please set up the Supabase Storage bucket "achievement-uploads" to enable file uploads.',
          { duration: 8000 }
        );
      }
    } catch (err) {
      console.error('Submission error:', err);
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('rls') || msg.toLowerCase().includes('policy') || msg.toLowerCase().includes('permission')) {
        toast.error('Permission denied. Please check the Row Level Security policies on the achievements table in Supabase.');
      } else if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate')) {
        toast.error('A submission with this information already exists.');
      } else if (msg) {
        toast.error(`Submission failed: ${msg}`);
      } else {
        toast.error('Failed to submit achievement. Please check your internet connection and try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setCurrentStep(1);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <div className="pt-10 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Logo row */}
          <div className="flex items-center gap-4 mb-6">
            {/* College logo placeholder */}
            <div
              className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center
                border border-border bg-card backdrop-blur-md shadow-xl"
            >
              <GraduationCap className="w-8 h-8 text-foreground" />
            </div>

            <div>
              <h1 className="text-foreground leading-tight">
                Department Achievement Tracker
              </h1>
              <p className="text-primary font-semibold text-sm mt-0.5">
                Department of CSE-(DS,CYS) &amp; AI&amp;DS
              </p>
              <p className="text-muted-foreground mt-1">
                Submit your academic and extracurricular achievements
              </p>
            </div>
          </div>

          {/* Accent line */}
          <div className="h-px bg-gradient-to-r from-foreground/30 via-muted-foreground/20 to-transparent" />
        </div>
      </div>

      {/* ── Form Card ─────────────────────────────────────────────────────── */}
      <div className="px-4">
        <div
          className="max-w-2xl mx-auto rounded-2xl border border-border shadow-2xl overflow-hidden bg-card backdrop-blur-xl"
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
                <div className="mb-8 pb-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                      {currentStep === 1 && <User className="w-4 h-4 text-primary-foreground" />}
                      {currentStep === 2 && <Trophy className="w-4 h-4 text-primary-foreground" />}
                      {currentStep === 3 && <Paperclip className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <div>
                      <h2 className="text-foreground">
                        {currentStep === 1 && 'Personal Details'}
                        {currentStep === 2 && 'Achievement Details'}
                        {currentStep === 3 && 'Attachments & Review'}
                      </h2>
                      <p className="text-muted-foreground text-sm mt-0.5">
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
                          Student Name <span className="text-destructive">*</span>
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
                          Hall Ticket Number <span className="text-destructive">*</span>
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
                          Currently Studying <span className="text-destructive">*</span>
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
                          Stream / Course <span className="text-destructive">*</span>
                        </FieldLabel>
                        <StyledSelect
                          id="stream"
                          value={formData.stream}
                          onChange={set('stream')}
                          placeholder="Select stream"
                        >
                          <SelectItem value="AI&DS">AI&amp;DS</SelectItem>
                          <SelectItem value="Data Science">Data science</SelectItem>
                          <SelectItem value="Cybersecurity">Cyber security</SelectItem>
                        </StyledSelect>
                      </FieldWrapper>
                    </div>

                    <FieldWrapper>
                      <FieldLabel htmlFor="email" icon={Mail}>
                        Email Address <span className="text-destructive">*</span>
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
                        Name of the Award / Medal <span className="text-destructive">*</span>
                      </FieldLabel>
                      <AwardRadioGroup
                        value={formData.awardName}
                        onChange={set('awardName')}
                      />
                    </FieldWrapper>

                    {/* Team / Individual Toggle */}
                    <FieldWrapper>
                      <FieldLabel htmlFor="teamType" icon={Users}>
                        Team / Individual <span className="text-destructive">*</span>
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
                                  ? 'bg-primary/10 border-foreground text-foreground shadow-lg'
                                  : 'bg-secondary border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground'
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
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <AchievementLevelGroup
                        value={formData.achievementLevel}
                        onChange={set('achievementLevel')}
                      />
                    </FieldWrapper>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FieldWrapper>
                        <FieldLabel htmlFor="eventName" icon={Trophy}>
                          Name of the Event <span className="text-destructive">*</span>
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
                          Event Date <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => set('date')(e.target.value)}
                          className="bg-input-background border-border text-foreground
                            focus:border-foreground focus:ring-1 focus:ring-foreground/30
                            hover:border-muted-foreground/40 transition-colors"
                        />
                      </FieldWrapper>
                    </div>
                  </div>
                )}

                {/* ── STEP 3 ─────────────────────────────────────────────── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* Certificate Upload */}
                    <FieldWrapper>
                      <FieldLabel htmlFor="certificateFile" icon={Upload}>
                        Certificate of Achievement{' '}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FileUpload
                        id="certificateFile"
                        label="certificate image"
                        file={formData.certificateFile}
                        onChange={setFile('certificateFile')}
                        required
                      />
                      <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-secondary border border-border">
                        <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground text-xs">
                          Upload a clear image of your certificate. Accepted formats:{' '}
                          <span className="text-foreground font-medium">PNG, JPG, JPEG</span>.
                        </p>
                      </div>
                    </FieldWrapper>

                    {/* Event Image Upload */}
                    <FieldWrapper>
                      <FieldLabel htmlFor="eventImageFile" icon={Image}>
                        Event Image
                        <span className="text-muted-foreground text-xs ml-1">(Optional)</span>
                      </FieldLabel>
                      <FileUpload
                        id="eventImageFile"
                        label="event image"
                        file={formData.eventImageFile}
                        onChange={setFile('eventImageFile')}
                      />
                    </FieldWrapper>

                    {/* Review Summary */}
                    <ReviewSummary data={formData} />
                  </div>
                )}

                {/* ── Navigation Buttons ────────────────────────────────── */}
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent gap-2"
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
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={uploading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg gap-2 px-8"
                    >
                      {uploading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                          Uploading...
                        </div>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Submit Achievement
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        {!submitted && (
          <p className="text-center text-muted-foreground/60 text-xs mt-6 max-w-2xl mx-auto">
            Your submission will be reviewed by the department admin before publishing.
          </p>
        )}
      </div>
    </div>
  );
}

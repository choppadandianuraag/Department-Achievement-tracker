import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Database,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    emailOnNew: true,
    emailOnApproved: false,
    emailOnRejected: false,
  });

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully!');
    setTimeout(() => setSaved(false), 2000);
  };

  const SectionCard = ({
    icon: Icon,
    title,
    description,
    children,
  }: {
    icon: typeof SettingsIcon;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="rounded-2xl border border-border overflow-hidden bg-card backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-foreground">{title}</h3>
          <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );

  const ToggleRow = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-foreground/80 text-sm">{label}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${checked ? 'bg-primary' : 'bg-switch-background'
          }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-primary-foreground shadow transition-all duration-200 ${checked ? 'left-6' : 'left-1'
            }`}
        />
      </button>
    </div>
  );

  const inputClass =
    'w-full px-3 py-2 rounded-xl text-sm text-foreground bg-input-background border border-border focus:border-foreground focus:outline-none focus:ring-1 focus:ring-ring/30 transition-colors placeholder:text-muted-foreground/50';

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your admin portal preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile */}
        <SectionCard icon={User} title="Profile" description="Update your admin account details">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Display Name</label>
              <input type="text" defaultValue="Admin User" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Email Address</label>
              <input type="email" defaultValue="admin@college.edu" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Employee ID</label>
              <input type="text" defaultValue="CS-ADM-001" className={inputClass} />
            </div>
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard icon={Lock} title="Security" description="Manage your password and access">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">New Password</label>
              <input type="password" placeholder="Enter new password" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs">Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" className={inputClass} />
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={Bell} title="Notifications" description="Configure email notification preferences">
          <div>
            <ToggleRow
              label="New Submission"
              description="Notify when a student submits an achievement"
              checked={notifications.emailOnNew}
              onChange={(v) => setNotifications((n) => ({ ...n, emailOnNew: v }))}
            />
            <ToggleRow
              label="Achievement Approved"
              description="Notify when an achievement is approved"
              checked={notifications.emailOnApproved}
              onChange={(v) => setNotifications((n) => ({ ...n, emailOnApproved: v }))}
            />
            <ToggleRow
              label="Achievement Rejected"
              description="Notify when an achievement is rejected"
              checked={notifications.emailOnRejected}
              onChange={(v) => setNotifications((n) => ({ ...n, emailOnRejected: v }))}
            />
          </div>
        </SectionCard>

        {/* System Info */}
        <SectionCard icon={Database} title="System Information" description="Application details and version">
          <div className="space-y-3">
            {[
              { label: 'App Version', value: 'v1.0.0' },
              { label: 'College Name', value: 'VNR Vignana Jyothi Institute of Engineering & Technology' },
              { label: 'Departments', value: 'CSE-(DS), CSE-(CYS), AI&DS' },
              { label: 'Backend', value: 'Supabase' },
              { label: 'Last Updated', value: 'February 2026' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
              >
                <span className="text-muted-foreground text-sm">{label}</span>
                <span className="text-foreground/80 text-sm">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200
            ${saved
              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
            }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

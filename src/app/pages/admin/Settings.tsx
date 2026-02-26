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
    <div
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: 'rgba(20, 28, 60, 0.70)', backdropFilter: 'blur(20px)' }}
    >
      <div
        className="flex items-center gap-3 px-6 py-5 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="w-9 h-9 rounded-xl bg-[#0ea5e9]/15 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#0ea5e9]" />
        </div>
        <div>
          <h3 className="text-white">{title}</h3>
          <p className="text-white/40 text-xs mt-0.5">{description}</p>
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
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-white/80 text-sm">{label}</p>
        <p className="text-white/40 text-xs mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${
          checked ? 'bg-[#0ea5e9]' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          Settings
        </h1>
        <p className="text-white/50 text-sm mt-1">Manage your admin portal preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <SectionCard icon={User} title="Profile" description="Update your admin account details">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs">Display Name</label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
                  focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs">Email Address</label>
              <input
                type="email"
                defaultValue="admin@college.edu"
                className="w-full px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
                  focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs">Employee ID</label>
              <input
                type="text"
                defaultValue="CS-ADM-001"
                className="w-full px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
                  focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors"
              />
            </div>
          </div>
        </SectionCard>

        {/* Security Settings */}
        <SectionCard icon={Lock} title="Security" description="Manage your password and access">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 pr-10 rounded-xl text-sm text-white bg-white/5 border border-white/10
                    focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors placeholder:text-white/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
                  focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors placeholder:text-white/25"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-3 py-2 rounded-xl text-sm text-white bg-white/5 border border-white/10
                  focus:border-[#0ea5e9] focus:outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 transition-colors placeholder:text-white/25"
              />
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
              { label: 'College Name', value: 'Engineering College' },
              { label: 'Departments', value: 'AI & DS, Data Science, Cybersecurity' },
              { label: 'Total Submissions', value: 'See Analytics' },
              { label: 'Last Updated', value: 'February 23, 2026' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
              >
                <span className="text-white/50 text-sm">{label}</span>
                <span className="text-white/80 text-sm">{value}</span>
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
              ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
              : 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white hover:from-[#0284c7] hover:to-[#075985] shadow-lg shadow-[#0ea5e9]/20'
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

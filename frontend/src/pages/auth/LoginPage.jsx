import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Mail, Lock, LogIn, Sparkles,
  ChevronDown, ChevronUp, Info, GraduationCap,
  Briefcase, Building2, Heart, Scale, Users, Shield
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { InputField } from '../../components/forms/InputField';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

// ─── Domain / Role information shown on login ────────────────────────────────
const DOMAIN_INFO = [
  {
    role: 'teen',
    label: '👧 Teen / Student',
    email: 'teen@teentalk.org',
    color: 'teal',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-800',
    badge: 'bg-teal-600',
    icon: GraduationCap,
    description: 'Access your safety learning modules, mood tracker, AI chat, and certificates.',
    dashboard: '/dashboard/teen',
  },
  {
    role: 'adult',
    label: '👨‍👩‍👦 Adult / Parent',
    email: 'adult@teentalk.org',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badge: 'bg-blue-600',
    icon: Users,
    description: 'View your child\'s progress and access parent-oriented safety awareness modules.',
    dashboard: '/dashboard/adult',
  },
  {
    role: 'school_admin',
    label: '🏫 School Admin',
    email: 'school@teentalk.org',
    color: 'amber',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badge: 'bg-amber-600',
    icon: Building2,
    description: 'Manage student registrations, monitor school-wide module completion, and issue certificates.',
    dashboard: '/dashboard/school',
  },
  {
    role: 'employee',
    label: '💼 Employee',
    email: 'employee@teentalk.org',
    color: 'emerald',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    badge: 'bg-emerald-600',
    icon: Briefcase,
    description: 'Complete mandatory POSH training, file workplace complaints confidentially.',
    dashboard: '/dashboard/employee',
  },
  {
    role: 'hr',
    label: '⚖️ HR / POSH Officer',
    email: 'hr@teentalk.org',
    color: 'rose',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    badge: 'bg-rose-600',
    icon: Scale,
    description: 'Review workplace complaints, manage IC committee cases, track POSH compliance.',
    dashboard: '/dashboard/hr',
  },
  {
    role: 'counselor',
    label: '🧠 Counselor / NGO',
    email: 'counselor@teentalk.org',
    color: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    badge: 'bg-purple-600',
    icon: Heart,
    description: 'Manage counseling sessions, case notes, and support escalations for teens in need.',
    dashboard: '/dashboard/support',
  },
  {
    role: 'super_admin',
    label: '⚡ Super Admin',
    email: 'admin@teentalk.org',
    color: 'slate',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-900',
    badge: 'bg-slate-800',
    icon: Shield,
    description: 'Full platform governance: manage all users, organizations, audit logs & system security.',
    dashboard: '/dashboard/admin',
    isSuperAdmin: true,
  },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDomainInfo, setShowDomainInfo] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const { login, getDashboardRoute } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(email, password);
      const targetRoute = from || getDashboardRoute(user.role);
      navigate(targetRoute, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectDemoRole = (domain) => {
    setEmail(domain.email);
    setPassword('Password123!');
    setSelectedDomain(domain);
    setError('');
  };

  const selectedInfo = DOMAIN_INFO.find((d) => d.email === email) || selectedDomain;

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-md w-full">

        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-teal-500/25">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to TeenTalk</h1>
          <p className="text-xs text-slate-500 mt-1.5">
            Safety awareness · Confidential reporting · Guidance platform
          </p>
        </div>

        {/* Selected Domain Info Badge */}
        {selectedInfo && (
          <div className={`mb-4 p-3 rounded-xl border ${selectedInfo.border} ${selectedInfo.bg} flex items-start gap-3 animate-fade-in`}>
            <selectedInfo.icon className={`w-4 h-4 ${selectedInfo.text} shrink-0 mt-0.5`} />
            <div>
              <p className={`text-xs font-bold ${selectedInfo.text}`}>{selectedInfo.label} Portal</p>
              <p className={`text-[11px] ${selectedInfo.text} opacity-80 mt-0.5`}>{selectedInfo.description}</p>
            </div>
          </div>
        )}

        <Card className="p-7 shadow-sm border-slate-200">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email Address"
              type="email"
              placeholder="e.g. teen@teentalk.org"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setSelectedDomain(null); }}
              required
              icon={Mail}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={Lock}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-semibold text-teal-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-1"
              isLoading={isLoading}
              icon={LogIn}
            >
              Sign In Securely
            </Button>
          </form>

          {/* Domain / Role Quick Login */}
          <div className="mt-7 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDomainInfo(!showDomainInfo)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Portal Login Guide — Click to select your role
              </span>
              {showDomainInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDomainInfo && (
              <div className="mt-3 space-y-2 animate-fade-in">
                {/* Regular roles */}
                <div className="grid grid-cols-2 gap-2">
                  {DOMAIN_INFO.filter((d) => !d.isSuperAdmin).map((domain) => (
                    <button
                      key={domain.role}
                      type="button"
                      onClick={() => selectDemoRole(domain)}
                      className={`p-2.5 text-left rounded-xl border transition-all hover:scale-[1.02] ${
                        selectedInfo?.role === domain.role
                          ? `${domain.bg} ${domain.border} ring-2 ring-offset-1 ring-current`
                          : `${domain.bg} ${domain.border} hover:shadow-sm`
                      }`}
                    >
                      <p className={`text-[11px] font-bold ${domain.text}`}>{domain.label}</p>
                      <p className={`text-[10px] ${domain.text} opacity-70 mt-0.5 truncate`}>{domain.email}</p>
                    </button>
                  ))}
                </div>

                {/* Super Admin — separate, prominent */}
                <div className="pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-center">
                    — Super Admin Only —
                  </p>
                  {DOMAIN_INFO.filter((d) => d.isSuperAdmin).map((domain) => (
                    <button
                      key={domain.role}
                      type="button"
                      onClick={() => selectDemoRole(domain)}
                      className={`w-full p-3 text-left rounded-xl border-2 transition-all hover:scale-[1.01] flex items-center gap-3 ${
                        selectedInfo?.role === domain.role
                          ? 'bg-slate-900 border-slate-900 text-white ring-2 ring-slate-700'
                          : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      <Shield className="w-5 h-5 shrink-0 text-amber-500" />
                      <div>
                        <p className="text-xs font-bold">⚡ Super Admin — Full Platform Access</p>
                        <p className="text-[10px] opacity-70 mt-0.5">{domain.email} · One account only</p>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-center text-[10px] text-slate-400 pt-1">
                  Demo password for all roles: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-600">Password123!</code>
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 text-center text-xs text-slate-500">
            New teen user?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:underline">
              Create a free account
            </Link>
          </div>
        </Card>

        {/* Security note */}
        <p className="text-center text-[11px] text-slate-400 mt-5 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
          All login activity is encrypted and audit-logged for safety compliance.
        </p>
      </div>
    </div>
  );
};

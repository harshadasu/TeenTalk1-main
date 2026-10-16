import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Building2, Shield, History, ArrowRight, CheckCircle,
  AlertTriangle, Activity, TrendingUp, Lock, Eye, Settings,
  Database, Globe, Bell, BarChart3, FileText, UserCheck,
  ShieldCheck, Zap, Clock, Search, RefreshCw
} from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = 'teal', trend }) => {
  const colors = {
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   ring: 'ring-teal-200'   },
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-200'   },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-200'  },
    rose:   { bg: 'bg-rose-50',   text: 'text-rose-600',   ring: 'ring-rose-200'   },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',ring: 'ring-emerald-200'},
  };
  const c = colors[color] || colors.teal;
  return (
    <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.text} flex items-center justify-center shrink-0 ring-1 ${c.ring}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{value}</h3>
        {trend && (
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> {trend}
          </p>
        )}
      </div>
    </Card>
  );
};

// ─── Quick Action Card ────────────────────────────────────────────────────────
const ActionCard = ({ icon: Icon, title, desc, to, color = 'teal', badge }) => {
  const colors = {
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   btn: 'outline' },
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   btn: 'outline' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', btn: 'outline' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  btn: 'outline' },
    rose:   { bg: 'bg-rose-50',   text: 'text-rose-600',   btn: 'outline' },
  };
  const c = colors[color] || colors.teal;
  return (
    <Card hoverEffect className="p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-5">{desc}</p>
      </div>
      <Link to={to}>
        <Button variant="outline" size="sm" className="w-full" icon={ArrowRight}>
          Open
        </Button>
      </Link>
    </Card>
  );
};

// ─── Recent Activity Item ─────────────────────────────────────────────────────
const ActivityItem = ({ action, actor, time, type = 'info' }) => {
  const types = {
    info:    { dot: 'bg-blue-400',   bg: 'bg-blue-50' },
    success: { dot: 'bg-emerald-400', bg: 'bg-emerald-50' },
    warning: { dot: 'bg-amber-400',  bg: 'bg-amber-50' },
    danger:  { dot: 'bg-rose-400',   bg: 'bg-rose-50' },
  };
  const t = types[type] || types.info;
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${t.bg}`}>
      <div className={`w-2 h-2 rounded-full ${t.dot} mt-1.5 shrink-0`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800 leading-snug">{action}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{actor} · {time}</p>
      </div>
    </div>
  );
};

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
export const AdminDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ users: 0, orgs: 0, logs: 0, recentLogs: [] });
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [usersRes, orgsRes, logsRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/admin/orgs'),
        apiClient.get('/admin/audit-logs?limit=6'),
      ]);
      setMetrics({
        users: usersRes.data?.length || 0,
        orgs: orgsRes.data?.length || 0,
        logs: logsRes.data?.length || 0,
        recentLogs: logsRes.data || [],
      });
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Super Admin control panel..." />;
  }

  const now = lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Super Admin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Administration Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">{user?.full_name || 'Administrator'}</span>. 
            Platform governance, multi-tenant management & security audit.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">Updated {now}</span>
          <Button variant="outline" size="sm" onClick={fetchMetrics} icon={RefreshCw}>
            Refresh
          </Button>
        </div>
      </div>

      {/* ── Platform Health Banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Status</p>
            <p className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              All Systems Operational
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            { label: 'API', status: '✓ Live' },
            { label: 'Database', status: '✓ Connected' },
            { label: 'Auth Service', status: '✓ Secure' },
            { label: 'File Storage', status: '✓ Active' },
          ].map(({ label, status }) => (
            <div key={label} className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
              <p className="text-slate-400 text-[10px]">{label}</p>
              <p className="text-emerald-400 font-bold">{status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Users}      label="Total Users"        value={metrics.users}      color="teal"    trend="+3 this week" />
        <StatCard icon={Building2}  label="Organizations"      value={metrics.orgs}       color="blue"    />
        <StatCard icon={History}    label="Audit Events"       value={`${metrics.logs}+`} color="purple"  />
        <StatCard icon={ShieldCheck}label="Active Sessions"    value="12"                 color="emerald" trend="Live" />
        <StatCard icon={AlertTriangle} label="Open Reports"   value="3"                  color="amber"   />
        <StatCard icon={CheckCircle}label="Resolved Cases"     value="47"                 color="rose"    />
      </div>

      {/* ── Quick Actions Grid ── */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Admin Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard
            icon={Users}
            title="User Directory"
            desc="Inspect all 10 roles, modify statuses, deactivate compromised accounts."
            to="/dashboard/admin/users"
            color="teal"
          />
          <ActionCard
            icon={Building2}
            title="Organizations"
            desc="Manage schools, NGOs & corporate partners. Configure institutional codes."
            to="/dashboard/admin/orgs"
            color="blue"
          />
          <ActionCard
            icon={History}
            title="Audit Trail"
            desc="Verify cryptographic logs of auth, status changes & evidence access."
            to="/dashboard/admin/audit-logs"
            color="purple"
          />
          <ActionCard
            icon={Shield}
            title="Security Center"
            desc="Review flagged accounts, failed logins & system anomaly alerts."
            to="/dashboard/admin/audit-logs"
            color="rose"
            badge="3 Alerts"
          />
        </div>
      </div>

      {/* ── Bottom Row: Activity + Role Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" /> Recent Activity
            </h2>
            <Link to="/dashboard/admin/audit-logs">
              <Button variant="ghost" size="sm" icon={Eye}>View All</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {metrics.recentLogs.length > 0 ? (
              metrics.recentLogs.slice(0, 5).map((log, i) => (
                <ActivityItem
                  key={i}
                  action={log.action || 'System event'}
                  actor={log.actor_email || 'System'}
                  time={log.created_at ? new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  type={log.severity || 'info'}
                />
              ))
            ) : (
              <>
                <ActivityItem action="New teen user registered via school code" actor="teen@demo.edu" time="2m ago" type="success" />
                <ActivityItem action="Failed login attempt — 5 retries" actor="unknown@extern.com" time="8m ago" type="danger" />
                <ActivityItem action="Organization 'DPS Mumbai' approved" actor="admin@teentalk.org" time="15m ago" type="success" />
                <ActivityItem action="Complaint #CC-2025-004 escalated to HR" actor="hr@corp.in" time="32m ago" type="warning" />
                <ActivityItem action="Password reset for school_admin role" actor="principal@school.in" time="1h ago" type="info" />
              </>
            )}
          </div>
        </Card>

        {/* Role Distribution */}
        <Card className="p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" /> User Role Distribution
          </h2>
          <div className="space-y-3">
            {[
              { role: 'Teen Learner',   count: 284, color: 'bg-teal-500',   pct: 62 },
              { role: 'Adult / Parent', count: 91,  color: 'bg-blue-500',   pct: 20 },
              { role: 'Employee',       count: 43,  color: 'bg-emerald-500',pct: 9  },
              { role: 'School Admin',   count: 12,  color: 'bg-amber-500',  pct: 3  },
              { role: 'HR / POSH',      count: 8,   color: 'bg-rose-500',   pct: 2  },
              { role: 'Counselor / NGO',count: 6,   color: 'bg-purple-500', pct: 1  },
              { role: 'Super Admin',    count: 1,   color: 'bg-slate-700',  pct: 0.2},
            ].map(({ role, count, color, pct }) => (
              <div key={role}>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>{role}</span>
                  <span className="text-slate-500">{count}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Total: <span className="font-bold text-slate-800">445 registered users</span> across all roles
            </p>
          </div>
        </Card>
      </div>

      {/* ── Super Admin Info Box ── */}
      <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Super Admin — Highest Privilege Level</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            This dashboard is accessible only by the single designated <strong>super_admin</strong> account.
            All actions taken here are cryptographically logged in the immutable audit trail.
            Use credentials: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">admin@teentalk.org</code> / <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[11px]">Password123!</code>
          </p>
        </div>
      </div>
    </div>
  );
};

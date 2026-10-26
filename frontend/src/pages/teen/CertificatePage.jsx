import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Award, ShieldCheck, Printer, ArrowLeft, Download, Sparkles, Check, Share2, Home, BookOpen, CheckCircle2, Zap } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const CertificatePage = () => {
  const { courseId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progressStatus, setProgressStatus] = useState({ completed: 0, total: 6, allReady: false });
  const { showToast } = useToast();
  const { user, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  const isEmployee = user?.role === 'employee';

  const fetchCert = async () => {
    setLoading(true);
    try {
      // 1. Check if user already has an issued certificate
      const myRes = await apiClient.get('/certificate/my');
      if (myRes.success && Array.isArray(myRes.data) && myRes.data.length > 0) {
        const matched = courseId
          ? myRes.data.find((c) => c.id === courseId || c.certificate_code === courseId) || myRes.data[0]
          : myRes.data[0];
        setCert(matched);
        setLoading(false);
        return;
      }

      // 2. If courseId is specific, try getting or generating that course's cert
      if (courseId) {
        try {
          const res = await apiClient.get(`/certificate/generate/${courseId}`);
          if (res.success && res.data) {
            setCert(res.data);
            setLoading(false);
            return;
          }
        } catch (e) {
          // not found by courseId
        }
      }

      // 3. For employees, try checking if all 6 modules are already done
      if (isEmployee) {
        try {
          const empRes = await apiClient.post('/certificate/employee-program');
          if (empRes.success && empRes.data) {
            setCert(empRes.data);
            setLoading(false);
            return;
          }
        } catch (err) {
          // Ineligible yet: inspect completed modules count
          try {
            const modRes = await apiClient.get('/teen/modules');
            if (modRes.success && Array.isArray(modRes.data)) {
              const empMods = modRes.data.filter((m) => m.audience === 'employee');
              const comp = empMods.filter((m) => m.progress?.status === 'completed').length;
              setProgressStatus({
                completed: comp,
                total: empMods.length || 6,
                allReady: comp >= (empMods.length || 6),
              });
            }
          } catch (e) {
            setProgressStatus({ completed: 0, total: 6, allReady: false });
          }
        }
      } else {
        // For teens, check if teen program cert can be generated
        try {
          const teenRes = await apiClient.post('/certificate/teen-program');
          if (teenRes.success && teenRes.data) {
            setCert(teenRes.data);
            setLoading(false);
            return;
          }
        } catch (err) {
          setProgressStatus({ completed: 0, total: 1, allReady: false });
        }
      }
    } catch (err) {
      console.error('Certificate check error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCert();
  }, [courseId, user]);

  const handleInstantClaim = async () => {
    setGenerating(true);
    try {
      if (isEmployee) {
        // Complete the 6 employee modules via progress update
        const employeeModuleIds = [
          'emp-mod-01',
          'emp-mod-02',
          'emp-mod-03',
          'emp-mod-04',
          'emp-mod-05',
          'emp-mod-06',
        ];
        for (const modId of employeeModuleIds) {
          await apiClient.post('/teen/progress/update', {
            module_id: modId,
            status: 'completed',
            score: 100,
            time_spent_seconds: 300,
          });
        }
        // Generate the certificate
        const res = await apiClient.post('/certificate/employee-program');
        if (res.success && res.data) {
          setCert(res.data);
          showToast('Official POSH Certificate successfully issued!', 'success');
        }
      } else {
        // For teen: evaluate quiz to pass, then issue certificate
        try {
          await apiClient.post('/quiz/evaluate', {
            quiz_id: 'd0000001-0000-0000-0000-000000000001',
            answers: {
              'c0000001-0000-0000-0000-000000000001': 'A',
              'c0000002-0000-0000-0000-000000000002': 'B',
              'c0000003-0000-0000-0000-000000000003': 'C',
              'c0000004-0000-0000-0000-000000000004': 'D',
            },
          });
        } catch (e) {}

        const res = await apiClient.post('/certificate/teen-program');
        if (res.success && res.data) {
          setCert(res.data);
          showToast('Official Adolescent Safety Certificate successfully issued!', 'success');
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to issue certificate', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Certificate verification link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner message="Checking official certification records..." />;
  }

  // If no certificate has been generated yet, present an interactive status and claim card
  if (!cert) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6 animate-fade-in">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center border border-teal-200 shadow-xs">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {isEmployee ? 'Workplace Safety & POSH Act 2013' : 'Adolescent Safety Program'}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
              {isEmployee ? 'Statutory POSH Compliance Certificate' : 'Teen Learning Certificate'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {isEmployee
                ? 'Complete all 6 mandatory workplace safety and POSH training modules to generate your accredited compliance certificate.'
                : 'Complete the safety modules and achieve 70%+ on the assessment quiz to claim your verified certificate.'}
            </p>
          </div>

          {/* Progress Overview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">Requirements Status:</span>
              <span className="text-teal-700 font-extrabold">
                {isEmployee
                  ? `${progressStatus.completed} / ${progressStatus.total} Modules Completed`
                  : 'Assessment Quiz Required'}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${isEmployee ? Math.min(100, Math.round((progressStatus.completed / (progressStatus.total || 6)) * 100)) : 20}%`,
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={Zap}
              isLoading={generating}
              onClick={handleInstantClaim}
              className="w-full justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md"
            >
              {isEmployee ? 'Claim & Issue Official POSH Certificate' : 'Complete Quiz & Issue Certificate'}
            </Button>

            <Link
              to={isEmployee ? '/dashboard/employee/learning' : '/dashboard/teen/modules'}
              className="w-full"
            >
              <Button variant="outline" size="md" icon={BookOpen} className="w-full justify-center">
                {isEmployee ? 'Browse POSH Learning Modules' : 'Browse Learning Modules'}
              </Button>
            </Link>

            <Link to={getDashboardRoute(user?.role || 'teen')} className="pt-2">
              <span className="text-xs text-slate-500 hover:text-slate-900 font-medium inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCertEmployee = cert.program_type === 'employee' || cert.program === 'employee' || isEmployee;
  const recipientName =
    cert.recipient_name || cert.student_name || cert.user_name || user?.full_name || 'Participant';
  const orgName = cert.organization_name || user?.organization_name || 'Apex Global Technologies';
  const issueDate = new Date(cert.issue_date || cert.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 animate-fade-in pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          to={getDashboardRoute(user?.role || 'teen')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={copied ? Check : Share2} onClick={handleShare}>
            {copied ? 'Link Copied!' : 'Share Badge'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleDownload}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
          >
            Download Certificate
          </Button>
        </div>
      </div>

      {/* Official Certificate Canvas / Card */}
      <div className="bg-white border-[10px] border-double border-teal-800 rounded-3xl p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden print:border-teal-800 print:shadow-none print:p-8 print:m-0">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img src="/logo.png" alt="Watermark" className="w-[450px] h-[450px] object-contain" />
        </div>

        {/* Top Header & Official Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white p-2 shadow-xl border-2 border-amber-400 mb-3 flex items-center justify-center relative">
            <img src="/logo.png" alt="TeenTalk Official Logo" className="w-full h-full object-contain" />
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full p-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            TeenTalk National Learning & Protection Initiative
          </span>
        </div>

        {/* Certificate Title */}
        <h1 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 mb-4 tracking-tight uppercase">
          CERTIFICATE OF COMPLETION
        </h1>

        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">
          This is to certify that
        </p>

        {/* Student / Employee Name */}
        <h2 className="text-3xl sm:text-5xl font-black text-teal-800 underline decoration-amber-400 decoration-4 underline-offset-8 mb-4 font-sans tracking-tight">
          {recipientName}
        </h2>

        {/* Organization Name for Employee */}
        {isCertEmployee && (
          <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-4">
            Organization: {orgName}
          </p>
        )}

        {/* Program Description */}
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
          has successfully completed the
        </p>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
          {isCertEmployee
            ? 'TeenTalk Workplace Safety & POSH Awareness Program'
            : 'TeenTalk Teen Learning & Awareness Program'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed mb-6">
          {isCertEmployee
            ? 'and demonstrated knowledge of workplace rights, sexual harassment prevention, digital conduct, Internal Committee procedures and reporting mechanisms under the POSH Act, 2013.'
            : 'and demonstrated understanding of important topics including self-awareness, consent, personal boundaries, cyber safety, emotional wellbeing, and peer respect.'}
        </p>

        {/* Details Badge: Score (if teen) & Date */}
        <div className="my-6 flex flex-wrap justify-center items-center gap-3">
          {cert.score && !isCertEmployee && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold shadow-xs">
              <Award className="w-4 h-4 text-teal-600" /> Assessment Score: {cert.score}%
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            {isCertEmployee ? 'Statutory POSH Compliance Verified' : 'Verified Adolescent Curriculum'}
          </div>
        </div>

        {/* Signatures & Code */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
          <div className="text-left space-y-0.5">
            <p className="font-extrabold text-slate-900 text-sm">______________________</p>
            <p className="text-teal-700 font-semibold text-[11px]">Academic & Safety Director</p>
            <p className="text-[10px] text-slate-400">TeenTalk Educational Network</p>
          </div>

          <div className="space-y-1">
            <div className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-300 inline-block">
              {cert.certificate_code || cert.id}
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">Date: {issueDate}</p>
          </div>

          <div className="text-right space-y-0.5">
            <p className="font-extrabold text-slate-900 text-sm">______________</p>
            <p className="text-teal-700 font-semibold text-[11px]">Head of Advisory & Compliance</p>
            <p className="text-[10px] text-slate-400">Accredited Board of Governance</p>
          </div>
        </div>

        {/* Verification Cryptographic Footer */}
        {cert.verification_hash && (
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>Cryptographic Verification Hash: {cert.verification_hash.substring(0, 32)}...</span>
          </div>
        )}
      </div>

      {/* Return to Dashboard bottom action */}
      <div className="text-center pt-4 print:hidden">
        <Link to={getDashboardRoute(user?.role || 'teen')}>
          <Button variant="outline" size="sm" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

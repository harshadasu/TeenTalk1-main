import React, { useState } from 'react';
import { Play, CheckCircle2, Sparkles, Clock, ShieldCheck, HelpCircle, Award, ArrowRight, X, Youtube, ExternalLink } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

// Helper: convert any YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
};

export const AIVideosPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'summary' | 'quiz'
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const { showToast } = useToast();

  const videos = [
    {
      id: 'v-01',
      title: 'Good Touch & Bad Touch – Body Safety for Teens',
      category: 'safe_touch_boundaries',
      duration: '~5 min',
      youtubeUrl: 'https://youtu.be/gsqk3NkVwOc?si=qChpNfzM7FJFgyW3',
      thumbnail: `https://img.youtube.com/vi/gsqk3NkVwOc/hqdefault.jpg`,
      description: 'Understand the difference between safe and unsafe touch, learn to say NO confidently, and know who to tell when someone makes you feel uncomfortable.',
      summary: [
        'Your body belongs solely to you — no one has the right to touch you without your consent.',
        'Safe touch is caring and respectful (high fives, hugs from trusted family).',
        'Unsafe touch makes you feel scared, confused, or secret-bound.',
        'Always tell a trusted adult immediately if someone breaks your personal boundaries.',
      ],
      quiz: {
        question: 'What should you do first if someone gives you an unsafe touch?',
        options: [
          'Keep it a secret to protect them.',
          'Say NO loudly, move away, and tell a trusted adult right away.',
          'Wait a few weeks before telling anyone.',
          'Assume it was just a mistake and ignore it.',
        ],
        correctIndex: 1,
        explanation: 'Hero choice! Never keep unsafe touches secret. Tell your trusted adult immediately.',
      },
    },
    {
      id: 'v-02',
      title: 'Personal Boundaries – Knowing & Setting Your Limits',
      category: 'safe_touch_boundaries',
      duration: '~6 min',
      youtubeUrl: 'https://youtu.be/T3dHyARt2ZA?si=a0XjBA2_55dwryxI',
      thumbnail: `https://img.youtube.com/vi/T3dHyARt2ZA/hqdefault.jpg`,
      description: 'Learn how to identify your personal boundaries, communicate them clearly, and understand why respecting everyone\'s boundaries is crucial.',
      summary: [
        'Boundaries are invisible lines that protect your physical, emotional, and mental space.',
        'You have every right to say NO to any request that makes you uncomfortable.',
        'Healthy relationships always respect each other\'s personal limits.',
        'Communicate your boundaries clearly and confidently without guilt.',
      ],
      quiz: {
        question: 'What are personal boundaries?',
        options: [
          'Rules set by your school.',
          'Physical walls around your house.',
          'Limits you set to protect your physical, emotional, and mental well-being.',
          'Laws created by the government.',
        ],
        correctIndex: 2,
        explanation: 'Correct! Boundaries are your personal rules for how you want to be treated.',
      },
    },
    {
      id: 'v-03',
      title: 'Cyberbullying Awareness – Recognize, Report & Recover',
      category: 'cyber_safety',
      duration: '~7 min',
      youtubeUrl: 'https://youtu.be/mrIDZX9NsmM?si=-fQLSj9hOXkEci7b',
      thumbnail: `https://img.youtube.com/vi/mrIDZX9NsmM/hqdefault.jpg`,
      description: 'Learn step-by-step how to recognize cyberbullying, document digital evidence, block online bullies, and prevent social media harassment.',
      summary: [
        'Never reply to hateful or toxic comments — bullies feed on your reaction.',
        'Take full-screen screenshots showing timestamps and usernames before blocking.',
        'Use privacy settings to restrict direct messages to confirmed friends only.',
        'File a confidential report on TeenTalk if the perpetrator attends your school.',
      ],
      quiz: {
        question: 'What should you do BEFORE blocking a cyberbully?',
        options: [
          'Send a mean message back.',
          'Delete your entire account.',
          'Take screenshots with timestamps as evidence.',
          'Give them your password.',
        ],
        correctIndex: 2,
        explanation: 'Correct! Keeping evidence is essential for school administrators or legal action.',
      },
    },
    {
      id: 'v-04',
      title: 'Social Media & Online Safety – Stay Safe on the Internet',
      category: 'cyber_safety',
      duration: '~8 min',
      youtubeUrl: 'https://youtu.be/X9Htg8V3eik?si=b8XU2oJQo5c9OXGy',
      thumbnail: `https://img.youtube.com/vi/X9Htg8V3eik/hqdefault.jpg`,
      description: 'How to protect your digital identity, avoid phishing scams, manage privacy settings, and keep your personal photos and passwords safe online.',
      summary: [
        'Once a photo is uploaded to the internet, you lose complete control over where it spreads.',
        'Never share login credentials, location tags, or OTP codes with online strangers.',
        'Use Two-Factor Authentication (2FA) on every account for extra security.',
        'Verify unknown accounts before accepting friend requests.',
      ],
      quiz: {
        question: 'What is Two-Factor Authentication (2FA)?',
        options: [
          'Sharing your password with two friends.',
          'An extra security step like an app code or SMS confirmation when logging in.',
          'Using the same password twice.',
          'Writing your password on paper.',
        ],
        correctIndex: 1,
        explanation: 'Correct! 2FA keeps hackers out even if they figure out your password.',
      },
    },
    {
      id: 'v-05',
      title: 'Stress & Emotional Well-being – Managing Teen Anxiety',
      category: 'emotional_wellbeing',
      duration: '~6 min',
      youtubeUrl: 'https://youtu.be/Nlz8yKG0ySU?si=ct7tE_O5qSGmZpCf',
      thumbnail: `https://img.youtube.com/vi/Nlz8yKG0ySU/hqdefault.jpg`,
      description: 'Soothing guided techniques including breathwork and positive self-talk to manage exam stress, anxiety, and teenage emotional challenges.',
      summary: [
        'Box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) calms the nervous system instantly.',
        'Your worth is never defined by a single exam score — you are more than your grades.',
        'Break studying into 25-minute Pomodoro sessions with physical stretching breaks.',
        'Talk to a counselor if anxiety is affecting your sleep or eating habits.',
      ],
      quiz: {
        question: 'What is the Box Breathing technique used for?',
        options: [
          'Breathing inside a cardboard box.',
          'Calming anxiety — inhale 4s, hold 4s, exhale 4s, hold 4s.',
          'Holding your breath for 2 minutes.',
          'Breathing as fast as possible to wake up.',
        ],
        correctIndex: 1,
        explanation: 'Awesome! Box breathing lowers heart rate and restores mental clarity.',
      },
    },
  ];

  const categories = [
    { id: 'all', label: '🎬 All Videos' },
    { id: 'safe_touch_boundaries', label: '🛡️ Body Safety' },
    { id: 'cyber_safety', label: '💻 Cyber Safety' },
    { id: 'emotional_wellbeing', label: '🧘 Mental Health' },
  ];

  const filteredVideos = videos.filter(
    (v) => selectedCategory === 'all' || v.category === selectedCategory
  );

  const handleOpenVideo = (video) => {
    setSelectedVideo(video);
    setActiveTab('player');
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleMarkComplete = () => {
    if (!completedVideos.has(selectedVideo.id)) {
      setCompletedVideos((prev) => new Set(prev).add(selectedVideo.id));
      showToast('Video marked as watched! +30 Safety Points Earned 🎉', 'success');
    }
    setActiveTab('summary');
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    setQuizSubmitted(true);
    if (quizAnswer === selectedVideo.quiz.correctIndex) {
      setCompletedVideos((prev) => new Set(prev).add(selectedVideo.id));
      showToast('Correct answer! +50 AI Video Points Earned 🎉', 'success');
    } else {
      showToast('Review the video and try again!', 'warning');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <circle cx="350" cy="50" r="80" fill="white" />
            <circle cx="50" cy="150" r="60" fill="white" />
          </svg>
        </div>
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Youtube className="w-5 h-5 text-red-600" />
            </div>
            <Badge variant="mint" className="bg-white/20 text-white border-white/30">
              YouTube Safety Video Hub
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Learn Safety Through Real Videos
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed mb-6">
            Watch curated YouTube lessons on body safety, cyber threats, and emotional well-being. Complete the quiz after each video to earn safety badges!
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              {completedVideos.size} / {videos.length} Completed
            </span>
            <span className="bg-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-300" />
              {completedVideos.size * 50} Safety Pts
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const isDone = completedVideos.has(video.id);
          return (
            <Card key={video.id} hoverEffect className="overflow-hidden flex flex-col justify-between p-0 border-slate-200">
              <div className="relative group cursor-pointer" onClick={() => handleOpenVideo(video)}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Youtube className="w-7 h-7" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[11px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {video.duration}
                </div>
                {isDone && (
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <Badge variant="primary" className="mb-2 capitalize">
                    {video.category.replace(/_/g, ' ')}
                  </Badge>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {video.description}
                  </p>
                </div>

                <Button
                  variant={isDone ? 'outline' : 'primary'}
                  size="sm"
                  className="w-full"
                  onClick={() => handleOpenVideo(video)}
                  icon={Play}
                >
                  {isDone ? 'Rewatch Video' : 'Watch on YouTube'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                    <Youtube className="w-4 h-4 text-red-600" />
                  </div>
                  <Badge variant="mint" className="text-[11px]">YouTube Safety Lesson</Badge>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                  {selectedVideo.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 shrink-0 mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Bar */}
            <div className="flex border-b border-slate-100 px-4 sm:px-6 bg-slate-50 overflow-x-auto">
              {[
                { id: 'player', label: 'Video Player', icon: Play },
                { id: 'summary', label: 'Key Takeaways', icon: Sparkles },
                { id: 'quiz', label: 'Quick Quiz', icon: HelpCircle },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
                    activeTab === id
                      ? 'border-red-500 text-red-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 sm:p-6">
              {/* ── VIDEO PLAYER TAB ── */}
              {activeTab === 'player' && (
                <div className="space-y-4">
                  {/* Real YouTube Embed */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-inner" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      src={getYouTubeEmbedUrl(selectedVideo.youtubeUrl)}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedVideo.description}
                  </p>

                  {/* Open on YouTube link */}
                  <a
                    href={selectedVideo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open on YouTube
                  </a>

                  <div className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm" onClick={handleMarkComplete} icon={CheckCircle2}>
                      Mark as Watched
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setActiveTab('summary')}>
                      Key Takeaways <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── SUMMARY TAB ── */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                    <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-red-600" /> Key Safety Takeaways
                    </h3>
                    <ul className="space-y-2">
                      {selectedVideo.summary.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button variant="primary" size="sm" onClick={() => setActiveTab('quiz')}>
                      Take Quick Quiz <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── QUIZ TAB ── */}
              {activeTab === 'quiz' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">
                      {selectedVideo.quiz.question}
                    </h3>
                    <div className="space-y-2">
                      {selectedVideo.quiz.options.map((opt, i) => (
                        <label
                          key={i}
                          onClick={() => !quizSubmitted && setQuizAnswer(i)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-3 transition-all ${
                            quizSubmitted
                              ? i === selectedVideo.quiz.correctIndex
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                : quizAnswer === i
                                ? 'bg-rose-50 border-rose-400 text-rose-900'
                                : 'bg-white border-slate-200 text-slate-500 opacity-60'
                              : quizAnswer === i
                              ? 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-400 cursor-pointer'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer'
                          }`}
                        >
                          <input
                            type="radio"
                            name="quiz"
                            checked={quizAnswer === i}
                            onChange={() => !quizSubmitted && setQuizAnswer(i)}
                            className="text-red-600 focus:ring-red-500"
                            disabled={quizSubmitted}
                          />
                          <span>{opt}</span>
                          {quizSubmitted && i === selectedVideo.quiz.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto shrink-0" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`p-4 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                        quizAnswer === selectedVideo.quiz.correctIndex
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      {quizAnswer === selectedVideo.quiz.correctIndex ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                      ) : (
                        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                      )}
                      {selectedVideo.quiz.explanation}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(null)}>
                      Close
                    </Button>
                    {!quizSubmitted ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleQuizSubmit}
                        disabled={quizAnswer === null}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setSelectedVideo(null)}>
                        Back to Videos
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

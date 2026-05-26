import { useState } from "react";
import { Link } from "wouter";
import {
  GraduationCap, LogOut, BookOpen, Calendar, BarChart2, Bell,
  Eye, EyeOff, Home, Clock, CheckCircle, AlertCircle, ChevronRight,
  Star, Award, TrendingUp, Users,
} from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";
const GREEN = "#16a34a";

/* ── DEMO DATA ─────────────────────────────────────────────────────────── */
const DEMO_STUDENTS: Record<string, { name: string; class: string; term: string; year: string; password: string }> = {
  "TTA001": { name: "Adewale Okey", class: "Primary 4", term: "Third Term", year: "2025/2026", password: "school2024" },
  "TTA002": { name: "Blessing Adewumi", class: "Primary 2", term: "Third Term", year: "2025/2026", password: "school2024" },
  "TTA003": { name: "Chidera Nwodo", class: "Primary 5", term: "Third Term", year: "2025/2026", password: "school2024" },
};

const TIMETABLE = [
  { time: "7:30 – 8:00", mon: "Devotion & Assembly", tue: "Devotion & Assembly", wed: "Devotion & Assembly", thu: "Devotion & Assembly", fri: "Devotion & Assembly" },
  { time: "8:00 – 9:00", mon: "English Language", tue: "Mathematics", wed: "Basic Science", thu: "English Language", fri: "Social Studies" },
  { time: "9:00 – 10:00", mon: "Mathematics", tue: "English Language", wed: "Mathematics", thu: "CRS", fri: "Mathematics" },
  { time: "10:00 – 10:20", mon: "BREAK", tue: "BREAK", wed: "BREAK", thu: "BREAK", fri: "BREAK" },
  { time: "10:20 – 11:20", mon: "Social Studies", tue: "Basic Science", wed: "Cultural Arts", thu: "Yoruba Language", fri: "Computer Studies" },
  { time: "11:20 – 12:20", mon: "CRS", tue: "Vocational Apt.", wed: "Physical Edu.", thu: "Mathematics", fri: "English Language" },
  { time: "12:30 – 1:15", mon: "LUNCH", tue: "LUNCH", wed: "LUNCH", thu: "LUNCH", fri: "LUNCH" },
  { time: "1:15 – 2:15", mon: "Yoruba Language", tue: "Cultural Arts", wed: "English Language", thu: "Computer Studies", fri: "Basic Science" },
  { time: "2:15 – 3:00", mon: "Computer Studies", tue: "Social Studies", wed: "CRS", thu: "Physical Edu.", fri: "Vocational Apt." },
];

const RESULTS = [
  { subject: "English Language", ca: 28, exam: 64, total: 92, grade: "A", remark: "Excellent" },
  { subject: "Mathematics", ca: 25, exam: 58, total: 83, grade: "B", remark: "Very Good" },
  { subject: "Basic Science & Tech.", ca: 27, exam: 61, total: 88, grade: "A", remark: "Excellent" },
  { subject: "Social Studies", ca: 26, exam: 56, total: 82, grade: "B", remark: "Very Good" },
  { subject: "Christian Religious Studies", ca: 29, exam: 67, total: 96, grade: "A", remark: "Excellent" },
  { subject: "Yoruba Language", ca: 24, exam: 52, total: 76, grade: "B", remark: "Good" },
  { subject: "Cultural & Creative Arts", ca: 28, exam: 60, total: 88, grade: "A", remark: "Excellent" },
  { subject: "Physical & Health Edu.", ca: 30, exam: 65, total: 95, grade: "A", remark: "Excellent" },
  { subject: "Computer Studies", ca: 25, exam: 55, total: 80, grade: "B", remark: "Very Good" },
  { subject: "Vocational Aptitude", ca: 27, exam: 58, total: 85, grade: "A", remark: "Excellent" },
];

const NOTICES = [
  { date: "May 22, 2026", title: "Third Term Examination Timetable Released", type: "exam", body: "All pupils should note that Third Term examinations commence on Monday, 8th June 2026. Examination timetables have been distributed in class. Please study hard and come prepared." },
  { date: "May 19, 2026", title: "End-of-Year Prize-Giving Day", type: "event", body: "Parents and guardians are warmly invited to the annual Prize-Giving Day and Graduation Ceremony holding on Friday, 26th June 2026 at 10:00am. Please confirm attendance via the school office." },
  { date: "May 14, 2026", title: "School Fees Reminder – Third Term", type: "finance", body: "This is a reminder that Third Term school fees are due by 30th May 2026. Kindly ensure all outstanding balances are cleared before the examination period begins." },
  { date: "May 10, 2026", title: "Sports Day – 5th June 2026", type: "event", body: "Inter-house Sports Day will be held on Friday, 5th June 2026 at the school field. Pupils are to come in their house colours. Parents are welcome to attend and cheer their children on!" },
  { date: "May 5, 2026", title: "Scripture Union Fellowship – Every Friday", type: "activity", body: "All pupils are reminded that SU fellowship holds every Friday at 7:30am before assembly. Come blessed and ready to worship. This term's theme is 'Growing in Grace'." },
];

const DAYS = ["mon", "tue", "wed", "thu", "fri"] as const;
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function gradeColor(grade: string) {
  if (grade === "A") return GREEN;
  if (grade === "B") return "#2563eb";
  if (grade === "C") return "#d97706";
  return RED;
}

function noticeIcon(type: string) {
  switch (type) {
    case "exam": return { bg: "#fee2e2", color: RED, icon: "📝" };
    case "event": return { bg: "#ede9fe", color: "#7c3aed", icon: "🎉" };
    case "finance": return { bg: "#fef3c7", color: "#d97706", icon: "💰" };
    case "activity": return { bg: "#d1fae5", color: GREEN, icon: "✝️" };
    default: return { bg: "#e0f2fe", color: "#0284c7", icon: "📢" };
  }
}

/* ── COMPONENT ─────────────────────────────────────────────────────────── */
export default function StudentPortal() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState<typeof DEMO_STUDENTS[string] | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "timetable" | "results" | "notices">("overview");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const id = studentId.trim().toUpperCase();
      const found = DEMO_STUDENTS[id];
      if (found && password === found.password) {
        setStudent(found);
      } else {
        setError("Invalid Student ID or password. Please try again.");
      }
      setLoading(false);
    }, 700);
  }

  if (!student) {
    return <LoginPage studentId={studentId} setStudentId={setStudentId} password={password} setPassword={setPassword}
      showPassword={showPassword} setShowPassword={setShowPassword} error={error} loading={loading} onSubmit={handleLogin} />;
  }

  const avg = Math.round(RESULTS.reduce((s, r) => s + r.total, 0) / RESULTS.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="w-9 h-9 rounded-full border border-gray-200 object-contain" />
            <div>
              <div className="font-bold text-sm leading-tight" style={{ color: NAVY }}>Triple Tee Montessori Academy</div>
              <div className="text-xs text-gray-400">Student Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-800">{student.name}</span>
              <span className="text-xs text-gray-400">{student.class} · {student.term}</span>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: NAVY }}>
              {student.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <button onClick={() => setStudent(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all">
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome banner */}
        <div className="rounded-2xl p-6 mb-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0e7490 100%)` }}>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-2xl font-extrabold">{student.name}</h1>
            <p className="text-blue-200 text-sm mt-1">{student.class} · {student.term} · {student.year}</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/15 rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-extrabold">{avg}%</div>
              <div className="text-blue-200 text-xs mt-0.5">Term Avg.</div>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-extrabold">92%</div>
              <div className="text-blue-200 text-xs mt-0.5">Attendance</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
          {([
            { id: "overview", label: "Overview", icon: Home },
            { id: "timetable", label: "Timetable", icon: Calendar },
            { id: "results", label: "Results", icon: BarChart2 },
            { id: "notices", label: "Notices", icon: Bell },
          ] as const).map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                  activeTab === tab.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Class Position", value: "3rd", sub: "out of 28 pupils", icon: Award, bg: "#ede9fe", color: "#7c3aed" },
                { label: "Subjects Passed", value: "10/10", sub: "all subjects", icon: CheckCircle, bg: "#d1fae5", color: GREEN },
                { label: "Attendance Rate", value: "92%", sub: "this term", icon: TrendingUp, bg: "#e0f2fe", color: "#0284c7" },
                { label: "Conduct Grade", value: "Excellent", sub: "behavioural report", icon: Star, bg: "#fef3c7", color: "#d97706" },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{stat.label}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                        <Icon className="w-4 h-4" style={{ color: stat.color }} />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top subjects */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Top Subjects This Term</h3>
                <div className="space-y-3">
                  {[...RESULTS].sort((a, b) => b.total - a.total).slice(0, 5).map(r => (
                    <div key={r.subject} className="flex items-center gap-3">
                      <div className="text-xs font-bold w-6 text-right text-gray-400">
                        {RESULTS.sort((a, b) => b.total - a.total).findIndex(x => x.subject === r.subject) + 1}.
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{r.subject}</span>
                          <span className="text-sm font-bold" style={{ color: gradeColor(r.grade) }}>{r.total}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${r.total}%`, backgroundColor: gradeColor(r.grade) }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab("results")}
                  className="mt-4 text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: NAVY }}>
                  View full results <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Upcoming */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {[
                    { date: "June 5", title: "Inter-House Sports Day", type: "event" },
                    { date: "June 8", title: "Third Term Examinations Begin", type: "exam" },
                    { date: "June 26", title: "Prize-Giving Day & Graduation", type: "event" },
                    { date: "June 27", title: "School Closes – Third Term", type: "holiday" },
                  ].map(ev => {
                    const colours: Record<string, { bg: string; color: string }> = {
                      exam: { bg: "#fee2e2", color: RED },
                      event: { bg: "#ede9fe", color: "#7c3aed" },
                      holiday: { bg: "#d1fae5", color: GREEN },
                    };
                    const c = colours[ev.type] ?? { bg: "#e0f2fe", color: "#0284c7" };
                    return (
                      <div key={ev.title} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center flex-shrink-0" style={{ backgroundColor: c.bg }}>
                          <span className="text-xs font-bold leading-tight" style={{ color: c.color }}>{ev.date.split(" ")[0]}</span>
                          <span className="text-xs font-bold" style={{ color: c.color }}>{ev.date.split(" ")[1]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{ev.title}</div>
                          <div className="text-xs text-gray-400 capitalize">{ev.type}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TIMETABLE ── */}
        {activeTab === "timetable" && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Weekly Class Timetable</h2>
              <p className="text-sm text-gray-400">{student.class} · {student.term} · {student.year}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr style={{ backgroundColor: NAVY }}>
                    <th className="px-4 py-3 text-left text-xs font-bold text-blue-200 w-28">Time</th>
                    {DAY_LABELS.map(d => (
                      <th key={d} className="px-4 py-3 text-left text-xs font-bold text-blue-200">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIMETABLE.map((row, i) => {
                    const isBreak = row.mon === "BREAK" || row.mon === "LUNCH";
                    return (
                      <tr key={row.time} className={isBreak ? "bg-amber-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2.5 text-xs font-bold text-gray-500 whitespace-nowrap border-r border-gray-100">{row.time}</td>
                        {DAYS.map(day => (
                          <td key={day} className="px-4 py-2.5 border-r border-gray-100 last:border-0">
                            <span className={isBreak
                              ? "text-amber-600 font-bold text-xs"
                              : "text-gray-700 text-sm"}>
                              {row[day]}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {activeTab === "results" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Term Results</h2>
                <p className="text-sm text-gray-400">{student.term} · {student.year}</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-center shadow-sm">
                  <div className="text-xl font-extrabold" style={{ color: NAVY }}>{avg}%</div>
                  <div className="text-xs text-gray-400">Average</div>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-center shadow-sm">
                  <div className="text-xl font-extrabold" style={{ color: GREEN }}>3rd</div>
                  <div className="text-xs text-gray-400">Position</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Subject</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">CA (30)</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Exam (70)</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Total (100)</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RESULTS.map((r, i) => (
                      <tr key={r.subject} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-5 py-3 font-medium text-gray-800">{r.subject}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{r.ca}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{r.exam}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: gradeColor(r.grade) }}>{r.total}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: gradeColor(r.grade) }}>{r.grade}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{r.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200" style={{ backgroundColor: "#f0f4ff" }}>
                      <td className="px-5 py-3 font-bold text-gray-800">Total / Average</td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: NAVY }}>
                        {RESULTS.reduce((s, r) => s + r.ca, 0)}
                      </td>
                      <td className="px-4 py-3 text-center font-bold" style={{ color: NAVY }}>
                        {RESULTS.reduce((s, r) => s + r.exam, 0)}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-lg" style={{ color: NAVY }}>{avg}%</td>
                      <td colSpan={2} className="px-4 py-3 font-bold" style={{ color: GREEN }}>3rd Position</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">* These results are for the {student.term}, {student.year} academic session. Contact the school office for your official report card.</p>
          </div>
        )}

        {/* ── NOTICES ── */}
        {activeTab === "notices" && (
          <div>
            <h2 className="font-bold text-gray-900 text-lg mb-6">School Notices & Announcements</h2>
            <div className="space-y-4">
              {NOTICES.map((notice, i) => {
                const n = noticeIcon(notice.type);
                return (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: n.bg }}>
                        {n.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <h3 className="font-bold text-gray-900">{notice.title}</h3>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{notice.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{notice.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 text-center text-xs text-gray-400">
        © 2026 Triple Tee Montessori Academy Student Portal. All rights reserved. &nbsp;·&nbsp;
        <Link href="/" className="hover:underline">Back to School Website</Link>
      </footer>
    </div>
  );
}

/* ── LOGIN PAGE ─────────────────────────────────────────────────────────── */
function LoginPage({
  studentId, setStudentId, password, setPassword,
  showPassword, setShowPassword, error, loading, onSubmit,
}: {
  studentId: string; setStudentId: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPassword: boolean; setShowPassword: (v: boolean) => void;
  error: string; loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="min-h-screen flex items-stretch bg-gray-100">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: `linear-gradient(155deg, #0d1b5e 0%, #1a237e 40%, #0e7490 100%)` }}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ backgroundColor: RED }} />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: "#fff" }} />
        <div className="absolute top-1/3 right-0 w-32 h-32 rounded-full opacity-5" style={{ backgroundColor: "#fff" }} />

        {/* School logo + name */}
        <div className="absolute top-8 left-10 flex items-center gap-3">
          <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 rounded-full border-2 border-white/30 object-contain bg-white p-0.5" />
          <div className="text-white">
            <div className="font-bold text-sm leading-tight">Triple Tee Montessori</div>
            <div className="text-blue-300 text-xs">Academy</div>
          </div>
        </div>

        <div className="relative text-white max-w-xs">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-3">Welcome Back</h1>
            <p className="text-blue-200 text-base">Secure Student Portal Access</p>
            <div className="mt-4 w-14 h-1 rounded-full" style={{ backgroundColor: "#fbbf24" }} />
          </div>

          <div className="space-y-3 text-sm text-blue-200">
            {["View your class results & term report", "Check your weekly timetable", "Read school notices & announcements", "Track your attendance & progress"].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-10 right-10 text-center text-xs text-blue-300 border-t border-white/10 pt-4">
          © 2026 Triple Tee Montessori Academy Portal. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 rounded-full border border-gray-200 object-contain" />
            <div>
              <div className="font-bold text-base leading-tight" style={{ color: NAVY }}>Triple Tee Montessori Academy</div>
              <div className="text-xs text-gray-400">Student Portal</div>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Sign In</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to continue.</p>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Student ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Student ID</label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. TTA001"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ focusRingColor: NAVY } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <button type="button" className="text-xs font-semibold hover:underline" style={{ color: NAVY }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">🔒</div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
              style={{ backgroundColor: GREEN }}>
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            New Applicant?{" "}
            <Link href="/apply" className="font-semibold hover:underline" style={{ color: NAVY }}>
              Check Admission Status
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-8 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-1 text-xs text-gray-500">
              <div><span className="font-semibold">Student ID:</span> TTA001, TTA002, or TTA003</div>
              <div><span className="font-semibold">Password:</span> school2024</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:underline">← Back to school website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

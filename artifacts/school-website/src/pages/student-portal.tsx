import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  GraduationCap, LogOut, BookOpen, Calendar, BarChart2, Bell,
  Eye, EyeOff, Home, CheckCircle, AlertCircle, ChevronRight,
  Star, Award, TrendingUp, Loader2, X, Mail, UserCheck,
} from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";
const GREEN = "#16a34a";

/* ── SESSION ──────────────────────────────────────────────────────────── */
const SESSION_KEY = "ttt_student_session";
type Session = { id: number; email: string; firstName: string; lastName: string; classLevel: string };

function saveSession(s: Session) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function loadSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null"); }
  catch { return null; }
}
function clearSession() { localStorage.removeItem(SESSION_KEY); }

/* ── TYPES ────────────────────────────────────────────────────────────── */
type ResultRow = { subject: string; ca1Score: number; ca2Score: number; caScore: number; examScore: number; total: number; grade: string; remark: string };
type TimetableRow = { timeSlot: string; monday: string; tuesday: string; wednesday: string; thursday: string; friday: string; isBreak: number };
type AttendanceSummary = { total: number; present: number; absent: number; late: number; percentage: number | null };
type AttendanceRecord = { date: string; status: string; remark: string };

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TERM_OPTIONS = ["First Term", "Second Term", "Third Term"];
const CURRENT_YEAR = "2025/2026";

type NoticeItem = { id: number; title: string; body: string; type: string; publishedAt: string };

function gradeColor(grade: string) {
  if (grade === "A") return GREEN;
  if (grade === "B") return "#2563eb";
  if (grade === "C") return "#d97706";
  return RED;
}
function noticeStyle(type: string): { bg: string; icon: string } {
  switch (type) {
    case "exam":     return { bg: "#fee2e2", icon: "📝" };
    case "event":    return { bg: "#ede9fe", icon: "🎉" };
    case "finance":  return { bg: "#fef3c7", icon: "💰" };
    case "activity": return { bg: "#d1fae5", icon: "✝️" };
    default:         return { bg: "#e0f2fe", icon: "📢" };
  }
}

/* ── MAIN COMPONENT ───────────────────────────────────────────────────── */
export default function StudentPortal() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "timetable" | "results" | "attendance" | "notices">("overview");

  // Term/year selectors
  const [selectedTerm, setSelectedTerm] = useState(TERM_OPTIONS[2]);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  // Data
  const [results, setResults] = useState<ResultRow[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [timetable, setTimetable] = useState<TimetableRow[]>([]);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [attendanceRows, setAttendanceRows] = useState<AttendanceRecord[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);

  useEffect(() => {
    const saved = loadSession();
    if (saved) setSession(saved);
  }, []);

  // Fetch results when session, term, or year changes
  useEffect(() => {
    if (!session) return;
    setResultsLoading(true);
    fetch(`/api/results/student/${session.id}?term=${encodeURIComponent(selectedTerm)}&academicYear=${encodeURIComponent(selectedYear)}`)
      .then(r => r.json())
      .then((data: ResultRow[]) => {
        setResults(Array.isArray(data) ? data : []);
      })
      .catch(() => setResults([]))
      .finally(() => setResultsLoading(false));
  }, [session, selectedTerm, selectedYear]);

  // Fetch attendance when session, term, or year changes
  useEffect(() => {
    if (!session) return;
    setAttendanceLoading(true);
    fetch(`/api/attendance/student/${session.id}?term=${encodeURIComponent(selectedTerm)}&academicYear=${encodeURIComponent(selectedYear)}`)
      .then(r => r.json())
      .then((data: { rows: { date: string; status: string; remark: string }[]; summary: AttendanceSummary }) => {
        setAttendanceSummary(data.summary ?? null);
        setAttendanceRows(Array.isArray(data.rows) ? data.rows : []);
      })
      .catch(() => { setAttendanceSummary(null); setAttendanceRows([]); })
      .finally(() => setAttendanceLoading(false));
  }, [session, selectedTerm, selectedYear]);

  // Fetch timetable when session or classLevel changes
  useEffect(() => {
    if (!session) return;
    setTimetableLoading(true);
    fetch(`/api/timetable?classLevel=${encodeURIComponent(session.classLevel)}`)
      .then(r => r.json())
      .then((data: TimetableRow[]) => setTimetable(Array.isArray(data) ? data : []))
      .catch(() => setTimetable([]))
      .finally(() => setTimetableLoading(false));
  }, [session]);

  // Fetch notices when session is set
  useEffect(() => {
    if (!session) return;
    setNoticesLoading(true);
    fetch("/api/notices")
      .then(r => r.json())
      .then((data: NoticeItem[]) => setNotices(Array.isArray(data) ? data : []))
      .catch(() => setNotices([]))
      .finally(() => setNoticesLoading(false));
  }, [session]);

  function handleLogin(s: Session) { saveSession(s); setSession(s); }
  function handleLogout() { clearSession(); setSession(null); setActiveTab("overview"); }

  if (!session) return <LoginPage onLogin={handleLogin} />;

  const avg = results.length > 0 ? Math.round(results.reduce((s, r) => s + r.total, 0) / results.length) : null;
  const attPct = attendanceSummary?.percentage ?? null;

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
              <span className="text-sm font-bold text-gray-800">{session.firstName} {session.lastName}</span>
              <span className="text-xs text-gray-400">{session.classLevel} · {selectedTerm}</span>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: NAVY }}>
              {(session.firstName[0] + session.lastName[0]).toUpperCase()}
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all">
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome banner */}
        <div className="rounded-2xl p-6 mb-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0e7490 100%)` }}>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-2xl font-extrabold">{session.firstName} {session.lastName}</h1>
            <p className="text-blue-200 text-sm mt-1">{session.classLevel} · {selectedTerm} · {selectedYear}</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/15 rounded-xl px-4 py-3 text-center min-w-[72px]">
              <div className="text-2xl font-extrabold">{avg !== null ? `${avg}%` : "—"}</div>
              <div className="text-blue-200 text-xs mt-0.5">Term Avg.</div>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-3 text-center min-w-[72px]">
              <div className="text-2xl font-extrabold">{attPct !== null ? `${attPct}%` : "—"}</div>
              <div className="text-blue-200 text-xs mt-0.5">Attendance</div>
            </div>
          </div>
        </div>

        {/* Term / Year selector */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <span className="text-xs font-semibold text-gray-500">Term:</span>
            {TERM_OPTIONS.map(t => (
              <button key={t} onClick={() => setSelectedTerm(t)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                style={{ backgroundColor: selectedTerm === t ? NAVY : "transparent", color: selectedTerm === t ? "white" : "#6b7280" }}>
                {t.replace(" Term", "")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <span className="text-xs font-semibold text-gray-500">Year:</span>
            <select className="text-xs font-semibold text-gray-700 border-none bg-transparent focus:outline-none cursor-pointer"
              value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              {["2025/2026", "2024/2025", "2023/2024"].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
          {([
            { id: "overview",    label: "Overview",    icon: Home },
            { id: "timetable",   label: "Timetable",   icon: Calendar },
            { id: "results",     label: "Results",     icon: BarChart2 },
            { id: "attendance",  label: "Attendance",  icon: UserCheck },
            { id: "notices",     label: "Notices",     icon: Bell },
          ] as const).map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                  activeTab === tab.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                }`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Subjects Passed", value: results.length > 0 ? `${results.filter(r => r.grade !== "F").length}/${results.length}` : "—", sub: "this term", icon: CheckCircle, bg: "#d1fae5", color: GREEN },
                { label: "Average Score",   value: avg !== null ? `${avg}%` : "—",   sub: "term average",  icon: TrendingUp, bg: "#e0f2fe", color: "#0284c7" },
                { label: "Attendance Rate", value: attPct !== null ? `${attPct}%` : "—", sub: "this term",  icon: Award,      bg: "#ede9fe", color: "#7c3aed" },
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
                {resultsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
                ) : results.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">No results available for this term yet.</p>
                ) : (
                  <div className="space-y-3">
                    {[...results].sort((a, b) => b.total - a.total).slice(0, 5).map((r, idx) => (
                      <div key={r.subject} className="flex items-center gap-3">
                        <div className="text-xs font-bold w-5 text-right text-gray-400">{idx + 1}.</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{r.subject}</span>
                            <span className="text-sm font-bold" style={{ color: gradeColor(r.grade) }}>{r.total}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${r.total}%`, backgroundColor: gradeColor(r.grade) }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setActiveTab("results")}
                  className="mt-4 text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: NAVY }}>
                  View full results <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Upcoming events */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {[
                    { date: "June 5",  title: "Inter-House Sports Day",         type: "event" },
                    { date: "June 8",  title: "Third Term Examinations Begin",  type: "exam" },
                    { date: "June 26", title: "Prize-Giving Day & Graduation",  type: "event" },
                    { date: "June 27", title: "School Closes – Third Term",     type: "holiday" },
                  ].map(ev => {
                    const colors: Record<string, string> = { exam: "#fee2e2", event: "#ede9fe", holiday: "#d1fae5" };
                    const textColors: Record<string, string> = { exam: RED, event: "#7c3aed", holiday: GREEN };
                    return (
                      <div key={ev.title} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: colors[ev.type] ?? "#e0f2fe" }}>
                          <span className="text-xs font-bold leading-tight" style={{ color: textColors[ev.type] ?? "#0284c7" }}>{ev.date.split(" ")[0]}</span>
                          <span className="text-xs font-bold" style={{ color: textColors[ev.type] ?? "#0284c7" }}>{ev.date.split(" ")[1]}</span>
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

        {/* TIMETABLE */}
        {activeTab === "timetable" && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Weekly Class Timetable</h2>
              <p className="text-sm text-gray-400">{session.classLevel}</p>
            </div>
            {timetableLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
            ) : timetable.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Timetable not set yet</p>
                <p className="text-xs mt-1">The admin will upload the class timetable soon.</p>
              </div>
            ) : (
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
                    {timetable.map((row, i) => {
                      const isBreak = !!row.isBreak;
                      return (
                        <tr key={i} className={isBreak ? "bg-amber-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2.5 text-xs font-bold text-gray-500 whitespace-nowrap border-r border-gray-100">{row.timeSlot}</td>
                          {DAYS.map(day => (
                            <td key={day} className="px-4 py-2.5 border-r border-gray-100 last:border-0">
                              <span className={isBreak ? "text-amber-600 font-bold text-xs" : "text-gray-700 text-sm"}>{row[day]}</span>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* RESULTS */}
        {activeTab === "results" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Term Results</h2>
                <p className="text-sm text-gray-400">{selectedTerm} · {selectedYear}</p>
              </div>
              {avg !== null && (
                <div className="flex gap-3">
                  <div className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-center shadow-sm">
                    <div className="text-xl font-extrabold" style={{ color: NAVY }}>{avg}%</div>
                    <div className="text-xs text-gray-400">Average</div>
                  </div>
                </div>
              )}
            </div>

            {resultsLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
            ) : results.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-16 text-center text-gray-400">
                <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No results available</p>
                <p className="text-xs mt-1">Results for {selectedTerm} · {selectedYear} have not been uploaded yet.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Subject</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">1st CA (15)</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">2nd CA (15)</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Exam (70)</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Total (100)</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Grade</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={r.subject} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-5 py-3 font-medium text-gray-800">{r.subject}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{r.ca1Score ?? 0}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{r.ca2Score ?? 0}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{r.examScore}</td>
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
                        <td className="px-4 py-3 text-center font-bold" style={{ color: NAVY }}>{results.reduce((s, r) => s + (r.ca1Score ?? 0), 0)}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: NAVY }}>{results.reduce((s, r) => s + (r.ca2Score ?? 0), 0)}</td>
                        <td className="px-4 py-3 text-center font-bold" style={{ color: NAVY }}>{results.reduce((s, r) => s + r.examScore, 0)}</td>
                        <td className="px-4 py-3 text-center font-bold text-lg" style={{ color: NAVY }}>{avg}%</td>
                        <td colSpan={2} className="px-4 py-3 font-semibold text-gray-500 text-xs">Based on {results.length} subject{results.length !== 1 ? "s" : ""}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-3">* Contact the school office for your official printed report card.</p>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab === "attendance" && (
          <div>
            <div className="mb-6">
              <h2 className="font-bold text-gray-900 text-lg">Attendance Record</h2>
              <p className="text-sm text-gray-400">{selectedTerm} · {selectedYear}</p>
            </div>

            {attendanceLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
            ) : (
              <>
                {/* Summary cards */}
                {attendanceSummary && attendanceSummary.total > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "School Days",     value: attendanceSummary.total,   bg: "#e0f2fe", color: "#0284c7" },
                      { label: "Days Present",    value: attendanceSummary.present, bg: "#d1fae5", color: GREEN },
                      { label: "Days Absent",     value: attendanceSummary.absent,  bg: "#fee2e2", color: RED },
                      { label: "Attendance Rate", value: `${attendanceSummary.percentage ?? 0}%`, bg: "#ede9fe", color: "#7c3aed" },
                    ].map(c => (
                      <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-extrabold" style={{ color: c.color }}>{c.value}</div>
                        <div className="text-xs text-gray-400 mt-1">{c.label}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Attendance rows */}
                {attendanceRows.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-16 text-center text-gray-400">
                    <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No attendance records</p>
                    <p className="text-xs mt-1">Attendance for {selectedTerm} · {selectedYear} has not been recorded yet.</p>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...attendanceRows].sort((a, b) => b.date.localeCompare(a.date)).map((r, i) => {
                            const cfg = { present: { label: "Present", bg: "#d1fae5", color: "#166534" }, absent: { label: "Absent", bg: "#fee2e2", color: "#991b1b" }, late: { label: "Late", bg: "#fef3c7", color: "#92400e" } }[r.status] ?? { label: r.status, bg: "#f3f4f6", color: "#374151" };
                            return (
                              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="px-5 py-3 text-gray-700">
                                  {new Date(r.date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold"
                                    style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{r.remark || "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* NOTICES */}
        {activeTab === "notices" && (
          <div>
            <h2 className="font-bold text-gray-900 text-lg mb-6">School Notices & Announcements</h2>
            {noticesLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
            ) : notices.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-16 text-center text-gray-400">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No notices at this time</p>
                <p className="text-xs mt-1">Check back later for school announcements.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map(notice => {
                  const n = noticeStyle(notice.type);
                  const dateStr = notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
                  return (
                    <div key={notice.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ backgroundColor: n.bg }}>{n.icon}</div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <h3 className="font-bold text-gray-900">{notice.title}</h3>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{dateStr}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{notice.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200 text-center text-xs text-gray-400">
        © 2026 Triple Tee Montessori Academy Student Portal.&nbsp;·&nbsp;
        <Link href="/" className="hover:underline">Back to school website</Link>
      </footer>
    </div>
  );
}

/* ── LOGIN PAGE ─────────────────────────────────────────────────────────── */
function LoginPage({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed.");
      onLogin(data as Session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <>
      <div className="min-h-screen flex items-stretch bg-gray-100">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-12"
          style={{ background: `linear-gradient(155deg, #0d1b5e 0%, #1a237e 40%, #0e7490 100%)` }}>
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ backgroundColor: RED }} />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white" />
          <div className="absolute top-8 left-10 flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 rounded-full border-2 border-white/30 object-contain bg-white p-0.5" />
            <div className="text-white">
              <div className="font-bold text-sm leading-tight">Triple Tee Montessori</div>
              <div className="text-blue-300 text-xs">Academy</div>
            </div>
          </div>
          <div className="relative text-white max-w-xs">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold leading-tight mb-3">Welcome Back</h1>
            <p className="text-blue-200 text-base">Secure Student Portal Access</p>
            <div className="mt-4 w-14 h-1 rounded-full" style={{ backgroundColor: "#fbbf24" }} />
            <div className="mt-8 space-y-3 text-sm text-blue-200">
              {["View your class results & term report", "Check your weekly timetable", "Read school notices & announcements", "Track your attendance record"].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-400" /> {item}
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
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 rounded-full border border-gray-200 object-contain" />
              <div>
                <div className="font-bold text-base leading-tight" style={{ color: NAVY }}>Triple Tee Montessori Academy</div>
                <div className="text-xs text-gray-400">Student Portal</div>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Sign In</h2>
            <p className="text-gray-400 text-sm mb-8">Enter your credentials to continue.</p>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username / Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="e.g. king or surname.firstname@st.ttt.edu.ng" value={email}
                    onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <button type="button" onClick={() => setShowForgot(true)}
                    className="text-xs font-semibold hover:underline" style={{ color: NAVY }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔒</span>
                  <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password}
                    onChange={e => setPassword(e.target.value)} required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
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
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: GREEN }}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-8">
              <Link href="/" className="hover:underline font-medium">← Back to school website</Link>
            </p>
          </div>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </>
  );
}

/* ── FORGOT PASSWORD MODAL ──────────────────────────────────────────────── */
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/student/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) throw new Error("Failed to send reset email.");
      setSent(true);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg">Reset Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-gray-900">Check your email</p>
            <p className="text-sm text-gray-500 mt-1">If that address is registered, a reset link has been sent.</p>
            <button onClick={onClose} className="mt-5 text-sm font-semibold" style={{ color: NAVY }}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-gray-500">Enter your student email address and we'll send you a password reset link.</p>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="surname.firstname@st.ttt.edu.ng" value={email}
                onChange={e => setEmail(e.target.value)} required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none" />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={loading || !email}
              className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60"
              style={{ backgroundColor: NAVY }}>
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── RESET PASSWORD PAGE (stub, rendered via App.tsx route) ──────────────── */
export { ForgotPasswordModal };

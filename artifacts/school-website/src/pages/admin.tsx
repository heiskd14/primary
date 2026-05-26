import { useState } from "react";
import { useListAdmissions, useUpdateAdmissionStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListAdmissionsQueryKey } from "@workspace/api-client-react";
import { LogOut, Eye, EyeOff, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";
const ADMIN_PASSWORD = "king2024";

type Admission = {
  id: number;
  childFirstName: string;
  childLastName: string;
  childDob: string;
  childGender: string;
  classApplyingFor: string;
  previousSchool?: string | null;
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  parentPhone2?: string | null;
  parentEmail?: string | null;
  parentAddress: string;
  howDidYouHear?: string | null;
  additionalInfo?: string | null;
  status: string;
  submittedAt: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: "Pending",  color: "#92400e", bg: "#fef3c7", icon: <Clock className="w-3.5 h-3.5" /> },
  reviewed: { label: "Reviewed", color: "#1e40af", bg: "#dbeafe", icon: <Eye className="w-3.5 h-3.5" /> },
  accepted: { label: "Accepted", color: "#166534", bg: "#dcfce7", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", color: "#991b1b", bg: "#fee2e2", icon: <XCircle className="w-3.5 h-3.5" /> },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function AdmissionRow({ admission, onStatusChange }: { admission: Admission; onStatusChange: (id: number, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const mutation = useUpdateAdmissionStatus();
  const qc = useQueryClient();

  async function changeStatus(status: string) {
    await mutation.mutateAsync({ id: admission.id, data: { status } });
    qc.invalidateQueries({ queryKey: getListAdmissionsQueryKey() });
    onStatusChange(admission.id, status);
  }

  const date = new Date(admission.submittedAt).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-gray-900">{admission.childFirstName} {admission.childLastName}</span>
            <StatusBadge status={admission.status} />
          </div>
          <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-3 flex-wrap">
            <span>{admission.classApplyingFor}</span>
            <span>·</span>
            <span>Parent: {admission.parentName}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5">
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: NAVY }}>Child's Details</h4>
              <dl className="space-y-1.5 text-sm">
                {[
                  ["Full Name", `${admission.childFirstName} ${admission.childLastName}`],
                  ["Date of Birth", admission.childDob],
                  ["Gender", admission.childGender],
                  ["Class Applied For", admission.classApplyingFor],
                  ["Previous School", admission.previousSchool || "None"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="text-gray-500 w-36 flex-shrink-0">{k}</dt>
                    <dd className="text-gray-900 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: NAVY }}>Parent / Guardian</h4>
              <dl className="space-y-1.5 text-sm">
                {[
                  ["Name", admission.parentName],
                  ["Relationship", admission.parentRelationship],
                  ["Phone", admission.parentPhone],
                  ["2nd Phone", admission.parentPhone2 || "—"],
                  ["Email", admission.parentEmail || "—"],
                  ["Address", admission.parentAddress],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="text-gray-500 w-36 flex-shrink-0">{k}</dt>
                    <dd className="text-gray-900 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {(admission.howDidYouHear || admission.additionalInfo) && (
            <div className="mb-5 text-sm">
              {admission.howDidYouHear && (
                <p className="text-gray-600 mb-1"><span className="font-semibold text-gray-700">Heard about us via:</span> {admission.howDidYouHear}</p>
              )}
              {admission.additionalInfo && (
                <p className="text-gray-600"><span className="font-semibold text-gray-700">Additional notes:</span> {admission.additionalInfo}</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-600 mr-1">Update status:</span>
            {["pending", "reviewed", "accepted", "rejected"].map((s) => {
              const cfg = STATUS_CONFIG[s];
              const isActive = admission.status === s;
              return (
                <button key={s} onClick={() => changeStatus(s)} disabled={isActive || mutation.isPending}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all disabled:opacity-60"
                  style={{
                    borderColor: isActive ? cfg.color : "#e5e7eb",
                    backgroundColor: isActive ? cfg.bg : "white",
                    color: isActive ? cfg.color : "#6b7280",
                  }}>
                  {mutation.isPending ? <Loader2 className="w-3 h-3 animate-spin inline" /> : cfg.label}
                </button>
              );
            })}
            {mutation.isError && <span className="text-xs text-red-500 ml-2">Failed to update. Try again.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: admissions = [], isLoading, refetch, isRefetching } = useListAdmissions();
  const [localStatuses, setLocalStatuses] = useState<Record<number, string>>({});

  function getStatus(a: Admission) {
    return localStatuses[a.id] ?? a.status;
  }

  const filtered = (admissions as Admission[]).filter((a) =>
    statusFilter === "all" ? true : getStatus(a) === statusFilter
  );

  const counts = (admissions as Admission[]).reduce<Record<string, number>>((acc, a) => {
    const s = getStatus(a);
    acc[s] = (acc[s] ?? 0) + 1;
    acc.all = (acc.all ?? 0) + 1;
    return acc;
  }, { all: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-white shadow-md" style={{ backgroundColor: NAVY }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 rounded-full object-contain bg-white p-0.5" />
            <div>
              <div className="font-bold text-base leading-tight">Triple Tee Montessori Academy</div>
              <div className="text-xs text-blue-200">Admissions Admin Panel</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => refetch()} disabled={isRefetching}
              className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm transition-colors">
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={onLogout}
              className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: "all", label: "Total Applications", color: NAVY, bg: "#f0f4ff" },
            { key: "pending", label: "Pending Review", color: "#92400e", bg: "#fef3c7" },
            { key: "accepted", label: "Accepted", color: "#166534", bg: "#dcfce7" },
            { key: "rejected", label: "Rejected", color: "#991b1b", bg: "#fee2e2" },
          ].map((card) => (
            <div key={card.key} className="rounded-xl p-4 border border-gray-200 bg-white shadow-sm text-center">
              <div className="text-3xl font-extrabold" style={{ color: card.color }}>{counts[card.key] ?? 0}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["all", "pending", "reviewed", "accepted", "rejected"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors border"
              style={{
                backgroundColor: statusFilter === s ? NAVY : "white",
                color: statusFilter === s ? "white" : "#374151",
                borderColor: statusFilter === s ? NAVY : "#e5e7eb",
              }}>
              {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s] ?? 0})
            </button>
          ))}
        </div>

        {/* Applications list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin" /> Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold">No applications {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}</p>
            <p className="text-sm mt-1">Applications submitted via the website will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <AdmissionRow key={a.id} admission={{ ...a, status: getStatus(a) }}
                onStatusChange={(id, status) => setLocalStatuses((p) => ({ ...p, [id]: status }))} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("ttma_admin", "1");
      onLogin();
    } else {
      setError(true);
      setPw("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="Logo" className="w-20 h-20 rounded-full object-contain mx-auto mb-4 border-4" style={{ borderColor: NAVY + "33" }} />
          <h1 className="text-xl font-extrabold" style={{ color: NAVY }}>Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Triple Tee Montessori Academy</p>
        </div>
        <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={pw} onChange={(e) => { setPw(e.target.value); setError(false); }}
                placeholder="Enter admin password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none transition-colors"
                onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
                onBlur={(e) => (e.currentTarget.style.borderColor = error ? "#ef4444" : "")}
                style={error ? { borderColor: "#ef4444" } : {}}
                autoFocus
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">Incorrect password. Please try again.</p>}
          </div>
          <button type="submit"
            className="w-full text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: NAVY }}>
            Log In
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          <a href="/" className="hover:underline">← Back to school website</a>
        </p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("ttma_admin") === "1");

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }
  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("ttma_admin"); setAuthed(false); }} />;
}

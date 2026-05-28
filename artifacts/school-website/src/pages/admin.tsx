import { useState, useEffect } from "react";
import { useListAdmissions, useUpdateAdmissionStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListAdmissionsQueryKey } from "@workspace/api-client-react";
import {
  LogOut, Eye, EyeOff, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  Loader2, RefreshCw, Plus, Pencil, Trash2, X, Save, Newspaper, ImageIcon,
  Users, Calendar, BookOpen, Info, GraduationCap, ClipboardList, LayoutGrid,
  UserCheck, Bell, DollarSign, Mic,
} from "lucide-react";

const NAVY = "#1a237e";
const RED  = "#CC2200";
const API  = "/api";
const ADMIN_SESSION_KEY = "ttt_admin_role";

// ─── Role Definitions ─────────────────────────────────────────────────────────

const ROLES: Record<string, { name: string; tabs: string[] }> = {
  "king2024":              { name: "Super Admin",       tabs: ["admissions","news","events","gallery","staff","school-life","about","results","attendance","timetable","notices"] },
  "tripletee@admin":       { name: "Admissions Officer",tabs: ["admissions"] },
  "tripletee@teach":       { name: "Teaching Staff",    tabs: ["results","attendance"] },
  "tripletee@bursaryunit": { name: "Bursary Unit",      tabs: ["school-fees"] },
  "principal@tripletee":   { name: "Principal",         tabs: ["admissions","news","events","gallery","staff","school-life","about","results","attendance","timetable","school-fees","principal-speech"] },
  "exam@tee":              { name: "Exam Committee",    tabs: ["timetable"] },
};

const ALL_TABS = [
  { id: "admissions",       label: "Admissions",       icon: CheckCircle },
  { id: "news",             label: "News",              icon: Newspaper },
  { id: "events",           label: "Events",            icon: Calendar },
  { id: "gallery",          label: "Gallery",           icon: ImageIcon },
  { id: "staff",            label: "Staff",             icon: Users },
  { id: "school-life",      label: "School Life",       icon: BookOpen },
  { id: "about",            label: "About Us",          icon: Info },
  { id: "results",          label: "Results",           icon: ClipboardList },
  { id: "attendance",       label: "Attendance",        icon: UserCheck },
  { id: "timetable",        label: "Timetable",         icon: LayoutGrid },
  { id: "notices",          label: "Notices",           icon: Bell },
  { id: "school-fees",      label: "School Fees",       icon: DollarSign },
  { id: "principal-speech", label: "Principal Speech",  icon: Mic },
];

// ─── API helper ───────────────────────────────────────────────────────────────

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls    = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a237e] transition-colors";
const textareaCls = `${inputCls} resize-none`;

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json() as { url: string };
      onChange(data.url);
    } catch { alert("Image upload failed. Please try again."); }
    finally { setUploading(false); }
  }
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading}
        className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer hover:border-[#1a237e] transition-colors file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#1a237e] file:text-white hover:file:opacity-90" />
      {uploading && <p className="text-xs text-blue-500 mt-1 animate-pulse">Uploading image…</p>}
      {value && <img src={value} alt="preview" className="mt-2 h-24 rounded-lg object-cover w-full border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-base" style={{ color: NAVY }}>{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, small }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "danger" | "ghost" | "outline"; disabled?: boolean; small?: boolean;
}) {
  const base = `inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all disabled:opacity-50 ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`;
  const styles = { primary: "text-white hover:opacity-90", danger: "text-white hover:opacity-90", ghost: "text-gray-600 hover:bg-gray-100", outline: "border border-gray-300 text-gray-700 hover:bg-gray-50" };
  const bg = variant === "primary" ? { backgroundColor: NAVY } : variant === "danger" ? { backgroundColor: RED } : {};
  return <button className={`${base} ${styles[variant]}`} style={bg} onClick={onClick} disabled={disabled}>{children}</button>;
}

function ConfirmDelete({ onConfirm, onCancel, label }: { onConfirm: () => void; onCancel: () => void; label: string }) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <p className="text-gray-700 mb-6">Are you sure you want to delete <strong>{label}</strong>? This cannot be undone.</p>
      <div className="flex justify-end gap-3">
        <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm}><Trash2 className="w-4 h-4" /> Delete</Btn>
      </div>
    </Modal>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-semibold">{text}</p>
    </div>
  );
}

// ─── Admissions Tab ───────────────────────────────────────────────────────────

type Admission = {
  id: number; childFirstName: string; childLastName: string; childDob: string;
  childGender: string; classApplyingFor: string; previousSchool?: string | null;
  parentName: string; parentRelationship: string; parentPhone: string;
  parentPhone2?: string | null; parentEmail?: string | null; parentAddress: string;
  howDidYouHear?: string | null; additionalInfo?: string | null;
  status: string; submittedAt: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: "Pending",  color: "#92400e", bg: "#fef3c7", icon: <Clock className="w-3.5 h-3.5" /> },
  reviewed: { label: "Reviewed", color: "#1e40af", bg: "#dbeafe", icon: <Eye className="w-3.5 h-3.5" /> },
  accepted: { label: "Accepted", color: "#166534", bg: "#dcfce7", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", color: "#991b1b", bg: "#fee2e2", icon: <XCircle className="w-3.5 h-3.5" /> },
};

function AdmissionRow({ admission, onStatusChange }: { admission: Admission; onStatusChange: (id: number, status: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const mutation = useUpdateAdmissionStatus();
  const qc = useQueryClient();
  async function changeStatus(status: string) {
    await mutation.mutateAsync({ id: admission.id, data: { status } });
    qc.invalidateQueries({ queryKey: getListAdmissionsQueryKey() });
    onStatusChange(admission.id, status);
  }
  const date = new Date(admission.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const cfg = STATUS_CONFIG[admission.status] ?? STATUS_CONFIG.pending;
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-gray-900">{admission.childFirstName} {admission.childLastName}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ color: cfg.color, backgroundColor: cfg.bg }}>{cfg.icon} {cfg.label}</span>
          </div>
          <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-3 flex-wrap">
            <span>{admission.classApplyingFor}</span><span>·</span>
            <span>Parent: {admission.parentName}</span><span>·</span><span>{date}</span>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5">
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: NAVY }}>Child</h4>
              <dl className="space-y-1.5 text-sm">
                {[["Full Name", `${admission.childFirstName} ${admission.childLastName}`], ["DOB", admission.childDob], ["Gender", admission.childGender], ["Class", admission.classApplyingFor], ["Prev School", admission.previousSchool || "None"]].map(([k, v]) => (
                  <div key={k} className="flex gap-3"><dt className="text-gray-500 w-28 flex-shrink-0">{k}</dt><dd className="text-gray-900 font-medium">{v}</dd></div>
                ))}
              </dl>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: NAVY }}>Parent</h4>
              <dl className="space-y-1.5 text-sm">
                {[["Name", admission.parentName], ["Relationship", admission.parentRelationship], ["Phone", admission.parentPhone], ["2nd Phone", admission.parentPhone2 || "—"], ["Email", admission.parentEmail || "—"], ["Address", admission.parentAddress]].map(([k, v]) => (
                  <div key={k} className="flex gap-3"><dt className="text-gray-500 w-28 flex-shrink-0">{k}</dt><dd className="text-gray-900 font-medium">{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
          {(admission.howDidYouHear || admission.additionalInfo) && (
            <div className="mb-5 text-sm">
              {admission.howDidYouHear && <p className="text-gray-600 mb-1"><strong>Heard via:</strong> {admission.howDidYouHear}</p>}
              {admission.additionalInfo && <p className="text-gray-600"><strong>Notes:</strong> {admission.additionalInfo}</p>}
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-600 mr-1">Update status:</span>
            {["pending","reviewed","accepted","rejected"].map(s => {
              const c = STATUS_CONFIG[s];
              const isActive = admission.status === s;
              return (
                <button key={s} onClick={() => changeStatus(s)} disabled={isActive || mutation.isPending}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all disabled:opacity-60"
                  style={{ borderColor: isActive ? c.color : "#e5e7eb", backgroundColor: isActive ? c.bg : "white", color: isActive ? c.color : "#6b7280" }}>
                  {mutation.isPending ? <Loader2 className="w-3 h-3 animate-spin inline" /> : c.label}
                </button>
              );
            })}
            {mutation.isError && <span className="text-xs text-red-500 ml-2">Failed. Try again.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function AdmissionsTab() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: admissions = [], isLoading, refetch, isRefetching } = useListAdmissions();
  const [localStatuses, setLocalStatuses] = useState<Record<number, string>>({});
  function getStatus(a: Admission) { return localStatuses[a.id] ?? a.status; }
  const filtered = (admissions as Admission[]).filter(a => statusFilter === "all" || getStatus(a) === statusFilter);
  const counts = (admissions as Admission[]).reduce<Record<string, number>>((acc, a) => {
    const s = getStatus(a); acc[s] = (acc[s] ?? 0) + 1; acc.all = (acc.all ?? 0) + 1; return acc;
  }, { all: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Applications</h2>
        <button onClick={() => refetch()} disabled={isRefetching} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[{ key: "all", label: "Total", color: NAVY, bg: "#f0f4ff" }, { key: "pending", label: "Pending", color: "#92400e", bg: "#fef3c7" }, { key: "accepted", label: "Accepted", color: "#166534", bg: "#dcfce7" }, { key: "rejected", label: "Rejected", color: "#991b1b", bg: "#fee2e2" }].map(c => (
          <div key={c.key} className="rounded-xl p-4 border border-gray-200 bg-white shadow-sm text-center">
            <div className="text-3xl font-extrabold" style={{ color: c.color }}>{counts[c.key] ?? 0}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {["all","pending","reviewed","accepted","rejected"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors border"
            style={{ backgroundColor: statusFilter === s ? NAVY : "white", color: statusFilter === s ? "white" : "#374151", borderColor: statusFilter === s ? NAVY : "#e5e7eb" }}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s] ?? 0})
          </button>
        ))}
      </div>
      {isLoading ? <div className="flex items-center justify-center py-20 text-gray-400 gap-3"><Loader2 className="w-6 h-6 animate-spin" /> Loading...</div>
        : filtered.length === 0 ? <EmptyState icon="📋" text={`No applications${statusFilter !== "all" ? ` with status "${statusFilter}"` : " yet"}`} />
          : <div className="space-y-3">{filtered.map(a => (
            <AdmissionRow key={a.id} admission={{ ...a, status: getStatus(a) }} onStatusChange={(id, status) => setLocalStatuses(p => ({ ...p, [id]: status }))} />
          ))}</div>}
    </div>
  );
}

// ─── News Tab ─────────────────────────────────────────────────────────────────

type NewsItem = { id: number; title: string; excerpt: string; content: string; category: string; author: string; imageUrl: string; publishedAt: string };
const NEWS_CATEGORIES = ["Achievement","School Life","Events","Curriculum","Community"];
const EMPTY_NEWS = { title: "", excerpt: "", content: "", category: NEWS_CATEGORIES[0], author: "", imageUrl: "" };

function NewsTab() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: NewsItem }>(null);
  const [form, setForm] = useState(EMPTY_NEWS);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); try { setItems(await apiFetch("/news?limit=100")); } finally { setLoading(false); } }
  function openAdd() { setForm(EMPTY_NEWS); setModal({ mode: "add" }); }
  function openEdit(item: NewsItem) { setForm({ title: item.title, excerpt: item.excerpt, content: item.content, category: item.category, author: item.author, imageUrl: item.imageUrl }); setModal({ mode: "edit", item }); }
  async function save() {
    setSaving(true);
    try {
      if (modal?.mode === "add") await apiFetch("/news", { method: "POST", body: JSON.stringify(form) });
      else if (modal?.item) await apiFetch(`/news/${modal.item.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setModal(null); load();
    } finally { setSaving(false); }
  }
  async function del(item: NewsItem) { await apiFetch(`/news/${item.id}`, { method: "DELETE" }); setDeleteTarget(null); load(); }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>News Articles</h2>
        <Btn onClick={openAdd}><Plus className="w-4 h-4" /> Add Article</Btn>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        : items.length === 0 ? <EmptyState icon="📰" text="No news articles yet" />
          : <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex gap-4 items-start">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-24 h-18 object-cover rounded-lg flex-shrink-0" style={{ height: "72px" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-white px-2 py-0.5 rounded mr-2" style={{ backgroundColor: RED }}>{item.category}</span>
                        <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{item.excerpt}</p>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-1">By {item.author} · {new Date(item.publishedAt).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add News Article" : "Edit News Article"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FieldRow label="Title *"><input className={inputCls} value={form.title} onChange={set("title")} /></FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Category"><select className={inputCls} value={form.category} onChange={set("category")}>{NEWS_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></FieldRow>
              <FieldRow label="Author *"><input className={inputCls} value={form.author} onChange={set("author")} /></FieldRow>
            </div>
            <FieldRow label="Excerpt *"><textarea className={textareaCls} rows={2} value={form.excerpt} onChange={set("excerpt")} /></FieldRow>
            <FieldRow label="Full Content *"><textarea className={textareaCls} rows={5} value={form.content} onChange={set("content")} /></FieldRow>
            <FieldRow label="Image (Upload or URL)">
              <ImageUpload value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
              <input className={`${inputCls} mt-2`} value={form.imageUrl} onChange={set("imageUrl")} placeholder="Or paste image URL…" />
            </FieldRow>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Btn variant="outline" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving || !form.title || !form.excerpt || !form.content || !form.author}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </Btn>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete label={deleteTarget.title} onConfirm={() => del(deleteTarget)} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ─── Events Tab ───────────────────────────────────────────────────────────────

type EventItem = { id: number; title: string; description: string; date: string; time: string; location: string; category: string };
const EVENT_CATEGORIES = ["Academic","Sports","Cultural","Religious","Community","Holiday","Other"];
const EMPTY_EVENT = { title: "", description: "", date: "", time: "", location: "", category: EVENT_CATEGORIES[0] };

function EventsTab() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: EventItem }>(null);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); try { setItems(await apiFetch("/events?limit=100")); } finally { setLoading(false); } }
  function openAdd() { setForm(EMPTY_EVENT); setModal({ mode: "add" }); }
  function openEdit(item: EventItem) { setForm({ title: item.title, description: item.description, date: item.date, time: item.time, location: item.location, category: item.category }); setModal({ mode: "edit", item }); }
  async function save() {
    setSaving(true);
    try {
      if (modal?.mode === "add") await apiFetch("/events", { method: "POST", body: JSON.stringify(form) });
      else if (modal?.item) await apiFetch(`/events/${modal.item.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setModal(null); load();
    } finally { setSaving(false); }
  }
  async function del(item: EventItem) { await apiFetch(`/events/${item.id}`, { method: "DELETE" }); setDeleteTarget(null); load(); }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>School Events</h2>
        <Btn onClick={openAdd}><Plus className="w-4 h-4" /> Add Event</Btn>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        : items.length === 0 ? <EmptyState icon="📅" text="No events yet" />
          : <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 rounded-lg text-center text-white py-2" style={{ backgroundColor: NAVY }}>
                  <div className="text-base font-extrabold leading-tight">{item.date.slice(8, 10)}</div>
                  <div className="text-[9px] font-bold uppercase">{item.date.slice(5, 7)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                      <span className="ml-2 text-xs font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: RED }}>{item.category}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.time} · {item.location}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add Event" : "Edit Event"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FieldRow label="Title *"><input className={inputCls} value={form.title} onChange={set("title")} /></FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Date *"><input type="date" className={inputCls} value={form.date} onChange={set("date")} /></FieldRow>
              <FieldRow label="Time *"><input className={inputCls} value={form.time} onChange={set("time")} placeholder="e.g. 9:00 AM" /></FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Location *"><input className={inputCls} value={form.location} onChange={set("location")} /></FieldRow>
              <FieldRow label="Category"><select className={inputCls} value={form.category} onChange={set("category")}>{EVENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></FieldRow>
            </div>
            <FieldRow label="Description"><textarea className={textareaCls} rows={4} value={form.description} onChange={set("description")} placeholder="Write the full event description here…" /></FieldRow>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Btn variant="outline" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving || !form.title || !form.date || !form.time || !form.location}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </Btn>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete label={deleteTarget.title} onConfirm={() => del(deleteTarget)} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ─── Gallery Tab ──────────────────────────────────────────────────────────────

type GalleryItem = { id: number; title: string; imageUrl: string; category: string; createdAt: string };
const GALLERY_CATEGORIES = ["Achievement","School Life","Arts","Sport","Events","Curriculum","Community"];
const EMPTY_GALLERY = { title: "", imageUrl: "", category: GALLERY_CATEGORIES[0] };

function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: GalleryItem }>(null);
  const [form, setForm] = useState(EMPTY_GALLERY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); try { setItems(await apiFetch("/gallery?limit=200")); } finally { setLoading(false); } }
  function openAdd() { setForm(EMPTY_GALLERY); setModal({ mode: "add" }); }
  function openEdit(item: GalleryItem) { setForm({ title: item.title, imageUrl: item.imageUrl, category: item.category }); setModal({ mode: "edit", item }); }
  async function save() {
    setSaving(true);
    try {
      if (modal?.mode === "add") await apiFetch("/gallery", { method: "POST", body: JSON.stringify(form) });
      else if (modal?.item) await apiFetch(`/gallery/${modal.item.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setModal(null); load();
    } finally { setSaving(false); }
  }
  async function del(item: GalleryItem) { await apiFetch(`/gallery/${item.id}`, { method: "DELETE" }); setDeleteTarget(null); load(); }
  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Gallery</h2>
        <Btn onClick={openAdd}><Plus className="w-4 h-4" /> Add Photo</Btn>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        : items.length === 0 ? <EmptyState icon="🖼️" text="No gallery photos yet" />
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map(item => (
              <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                <img src={item.imageUrl} alt={item.title} className="w-full h-28 object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/200x150?text=No+Image"; }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(item)} className="p-1.5 bg-white rounded-full text-blue-600 shadow"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget(item)} className="p-1.5 bg-white rounded-full text-red-600 shadow"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="px-2 py-1.5">
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.title}</p>
                  <p className="text-[10px] text-gray-400">{item.category}</p>
                </div>
              </div>
            ))}
          </div>}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add Gallery Photo" : "Edit Gallery Photo"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FieldRow label="Title *"><input className={inputCls} value={form.title} onChange={setF("title")} /></FieldRow>
            <FieldRow label="Image (Upload or URL)">
              <ImageUpload value={form.imageUrl} onChange={url => setForm(f => ({ ...f, imageUrl: url }))} />
              <input className={`${inputCls} mt-2`} value={form.imageUrl} onChange={setF("imageUrl")} placeholder="Or paste image URL…" />
            </FieldRow>
            <FieldRow label="Category">
              <select className={inputCls} value={form.category} onChange={setF("category")}>{GALLERY_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            </FieldRow>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Btn variant="outline" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving || !form.title || !form.imageUrl}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </Btn>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete label={deleteTarget.title} onConfirm={() => del(deleteTarget)} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ─── Staff Tab ────────────────────────────────────────────────────────────────

type StaffMember = { id: number; name: string; role: string; department: string; bio: string; photoUrl: string; displayOrder: number };
const DEPARTMENTS = ["Management","Teaching","Support","Administration"];
const EMPTY_STAFF = { name: "", role: "", department: DEPARTMENTS[1], bio: "", photoUrl: "", displayOrder: 0 };

function StaffTab() {
  const [items, setItems] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: StaffMember }>(null);
  const [form, setForm] = useState<typeof EMPTY_STAFF>(EMPTY_STAFF);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); try { setItems(await apiFetch("/staff")); } finally { setLoading(false); } }
  function openAdd() { setForm(EMPTY_STAFF); setModal({ mode: "add" }); }
  function openEdit(item: StaffMember) { setForm({ name: item.name, role: item.role, department: item.department, bio: item.bio, photoUrl: item.photoUrl, displayOrder: item.displayOrder }); setModal({ mode: "edit", item }); }
  async function save() {
    setSaving(true);
    try {
      if (modal?.mode === "add") await apiFetch("/staff", { method: "POST", body: JSON.stringify(form) });
      else if (modal?.item) await apiFetch(`/staff/${modal.item.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setModal(null); load();
    } finally { setSaving(false); }
  }
  async function del(item: StaffMember) { await apiFetch(`/staff/${item.id}`, { method: "DELETE" }); setDeleteTarget(null); load(); }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: k === "displayOrder" ? Number(e.target.value) : e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Our Staff</h2>
        <Btn onClick={openAdd}><Plus className="w-4 h-4" /> Add Staff Member</Btn>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        : items.length === 0 ? <EmptyState icon="👩‍🏫" text="No staff members yet" />
          : <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
                {item.photoUrl
                  ? <img src={item.photoUrl} alt={item.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2" style={{ borderColor: NAVY + "33" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: "#f0f4ff" }}>👤</div>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-gray-900">{item.name}</span>
                      <span className="ml-2 text-xs text-gray-500">{item.role}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{item.department}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.bio}</p>
                </div>
              </div>
            ))}
          </div>}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add Staff Member" : "Edit Staff Member"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FieldRow label="Full Name *"><input className={inputCls} value={form.name} onChange={set("name")} /></FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Role / Title *"><input className={inputCls} value={form.role} onChange={set("role")} placeholder="e.g. Head Teacher" /></FieldRow>
              <FieldRow label="Department"><select className={inputCls} value={form.department} onChange={set("department")}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select></FieldRow>
            </div>
            <FieldRow label="Bio *"><textarea className={textareaCls} rows={3} value={form.bio} onChange={set("bio")} /></FieldRow>
            <FieldRow label="Photo (Upload or URL)">
              <ImageUpload value={form.photoUrl} onChange={url => setForm(f => ({ ...f, photoUrl: url }))} />
              <input className={`${inputCls} mt-2`} value={form.photoUrl} onChange={set("photoUrl")} placeholder="Or paste photo URL…" />
            </FieldRow>
            <FieldRow label="Display Order"><input type="number" className={inputCls} value={form.displayOrder} onChange={set("displayOrder")} /></FieldRow>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Btn variant="outline" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving || !form.name || !form.role || !form.bio}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </Btn>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete label={deleteTarget.name} onConfirm={() => del(deleteTarget)} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ─── School Life Tab ──────────────────────────────────────────────────────────

type Subject = { id: number; name: string; emoji: string; description: string; displayOrder: number };
type Club    = { id: number; name: string; timeSlot: string; yearGroup: string; icon: string; displayOrder: number };
const EMPTY_SUBJECT = { name: "", emoji: "📚", description: "", displayOrder: 0 };
const EMPTY_CLUB    = { name: "", timeSlot: "", yearGroup: "", icon: "⭐", displayOrder: 0 };

function SchoolLifeTab() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectModal, setSubjectModal] = useState<null | { mode: "add" | "edit"; item?: Subject }>(null);
  const [clubModal, setClubModal] = useState<null | { mode: "add" | "edit"; item?: Club }>(null);
  const [subjectForm, setSubjectForm] = useState<typeof EMPTY_SUBJECT>(EMPTY_SUBJECT);
  const [clubForm, setClubForm] = useState<typeof EMPTY_CLUB>(EMPTY_CLUB);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "subject" | "club"; item: Subject | Club } | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try { const [s, c] = await Promise.all([apiFetch("/school-life/subjects"), apiFetch("/school-life/clubs")]); setSubjects(s); setClubs(c); }
    finally { setLoading(false); }
  }
  const setS = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSubjectForm(f => ({ ...f, [k]: k === "displayOrder" ? Number(e.target.value) : e.target.value }));
  const setC = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setClubForm(f => ({ ...f, [k]: k === "displayOrder" ? Number(e.target.value) : e.target.value }));
  async function saveSubject() {
    setSaving(true);
    try {
      if (subjectModal?.mode === "add") await apiFetch("/school-life/subjects", { method: "POST", body: JSON.stringify(subjectForm) });
      else if (subjectModal?.item) await apiFetch(`/school-life/subjects/${(subjectModal.item as Subject).id}`, { method: "PATCH", body: JSON.stringify(subjectForm) });
      setSubjectModal(null); load();
    } finally { setSaving(false); }
  }
  async function saveClub() {
    setSaving(true);
    try {
      if (clubModal?.mode === "add") await apiFetch("/school-life/clubs", { method: "POST", body: JSON.stringify(clubForm) });
      else if (clubModal?.item) await apiFetch(`/school-life/clubs/${(clubModal.item as Club).id}`, { method: "PATCH", body: JSON.stringify(clubForm) });
      setClubModal(null); load();
    } finally { setSaving(false); }
  }
  async function delItem() {
    if (!deleteTarget) return;
    const { type, item } = deleteTarget;
    if (type === "subject") await apiFetch(`/school-life/subjects/${item.id}`, { method: "DELETE" });
    else await apiFetch(`/school-life/clubs/${item.id}`, { method: "DELETE" });
    setDeleteTarget(null); load();
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>Subjects</h2>
          <Btn onClick={() => { setSubjectForm(EMPTY_SUBJECT); setSubjectModal({ mode: "add" }); }}><Plus className="w-4 h-4" /> Add Subject</Btn>
        </div>
        {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
          : subjects.length === 0 ? <EmptyState icon="📖" text="No subjects yet" />
            : <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map(s => (
                <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 relative group">
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="font-bold text-sm mb-1" style={{ color: NAVY }}>{s.name}</div>
                  <p className="text-xs text-gray-500 line-clamp-2">{s.description}</p>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setSubjectForm({ name: s.name, emoji: s.emoji, description: s.description, displayOrder: s.displayOrder }); setSubjectModal({ mode: "edit", item: s }); }} className="p-1 bg-white border border-gray-200 rounded text-blue-600 shadow-sm"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => setDeleteTarget({ type: "subject", item: s })} className="p-1 bg-white border border-gray-200 rounded text-red-600 shadow-sm"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>}
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>Clubs & Activities</h2>
          <Btn onClick={() => { setClubForm(EMPTY_CLUB); setClubModal({ mode: "add" }); }}><Plus className="w-4 h-4" /> Add Club</Btn>
        </div>
        {!loading && (clubs.length === 0 ? <EmptyState icon="🏃" text="No clubs yet" />
          : <div className="space-y-2">
            {clubs.map(c => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm text-gray-900">{c.name}</span>
                  <span className="text-xs text-gray-500 ml-3">{c.timeSlot} · {c.yearGroup}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setClubForm({ name: c.name, timeSlot: c.timeSlot, yearGroup: c.yearGroup, icon: c.icon, displayOrder: c.displayOrder }); setClubModal({ mode: "edit", item: c }); }} className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget({ type: "club", item: c })} className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>)}
      </div>
      {subjectModal && (
        <Modal title={subjectModal.mode === "add" ? "Add Subject" : "Edit Subject"} onClose={() => setSubjectModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <FieldRow label="Emoji"><input className={inputCls} value={subjectForm.emoji} onChange={setS("emoji")} /></FieldRow>
              <div className="col-span-2"><FieldRow label="Subject Name *"><input className={inputCls} value={subjectForm.name} onChange={setS("name")} /></FieldRow></div>
            </div>
            <FieldRow label="Description *"><textarea className={textareaCls} rows={3} value={subjectForm.description} onChange={setS("description")} /></FieldRow>
            <FieldRow label="Display Order"><input type="number" className={inputCls} value={subjectForm.displayOrder} onChange={setS("displayOrder")} /></FieldRow>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Btn variant="outline" onClick={() => setSubjectModal(null)}>Cancel</Btn>
            <Btn onClick={saveSubject} disabled={saving || !subjectForm.name || !subjectForm.description}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </Btn>
          </div>
        </Modal>
      )}
      {clubModal && (
        <Modal title={clubModal.mode === "add" ? "Add Club" : "Edit Club"} onClose={() => setClubModal(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <FieldRow label="Icon"><input className={inputCls} value={clubForm.icon} onChange={setC("icon")} /></FieldRow>
              <div className="col-span-2"><FieldRow label="Club Name *"><input className={inputCls} value={clubForm.name} onChange={setC("name")} /></FieldRow></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Meeting Time *"><input className={inputCls} value={clubForm.timeSlot} onChange={setC("timeSlot")} placeholder="e.g. Tuesdays" /></FieldRow>
              <FieldRow label="Year Group *"><input className={inputCls} value={clubForm.yearGroup} onChange={setC("yearGroup")} placeholder="e.g. Primary 1–5" /></FieldRow>
            </div>
            <FieldRow label="Display Order"><input type="number" className={inputCls} value={clubForm.displayOrder} onChange={setC("displayOrder")} /></FieldRow>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Btn variant="outline" onClick={() => setClubModal(null)}>Cancel</Btn>
            <Btn onClick={saveClub} disabled={saving || !clubForm.name || !clubForm.timeSlot || !clubForm.yearGroup}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </Btn>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete label={deleteTarget.item.name} onConfirm={delItem} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ─── About Us Tab ─────────────────────────────────────────────────────────────

const ABOUT_KEYS = [
  { key: "welcome_text",      label: "Welcome / Introduction Text",           multiline: true },
  { key: "mission",           label: "Our Mission",                           multiline: true },
  { key: "vision",            label: "Our Vision",                            multiline: true },
  { key: "tagline_text",      label: "Tagline Text",                          multiline: true },
  { key: "teachers_text_1",   label: "Teachers Section — First Paragraph",    multiline: true },
  { key: "teachers_text_2",   label: "Teachers Section — Second Paragraph",   multiline: true },
  { key: "proprietors_speech",label: "Proprietor's Speech / Message",         multiline: true },
  { key: "key_facts",         label: "Key Facts (one per line)",              multiline: true },
];

function AboutTab() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try { const data = await apiFetch("/site-content"); setContent(data); setEdits(data); }
    finally { setLoading(false); }
  }
  async function saveKey(key: string) {
    setSaving(key);
    try {
      await apiFetch(`/site-content/${key}`, { method: "PUT", body: JSON.stringify({ value: edits[key] ?? "" }) });
      setContent(c => ({ ...c, [key]: edits[key] ?? "" }));
      setSaved(key); setTimeout(() => setSaved(null), 2000);
    } finally { setSaving(null); }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>About Us & Speeches</h2>
        <p className="text-sm text-gray-500 mt-1">Edit each field and click Save to update the website immediately.</p>
      </div>
      <div className="space-y-6">
        {ABOUT_KEYS.map(({ key, label, multiline }) => {
          const isDirty = (edits[key] ?? "") !== (content[key] ?? "");
          const isSaving = saving === key;
          const isSaved = saved === key;
          return (
            <div key={key} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-gray-700">{label}</label>
                <Btn small onClick={() => saveKey(key)} disabled={isSaving || !isDirty}>
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isSaved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {isSaved ? "Saved!" : "Save"}
                </Btn>
              </div>
              {multiline
                ? <textarea className={textareaCls} rows={4} value={edits[key] ?? ""} onChange={e => setEdits(ed => ({ ...ed, [key]: e.target.value }))} />
                : <input className={inputCls} value={edits[key] ?? ""} onChange={e => setEdits(ed => ({ ...ed, [key]: e.target.value }))} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shared Academic Constants ────────────────────────────────────────────────

const CLASS_OPTIONS = ["Creche","Toddler","Nursery 1","Nursery 2","Kindergarten","Primary 1","Primary 2","Primary 3","Primary 4","Primary 5"];
const TERM_OPTIONS  = ["First Term","Second Term","Third Term"];
const CURRENT_YEAR  = "2025/2026";
const CLASS_ORDER   = CLASS_OPTIONS;

const RESULT_SUBJECTS = [
  "English Language","Mathematics","Basic Science","Social Studies","CRS / Islamic Studies",
  "Yoruba Language","Cultural & Creative Arts","Physical Education","Computer Studies",
  "Vocational Aptitude","Handwriting","Verbal Reasoning","Quantitative Reasoning",
];

// ─── Results Tab ──────────────────────────────────────────────────────────────

type StudentRow = { id: number; firstName: string; lastName: string; email: string; classLevel: string };
type ScoreMap   = Record<number, Record<string, { ca1: string; ca2: string; exam: string }>>;

function ResultsTab() {
  const [cls, setCls] = useState(CLASS_OPTIONS[5]);
  const [term, setTerm] = useState(TERM_OPTIONS[2]);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [scores, setScores] = useState<ScoreMap>({});
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [promoteCls, setPromoteCls] = useState(CLASS_OPTIONS[0]);
  const [promoting, setPromoting] = useState(false);
  const [promoteResult, setPromoteResult] = useState("");

  async function load() {
    setLoading(true); setSaved(false);
    try {
      const [studs, existing] = await Promise.all([
        apiFetch(`/student/list?classLevel=${encodeURIComponent(cls)}`),
        apiFetch(`/results?classLevel=${encodeURIComponent(cls)}&term=${encodeURIComponent(term)}&academicYear=${encodeURIComponent(year)}`),
      ]);
      setStudents(studs);
      const map: ScoreMap = {};
      for (const s of studs as StudentRow[]) map[s.id] = {};
      for (const r of existing as { studentAccountId: number; subject: string; ca1Score: number; ca2Score: number; examScore: number }[]) {
        if (!map[r.studentAccountId]) map[r.studentAccountId] = {};
        map[r.studentAccountId][r.subject] = { ca1: String(r.ca1Score ?? 0), ca2: String(r.ca2Score ?? 0), exam: String(r.examScore ?? 0) };
      }
      setScores(map);
    } finally { setLoading(false); }
  }

  function setScore(sid: number, subj: string, field: "ca1" | "ca2" | "exam", val: string) {
    setScores(prev => {
      const copy = { ...prev, [sid]: { ...(prev[sid] ?? {}), [subj]: { ...(prev[sid]?.[subj] ?? { ca1: "", ca2: "", exam: "" }), [field]: val } } };
      return copy;
    });
  }

  async function saveAll() {
    setSaving(true); setSaved(false);
    try {
      const entries = students.map(s => ({
        studentAccountId: s.id, term, academicYear: year, classLevel: cls,
        subjects: RESULT_SUBJECTS
          .map(subj => {
            const sc = scores[s.id]?.[subj] ?? { ca1: "", ca2: "", exam: "" };
            return { subject: subj, ca1Score: Number(sc.ca1) || 0, ca2Score: Number(sc.ca2) || 0, examScore: Number(sc.exam) || 0 };
          })
          .filter(s => s.ca1Score || s.ca2Score || s.examScore),
      }));
      await apiFetch("/results/bulk", { method: "PUT", body: JSON.stringify(entries) });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  async function promote() {
    const nextIdx = CLASS_ORDER.indexOf(promoteCls) + 1;
    if (nextIdx >= CLASS_ORDER.length) return;
    setPromoting(true); setPromoteResult("");
    try {
      const res = await apiFetch("/student/promote", { method: "POST", body: JSON.stringify({ fromClass: promoteCls, toClass: CLASS_ORDER[nextIdx] }) });
      setPromoteResult(`✅ ${res.count ?? 0} student(s) promoted to ${CLASS_ORDER[nextIdx]}`);
    } catch { setPromoteResult("❌ Promotion failed. Try again."); }
    finally { setPromoting(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Results</h2>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Class</label>
          <select className={inputCls} value={cls} onChange={e => setCls(e.target.value)}>{CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Term</label>
          <select className={inputCls} value={term} onChange={e => setTerm(e.target.value)}>{TERM_OPTIONS.map(t => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="w-28">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
          <input className={inputCls} value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <Btn onClick={load} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Load Students
        </Btn>
      </div>

      {students.length === 0 && !loading && <EmptyState icon="🎓" text='Select class, term & year then click "Load Students"' />}
      {loading && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>}

      {students.length > 0 && !loading && (
        <>
          <div className="space-y-2 mb-5">
            {students.map(s => {
              const isOpen = expanded === s.id;
              const subScores = scores[s.id] ?? {};
              return (
                <div key={s.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button onClick={() => setExpanded(isOpen ? null : s.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: NAVY }}>
                      {(s.firstName[0] + s.lastName[0]).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{s.firstName} {s.lastName}</div>
                      <div className="text-xs text-gray-400">{s.email}</div>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 pb-4">
                      <div className="overflow-x-auto mt-3">
                        <table className="w-full text-sm min-w-[620px]">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase w-44">Subject</th>
                              <th className="px-3 py-2 text-center text-xs font-bold text-gray-500 uppercase w-24">1st CA (15)</th>
                              <th className="px-3 py-2 text-center text-xs font-bold text-gray-500 uppercase w-24">2nd CA (15)</th>
                              <th className="px-3 py-2 text-center text-xs font-bold text-gray-500 uppercase w-24">Exam (70)</th>
                              <th className="px-3 py-2 text-center text-xs font-bold text-gray-500 uppercase w-20">Total</th>
                              <th className="px-3 py-2 text-center text-xs font-bold text-gray-500 uppercase w-16">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {RESULT_SUBJECTS.map(subj => {
                              const sc = subScores[subj] ?? { ca1: "", ca2: "", exam: "" };
                              const ca1 = Number(sc.ca1) || 0;
                              const ca2 = Number(sc.ca2) || 0;
                              const exam = Number(sc.exam) || 0;
                              const total = ca1 + ca2 + exam;
                              const grade = total >= 70 ? "A" : total >= 60 ? "B" : total >= 50 ? "C" : total >= 45 ? "D" : (ca1 || ca2 || exam) ? "F" : "—";
                              const gradeColor = grade === "A" ? "#16a34a" : grade === "B" ? "#2563eb" : grade === "C" ? "#d97706" : grade === "F" ? RED : "#6b7280";
                              return (
                                <tr key={subj} className="border-t border-gray-100">
                                  <td className="px-3 py-1.5 text-gray-700 text-xs">{subj}</td>
                                  <td className="px-3 py-1.5 text-center">
                                    <input type="number" min={0} max={15} value={sc.ca1}
                                      onChange={e => setScore(s.id, subj, "ca1", e.target.value)}
                                      className="w-14 border border-gray-200 rounded px-2 py-1 text-center text-xs focus:outline-none focus:border-[#1a237e]" />
                                  </td>
                                  <td className="px-3 py-1.5 text-center">
                                    <input type="number" min={0} max={15} value={sc.ca2}
                                      onChange={e => setScore(s.id, subj, "ca2", e.target.value)}
                                      className="w-14 border border-gray-200 rounded px-2 py-1 text-center text-xs focus:outline-none focus:border-[#1a237e]" />
                                  </td>
                                  <td className="px-3 py-1.5 text-center">
                                    <input type="number" min={0} max={70} value={sc.exam}
                                      onChange={e => setScore(s.id, subj, "exam", e.target.value)}
                                      className="w-14 border border-gray-200 rounded px-2 py-1 text-center text-xs focus:outline-none focus:border-[#1a237e]" />
                                  </td>
                                  <td className="px-3 py-1.5 text-center font-bold text-sm" style={{ color: gradeColor }}>{ca1 || ca2 || exam ? total : "—"}</td>
                                  <td className="px-3 py-1.5 text-center"><span className="text-xs font-bold" style={{ color: gradeColor }}>{grade}</span></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{students.length} student{students.length !== 1 ? "s" : ""} · {term} · {year}</p>
            <Btn onClick={saveAll} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save All Results"}
            </Btn>
          </div>
        </>
      )}

      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-900 mb-1 flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Class Promotion</h3>
        <p className="text-xs text-amber-700 mb-4">After Third Term, promote all students in a class to the next level.</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-amber-800 mb-1">Class to Promote</label>
            <select className={inputCls} value={promoteCls} onChange={e => setPromoteCls(e.target.value)}>
              {CLASS_ORDER.slice(0, -1).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <Btn variant="danger" onClick={promote} disabled={promoting}>
            {promoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
            Promote to {CLASS_ORDER[CLASS_ORDER.indexOf(promoteCls) + 1] ?? "—"}
          </Btn>
        </div>
        {promoteResult && <p className="mt-3 text-sm font-semibold" style={{ color: promoteResult.startsWith("✅") ? "#166534" : RED }}>{promoteResult}</p>}
      </div>
    </div>
  );
}

// ─── Attendance Tab ───────────────────────────────────────────────────────────

type AttendanceEntry = { status: "present" | "absent" | "late"; remark: string };

function AttendanceTab() {
  const [cls, setCls] = useState(CLASS_OPTIONS[5]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [term, setTerm] = useState(TERM_OPTIONS[2]);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [attendance, setAttendance] = useState<Record<number, AttendanceEntry>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true); setSaved(false);
    try {
      const [studs, existing] = await Promise.all([
        apiFetch(`/student/list?classLevel=${encodeURIComponent(cls)}`),
        apiFetch(`/attendance?classLevel=${encodeURIComponent(cls)}&date=${date}`),
      ]);
      setStudents(studs);
      const map: Record<number, AttendanceEntry> = {};
      for (const s of studs) map[s.id] = { status: "present", remark: "" };
      for (const e of existing as { studentAccountId: number; status: string; remark: string }[]) {
        if (map[e.studentAccountId]) map[e.studentAccountId] = { status: e.status as AttendanceEntry["status"], remark: e.remark ?? "" };
      }
      setAttendance(map);
    } finally { setLoading(false); }
  }

  function setStatus(id: number, status: AttendanceEntry["status"]) { setAttendance(prev => ({ ...prev, [id]: { ...(prev[id] ?? { status: "present", remark: "" }), status } })); }
  function setRemark(id: number, remark: string) { setAttendance(prev => ({ ...prev, [id]: { ...(prev[id] ?? { status: "present", remark: "" }), remark } })); }

  async function save() {
    setSaving(true); setSaved(false);
    try {
      await apiFetch("/attendance/bulk", { method: "PUT", body: JSON.stringify({
        date, term, academicYear: year, classLevel: cls,
        entries: students.map(s => ({ studentAccountId: s.id, status: attendance[s.id]?.status ?? "present", remark: attendance[s.id]?.remark ?? "" })),
      }) });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  const statusCfg = {
    present: { label: "Present", bg: "#d1fae5", color: "#166534" },
    absent:  { label: "Absent",  bg: "#fee2e2", color: "#991b1b" },
    late:    { label: "Late",    bg: "#fef3c7", color: "#92400e" },
  } as const;

  const counts = students.reduce((acc, s) => { const st = attendance[s.id]?.status ?? "present"; acc[st] = (acc[st] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Attendance</h2>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Class</label>
          <select className={inputCls} value={cls} onChange={e => setCls(e.target.value)}>{CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
          <input type="date" className={inputCls} value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Term</label>
          <select className={inputCls} value={term} onChange={e => setTerm(e.target.value)}>{TERM_OPTIONS.map(t => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="w-28">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
          <input className={inputCls} value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <Btn onClick={load} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Load</Btn>
      </div>
      {students.length === 0 && !loading && <EmptyState icon="📋" text='Select class & date then click "Load"' />}
      {loading && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>}
      {students.length > 0 && !loading && (
        <>
          <div className="flex gap-3 mb-4">
            {(["present","absent","late"] as const).map(st => (
              <div key={st} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: statusCfg[st].bg, color: statusCfg[st].color }}>
                {statusCfg[st].label}: {counts[st] ?? 0}
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Remark</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => {
                  const a = attendance[s.id] ?? { status: "present" as const, remark: "" };
                  return (
                    <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-3"><div className="font-semibold text-gray-900 text-sm">{s.firstName} {s.lastName}</div></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1.5">
                          {(["present","absent","late"] as const).map(st => (
                            <button key={st} onClick={() => setStatus(s.id, st)} className="px-2.5 py-1 rounded-lg text-xs font-bold border-2 transition-all"
                              style={{ borderColor: a.status === st ? statusCfg[st].color : "#e5e7eb", backgroundColor: a.status === st ? statusCfg[st].bg : "white", color: a.status === st ? statusCfg[st].color : "#9ca3af" }}>
                              {statusCfg[st].label}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#1a237e]"
                          value={a.remark} onChange={e => setRemark(s.id, e.target.value)} placeholder="Optional note…" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{students.length} student{students.length !== 1 ? "s" : ""} · {new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
            <Btn onClick={save} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save Attendance"}
            </Btn>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Timetable Tab ────────────────────────────────────────────────────────────

type TRow = { timeSlot: string; monday: string; tuesday: string; wednesday: string; thursday: string; friday: string; displayOrder: number; isBreak: number; timetableType: string };
const DAYS_COLS: { key: keyof TRow; label: string }[] = [
  { key: "monday", label: "Monday" }, { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" }, { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
];
const EMPTY_ROW: TRow = { timeSlot: "", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", displayOrder: 0, isBreak: 0, timetableType: "class" };
const TIMETABLE_TYPES = [{ value: "class", label: "Class Schedule" }, { value: "test", label: "Test Timetable" }, { value: "exam", label: "Exam Timetable" }];

function TimetableTab() {
  const [cls, setCls] = useState(CLASS_OPTIONS[5]);
  const [timetableType, setTimetableType] = useState("class");
  const [rows, setRows] = useState<TRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true); setSaved(false);
    try {
      const data = await apiFetch(`/timetable?classLevel=${encodeURIComponent(cls)}&timetableType=${encodeURIComponent(timetableType)}`);
      setRows((data as TRow[]).map((r, i) => ({ ...EMPTY_ROW, ...r, timetableType, displayOrder: i })));
    } finally { setLoading(false); }
  }

  function updateRow(i: number, field: keyof TRow, val: string | number) { setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r)); }
  function addRow() { setRows(prev => [...prev, { ...EMPTY_ROW, timetableType, displayOrder: prev.length }]); }
  function removeRow(i: number) { setRows(prev => prev.filter((_, idx) => idx !== i).map((r, idx) => ({ ...r, displayOrder: idx }))); }

  async function save() {
    setSaving(true); setSaved(false);
    try {
      await apiFetch("/timetable", { method: "PUT", body: JSON.stringify({ classLevel: cls, timetableType, rows: rows.map((r, i) => ({ ...r, displayOrder: i })) }) });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Timetable Editor</h2>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Class</label>
          <select className={inputCls} value={cls} onChange={e => setCls(e.target.value)}>{CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Timetable Type</label>
          <select className={inputCls} value={timetableType} onChange={e => setTimetableType(e.target.value)}>
            {TIMETABLE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <Btn onClick={load} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Load Timetable</Btn>
      </div>
      {rows.length === 0 && !loading && <EmptyState icon="📅" text='Select class, type and click "Load Timetable"' />}
      {loading && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>}
      {rows.length > 0 && !loading && (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[750px]">
                <thead>
                  <tr style={{ backgroundColor: NAVY }}>
                    <th className="px-3 py-3 text-left text-xs font-bold text-blue-200 w-32">Time Slot</th>
                    {DAYS_COLS.map(d => <th key={d.key as string} className="px-3 py-3 text-left text-xs font-bold text-blue-200">{d.label}</th>)}
                    <th className="px-3 py-3 text-center text-xs font-bold text-blue-200 w-20">Break?</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={row.isBreak ? "bg-amber-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-2 py-1.5 border-r border-gray-100">
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#1a237e]" value={row.timeSlot} onChange={e => updateRow(i, "timeSlot", e.target.value)} placeholder="e.g. 8:00 – 9:00" />
                      </td>
                      {DAYS_COLS.map(d => (
                        <td key={d.key as string} className="px-2 py-1.5 border-r border-gray-100">
                          <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#1a237e]" value={row[d.key] as string} onChange={e => updateRow(i, d.key, e.target.value)} />
                        </td>
                      ))}
                      <td className="px-2 py-1.5 text-center border-r border-gray-100">
                        <input type="checkbox" checked={!!row.isBreak} onChange={e => updateRow(i, "isBreak", e.target.checked ? 1 : 0)} className="w-4 h-4 cursor-pointer" />
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button onClick={() => removeRow(i)} className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50"><X className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Btn variant="outline" onClick={addRow}><Plus className="w-4 h-4" /> Add Row</Btn>
            <Btn onClick={save} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save Timetable"}
            </Btn>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Notices Tab ──────────────────────────────────────────────────────────────

type Notice = { id: number; title: string; body: string; type: string; publishedAt: string };
const NOTICE_TYPES = ["general","exam","event","finance","activity"];
const NOTICE_ICON: Record<string, string> = { exam: "📝", event: "🎉", finance: "💰", activity: "✝️", general: "📢" };
const NOTICE_BG:   Record<string, string> = { exam: "#fee2e2", event: "#ede9fe", finance: "#fef3c7", activity: "#d1fae5", general: "#e0f2fe" };
const EMPTY_NOTICE = { title: "", body: "", type: "general", publishedAt: new Date().toISOString().slice(0, 10) };

function NoticesTab() {
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: Notice }>(null);
  const [form, setForm] = useState(EMPTY_NOTICE);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); try { setItems(await apiFetch("/notices")); } finally { setLoading(false); } }
  function openAdd() { setForm(EMPTY_NOTICE); setModal({ mode: "add" }); }
  function openEdit(item: Notice) {
    setForm({ title: item.title, body: item.body, type: item.type, publishedAt: item.publishedAt?.slice(0, 10) ?? "" });
    setModal({ mode: "edit", item });
  }
  async function save() {
    setSaving(true);
    try {
      if (modal?.mode === "add") await apiFetch("/notices", { method: "POST", body: JSON.stringify(form) });
      else if (modal?.item) await apiFetch(`/notices/${modal.item.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setModal(null); load();
    } finally { setSaving(false); }
  }
  async function del(item: Notice) { await apiFetch(`/notices/${item.id}`, { method: "DELETE" }); setDeleteTarget(null); load(); }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>School Notices</h2>
        <Btn onClick={openAdd}><Plus className="w-4 h-4" /> Add Notice</Btn>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        : items.length === 0 ? <EmptyState icon="📢" text="No notices yet. Add your first notice." />
          : <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: NOTICE_BG[item.type] ?? "#e0f2fe" }}>
                    {NOTICE_ICON[item.type] ?? "📢"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full capitalize font-semibold" style={{ backgroundColor: NOTICE_BG[item.type] ?? "#e0f2fe", color: "#374151" }}>{item.type}</span>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""}</p>
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add Notice" : "Edit Notice"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FieldRow label="Title *"><input className={inputCls} value={form.title} onChange={set("title")} placeholder="Notice title…" /></FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Type">
                <select className={inputCls} value={form.type} onChange={set("type")}>
                  {NOTICE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Date"><input type="date" className={inputCls} value={form.publishedAt} onChange={set("publishedAt")} /></FieldRow>
            </div>
            <FieldRow label="Message *"><textarea className={textareaCls} rows={6} value={form.body} onChange={set("body")} placeholder="Write the full notice message here…" /></FieldRow>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Btn variant="outline" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save} disabled={saving || !form.title || !form.body}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </Btn>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete label={deleteTarget.title} onConfirm={() => del(deleteTarget)} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ─── School Fees Tab ──────────────────────────────────────────────────────────

type FeeRow     = { id: number; studentAccountId: number | null; term: string; academicYear: string; classLevel: string; feeType: string; amount: number; amountPaid: number; dueDate: string; notes: string; status: string };
type StudentRow2 = { id: number; firstName: string; lastName: string; email: string };

const FEE_TYPES  = ["Tuition Fee","Development Levy","Exam Fee","Sports Fee","ICT Fee","Uniform Fee","Book Fee","Other"];
const EMPTY_FEE  = { feeType: FEE_TYPES[0], amount: "", amountPaid: "0", dueDate: "", notes: "" };

function SchoolFeesTab() {
  const [cls, setCls]   = useState(CLASS_OPTIONS[5]);
  const [term, setTerm] = useState(TERM_OPTIONS[2]);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [students, setStudents] = useState<StudentRow2[]>([]);
  const [fees, setFees] = useState<FeeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [feeModal, setFeeModal] = useState<null | { mode: "add" | "edit"; studentId: number; studentName: string; fee?: FeeRow }>(null);
  const [feeForm, setFeeForm] = useState(EMPTY_FEE);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FeeRow | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [studs, feeData] = await Promise.all([
        apiFetch(`/student/list?classLevel=${encodeURIComponent(cls)}`),
        apiFetch(`/school-fees?classLevel=${encodeURIComponent(cls)}&term=${encodeURIComponent(term)}&academicYear=${encodeURIComponent(year)}`),
      ]);
      setStudents(studs);
      setFees((feeData as { fee: FeeRow }[]).map(r => r.fee));
    } finally { setLoading(false); }
  }

  function getStudentFees(sid: number) { return fees.filter(f => f.studentAccountId === sid); }
  function openAddFee(s: StudentRow2) { setFeeForm(EMPTY_FEE); setFeeModal({ mode: "add", studentId: s.id, studentName: `${s.firstName} ${s.lastName}` }); }
  function openEditFee(s: StudentRow2, fee: FeeRow) {
    setFeeForm({ feeType: fee.feeType, amount: String(fee.amount), amountPaid: String(fee.amountPaid), dueDate: fee.dueDate ?? "", notes: fee.notes ?? "" });
    setFeeModal({ mode: "edit", studentId: s.id, studentName: `${s.firstName} ${s.lastName}`, fee });
  }

  async function saveFee() {
    if (!feeModal) return;
    setSaving(true);
    try {
      const payload = { studentAccountId: feeModal.studentId, term, academicYear: year, classLevel: cls, feeType: feeForm.feeType, amount: Number(feeForm.amount) || 0, amountPaid: Number(feeForm.amountPaid) || 0, dueDate: feeForm.dueDate, notes: feeForm.notes };
      if (feeModal.mode === "add") await apiFetch("/school-fees", { method: "POST", body: JSON.stringify(payload) });
      else if (feeModal.fee) await apiFetch(`/school-fees/${feeModal.fee.id}`, { method: "PUT", body: JSON.stringify(payload) });
      setFeeModal(null); load();
    } finally { setSaving(false); }
  }

  async function delFee(fee: FeeRow) { await apiFetch(`/school-fees/${fee.id}`, { method: "DELETE" }); setDeleteTarget(null); load(); }
  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setFeeForm(f => ({ ...f, [k]: e.target.value }));

  const totalOwed = fees.reduce((s, f) => s + f.amount, 0);
  const totalPaid = fees.reduce((s, f) => s + f.amountPaid, 0);
  const totalOut  = totalOwed - totalPaid;

  const statusCfg: Record<string, { label: string; bg: string; color: string }> = {
    paid:        { label: "Paid",        bg: "#d1fae5", color: "#166534" },
    partial:     { label: "Partial",     bg: "#fef3c7", color: "#92400e" },
    outstanding: { label: "Outstanding", bg: "#fee2e2", color: "#991b1b" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>School Fees</h2>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Class</label>
          <select className={inputCls} value={cls} onChange={e => setCls(e.target.value)}>{CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="flex-1 min-w-[130px]">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Term</label>
          <select className={inputCls} value={term} onChange={e => setTerm(e.target.value)}>{TERM_OPTIONS.map(t => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="w-28">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Year</label>
          <input className={inputCls} value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <Btn onClick={load} disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Load</Btn>
      </div>
      {students.length === 0 && !loading && <EmptyState icon="💰" text='Select class, term & year then click "Load"' />}
      {loading && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>}
      {students.length > 0 && !loading && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Total Owed",  value: `₦${totalOwed.toLocaleString()}`,  color: NAVY,     bg: "#f0f4ff" },
              { label: "Total Paid",  value: `₦${totalPaid.toLocaleString()}`,  color: "#166534", bg: "#d1fae5" },
              { label: "Outstanding", value: `₦${totalOut.toLocaleString()}`,   color: "#991b1b", bg: "#fee2e2" },
            ].map(c => (
              <div key={c.label} className="rounded-xl p-4 border border-gray-200 bg-white shadow-sm text-center">
                <div className="text-xl font-extrabold" style={{ color: c.color }}>{c.value}</div>
                <div className="text-xs font-semibold text-gray-500 mt-1">{c.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {students.map(s => {
              const sf = getStudentFees(s.id);
              const isOpen = expanded === s.id;
              const sOwed = sf.reduce((a, f) => a + f.amount, 0);
              const sPaid = sf.reduce((a, f) => a + f.amountPaid, 0);
              const sOut  = sOwed - sPaid;
              return (
                <div key={s.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button onClick={() => setExpanded(isOpen ? null : s.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: NAVY }}>{(s.firstName[0] + s.lastName[0]).toUpperCase()}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{s.firstName} {s.lastName}</div>
                      <div className="text-xs text-gray-400">{sf.length} record{sf.length !== 1 ? "s" : ""} · {sOut > 0 ? `₦${sOut.toLocaleString()} outstanding` : sf.length > 0 ? "Fully paid" : "No records"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {sOut > 0 && <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">Owing</span>}
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 pb-4">
                      {sf.length > 0 && (
                        <div className="overflow-x-auto mt-3 mb-3">
                          <table className="w-full text-sm min-w-[540px]">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-3 py-2 text-left text-xs font-bold text-gray-500 uppercase">Fee Type</th>
                                <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                                <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 uppercase">Paid</th>
                                <th className="px-3 py-2 text-right text-xs font-bold text-gray-500 uppercase">Balance</th>
                                <th className="px-3 py-2 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-3 py-2 text-center text-xs font-bold text-gray-500 uppercase w-20">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sf.map(fee => {
                                const bal = fee.amount - fee.amountPaid;
                                const cfg = statusCfg[fee.status] ?? statusCfg.outstanding;
                                return (
                                  <tr key={fee.id} className="border-t border-gray-100">
                                    <td className="px-3 py-2 text-gray-700 text-xs">{fee.feeType}</td>
                                    <td className="px-3 py-2 text-right text-xs">₦{fee.amount.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right text-xs text-green-700">₦{fee.amountPaid.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right text-xs font-bold" style={{ color: bal > 0 ? RED : "#166534" }}>₦{bal.toLocaleString()}</td>
                                    <td className="px-3 py-2 text-center">
                                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      <div className="flex justify-center gap-1">
                                        <button onClick={() => openEditFee(s, fee)} className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"><Pencil className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => setDeleteTarget(fee)} className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <Btn small onClick={() => openAddFee(s)}><Plus className="w-3.5 h-3.5" /> Add Fee</Btn>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      {feeModal && (
        <Modal title={`${feeModal.mode === "add" ? "Add" : "Edit"} Fee — ${feeModal.studentName}`} onClose={() => setFeeModal(null)}>
          <div className="space-y-4">
            <FieldRow label="Fee Type">
              <select className={inputCls} value={feeForm.feeType} onChange={setF("feeType")}>{FEE_TYPES.map(t => <option key={t}>{t}</option>)}</select>
            </FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Amount (₦) *"><input type="number" min={0} className={inputCls} value={feeForm.amount} onChange={setF("amount")} /></FieldRow>
              <FieldRow label="Amount Paid (₦)"><input type="number" min={0} className={inputCls} value={feeForm.amountPaid} onChange={setF("amountPaid")} /></FieldRow>
            </div>
            <FieldRow label="Due Date"><input type="date" className={inputCls} value={feeForm.dueDate} onChange={setF("dueDate")} /></FieldRow>
            <FieldRow label="Notes"><textarea className={textareaCls} rows={2} value={feeForm.notes} onChange={setF("notes")} placeholder="Optional notes…" /></FieldRow>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Btn variant="outline" onClick={() => setFeeModal(null)}>Cancel</Btn>
            <Btn onClick={saveFee} disabled={saving || !feeForm.amount}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </Btn>
          </div>
        </Modal>
      )}
      {deleteTarget && <ConfirmDelete label={deleteTarget.feeType} onConfirm={() => delFee(deleteTarget)} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}

// ─── Principal Speech Tab ─────────────────────────────────────────────────────

function PrincipalSpeechTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", author: "The Principal", date: new Date().toISOString().slice(0, 10) });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch("/site-content") as Record<string, string>;
      setForm({
        title:  data.principal_speech_title  ?? "",
        body:   data.principal_speech_body   ?? "",
        author: data.principal_speech_author ?? "The Principal",
        date:   data.principal_speech_date   ?? new Date().toISOString().slice(0, 10),
      });
    } finally { setLoading(false); }
  }
  async function save() {
    setSaving(true); setSaved(false);
    try {
      await Promise.all([
        apiFetch("/site-content/principal_speech_title",  { method: "PUT", body: JSON.stringify({ value: form.title }) }),
        apiFetch("/site-content/principal_speech_body",   { method: "PUT", body: JSON.stringify({ value: form.body }) }),
        apiFetch("/site-content/principal_speech_author", { method: "PUT", body: JSON.stringify({ value: form.author }) }),
        apiFetch("/site-content/principal_speech_date",   { method: "PUT", body: JSON.stringify({ value: form.date }) }),
      ]);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  }
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>Principal's Speech</h2>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5 max-w-2xl">
        <p className="text-sm text-gray-500">This speech will display on the school website under the About / Welcome section.</p>
        <FieldRow label="Speech Title *"><input className={inputCls} value={form.title} onChange={set("title")} placeholder="e.g. Welcome Address – 2025/2026 Academic Year" /></FieldRow>
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Speaker / Author"><input className={inputCls} value={form.author} onChange={set("author")} /></FieldRow>
          <FieldRow label="Date"><input type="date" className={inputCls} value={form.date} onChange={set("date")} /></FieldRow>
        </div>
        <FieldRow label="Speech Content *">
          <textarea className={textareaCls} rows={10} value={form.body} onChange={set("body")} placeholder="Write the full speech here…" />
        </FieldRow>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400">Changes update the school website immediately after saving.</p>
          <Btn onClick={save} disabled={saving || !form.title || !form.body}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Speech"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ role, onLogout }: { role: string; onLogout: () => void }) {
  const roleInfo     = ROLES[role];
  const allowedIds   = roleInfo?.tabs ?? [];
  const visibleTabs  = ALL_TABS.filter(t => allowedIds.includes(t.id));
  const [activeTab, setActiveTab] = useState(visibleTabs[0]?.id ?? "admissions");

  function renderTab() {
    switch (activeTab) {
      case "admissions":       return <AdmissionsTab />;
      case "news":             return <NewsTab />;
      case "events":           return <EventsTab />;
      case "gallery":          return <GalleryTab />;
      case "staff":            return <StaffTab />;
      case "school-life":      return <SchoolLifeTab />;
      case "about":            return <AboutTab />;
      case "results":          return <ResultsTab />;
      case "attendance":       return <AttendanceTab />;
      case "timetable":        return <TimetableTab />;
      case "notices":          return <NoticesTab />;
      case "school-fees":      return <SchoolFeesTab />;
      case "principal-speech": return <PrincipalSpeechTab />;
      default:                 return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-white shadow-md" style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 rounded-full object-contain bg-white p-0.5" />
            <div>
              <div className="font-bold text-base leading-tight">Triple Tee Montessori Academy</div>
              <div className="text-xs text-blue-200">Admin Panel · {roleInfo?.name}</div>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-0 flex gap-0.5 overflow-x-auto">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? "text-white border-yellow-400" : "text-blue-200 border-transparent hover:text-white"}`}>
                <Icon className="w-4 h-4 flex-shrink-0" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderTab()}
      </div>
    </div>
  );
}

// ─── Admin Login Page ─────────────────────────────────────────────────────────

function AdminLoginPage({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [pwd, setPwd]   = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (ROLES[pwd]) { setError(""); onLogin(pwd); }
    else { setError("Incorrect password. Please try again."); setPwd(""); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #0d1b5e 0%, #1a237e 50%, #0e7490 100%)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.jpeg" alt="Logo" className="w-20 h-20 rounded-full border-4 object-contain" style={{ borderColor: NAVY + "22" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-center mb-1" style={{ color: NAVY }}>Admin Login</h1>
        <p className="text-center text-gray-400 text-sm mb-8">Triple Tee Montessori Academy</p>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={pwd} onChange={e => setPwd(e.target.value)}
                placeholder="Enter your admin password" required autoComplete="current-password"
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a237e]/30 focus:border-[#1a237e] transition-all" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <XCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          <button type="submit" className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-all" style={{ backgroundColor: NAVY }}>
            Sign In
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Different roles use different passwords. Contact the Head Admin if you've lost your password.</p>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(() => {
    try { return sessionStorage.getItem(ADMIN_SESSION_KEY); } catch { return null; }
  });

  function handleLogin(pwd: string) {
    try { sessionStorage.setItem(ADMIN_SESSION_KEY, pwd); } catch {}
    setRole(pwd);
  }

  function handleLogout() {
    try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch {}
    setRole(null);
  }

  if (!role || !ROLES[role]) return <AdminLoginPage onLogin={handleLogin} />;
  return <AdminDashboard role={role} onLogout={handleLogout} />;
}

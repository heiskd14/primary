import { useState, useEffect } from "react";
import { useListAdmissions, useUpdateAdmissionStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListAdmissionsQueryKey } from "@workspace/api-client-react";
import {
  LogOut, Eye, EyeOff, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  Loader2, RefreshCw, Plus, Pencil, Trash2, X, Save, Newspaper, ImageIcon,
  Users, Calendar, BookOpen, Info,
} from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";
const ADMIN_PASSWORD = "king2024";

const API = "/api";

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

type Admission = {
  id: number; childFirstName: string; childLastName: string; childDob: string;
  childGender: string; classApplyingFor: string; previousSchool?: string | null;
  parentName: string; parentRelationship: string; parentPhone: string;
  parentPhone2?: string | null; parentEmail?: string | null; parentAddress: string;
  howDidYouHear?: string | null; additionalInfo?: string | null;
  status: string; submittedAt: string;
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a237e] transition-colors";
const textareaCls = `${inputCls} resize-none`;

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
  const styles = {
    primary: `text-white hover:opacity-90`,
    danger: `text-white hover:opacity-90`,
    ghost: `text-gray-600 hover:bg-gray-100`,
    outline: `border border-gray-300 text-gray-700 hover:bg-gray-50`,
  };
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

  const date = new Date(admission.submittedAt).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const cfg = STATUS_CONFIG[admission.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-gray-900">{admission.childFirstName} {admission.childLastName}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ color: cfg.color, backgroundColor: cfg.bg }}>{cfg.icon} {cfg.label}</span>
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
                {[["Full Name", `${admission.childFirstName} ${admission.childLastName}`],
                  ["DOB", admission.childDob], ["Gender", admission.childGender],
                  ["Class", admission.classApplyingFor], ["Prev School", admission.previousSchool || "None"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="text-gray-500 w-28 flex-shrink-0">{k}</dt>
                    <dd className="text-gray-900 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: NAVY }}>Parent</h4>
              <dl className="space-y-1.5 text-sm">
                {[["Name", admission.parentName], ["Relationship", admission.parentRelationship],
                  ["Phone", admission.parentPhone], ["2nd Phone", admission.parentPhone2 || "—"],
                  ["Email", admission.parentEmail || "—"], ["Address", admission.parentAddress],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="text-gray-500 w-28 flex-shrink-0">{k}</dt>
                    <dd className="text-gray-900 font-medium">{v}</dd>
                  </div>
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
            {["pending", "reviewed", "accepted", "rejected"].map((s) => {
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
        <button onClick={() => refetch()} disabled={isRefetching}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[{ key: "all", label: "Total", color: NAVY, bg: "#f0f4ff" },
          { key: "pending", label: "Pending", color: "#92400e", bg: "#fef3c7" },
          { key: "accepted", label: "Accepted", color: "#166534", bg: "#dcfce7" },
          { key: "rejected", label: "Rejected", color: "#991b1b", bg: "#fee2e2" },
        ].map(c => (
          <div key={c.key} className="rounded-xl p-4 border border-gray-200 bg-white shadow-sm text-center">
            <div className="text-3xl font-extrabold" style={{ color: c.color }}>{counts[c.key] ?? 0}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {["all", "pending", "reviewed", "accepted", "rejected"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors border"
            style={{ backgroundColor: statusFilter === s ? NAVY : "white", color: statusFilter === s ? "white" : "#374151", borderColor: statusFilter === s ? NAVY : "#e5e7eb" }}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s] ?? 0})
          </button>
        ))}
      </div>
      {isLoading ? <div className="flex items-center justify-center py-20 text-gray-400 gap-3"><Loader2 className="w-6 h-6 animate-spin" /> Loading...</div>
        : filtered.length === 0 ? <EmptyState icon="📋" text={`No applications${statusFilter !== "all" ? ` with status "${statusFilter}"` : " yet"}`} />
          : <div className="space-y-3">{filtered.map(a => (
            <AdmissionRow key={a.id} admission={{ ...a, status: getStatus(a) }}
              onStatusChange={(id, status) => setLocalStatuses(p => ({ ...p, [id]: status }))} />
          ))}</div>}
    </div>
  );
}

// ─── News Tab ─────────────────────────────────────────────────────────────────

type NewsItem = { id: number; title: string; excerpt: string; content: string; category: string; author: string; imageUrl: string; publishedAt: string };

const NEWS_CATEGORIES = ["Achievement", "School Life", "Events", "Curriculum", "Community"];
const EMPTY_NEWS = { title: "", excerpt: "", content: "", category: NEWS_CATEGORIES[0], author: "", imageUrl: "" };

function NewsTab() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: NewsItem }>(null);
  const [form, setForm] = useState(EMPTY_NEWS);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try { setItems(await apiFetch("/news?limit=100")); } finally { setLoading(false); }
  }

  function openAdd() { setForm(EMPTY_NEWS); setModal({ mode: "add" }); }
  function openEdit(item: NewsItem) { setForm({ title: item.title, excerpt: item.excerpt, content: item.content, category: item.category, author: item.author, imageUrl: item.imageUrl }); setModal({ mode: "edit", item }); }

  async function save() {
    setSaving(true);
    try {
      if (modal?.mode === "add") {
        await apiFetch("/news", { method: "POST", body: JSON.stringify(form) });
      } else if (modal?.item) {
        await apiFetch(`/news/${modal.item.id}`, { method: "PATCH", body: JSON.stringify(form) });
      }
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function del(item: NewsItem) {
    await apiFetch(`/news/${item.id}`, { method: "DELETE" });
    setDeleteTarget(null); load();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>News Articles</h2>
        <Btn onClick={openAdd}><Plus className="w-4 h-4" /> Add Article</Btn>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        : items.length === 0 ? <EmptyState icon="📰" text="No news articles yet" />
          : <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-start">
                {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
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
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-1">By {item.author} · {new Date(item.publishedAt).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
            ))}
          </div>}

      {modal && (
        <Modal title={modal.mode === "add" ? "Add News Article" : "Edit News Article"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <FieldRow label="Title *"><input className={inputCls} value={form.title} onChange={set("title")} /></FieldRow>
            <div className="grid grid-cols-2 gap-3">
              <FieldRow label="Category">
                <select className={inputCls} value={form.category} onChange={set("category")}>
                  {NEWS_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Author *"><input className={inputCls} value={form.author} onChange={set("author")} /></FieldRow>
            </div>
            <FieldRow label="Excerpt *"><textarea className={textareaCls} rows={2} value={form.excerpt} onChange={set("excerpt")} /></FieldRow>
            <FieldRow label="Full Content *"><textarea className={textareaCls} rows={5} value={form.content} onChange={set("content")} /></FieldRow>
            <FieldRow label="Image URL"><input className={inputCls} value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." /></FieldRow>
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
const EVENT_CATEGORIES = ["Academic", "Sports", "Cultural", "Religious", "Community", "Holiday", "Other"];
const EMPTY_EVENT = { title: "", description: "", date: "", time: "", location: "", category: EVENT_CATEGORIES[0] };

function EventsTab() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: EventItem }>(null);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try { setItems(await apiFetch("/events?limit=100")); } finally { setLoading(false); }
  }

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

  async function del(item: EventItem) {
    await apiFetch(`/events/${item.id}`, { method: "DELETE" });
    setDeleteTarget(null); load();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: NAVY }}>School Events & Speeches</h2>
        <Btn onClick={openAdd}><Plus className="w-4 h-4" /> Add Event</Btn>
      </div>
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
        : items.length === 0 ? <EmptyState icon="📅" text="No events yet" />
          : <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 rounded-lg text-center text-white py-2" style={{ backgroundColor: NAVY }}>
                  <div className="text-base font-extrabold leading-tight">{new Date(item.date).getDate() || item.date.slice(8, 10)}</div>
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
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.description}</p>
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
              <FieldRow label="Category">
                <select className={inputCls} value={form.category} onChange={set("category")}>
                  {EVENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </FieldRow>
            </div>
            <FieldRow label="Description"><textarea className={textareaCls} rows={3} value={form.description} onChange={set("description")} /></FieldRow>
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
const GALLERY_CATEGORIES = ["Achievement", "School Life", "Arts", "Sport", "Events", "Curriculum", "Community"];
const EMPTY_GALLERY = { title: "", imageUrl: "", category: GALLERY_CATEGORIES[0] };

function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: GalleryItem }>(null);
  const [form, setForm] = useState(EMPTY_GALLERY);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try { setItems(await apiFetch("/gallery?limit=200")); } finally { setLoading(false); }
  }

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

  async function del(item: GalleryItem) {
    await apiFetch(`/gallery/${item.id}`, { method: "DELETE" });
    setDeleteTarget(null); load();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

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
                  onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x150?text=No+Image"; }} />
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
            <FieldRow label="Title *"><input className={inputCls} value={form.title} onChange={set("title")} /></FieldRow>
            <FieldRow label="Image URL *">
              <input className={inputCls} value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." />
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-28 rounded-lg object-cover w-full border" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
            </FieldRow>
            <FieldRow label="Category">
              <select className={inputCls} value={form.category} onChange={set("category")}>
                {GALLERY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
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
const DEPARTMENTS = ["Management", "Teaching", "Support", "Administration"];
const EMPTY_STAFF = { name: "", role: "", department: DEPARTMENTS[1], bio: "", photoUrl: "", displayOrder: 0 };

function StaffTab() {
  const [items, setItems] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; item?: StaffMember }>(null);
  const [form, setForm] = useState<typeof EMPTY_STAFF>(EMPTY_STAFF);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    try { setItems(await apiFetch("/staff")); } finally { setLoading(false); }
  }

  function openAdd() { setForm(EMPTY_STAFF); setModal({ mode: "add" }); }
  function openEdit(item: StaffMember) {
    setForm({ name: item.name, role: item.role, department: item.department, bio: item.bio, photoUrl: item.photoUrl, displayOrder: item.displayOrder });
    setModal({ mode: "edit", item });
  }

  async function save() {
    setSaving(true);
    try {
      if (modal?.mode === "add") await apiFetch("/staff", { method: "POST", body: JSON.stringify(form) });
      else if (modal?.item) await apiFetch(`/staff/${modal.item.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function del(item: StaffMember) {
    await apiFetch(`/staff/${item.id}`, { method: "DELETE" });
    setDeleteTarget(null); load();
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: k === "displayOrder" ? Number(e.target.value) : e.target.value }));

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
                  : <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl" style={{ backgroundColor: "#f0f4ff" }}>👤</div>
                }
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
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.bio}</p>
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
              <FieldRow label="Department">
                <select className={inputCls} value={form.department} onChange={set("department")}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </FieldRow>
            </div>
            <FieldRow label="Bio *"><textarea className={textareaCls} rows={3} value={form.bio} onChange={set("bio")} /></FieldRow>
            <FieldRow label="Photo URL">
              <input className={inputCls} value={form.photoUrl} onChange={set("photoUrl")} placeholder="https://..." />
              {form.photoUrl && <img src={form.photoUrl} alt="preview" className="mt-2 w-16 h-16 rounded-full object-cover border" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
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
type Club = { id: number; name: string; timeSlot: string; yearGroup: string; icon: string; displayOrder: number };
const EMPTY_SUBJECT = { name: "", emoji: "📚", description: "", displayOrder: 0 };
const EMPTY_CLUB = { name: "", timeSlot: "", yearGroup: "", icon: "⭐", displayOrder: 0 };

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
    try {
      const [s, c] = await Promise.all([apiFetch("/school-life/subjects"), apiFetch("/school-life/clubs")]);
      setSubjects(s); setClubs(c);
    } finally { setLoading(false); }
  }

  const setS = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSubjectForm(f => ({ ...f, [k]: k === "displayOrder" ? Number(e.target.value) : e.target.value }));
  const setC = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setClubForm(f => ({ ...f, [k]: k === "displayOrder" ? Number(e.target.value) : e.target.value }));

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
      {/* Subjects */}
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
                    <button onClick={() => { setSubjectForm({ name: s.name, emoji: s.emoji, description: s.description, displayOrder: s.displayOrder }); setSubjectModal({ mode: "edit", item: s }); }}
                      className="p-1 bg-white border border-gray-200 rounded text-blue-600 shadow-sm"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => setDeleteTarget({ type: "subject", item: s })}
                      className="p-1 bg-white border border-gray-200 rounded text-red-600 shadow-sm"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>}
      </div>

      {/* Clubs */}
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
                  <button onClick={() => { setClubForm({ name: c.name, timeSlot: c.timeSlot, yearGroup: c.yearGroup, icon: c.icon, displayOrder: c.displayOrder }); setClubModal({ mode: "edit", item: c }); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget({ type: "club", item: c })}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>)}
      </div>

      {/* Modals */}
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
              <FieldRow label="Year Group *"><input className={inputCls} value={clubForm.yearGroup} onChange={setC("yearGroup")} placeholder="e.g. Primary 1 – 5" /></FieldRow>
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
  { key: "welcome_text", label: "Welcome / Introduction Text", multiline: true },
  { key: "mission", label: "Our Mission", multiline: true },
  { key: "vision", label: "Our Vision", multiline: true },
  { key: "tagline_text", label: "Our Tagline Text", multiline: true },
  { key: "teachers_text_1", label: "Teachers Section — First Paragraph", multiline: true },
  { key: "teachers_text_2", label: "Teachers Section — Second Paragraph", multiline: true },
  { key: "proprietors_speech", label: "Proprietor's Speech / Message", multiline: true },
  { key: "key_facts", label: "Key Facts (one per line)", multiline: true },
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
    try {
      const data = await apiFetch("/site-content");
      setContent(data); setEdits(data);
    } finally { setLoading(false); }
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
        <p className="text-sm text-gray-500 mt-1">Edit and save each section individually. Changes appear live on the website.</p>
      </div>
      <div className="space-y-6">
        {ABOUT_KEYS.map(({ key, label, multiline }) => (
          <div key={key} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-sm" style={{ color: NAVY }}>{label}</label>
              <button
                onClick={() => saveKey(key)}
                disabled={saving === key}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all disabled:opacity-60"
                style={{ backgroundColor: saved === key ? "#166534" : NAVY }}>
                {saving === key ? <Loader2 className="w-3 h-3 animate-spin" /> : saved === key ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {saved === key ? "Saved!" : "Save"}
              </button>
            </div>
            {multiline
              ? <textarea className={textareaCls} rows={5} value={edits[key] ?? ""}
                  onChange={e => setEdits(d => ({ ...d, [key]: e.target.value }))} />
              : <input className={inputCls} value={edits[key] ?? ""}
                  onChange={e => setEdits(d => ({ ...d, [key]: e.target.value }))} />
            }
            {key === "key_facts" && <p className="text-xs text-gray-400 mt-1">Enter one fact per line.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

const TABS = [
  { id: "admissions", label: "Admissions", icon: <CheckCircle className="w-4 h-4" /> },
  { id: "news", label: "News", icon: <Newspaper className="w-4 h-4" /> },
  { id: "events", label: "Events & Speeches", icon: <Calendar className="w-4 h-4" /> },
  { id: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
  { id: "staff", label: "Staff", icon: <Users className="w-4 h-4" /> },
  { id: "school-life", label: "School Life", icon: <BookOpen className="w-4 h-4" /> },
  { id: "about", label: "About Us", icon: <Info className="w-4 h-4" /> },
];

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("admissions");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-white shadow-md" style={{ backgroundColor: NAVY }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 rounded-full object-contain bg-white p-0.5" />
            <div>
              <div className="font-bold text-base leading-tight">Triple Tee Montessori Academy</div>
              <div className="text-xs text-blue-200">Admin Panel</div>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-0 flex gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap rounded-t-lg transition-colors ${activeTab === tab.id ? "bg-gray-50 text-[#1a237e]" : "text-blue-200 hover:text-white"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "admissions" && <AdmissionsTab />}
        {activeTab === "news" && <NewsTab />}
        {activeTab === "events" && <EventsTab />}
        {activeTab === "gallery" && <GalleryTab />}
        {activeTab === "staff" && <StaffTab />}
        {activeTab === "school-life" && <SchoolLifeTab />}
        {activeTab === "about" && <AboutTab />}
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("ttma_admin", "1"); onLogin(); }
    else { setError(true); setPw(""); }
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
              <input type={show ? "text" : "password"} value={pw} onChange={e => { setPw(e.target.value); setError(false); }}
                placeholder="Enter admin password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none transition-colors"
                onFocus={e => (e.currentTarget.style.borderColor = NAVY)}
                onBlur={e => (e.currentTarget.style.borderColor = error ? "#ef4444" : "")}
                style={error ? { borderColor: "#ef4444" } : {}} autoFocus />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">Incorrect password. Please try again.</p>}
          </div>
          <button type="submit" className="w-full text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: NAVY }}>
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
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("ttma_admin"); setAuthed(false); }} />;
}

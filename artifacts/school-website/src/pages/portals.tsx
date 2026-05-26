import { Link } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import {
  FileText, GraduationCap, Users, Shield, BookOpen, ArrowRight, ShieldCheck,
  LogIn,
} from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";

const portals = [
  {
    title: "Applicant Portal",
    desc: "Apply for admission, check your application status, and manage your enrolment process.",
    icon: FileText,
    iconBg: "#d1fae5",
    iconColor: "#059669",
    borderColor: "#059669",
    href: "/apply",
    cta: "Start Application",
  },
  {
    title: "Student Portal",
    desc: "Access academic records, class timetables, results, and school activities.",
    icon: GraduationCap,
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
    borderColor: "#7c3aed",
    href: "/student-portal",
    cta: "Access Portal",
  },
  {
    title: "Staff Portal",
    desc: "Administrative tools, admission management, profile management, and internal resources.",
    icon: Shield,
    iconBg: "#fee2e2",
    iconColor: "#dc2626",
    borderColor: "#dc2626",
    href: "/admin",
    cta: "Access Portal",
  },
  {
    title: "Parent / Guardian Portal",
    desc: "Monitor your child's academic progress, attendance, and school activities.",
    icon: Users,
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    borderColor: "#d97706",
    href: "#",
    cta: "Access Portal",
    comingSoon: true,
  },
  {
    title: "e-Learning Portal",
    desc: "Online learning resources, assignments, and educational materials for pupils.",
    icon: BookOpen,
    iconBg: "#e0f2fe",
    iconColor: "#0284c7",
    borderColor: "#0284c7",
    href: "#",
    cta: "Access Portal",
    comingSoon: true,
  },
];

export default function Portals() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
              style={{ backgroundColor: "#e0e7ff", color: NAVY }}>
              WELCOME TO
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5" style={{ color: "#111827" }}>
              Triple Tee Montessori<br />Academy Portals
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-lg">
              A secure, easy-to-use online gateway that gives pupils, parents, staff, and applicants convenient access to school services, academic records, and important updates.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/apply"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: NAVY }}>
                <FileText className="w-4 h-4" /> Apply for Admission
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: NAVY, color: NAVY }}>
                Contact Us
              </Link>
            </div>
          </motion.div>

          {/* Right — gateway card */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ede9fe" }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: "#7c3aed" }} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Secure Gateway</p>
                  <p className="text-xs text-gray-400">Unified access to all resources</p>
                </div>
              </div>
              <div className="space-y-3">
                <Link href="/apply"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all group">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#d1fae5" }}>
                    <LogIn className="w-4 h-4" style={{ color: "#059669" }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-violet-700">Applicant Login</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-violet-500" />
                </Link>
                <Link href="/student-portal"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-violet-200 hover:bg-violet-50 transition-all group">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ede9fe" }}>
                    <GraduationCap className="w-4 h-4" style={{ color: "#7c3aed" }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-violet-700">Student Login</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-violet-500" />
                </Link>
                <Link href="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-red-200 hover:bg-red-50 transition-all group">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#fee2e2" }}>
                    <Shield className="w-4 h-4" style={{ color: "#dc2626" }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-red-700">Staff Login</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-red-400" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Choose Your Portal */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3" style={{ color: "#111827" }}>Choose Your Portal</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">Select the portal that best matches your role to access the tools and resources available to you.</p>
          </div>

          {/* Top row — 3 cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {portals.slice(0, 3).map((portal, i) => (
              <PortalCard key={portal.title} portal={portal} delay={i * 0.1} />
            ))}
          </div>

          {/* Bottom row — 2 cards centred */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {portals.slice(3).map((portal, i) => (
              <PortalCard key={portal.title} portal={portal} delay={(i + 3) * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-14 px-6" style={{ background: "linear-gradient(135deg, #1a237e 0%, #0e7490 100%)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl font-extrabold mb-1">Ready to join us?</h3>
            <p className="text-blue-200 text-sm">Start your child's journey today. The application process is simple and takes just a few minutes.</p>
          </div>
          <Link href="/apply"
            className="inline-flex items-center gap-2 bg-white font-bold px-7 py-3.5 rounded-xl text-sm hover:bg-blue-50 transition-colors whitespace-nowrap flex-shrink-0"
            style={{ color: NAVY }}>
            Start Application <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function PortalCard({ portal, delay }: {
  portal: typeof portals[0];
  delay: number;
}) {
  const Icon = portal.icon;
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${portal.comingSoon ? "opacity-75" : ""}`}
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: portal.iconBg }}>
        <Icon className="w-7 h-7" style={{ color: portal.iconColor }} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{portal.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{portal.desc}</p>
      {portal.comingSoon ? (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border"
          style={{ borderColor: "#e5e7eb", color: "#9ca3af" }}>
          Coming Soon
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-colors"
          style={{ borderColor: portal.borderColor, color: portal.borderColor }}>
          {portal.cta} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      )}
    </motion.div>
  );

  if (portal.comingSoon) return content;
  return <Link href={portal.href}>{content}</Link>;
}

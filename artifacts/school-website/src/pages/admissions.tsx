import { motion } from "framer-motion";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { CheckCircle, ChevronRight, Phone, Mail } from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";

const steps = [
  { step: "1", title: "Visit the School", desc: "Come and see our school in person. We welcome prospective families to visit during school hours. Please call ahead to schedule your visit with our office." },
  { step: "2", title: "Collect an Admission Form", desc: "Pick up an admission form from our school office. Forms are available at the beginning of each term. A small administrative fee applies." },
  { step: "3", title: "Submit Completed Form", desc: "Return the completed form with the required documents: birth certificate, immunisation card, previous school report (if applicable), and passport photographs." },
  { step: "4", title: "Entrance Assessment", desc: "Pupils seeking admission into Primary 1 and above will take a brief entrance assessment to help us understand their current learning level and ensure proper class placement." },
  { step: "5", title: "Offer of Place", desc: "If a place is available and your child meets the entry requirements, we will issue an offer letter. You will then be given details of the acceptance fee and first-term school fees." },
  { step: "6", title: "Welcome to Triple Tee!", desc: "Once fees are paid and all documents are submitted, your child is enrolled. Our team will guide you through the uniform, book list, and first-day arrangements." },
];

export default function Admissions() {
  return (
    <Layout>
      <PageHero
        title="Admissions"
        subtitle="How to enrol your child at Triple Tee Montessori Academy"
        breadcrumb="Home / Admissions"
      />

      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-3" style={{ color: NAVY }}>Enrolling Your Child</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            We accept pupils from Creche (6 weeks) through to Junior Secondary School (JSS 3). Admissions are open at the start of each term, subject to availability of places. We encourage parents to apply early to secure a place for their child.
          </p>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-8">
              {steps.map((s, i) => (
                <motion.div key={s.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="relative flex gap-5 pl-2">
                  <div className="flex-shrink-0 w-10 h-10 text-white rounded-full flex items-center justify-center font-extrabold text-lg relative z-10" style={{ backgroundColor: NAVY }}>
                    {s.step}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1 shadow-sm">
                    <h3 className="font-bold mb-1" style={{ color: NAVY }}>{s.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-r-xl p-5 border-l-4" style={{ backgroundColor: "#fff8e7", borderColor: "#C8A55F" }}>
            <h3 className="font-bold mb-2" style={{ color: NAVY }}>Classes We Offer</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Creche (6 weeks – 18 months)",
                "Toddler (18 months – 2 years)",
                "Nursery 1 & 2 (Ages 3 – 4)",
                "Kindergarten (Age 5)",
                "Primary 1 – 6 (Ages 6 – 11)",
                "JSS 1 – 3 (Ages 12 – 14)",
              ].map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: RED }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold mb-3" style={{ color: NAVY }}>Documents Required</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {[
                "Completed admission form",
                "Birth certificate (original & photocopy)",
                "Immunisation card / health records",
                "4 recent passport photographs",
                "Previous school report cards (if any)",
                "Parent/Guardian ID document",
              ].map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: RED }}>✓</span> {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-white rounded-xl p-5" style={{ backgroundColor: NAVY }}>
            <h3 className="font-bold mb-3">Enquire About Admissions</h3>
            <p className="text-sm text-blue-100 mb-4">Have questions? Contact our admissions team directly.</p>
            <a href="tel:+2348012345678" className="flex items-center gap-2 text-sm font-semibold hover:text-white mb-2" style={{ color: "#fca5a5" }}>
              <Phone className="w-4 h-4" /> +234 (0) 801 234 5678
            </a>
            <a href="mailto:admissions@tripletee.edu.ng" className="flex items-center gap-2 text-sm font-semibold hover:text-white" style={{ color: "#fca5a5" }}>
              <Mail className="w-4 h-4" /> admissions@tripletee.edu.ng
            </a>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: "#f0f4ff", border: `1px solid ${NAVY}33` }}>
            <h3 className="font-bold mb-2" style={{ color: NAVY }}>Book a School Visit</h3>
            <p className="text-sm text-gray-600 mb-3">See our school in action before applying. We'd love to show you around.</p>
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: RED }}>
              Book a Visit <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: NAVY }}>What to Expect When You Join</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Warm Welcome", desc: "Our staff will ensure your child settles in smoothly. New pupils are paired with a buddy from their class to help them feel at home from day one." },
              { title: "School Uniform", desc: "We have a neat, affordable school uniform that instils pride and discipline. The full uniform list is provided upon acceptance of a place. Second-hand uniforms may be available." },
              { title: "Ongoing Communication", desc: "We keep parents informed through our termly newsletter, notice board, and direct communication via SMS and WhatsApp. You will always know what is happening." },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <CheckCircle className="w-6 h-6 mb-3" style={{ color: RED }} />
                <h3 className="font-bold mb-2" style={{ color: NAVY }}>{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

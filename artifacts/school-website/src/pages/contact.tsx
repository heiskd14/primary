import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { q: "How do I report my child's absence?", a: "Please call our school office on 01234 567 890 before 9:00am on the day of absence, or email absences@greenfieldprimary.sch.uk. Please do not leave a message with another parent." },
  { q: "How do I book a parent-teacher appointment?", a: "Parents' evening appointments are booked through our online system (ParentMail). You'll receive an email with instructions when appointments open. For urgent concerns, please contact your child's class teacher directly via the school office." },
  { q: "What is the school's policy on mobile phones?", a: "Pupils are not permitted to use mobile phones during the school day. Phones must be switched off and kept in school bags. The school takes no responsibility for personal devices brought onto the premises." },
  { q: "How do I apply for a school place?", a: "Applications for Reception places are made through the London Borough of Islington's website. For in-year transfers, please contact our school office directly. Visit our Admissions page for full details." },
  { q: "Who do I contact about my child's SEND needs?", a: "Please contact Mrs. Fiona Campbell, our SENCo, via the school office on 01234 567 890 or at senco@greenfieldprimary.sch.uk. We are committed to working closely with families to support every child." },
  { q: "How do I find out about school closures or emergencies?", a: "School closures and urgent messages are sent via ParentMail and posted on the school website. Please ensure your contact details are kept up to date with the school office." },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Layout>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you"
        breadcrumb="Home / Contact"
      />

      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-[#1a3c6e] mb-6">Send Us a Message</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Message Received!</h3>
              <p className="text-green-700">Thank you for getting in touch. A member of our team will respond within two working days.</p>
              <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }} className="mt-5 text-sm text-green-700 underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a3c6e] focus:ring-1 focus:ring-[#1a3c6e] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a3c6e] focus:ring-1 focus:ring-[#1a3c6e] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                <select
                  required
                  value={formData.subject}
                  onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a3c6e] focus:ring-1 focus:ring-[#1a3c6e] transition-colors bg-white"
                >
                  <option value="">Select a subject...</option>
                  <option>Admissions Enquiry</option>
                  <option>General Enquiry</option>
                  <option>Attendance & Absence</option>
                  <option>SEND Support</option>
                  <option>Complaint or Concern</option>
                  <option>Book a School Visit</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Please write your message here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a3c6e] focus:ring-1 focus:ring-[#1a3c6e] transition-colors resize-none"
                />
              </div>
              <p className="text-xs text-gray-500">We aim to respond to all enquiries within two working days. For urgent matters, please call us directly.</p>
              <button type="submit" className="w-full bg-[#1a3c6e] text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Details */}
        <div className="space-y-5">
          <div className="bg-[#1a3c6e] text-white rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-5">School Office</h3>
            <div className="space-y-4 text-blue-100 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 text-yellow-300 mt-0.5" />
                <div><div className="font-semibold text-white mb-0.5">Address</div>Greenfield Lane<br />London<br />N1 4PQ</div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-yellow-300 mt-0.5" />
                <div><div className="font-semibold text-white mb-0.5">Telephone</div><a href="tel:01234567890" className="hover:text-white">01234 567 890</a></div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-yellow-300 mt-0.5" />
                <div><div className="font-semibold text-white mb-0.5">Email</div><a href="mailto:info@greenfieldprimary.sch.uk" className="hover:text-white break-all">info@greenfieldprimary.sch.uk</a></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 text-yellow-300 mt-0.5" />
                <div><div className="font-semibold text-white mb-0.5">Office Hours</div>Mon–Fri: 8:00am – 4:30pm<br />(Term time only)</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold text-[#1a3c6e] mb-3">Specific Contacts</h3>
            <ul className="space-y-3 text-sm">
              {[
                { dept: "Admissions", email: "admissions@greenfieldprimary.sch.uk" },
                { dept: "SEND / SENCo", email: "senco@greenfieldprimary.sch.uk" },
                { dept: "Absence Line", email: "absences@greenfieldprimary.sch.uk" },
                { dept: "Finance Office", email: "finance@greenfieldprimary.sch.uk" },
              ].map(c => (
                <li key={c.dept}>
                  <div className="font-semibold text-gray-700">{c.dept}</div>
                  <a href={`mailto:${c.email}`} className="text-[#1a3c6e] hover:underline break-all">{c.email}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 border-t border-gray-200 py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1a3c6e] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-[#1a3c6e] flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";

const faqs = [
  { q: "How do I report my child's absence?", a: "Please call our school office on +234 (0) 801 234 5678 before 7:45am on the day of absence. If your child will be absent for more than one day, please also send a written note on their return." },
  { q: "What are the school fees and when are they due?", a: "School fees are payable at the beginning of each term. The fee schedule is provided upon enrolment and is updated at the start of each academic year. Please contact the school office for the current fee structure." },
  { q: "How do I book a parent-teacher meeting?", a: "Parent-teacher conferences are held at the end of each term. You will be notified by letter or SMS when booking opens. For urgent concerns about your child, please contact the class teacher directly through the school office." },
  { q: "What is the school's policy on mobile phones?", a: "Pupils are not permitted to carry or use mobile phones on school premises during school hours. Phones brought to school must be handed to the class teacher at the start of the day and collected at dismissal." },
  { q: "How do I apply for a place?", a: "Visit our Admissions page for the full step-by-step guide. You can also come to the school office in person to collect an admission form. We welcome new pupils at the beginning of each term." },
  { q: "Who do I contact about a special need or concern about my child?", a: "Please speak directly to your child's class teacher in the first instance. For more complex concerns, you may request an appointment with the school's academic coordinator or the proprietor through the office." },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Layout>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you — reach out any time"
        breadcrumb="Home / Contact"
      />

      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6" style={{ color: NAVY }}>Send Us a Message</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Message Received!</h3>
              <p className="text-green-700">Thank you for getting in touch. A member of our team will get back to you as soon as possible.</p>
              <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }} className="mt-5 text-sm text-green-700 underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="Your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    style={{ outlineColor: NAVY }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} placeholder="+234 XXX XXX XXXX"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                    onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="your.email@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                <select required value={formData.subject} onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors bg-white"
                  onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                >
                  <option value="">Select a subject...</option>
                  <option>Admissions Enquiry</option>
                  <option>General Enquiry</option>
                  <option>School Fees</option>
                  <option>Pupil Welfare / Concern</option>
                  <option>Parent-Teacher Meeting</option>
                  <option>Book a School Visit</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} placeholder="Please write your message here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-colors resize-none"
                  onFocus={(e) => (e.currentTarget.style.borderColor = NAVY)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>
              <button type="submit" className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: NAVY }}>
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Details */}
        <div className="space-y-5">
          <div className="text-white rounded-2xl p-6" style={{ backgroundColor: NAVY }}>
            <h3 className="font-bold text-lg mb-5">School Office</h3>
            <div className="space-y-4 text-blue-100 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#fca5a5" }} />
                <div>
                  <div className="font-semibold text-white mb-0.5">Address</div>
                  Triple Tee Montessori Academy<br />
                  Oke-Ola, Oro<br />
                  Irepodun LGA, Kwara State<br />
                  Nigeria
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#fca5a5" }} />
                <div>
                  <div className="font-semibold text-white mb-0.5">Telephone</div>
                  <a href="tel:+2348012345678" className="hover:text-white">+234 (0) 801 234 5678</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#fca5a5" }} />
                <div>
                  <div className="font-semibold text-white mb-0.5">Email</div>
                  <a href="mailto:info@tripletee.edu.ng" className="hover:text-white">info@tripletee.edu.ng</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#fca5a5" }} />
                <div>
                  <div className="font-semibold text-white mb-0.5">Office Hours</div>
                  Monday – Friday: 7:30am – 3:30pm<br />
                  (Term time only)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-bold mb-3" style={{ color: NAVY }}>Specific Contacts</h3>
            <ul className="space-y-3 text-sm">
              {[
                { dept: "Admissions", email: "admissions@tripletee.edu.ng" },
                { dept: "Academic Affairs", email: "academics@tripletee.edu.ng" },
                { dept: "Accounts / Fees", email: "accounts@tripletee.edu.ng" },
                { dept: "PTA Secretary", email: "pta@tripletee.edu.ng" },
              ].map((c) => (
                <li key={c.dept}>
                  <div className="font-semibold text-gray-700">{c.dept}</div>
                  <a href={`mailto:${c.email}`} className="hover:underline break-all text-sm" style={{ color: NAVY }}>{c.email}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 border-t border-gray-200 py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8" style={{ color: NAVY }}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: NAVY }} />
                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

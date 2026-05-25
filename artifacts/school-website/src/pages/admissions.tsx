import { motion } from "framer-motion";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { CheckCircle, ChevronRight, Phone, Mail } from "lucide-react";

const steps = [
  { step: "1", title: "Check Eligibility", desc: "Our catchment area covers parts of Islington. Use our online postcode checker to see if your address is within our catchment." },
  { step: "2", title: "Apply to Your Local Authority", desc: "Applications for Reception places are made through your local council (London Borough of Islington). Apply online at the council website by 15 January each year." },
  { step: "3", title: "Visit the School", desc: "We hold open mornings throughout the autumn term. Book a tour to see our school in action and ask any questions you may have." },
  { step: "4", title: "Receive Your Offer", desc: "Offers are sent by your local authority on National Offer Day (16 April). If you're offered a place, you'll need to accept it within the deadline." },
  { step: "5", title: "Welcome to Greenfield!", desc: "Once you've accepted, we'll be in touch with transition information, uniform details, and an invitation to our welcome events for new families." },
];

export default function Admissions() {
  return (
    <Layout>
      <PageHero
        title="Admissions"
        subtitle="How to apply for a place at Greenfield Primary School"
        breadcrumb="Home / Admissions"
      />

      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-[#1a3c6e] mb-3">Applying for a Reception Place</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            If your child is due to start primary school, we would love to welcome them to Greenfield Primary. Applications for Reception entry are managed by the London Borough of Islington and follow the national admissions timetable. Below is a step-by-step guide to the process.
          </p>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-blue-100" />
            <div className="space-y-8">
              {steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex gap-5 pl-2"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-[#1a3c6e] text-white rounded-full flex items-center justify-center font-extrabold text-lg relative z-10">
                    {s.step}
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1 shadow-sm">
                    <h3 className="font-bold text-[#1a3c6e] mb-1">{s.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl p-5">
            <h3 className="font-bold text-[#1a3c6e] mb-2">Key Dates 2026–27 Entry</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="font-semibold text-yellow-600 flex-shrink-0">Open Mornings:</span> Oct–Dec 2025</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-yellow-600 flex-shrink-0">Application Deadline:</span> 15 January 2026</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-yellow-600 flex-shrink-0">National Offer Day:</span> 16 April 2026</li>
              <li className="flex items-start gap-2"><span className="font-semibold text-yellow-600 flex-shrink-0">Acceptance Deadline:</span> 30 April 2026</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-[#1a3c6e] mb-3">Our Admissions Policy</h3>
            <p className="text-sm text-gray-600 mb-3">Children with an Education, Health and Care Plan (EHCP) naming our school are admitted first. After this, places are offered according to our oversubscription criteria:</p>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
              <li>Children in local authority care (Looked After Children)</li>
              <li>Siblings of current pupils</li>
              <li>Children of staff members</li>
              <li>Children living closest to the school</li>
            </ol>
          </div>

          <div className="bg-[#1a3c6e] text-white rounded-xl p-5">
            <h3 className="font-bold mb-3">In-Year Admissions</h3>
            <p className="text-sm text-blue-100 mb-4">If you are moving to the area or need to change your child's school mid-year, please contact our school office directly.</p>
            <a href="tel:01234567890" className="flex items-center gap-2 text-yellow-300 text-sm font-semibold hover:text-yellow-200 mb-2">
              <Phone className="w-4 h-4" /> 01234 567 890
            </a>
            <a href="mailto:admissions@greenfieldprimary.sch.uk" className="flex items-center gap-2 text-yellow-300 text-sm font-semibold hover:text-yellow-200">
              <Mail className="w-4 h-4" /> admissions@greenfieldprimary.sch.uk
            </a>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="font-bold text-[#1a3c6e] mb-2">Book a School Tour</h3>
            <p className="text-sm text-gray-600 mb-3">We hold open mornings throughout the autumn term. Come and see our school for yourself.</p>
            <Link href="/contact" className="inline-flex items-center gap-1.5 bg-[#1a3c6e] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              Book a Visit <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1a3c6e] mb-6">What to Expect at Greenfield</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Settling In", desc: "We take great care with transition into school. New Reception pupils join gradually, with phased start arrangements to help every child settle confidently." },
              { title: "Uniform", desc: "We have a smart, affordable uniform. Second-hand items are available through our PTA. Full details are provided upon acceptance of a place." },
              { title: "Communication", desc: "We keep parents informed through our weekly newsletter, ParentMail, and the school website. You'll always know what's happening." },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <CheckCircle className="w-6 h-6 text-green-600 mb-3" />
                <h3 className="font-bold text-[#1a3c6e] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

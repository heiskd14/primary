import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { CheckCircle } from "lucide-react";

function PageHero({ title, subtitle, breadcrumb }: { title: string; subtitle: string; breadcrumb: string }) {
  return (
    <div className="bg-[#1a3c6e] text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-blue-300 text-sm mb-2">{breadcrumb}</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-blue-200 text-lg">{subtitle}</p>
      </div>
    </div>
  );
}

export { PageHero };

export default function About() {
  return (
    <Layout>
      <PageHero
        title="About Greenfield Primary School"
        subtitle="A warm, welcoming school where every child is known and valued"
        breadcrumb="Home / About Us"
      />

      {/* Headteacher welcome */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-[#1a3c6e] mb-5">Welcome from Our Headteacher</h2>
          <div className="prose prose-gray max-w-none text-gray-700 space-y-4 leading-relaxed">
            <p>Welcome to Greenfield Primary School. I am immensely proud to lead this outstanding school and to be part of such a vibrant, caring community. Every day, I see our pupils arrive with enthusiasm and leave with a growing sense of confidence, knowledge, and belonging.</p>
            <p>At Greenfield, we believe that every child deserves the very best education — one that is academically rigorous, creatively stimulating, and rooted in strong values. Our dedicated staff work tirelessly to know each pupil as an individual, to understand their needs, and to unlock their full potential.</p>
            <p>We are incredibly proud of our most recent Ofsted inspection result, where inspectors rated us Outstanding in every single category. But beyond inspection results, what matters most to us is the happiness, wellbeing, and genuine love of learning that we see in our children every day.</p>
            <p>If you are considering Greenfield Primary for your child, I warmly invite you to come and visit us. There is no better way to experience who we are than to see our school in action.</p>
            <p className="font-semibold text-[#1a3c6e]">Mrs. Patricia Okafor, Headteacher</p>
          </div>
        </div>
        <div>
          <img
            src="https://api.dicebear.com/9.x/initials/svg?seed=Patricia%20Okafor&backgroundColor=1d4ed8&fontFamily=Georgia&fontSize=40&size=256"
            alt="Mrs. Patricia Okafor"
            className="w-full rounded-2xl border-4 border-[#1a3c6e]/20 mb-4"
          />
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-center">
            <div className="font-bold text-[#1a3c6e]">Mrs. Patricia Okafor</div>
            <div className="text-gray-600">Headteacher</div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-gray-50 border-y border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Our Mission",
                color: "border-t-4 border-[#1a3c6e]",
                text: "To provide an outstanding education that equips every pupil with the knowledge, skills, and character to thrive in secondary school and beyond.",
              },
              {
                title: "Our Vision",
                color: "border-t-4 border-yellow-400",
                text: "A school where every child feels safe, happy, and inspired — where curiosity is celebrated, diversity is embraced, and excellence is achieved by all.",
              },
              {
                title: "Our Promise",
                color: "border-t-4 border-green-500",
                text: "We promise to know every child by name, to listen to every family, and to never stop improving what we offer our community.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-xl p-6 shadow-sm ${item.color}`}
              >
                <h3 className="text-xl font-bold text-[#1a3c6e] mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-[#1a3c6e] mb-8">Key Facts About Our School</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Co-educational primary school for pupils aged 4–11",
            "Over 420 pupils across Reception to Year 6",
            "Rated Outstanding by Ofsted in all areas",
            "Located in the London Borough of Islington",
            "Founded in 1987, serving our community for over 35 years",
            "Excellent provision for pupils with SEND",
            "Active Parent-Teacher Association (PTA)",
            "A wide range of extra-curricular clubs and activities",
            "Strong links with local secondary schools",
            "Breakfast club from 7:45am and after-school care until 6:00pm",
          ].map((fact, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm">{fact}</span>
            </div>
          ))}
        </div>
      </section>

      {/* School hours */}
      <section className="bg-[#1a3c6e] text-white py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">School Hours & Term Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "School Day", items: ["Doors open: 8:45am", "Registration: 9:00am", "Morning break: 10:30am", "Lunch: 12:00pm–1:00pm", "End of day: 3:15pm"] },
              { title: "Wraparound Care", items: ["Breakfast Club: 7:45am–8:45am", "After-School Club: 3:15pm–6:00pm", "Holiday Club: Available in school holidays", "Booking required in advance"] },
              { title: "Term Dates 2025–26", items: ["Autumn Term: Sept–Dec 2025", "Spring Term: Jan–Apr 2026", "Summer Term: Apr–Jul 2026", "See website for exact dates and INSET days"] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="font-bold text-yellow-300 mb-3">{col.title}</h3>
                <ul className="space-y-2 text-blue-100 text-sm">
                  {col.items.map((item, i) => <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

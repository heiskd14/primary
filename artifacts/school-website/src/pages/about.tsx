import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { CheckCircle } from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";

export function PageHero({ title, subtitle, breadcrumb }: { title: string; subtitle: string; breadcrumb: string }) {
  return (
    <div className="text-white py-12" style={{ backgroundColor: NAVY }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-blue-300 text-sm mb-2">{breadcrumb}</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-blue-200 text-lg">{subtitle}</p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <Layout>
      <PageHero
        title="About Triple Tee Montessori Academy"
        subtitle="A faith-based school where every child is equipped to fulfil their God-given potential"
        breadcrumb="Home / About Us"
      />

      {/* Proprietor welcome */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-5" style={{ color: NAVY }}>Welcome from Our Proprietor</h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>Welcome to Triple Tee Montessori Academy. It is my joy and privilege to lead this school and to serve the families of Oke-Ola, Oro, and the wider Kwara State community. Since our founding, we have been committed to one overriding purpose: to build a God-centred future in every child entrusted to our care.</p>
            <p>At Triple Tee, we believe that true education is holistic — it shapes the mind, the character, and the spirit. Our Montessori approach gives every child the freedom to learn at their own pace in a prepared, nurturing environment, while our Christian values ensure that faith, integrity, and service to others remain at the heart of all we do.</p>
            <p>We are proud of the academic results our pupils achieve, but we are equally proud of the young people they are becoming — young men and women of character, confidence, and compassion who are ready to make a positive difference in Nigeria and beyond.</p>
            <p>If you are considering Triple Tee Montessori Academy for your child, we warmly invite you to visit us. Come and see for yourself what makes our school special.</p>
            <p className="font-semibold" style={{ color: NAVY }}>The Proprietor, Triple Tee Montessori Academy</p>
          </div>
        </div>
        <div>
          <img
            src="/logo.jpeg"
            alt="Triple Tee Montessori Academy"
            className="w-full rounded-2xl border-4 mb-4"
            style={{ borderColor: NAVY + "33" }}
          />
          <div className="rounded-xl p-4 text-sm text-center" style={{ backgroundColor: "#f0f4ff", border: `1px solid ${NAVY}33` }}>
            <div className="font-bold" style={{ color: NAVY }}>Triple Tee Montessori Academy</div>
            <div className="text-gray-600">Oke-Ola, Oro, Kwara State</div>
            <div className="text-xs mt-1 italic" style={{ color: RED }}>"Building God Centered Future"</div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Promise */}
      <section className="bg-gray-50 border-y border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Our Mission", borderColor: NAVY, text: "To provide a high-quality Montessori education rooted in Christian values, equipping every child — from Creche to Junior Secondary — with the knowledge, skills, and godly character to succeed in life." },
              { title: "Our Vision", borderColor: RED, text: "A school where faith and learning go hand-in-hand; where every child discovers their unique potential and is inspired to serve God, their family, and the nation of Nigeria." },
              { title: "Our Promise", borderColor: "#C8A55F", text: "We promise to partner with every family, to know every child by name, and to never stop striving to provide the best possible education in a safe, loving, and God-honouring environment." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm" style={{ borderTop: `4px solid ${item.borderColor}` }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: NAVY }}>{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold mb-8" style={{ color: NAVY }}>Key Facts About Our School</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Montessori school for children from Creche to Junior Secondary School (JSS)",
            "Located in Oke-Ola, Oro, Irepodun Local Government Area, Kwara State",
            "Faith-based institution rooted in Christian values",
            "Small class sizes for personalised, child-centred learning",
            "Qualified and dedicated teaching staff",
            "Broad curriculum covering core subjects, arts, and moral education",
            "Active Parent–Teacher Association (PTA)",
            "Regular devotion, worship, and scripture-based learning",
            "Extracurricular activities including sports, cultural events, and debate",
            "Safe, clean, and stimulating learning environment",
          ].map((fact, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: RED }} />
              <span className="text-gray-700 text-sm">{fact}</span>
            </div>
          ))}
        </div>
      </section>

      {/* School hours */}
      <section className="text-white py-14" style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">School Hours & Term Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "School Day", items: ["Gates open: 7:30am", "Assembly & Devotion: 7:45am", "Lessons begin: 8:00am", "Break time: 10:00am – 10:20am", "Lunch: 12:30pm – 1:15pm", "Close of school: 2:30pm"] },
              { title: "Extended Care", items: ["Morning supervision from 7:30am", "After-school care available", "Holiday lessons during breaks", "Contact office for details"] },
              { title: "Academic Calendar", items: ["First Term: September – December", "Second Term: January – March", "Third Term: April – July", "Public exams: BECE / Common Entrance"] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="font-bold mb-3" style={{ color: "#fca5a5" }}>{col.title}</h3>
                <ul className="space-y-2 text-blue-100 text-sm">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: RED }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

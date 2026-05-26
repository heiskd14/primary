import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { CheckCircle } from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";

const DEFAULTS: Record<string, string> = {
  welcome_text: "Triple Tee Montessori Academy was founded on a deep-seated belief that quality, affordable education — rooted in strong moral values — can shape a child's life from the earliest years. Our purpose extends beyond academics; we aim to nurture the future of our community.\n\nWe are convinced that many of the social ills we see today stem from a lack of critical thinking, honesty, and respect. By instilling these principles early, we help children grow into thoughtful, compassionate individuals who naturally practice integrity in every aspect of life.\n\nAt Triple Tee, learning is joyful and child-centered, guided by the Montessori method. Our students are cherished as princes and princesses, and our motto — \"Building a Christ-centred future\" — reflects our commitment to fostering spiritual growth alongside academic excellence.\n\nWe are located opposite Winners Chapel, Oke-Ola, Oro, along the Ijomu-Oro Road in Oro, Kwara State, and we serve families across Oro and the surrounding communities.",
  mission: "To provide quality, affordable, faith-based Montessori education that equips every child — from Creche to Primary 5 — with knowledge, strong moral values, and the godly character to make a positive difference in Nigeria.",
  vision: "A school where every child is cherished, where faith and learning go hand-in-hand, and where exceptional teachers shape the minds and futures of the next generation of compassionate Nigerian leaders.",
  tagline_text: "\"Inspiring Excellence, Building Character, Nurturing Futures\" — three commitments that drive everything we do at Triple Tee Montessori Academy.",
  teachers_text_1: "At Triple Tee Montessori Academy, we believe that the foundation of a great education lies in the hands of great teachers. That's why we pride ourselves on having a team of highly qualified, experienced, and passionate educators dedicated to shaping the minds and futures of our students.",
  teachers_text_2: "Our teachers bring a wealth of knowledge, diverse teaching methods, and a genuine commitment to each student's success. Through continuous professional development, they stay at the forefront of educational best practices, ensuring that our classrooms are engaging, innovative, and inclusive. Beyond academics, our teachers serve as mentors and role models.",
  proprietors_speech: "",
  key_facts: "Montessori school for children from Creche to Primary 5\nLocated opposite Winners Chapel, Oke-Ola, Oro, Kwara State\nFaith-based institution — Building a Christ-Centred Future\nSmall class sizes for personalised, child-centred Montessori learning\nHighly qualified, experienced, and dedicated teaching staff\nBroad curriculum: academics, arts, moral & Christian education\nActive Parent–Teacher Association (PTA)\nDaily devotion, prayer, and scripture-based learning\nExtracurricular activities: sports, cultural events, debate, music\nSchool hours: Monday – Friday, 7:00am – 6:00pm\nOnline admission available — contact us to apply\nAffordable, quality education for families in Oro and beyond",
};

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
  const [content, setContent] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    fetch("/api/site-content")
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, string>) => {
        setContent(prev => ({ ...prev, ...data }));
      })
      .catch(() => {});
  }, []);

  const get = (key: string) => content[key] ?? DEFAULTS[key] ?? "";

  const keyFacts = get("key_facts").split("\n").filter(f => f.trim());

  return (
    <Layout>
      <PageHero
        title="About Triple Tee Montessori Academy"
        subtitle="Inspiring Excellence, Building Character, Nurturing Futures"
        breadcrumb="Home / About Us"
      />

      {/* Welcome section */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-5" style={{ color: NAVY }}>Welcome to Triple Tee Montessori Academy</h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            {get("welcome_text").split("\n\n").filter(p => p.trim()).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
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
            <div className="text-gray-600 text-xs mt-1">Opp. Winners Chapel, Oke-Ola, Oro</div>
            <div className="text-gray-600 text-xs">Kwara State, Nigeria</div>
            <div className="text-xs mt-2 font-semibold italic" style={{ color: RED }}>"Building God Centered Future"</div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Tagline */}
      <section className="bg-gray-50 border-y border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Our Mission", borderColor: NAVY, key: "mission" },
              { title: "Our Vision", borderColor: RED, key: "vision" },
              { title: "Our Tagline", borderColor: "#C8A55F", key: "tagline_text" },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm" style={{ borderTop: `4px solid ${item.borderColor}` }}>
                <h3 className="text-xl font-bold mb-3" style={{ color: NAVY }}>{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{get(item.key)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proprietor's Speech (only shown if set) */}
      {get("proprietors_speech") && (
        <section className="max-w-7xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-bold mb-5" style={{ color: NAVY }}>Proprietor's Message</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {get("proprietors_speech").split("\n\n").filter(p => p.trim()).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Teachers section */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>Exceptional Education Starts With Exceptional Teachers</h2>
        <div className="grid md:grid-cols-2 gap-8 text-gray-600 leading-relaxed">
          <p>{get("teachers_text_1")}</p>
          <p>{get("teachers_text_2")}</p>
        </div>
      </section>

      {/* Key facts */}
      <section className="bg-gray-50 border-t border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8" style={{ color: NAVY }}>Key Facts About Our School</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {keyFacts.map((fact, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: RED }} />
                <span className="text-gray-700 text-sm">{fact}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School hours */}
      <section className="text-white py-14" style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8">School Hours & Term Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "School Day", items: ["Gates open: 7:00am", "Assembly & Devotion: 7:30am", "Lessons begin: 8:00am", "Break time: 10:00am – 10:20am", "Lunch: 12:30pm – 1:15pm", "After-school care until: 6:00pm"] },
              { title: "Contact Details", items: ["Tel: 07036500419", "Tel: 08032348460", "Email: tripleteeschools@gmail.com", "Mon – Fri: 7:00am – 6:00pm"] },
              { title: "Academic Calendar", items: ["First Term: September – December", "Second Term: January – March", "Third Term: April – July"] },
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

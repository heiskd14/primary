import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";

const subjects = [
  { name: "English & Literacy", emoji: "📖", desc: "From phonics in Reception to analytical writing in Year 6, we build confident readers and writers who love language." },
  { name: "Mathematics", emoji: "🔢", desc: "Using concrete resources, pictorial methods, and abstract reasoning to build deep mathematical understanding." },
  { name: "Science", emoji: "🔬", desc: "Hands-on investigations and experiments that develop scientific thinking and a curiosity about the natural world." },
  { name: "History", emoji: "🏛️", desc: "Exploring the past through stories, artefacts, and enquiry — from ancient civilisations to modern Britain." },
  { name: "Geography", emoji: "🌍", desc: "Understanding our world through maps, fieldwork, and learning about diverse places, environments, and cultures." },
  { name: "Art & Design", emoji: "🎨", desc: "Developing creativity, technique, and an appreciation of artists and designers from around the world." },
  { name: "Music", emoji: "🎵", desc: "Every pupil learns an instrument in Key Stage 2. Our choir and orchestra perform regularly throughout the year." },
  { name: "PE & Sport", emoji: "⚽", desc: "Daily physical activity, competitive sport, and a focus on wellbeing — our PE programme is award-winning." },
  { name: "Computing", emoji: "💻", desc: "Digital literacy, coding, and online safety — preparing children for a digital future." },
  { name: "PSHE & RE", emoji: "❤️", desc: "Character education, emotional wellbeing, and an understanding of the diverse world we live in." },
];

const clubs = [
  { name: "Football Club", time: "Monday, 3:15pm", year: "Years 3–6", icon: "⚽" },
  { name: "Drama Club", time: "Tuesday, 3:15pm", year: "Years 2–6", icon: "🎭" },
  { name: "Coding Club", time: "Wednesday, 3:15pm", year: "Years 4–6", icon: "💻" },
  { name: "Choir", time: "Wednesday, 3:15pm", year: "Years 3–6", icon: "🎵" },
  { name: "Art Club", time: "Thursday, 3:15pm", year: "Years 1–4", icon: "🎨" },
  { name: "Netball Club", time: "Thursday, 3:15pm", year: "Years 4–6", icon: "🏐" },
  { name: "Book Club", time: "Friday, 1:00pm (lunch)", year: "Years 3–6", icon: "📚" },
  { name: "Geography Club", time: "Friday, 3:15pm", year: "Years 4–6", icon: "🌍" },
];

export default function SchoolLife() {
  return (
    <Layout>
      <PageHero
        title="School Life at Greenfield"
        subtitle="A rich, broad curriculum and a vibrant community life"
        breadcrumb="Home / School Life"
      />

      {/* Curriculum */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-[#1a3c6e] mb-2">Our Curriculum</h2>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-3xl">
          We follow the National Curriculum and have developed our own enriched curriculum that goes beyond it. Our curriculum is carefully designed to ensure progression, depth of knowledge, and real joy in learning at every stage.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjects.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1a3c6e] hover:shadow-sm transition-all"
            >
              <div className="text-3xl mb-2">{s.emoji}</div>
              <h3 className="font-bold text-sm text-[#1a3c6e] mb-1">{s.name}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Extra-curricular */}
      <section className="bg-gray-50 border-y border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1a3c6e] mb-2">Extra-Curricular Clubs</h2>
          <p className="text-gray-600 mb-8">We offer a wide range of clubs before, during, and after school. All clubs are free of charge unless otherwise stated.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {clubs.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-bold text-[#1a3c6e] text-sm">{c.name}</div>
                <div className="text-xs text-gray-500 mt-1">{c.time}</div>
                <div className="text-xs font-medium text-blue-600 mt-0.5">{c.year}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trips & Visits */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-[#1a3c6e] mb-2">Trips, Visits & Residential</h2>
        <p className="text-gray-600 mb-8 max-w-3xl leading-relaxed">Learning beyond the classroom is an important part of life at Greenfield. Every year group benefits from enriching trips that bring the curriculum to life.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { year: "Reception & Year 1", trips: ["Local nature walk and farm visit", "Library and storytime sessions", "Theatre visit – pantomime"], img: "https://images.unsplash.com/photo-1472746729193-90de9a6eb4b3?w=600&q=80" },
            { year: "Years 2, 3 & 4", trips: ["Natural History Museum", "Tower of London", "Hampton Court Palace", "London Wetland Centre"], img: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=600&q=80" },
            { year: "Years 5 & 6", trips: ["Year 5 Residential – Outdoor Activities", "Science Museum", "Houses of Parliament", "Shakespeare's Globe Theatre"], img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
          ].map((g, i) => (
            <div key={g.year} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <img src={g.img} alt={g.year} className="w-full h-36 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-[#1a3c6e] mb-3">{g.year}</h3>
                <ul className="space-y-1.5">
                  {g.trips.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 font-bold mt-0.5">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wellbeing */}
      <section className="bg-[#1a3c6e] py-14 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Pupil Wellbeing & Mental Health</h2>
            <p className="text-blue-100 leading-relaxed mb-4">
              We take the mental health and wellbeing of our pupils extremely seriously. Every class has a weekly wellbeing session, and we have a trained Mental Health Lead who supports individual pupils and families.
            </p>
            <p className="text-blue-100 leading-relaxed">
              Our Pupil Wellbeing Champions — elected by their peers — help ensure every child has a trusted voice and that kindness is at the heart of our school culture.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Weekly PSHE lessons", "Trained Mental Health Lead", "Nurture group provision", "Pupil Wellbeing Champions", "Peaceful playground zones", "Restorative practice approach"].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-blue-100">
                <span className="text-yellow-400 font-bold flex-shrink-0">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

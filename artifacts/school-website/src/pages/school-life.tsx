import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";

const NAVY = "#1a237e";
const RED = "#CC2200";

const subjects = [
  { name: "English Language", emoji: "📖", desc: "Building confident readers, writers, and speakers through phonics, comprehension, grammar, and creative expression." },
  { name: "Mathematics", emoji: "🔢", desc: "From counting and number sense to algebra and geometry — we make maths practical, visual, and enjoyable." },
  { name: "Basic Science & Technology", emoji: "🔬", desc: "Hands-on experiments, environmental science, and introductory technology skills for a modern Nigeria." },
  { name: "Social Studies", emoji: "🌍", desc: "Understanding Nigerian history, civic values, geography, and our responsibilities as citizens." },
  { name: "Christian Religious Studies", emoji: "✝️", desc: "Scripture, prayer, and Christian values form a central part of our school's identity and daily life." },
  { name: "Yoruba Language", emoji: "🗣️", desc: "We celebrate our cultural heritage through the study of Yoruba language, literature, and oral tradition." },
  { name: "Cultural & Creative Arts", emoji: "🎨", desc: "Drawing, painting, crafts, drama, and music — nurturing creativity and self-expression in every child." },
  { name: "Physical & Health Education", emoji: "⚽", desc: "Sports, games, and health education keeping our pupils fit, active, and aware of healthy living." },
  { name: "Computer Studies", emoji: "💻", desc: "Introducing pupils to digital literacy, keyboarding, internet safety, and basic computing from an early age." },
  { name: "Vocational Aptitude", emoji: "🛠️", desc: "Practical skills and entrepreneurship education preparing pupils for real-world challenges and opportunities." },
];

const clubs = [
  { name: "Football Club", time: "Tuesdays & Thursdays", year: "Primary – JSS", icon: "⚽" },
  { name: "Debate & Public Speaking", time: "Wednesdays", year: "Primary 4 – JSS", icon: "🎤" },
  { name: "Cultural Dance Club", time: "Fridays", year: "All Classes", icon: "💃" },
  { name: "Art & Craft Club", time: "Wednesdays", year: "Nursery – Primary", icon: "🎨" },
  { name: "Scripture Union (SU)", time: "Every Morning", year: "Primary 1 – JSS", icon: "✝️" },
  { name: "Science Club", time: "Thursdays", year: "Primary 3 – JSS", icon: "🔬" },
  { name: "Music & Choir", time: "Fridays", year: "All Classes", icon: "🎵" },
  { name: "Junior Entrepreneurs Club", time: "Saturdays (select)", year: "Primary 4 – JSS", icon: "💼" },
];

export default function SchoolLife() {
  return (
    <Layout>
      <PageHero
        title="School Life at Triple Tee"
        subtitle="A rich, faith-centred education and vibrant school community"
        breadcrumb="Home / School Life"
      />

      {/* Curriculum */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Our Curriculum</h2>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-3xl">
          We follow the Nigerian Educational Research and Development Council (NERDC) / Universal Basic Education (UBE) curriculum, enriched with the Montessori philosophy. Our curriculum is designed to develop critical thinking, creativity, and godly character alongside strong academic foundations.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjects.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <h3 className="font-bold text-sm mb-1" style={{ color: NAVY }}>{s.name}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Montessori Approach */}
      <section className="border-y border-gray-200 py-14" style={{ backgroundColor: "#f0f4ff" }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>The Montessori Approach</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Triple Tee, we are proud to use the Montessori method — an internationally respected, child-centred approach to education developed by Dr. Maria Montessori. In a Montessori classroom, children are encouraged to learn through exploration, hands-on activity, and self-direction within a carefully prepared environment.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our trained Montessori teachers act as guides, observing each child's natural curiosity and readiness to learn, then introducing new concepts at exactly the right moment. The result is children who are intrinsically motivated, independent, and joyful learners.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Child-led learning", desc: "Each child progresses at their own pace" },
              { title: "Prepared environment", desc: "Classrooms designed to inspire and challenge" },
              { title: "Hands-on materials", desc: "Concrete objects before abstract concepts" },
              { title: "Mixed-age groups", desc: "Older pupils mentor younger ones naturally" },
              { title: "Freedom with responsibility", desc: "Children make choices within clear boundaries" },
              { title: "Intrinsic motivation", desc: "Learning for joy, not just grades" },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="font-bold text-sm mb-1" style={{ color: RED }}>✓ {item.title}</div>
                <div className="text-xs text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold mb-2" style={{ color: NAVY }}>Clubs & Activities</h2>
        <p className="text-gray-600 mb-8">We offer a range of extracurricular activities that develop talent, build character, and strengthen community.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {clubs.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold text-sm" style={{ color: NAVY }}>{c.name}</div>
              <div className="text-xs text-gray-500 mt-1">{c.time}</div>
              <div className="text-xs font-medium mt-0.5" style={{ color: RED }}>{c.year}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Faith & Character */}
      <section className="text-white py-14" style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Faith & Character Education</h2>
            <p className="text-blue-100 leading-relaxed mb-4">
              Faith is not an add-on at Triple Tee — it is woven into everything we do. Every school day begins with devotion, prayer, and scripture. Our pupils learn not just to read the Bible but to live by its values: honesty, kindness, perseverance, and love for God and neighbour.
            </p>
            <p className="text-blue-100 leading-relaxed">
              Our Character Education programme runs alongside all academic subjects, helping children develop into people of integrity who will be a blessing to their families, their community, and Nigeria as a whole.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Daily Morning Devotion", "Scripture memorisation", "Christian Religious Studies", "Scripture Union (SU)", "Annual Carol Service", "School-wide prayer days", "Community outreach projects", "Values assembly every week"].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-blue-100">
                <span className="font-bold flex-shrink-0" style={{ color: "#fca5a5" }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

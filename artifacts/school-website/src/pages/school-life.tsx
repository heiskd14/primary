import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { Skeleton } from "@/components/ui/skeleton";

const NAVY = "#1a237e";
const RED = "#CC2200";

const DEFAULT_SUBJECTS = [
  { id: 0, name: "English Language", emoji: "📖", description: "Building confident readers, writers, and speakers through phonics, comprehension, grammar, and creative expression.", displayOrder: 0 },
  { id: 1, name: "Mathematics", emoji: "🔢", description: "From counting and number sense to algebra and geometry — we make maths practical, visual, and enjoyable.", displayOrder: 1 },
  { id: 2, name: "Basic Science & Technology", emoji: "🔬", description: "Hands-on experiments, environmental science, and introductory technology skills for a modern Nigeria.", displayOrder: 2 },
  { id: 3, name: "Social Studies", emoji: "🌍", description: "Understanding Nigerian history, civic values, geography, and our responsibilities as citizens.", displayOrder: 3 },
  { id: 4, name: "Christian Religious Studies", emoji: "✝️", description: "Scripture, prayer, and Christian values form a central part of our school's identity and daily life.", displayOrder: 4 },
  { id: 5, name: "Yoruba Language", emoji: "🗣️", description: "We celebrate our cultural heritage through the study of Yoruba language, literature, and oral tradition.", displayOrder: 5 },
  { id: 6, name: "Cultural & Creative Arts", emoji: "🎨", description: "Drawing, painting, crafts, drama, and music — nurturing creativity and self-expression in every child.", displayOrder: 6 },
  { id: 7, name: "Physical & Health Education", emoji: "⚽", description: "Sports, games, and health education keeping our pupils fit, active, and aware of healthy living.", displayOrder: 7 },
  { id: 8, name: "Computer Studies", emoji: "💻", description: "Introducing pupils to digital literacy, keyboarding, internet safety, and basic computing from an early age.", displayOrder: 8 },
  { id: 9, name: "Vocational Aptitude", emoji: "🛠️", description: "Practical skills and entrepreneurship education preparing pupils for real-world challenges and opportunities.", displayOrder: 9 },
];

const DEFAULT_CLUBS = [
  { id: 0, name: "Football Club", timeSlot: "Tuesdays & Thursdays", yearGroup: "Primary 1 – Primary 5", icon: "⚽", displayOrder: 0 },
  { id: 1, name: "Debate & Public Speaking", timeSlot: "Wednesdays", yearGroup: "Primary 3 – Primary 5", icon: "🎤", displayOrder: 1 },
  { id: 2, name: "Cultural Dance Club", timeSlot: "Fridays", yearGroup: "All Classes", icon: "💃", displayOrder: 2 },
  { id: 3, name: "Art & Craft Club", timeSlot: "Wednesdays", yearGroup: "Nursery – Primary", icon: "🎨", displayOrder: 3 },
  { id: 4, name: "Scripture Union (SU)", timeSlot: "Every Morning", yearGroup: "Primary 1 – Primary 5", icon: "✝️", displayOrder: 4 },
  { id: 5, name: "Science Club", timeSlot: "Thursdays", yearGroup: "Primary 3 – Primary 5", icon: "🔬", displayOrder: 5 },
  { id: 6, name: "Music & Choir", timeSlot: "Fridays", yearGroup: "All Classes", icon: "🎵", displayOrder: 6 },
  { id: 7, name: "Junior Entrepreneurs Club", timeSlot: "Saturdays (select)", yearGroup: "Primary 3 – Primary 5", icon: "💼", displayOrder: 7 },
];

type Subject = typeof DEFAULT_SUBJECTS[0];
type Club = typeof DEFAULT_CLUBS[0];

export default function SchoolLife() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/school-life/subjects").then(r => r.ok ? r.json() : []),
      fetch("/api/school-life/clubs").then(r => r.ok ? r.json() : []),
    ]).then(([s, c]) => {
      setSubjects(s.length > 0 ? s : DEFAULT_SUBJECTS);
      setClubs(c.length > 0 ? c : DEFAULT_CLUBS);
    }).catch(() => {
      setSubjects(DEFAULT_SUBJECTS);
      setClubs(DEFAULT_CLUBS);
    }).finally(() => setLoading(false));
  }, []);

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
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
            : subjects.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all">
                <div className="text-3xl mb-2">{s.emoji}</div>
                <h3 className="font-bold text-sm mb-1" style={{ color: NAVY }}>{s.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.description}</p>
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
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
            : clubs.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-bold text-sm" style={{ color: NAVY }}>{c.name}</div>
                <div className="text-xs text-gray-500 mt-1">{c.timeSlot}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: RED }}>{c.yearGroup}</div>
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

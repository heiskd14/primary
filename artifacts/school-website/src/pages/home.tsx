import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListNews, useListEvents } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, ChevronRight, BookOpen, Heart, Users, Star } from "lucide-react";

const NAVY = "#1a237e";
const RED = "#CC2200";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
  };
}

const values = [
  { icon: Star, title: "Faith", desc: "We are rooted in Christian values, nurturing children who honour God in all they do.", color: "bg-red-50 text-red-700" },
  { icon: BookOpen, title: "Excellence", desc: "We set high academic and moral standards, celebrating achievement at every stage.", color: "bg-blue-50 text-blue-900" },
  { icon: Heart, title: "Character", desc: "We develop integrity, discipline, and compassion alongside academic knowledge.", color: "bg-orange-50 text-orange-700" },
  { icon: Users, title: "Community", desc: "We work hand-in-hand with families and the Oro community to raise well-rounded children.", color: "bg-green-50 text-green-700" },
];

export default function Home() {
  const { data: news, isLoading: newsLoading } = useListNews({ limit: 3 });
  const { data: events, isLoading: eventsLoading } = useListEvents({ limit: 4 });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ backgroundColor: NAVY, minHeight: 520 }}>
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${NAVY}, ${NAVY}cc, transparent)` }} />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: RED }}>
              <Star className="w-4 h-4" /> Faith · Excellence · Character
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              Welcome to<br />Triple Tee<br />Montessori Academy
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-3 italic font-medium">
              "Building God Centered Future"
            </p>
            <p className="text-lg text-blue-200 leading-relaxed mb-8">
              A caring, faith-based school in Oke-Ola, Oro, Kwara State — where every child is known, loved, and equipped to fulfil their God-given potential.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admissions"
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg transition-colors text-white"
                style={{ backgroundColor: RED }}
              >
                Apply for Admission <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg border border-white/30 bg-white/15 hover:bg-white/25 transition-colors"
              >
                About Our School
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-4" style={{ backgroundColor: RED }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
          {[
            { value: "Creche – JSS", label: "Classes Offered" },
            { value: "Montessori", label: "Teaching Method" },
            { value: "Oke-Ola, Oro", label: "Kwara State, Nigeria" },
            { value: "Building God", label: "Centered Future" },
          ].map((s, i) => (
            <div key={i} className="py-2">
              <div className="text-lg md:text-xl font-extrabold">{s.value}</div>
              <div className="text-xs md:text-sm font-semibold opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "School Uniform", icon: "👕", href: "/about" },
            { label: "Term Dates", icon: "📅", href: "/news" },
            { label: "Apply for Admission", icon: "📝", href: "/admissions" },
            { label: "Contact the School", icon: "📞", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:shadow-sm transition-all group"
              style={{ borderColor: undefined }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1a237e]">{item.label}</span>
              <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-[#1a237e] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* News + Events */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        {/* Latest News */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Latest News</h2>
            <Link href="/news" className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color: NAVY }}>
              All news <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-5">
            {newsLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)
              : news?.map((article, i) => (
                <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link href={`/news/${article.id}`}>
                    <div className="flex gap-4 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group cursor-pointer" style={{ borderColor: undefined }}>
                      <img src={article.imageUrl} alt={article.title} className="w-28 md:w-36 object-cover flex-shrink-0" />
                      <div className="p-4 flex flex-col justify-between min-w-0">
                        <div>
                          <span className="inline-block text-xs font-bold px-2 py-0.5 rounded mb-2 text-white" style={{ backgroundColor: RED }}>{article.category}</span>
                          <h3 className="font-bold text-gray-900 leading-snug group-hover:text-[#1a237e] transition-colors line-clamp-2">{article.title}</h3>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">{formatDate(article.publishedAt)} · {article.author}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Upcoming Events</h2>
          </div>
          <div className="space-y-3">
            {eventsLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
              : events?.map((event, i) => {
                const { day, month } = formatEventDate(event.date);
                return (
                  <motion.div key={event.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-sm transition-all">
                    <div className="flex-shrink-0 w-12 rounded-lg text-center text-white py-1.5" style={{ backgroundColor: NAVY }}>
                      <div className="text-lg font-extrabold leading-tight">{day}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{month}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-gray-900 leading-snug">{event.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {event.time}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            <Link href="/news" className="block text-center text-sm font-semibold hover:underline pt-2" style={{ color: NAVY }}>
              View all events →
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 border-t border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: NAVY }}>Our Core Values</h2>
            <p className="text-gray-600">The principles rooted in faith that guide everything we do at Triple Tee</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${v.color}`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2" style={{ color: NAVY }}>{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="py-14 text-white" style={{ backgroundColor: NAVY }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Is your child ready to start?</h2>
            <p className="text-blue-200">We welcome new pupils from Creche through to Junior Secondary. Find out how to enrol.</p>
          </div>
          <Link href="/admissions" className="flex-shrink-0 inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg transition-colors text-white" style={{ backgroundColor: RED }}>
            Admissions Information <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

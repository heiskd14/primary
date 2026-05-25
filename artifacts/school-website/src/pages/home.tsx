import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListNews, useListEvents } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, ChevronRight, Star, BookOpen, Heart, Users } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return { day: d.toLocaleDateString("en-GB", { day: "2-digit" }), month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase() };
}

const values = [
  { icon: Star, title: "Excellence", desc: "We set high expectations for every pupil, celebrating achievement at every level.", color: "bg-blue-50 text-blue-700" },
  { icon: Heart, title: "Inclusion", desc: "Every child belongs. We celebrate diversity and ensure all pupils feel valued and safe.", color: "bg-red-50 text-red-700" },
  { icon: BookOpen, title: "Love of Learning", desc: "We inspire curiosity and a lifelong love of learning that goes beyond the classroom.", color: "bg-green-50 text-green-700" },
  { icon: Users, title: "Community", desc: "We are stronger together. Our school, families, and local community work in partnership.", color: "bg-amber-50 text-amber-700" },
];

export default function Home() {
  const { data: news, isLoading: newsLoading } = useListNews({ limit: 3 });
  const { data: events, isLoading: eventsLoading } = useListEvents({ limit: 4 });

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative bg-[#1a3c6e] text-white overflow-hidden"
        style={{ minHeight: 520 }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c6e] via-[#1a3c6ecc] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#1a3c6e] text-sm font-bold px-4 py-1.5 rounded-full mb-6">
              <Star className="w-4 h-4" /> Rated Outstanding by Ofsted
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              Welcome to<br />Greenfield Primary School
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Nurturing Minds, Inspiring Futures. A caring, inclusive community school where every child is known, valued, and supported to achieve their very best.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admissions" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#1a3c6e] font-bold px-6 py-3 rounded-lg transition-colors">
                Apply for a Place <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3 rounded-lg border border-white/30 transition-colors">
                About Our School
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-yellow-400 py-4">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: "420+", label: "Pupils" },
            { value: "Ofsted Outstanding", label: "Latest Inspection" },
            { value: "Est. 1987", label: "Serving Our Community" },
            { value: "98%", label: "Parent Satisfaction" },
          ].map((s, i) => (
            <div key={i} className="py-2">
              <div className="text-xl md:text-2xl font-extrabold text-[#1a3c6e]">{s.value}</div>
              <div className="text-xs md:text-sm font-semibold text-[#1a3c6e]/70">{s.label}</div>
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
            { label: "Apply for a Place", icon: "📝", href: "/admissions" },
            { label: "Contact the School", icon: "📞", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#1a3c6e] hover:shadow-sm transition-all group"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#1a3c6e]">{item.label}</span>
              <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-[#1a3c6e] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* News + Events */}
      <section className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        {/* Latest News */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a3c6e]">Latest News</h2>
            <Link href="/news" className="text-sm font-semibold text-[#1a3c6e] hover:underline flex items-center gap-1">
              All news <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-5">
            {newsLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)
              : news?.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/news/${article.id}`}>
                    <div className="flex gap-4 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-[#1a3c6e] transition-all group cursor-pointer">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-28 md:w-36 object-cover flex-shrink-0 group-hover:opacity-90 transition-opacity"
                      />
                      <div className="p-4 flex flex-col justify-between min-w-0">
                        <div>
                          <span className="inline-block text-xs font-bold bg-blue-100 text-[#1a3c6e] px-2 py-0.5 rounded mb-2">{article.category}</span>
                          <h3 className="font-bold text-gray-900 leading-snug group-hover:text-[#1a3c6e] transition-colors line-clamp-2">{article.title}</h3>
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
            <h2 className="text-2xl font-bold text-[#1a3c6e]">Upcoming Events</h2>
          </div>
          <div className="space-y-3">
            {eventsLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
              : events?.map((event, i) => {
                const { day, month } = formatEventDate(event.date);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:border-[#1a3c6e] hover:shadow-sm transition-all"
                  >
                    <div className="flex-shrink-0 w-12 bg-[#1a3c6e] rounded-lg text-center text-white py-1.5">
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
            <Link href="/news" className="block text-center text-sm font-semibold text-[#1a3c6e] hover:underline pt-2">
              View all events →
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 border-t border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1a3c6e] mb-2">Our School Values</h2>
            <p className="text-gray-600">The principles that guide everything we do at Greenfield Primary</p>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4", v.color)}>
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#1a3c6e] mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="bg-[#1a3c6e] py-14 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Is your child starting school?</h2>
            <p className="text-blue-200">We welcome new families to Greenfield Primary. Find out how to apply for a place.</p>
          </div>
          <Link href="/admissions" className="flex-shrink-0 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#1a3c6e] font-bold px-6 py-3 rounded-lg transition-colors">
            Admissions Information <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

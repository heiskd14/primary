import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListNews, useListEvents } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    full: d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  };
}

const NAVY = "#1a237e";
const RED = "#CC2200";

const CATEGORIES = ["All", "Achievement", "School Life", "Events", "Curriculum", "Community"];

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: news, isLoading: newsLoading } = useListNews({ limit: 20 });
  const { data: events, isLoading: eventsLoading } = useListEvents({ limit: 20 });

  const filteredNews = activeCategory === "All" ? news : news?.filter(n => n.category === activeCategory);

  return (
    <Layout>
      <PageHero
        title="News & Events"
        subtitle="Stay up to date with everything happening at Triple Tee Montessori Academy"
        breadcrumb="Home / News & Events"
      />

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        {/* News */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-5" style={{ color: NAVY }}>Latest News</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  activeCategory === cat ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-300"
                )}
                style={activeCategory === cat ? { backgroundColor: NAVY, borderColor: NAVY } : undefined}
                onMouseEnter={(e) => { if (activeCategory !== cat) { (e.currentTarget as HTMLElement).style.borderColor = NAVY; (e.currentTarget as HTMLElement).style.color = NAVY; } }}
                onMouseLeave={(e) => { if (activeCategory !== cat) { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.color = ""; } }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {newsLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
              : (
                <AnimatePresence>
                  {filteredNews?.map((article, i) => (
                    <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.06 }}>
                      <Link href={`/news/${article.id}`}>
                        <div className="flex gap-5 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all group cursor-pointer"
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = NAVY; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                        >
                          <img src={article.imageUrl} alt={article.title} className="w-36 md:w-48 object-cover flex-shrink-0" />
                          <div className="p-5 flex flex-col justify-between min-w-0">
                            <div>
                              <span className="inline-block text-xs font-bold text-white px-2 py-0.5 rounded mb-2" style={{ backgroundColor: RED }}>{article.category}</span>
                              <h3 className="font-bold text-gray-900 text-lg leading-snug transition-colors mb-2 group-hover:text-[#1a237e]">{article.title}</h3>
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{article.excerpt}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-gray-500">{formatDate(article.publishedAt)} · {article.author}</div>
                              <span className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: NAVY }}>Read more <ArrowRight className="w-3 h-3" /></span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
          </div>
        </div>

        {/* Events sidebar */}
        <div>
          <h2 className="text-2xl font-bold mb-5" style={{ color: NAVY }}>School Events</h2>
          <div className="space-y-3">
            {eventsLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
              : events?.map((event, i) => {
                const d = formatEventDate(event.date);
                return (
                  <motion.div key={event.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = NAVY; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-12 rounded-lg text-center text-white py-2" style={{ backgroundColor: NAVY }}>
                        <div className="text-lg font-extrabold leading-tight">{d.day}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">{d.month}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-gray-900 mb-1">{event.title}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: RED }}>{event.category}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.location}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

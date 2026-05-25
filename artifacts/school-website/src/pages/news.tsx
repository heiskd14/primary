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

const CATEGORIES = ["All", "Achievement", "School News", "Trips & Events", "Sport", "Arts & Culture"];

export default function News() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: news, isLoading: newsLoading } = useListNews({ limit: 20 });
  const { data: events, isLoading: eventsLoading } = useListEvents({ limit: 20 });

  const filteredNews = activeCategory === "All" ? news : news?.filter(n => n.category === activeCategory);

  return (
    <Layout>
      <PageHero
        title="News & Events"
        subtitle="Stay up to date with everything happening at Greenfield Primary"
        breadcrumb="Home / News & Events"
      />

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        {/* News */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-[#1a3c6e] mb-5">Latest News</h2>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                  activeCategory === cat
                    ? "bg-[#1a3c6e] text-white border-[#1a3c6e]"
                    : "bg-white text-gray-600 border-gray-300 hover:border-[#1a3c6e] hover:text-[#1a3c6e]"
                )}
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
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <Link href={`/news/${article.id}`}>
                        <div className="flex gap-5 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-[#1a3c6e] transition-all group cursor-pointer">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-36 md:w-48 object-cover flex-shrink-0"
                          />
                          <div className="p-5 flex flex-col justify-between min-w-0">
                            <div>
                              <span className="inline-block text-xs font-bold bg-blue-100 text-[#1a3c6e] px-2 py-0.5 rounded mb-2">{article.category}</span>
                              <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-[#1a3c6e] transition-colors mb-2">{article.title}</h3>
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{article.excerpt}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-gray-500">{formatDate(article.publishedAt)} · {article.author}</div>
                              <span className="text-xs font-semibold text-[#1a3c6e] flex items-center gap-1 group-hover:gap-2 transition-all">Read more <ArrowRight className="w-3 h-3" /></span>
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
          <h2 className="text-2xl font-bold text-[#1a3c6e] mb-5">School Events</h2>
          <div className="space-y-3">
            {eventsLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
              : events?.map((event, i) => {
                const d = formatEventDate(event.date);
                const categoryColors: Record<string, string> = {
                  "Term Dates": "bg-blue-100 text-blue-700",
                  "Sport": "bg-green-100 text-green-700",
                  "Arts": "bg-purple-100 text-purple-700",
                  "Community": "bg-amber-100 text-amber-700",
                  "Curriculum": "bg-red-100 text-red-700",
                  "Parents": "bg-pink-100 text-pink-700",
                  "Arts & Culture": "bg-purple-100 text-purple-700",
                };
                const colorClass = categoryColors[event.category] ?? "bg-gray-100 text-gray-600";
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1a3c6e] hover:shadow-sm transition-all"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-12 bg-[#1a3c6e] rounded-lg text-center text-white py-2">
                        <div className="text-lg font-extrabold leading-tight">{d.day}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">{d.month}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-gray-900 mb-1">{event.title}</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", colorClass)}>{event.category}</span>
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

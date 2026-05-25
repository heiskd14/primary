import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListGallery } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { PageHero } from "./about";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAVY = "#1a237e";
const RED = "#CC2200";

const CATEGORIES = ["All", "Achievement", "School Life", "Arts", "Sport", "Events", "Curriculum", "Community"];

export default function Gallery() {
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null);
  const { data: items, isLoading } = useListGallery(category !== "All" ? { category } : {});

  return (
    <Layout>
      <PageHero
        title="Gallery"
        subtitle="A glimpse into life at Triple Tee Montessori Academy"
        breadcrumb="Home / Gallery"
      />

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
                category === cat
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-300"
              )}
              style={category === cat ? { backgroundColor: NAVY, borderColor: NAVY } : undefined}
              onMouseEnter={(e) => { if (category !== cat) { (e.currentTarget as HTMLElement).style.borderColor = NAVY; (e.currentTarget as HTMLElement).style.color = NAVY; } }}
              onMouseLeave={(e) => { if (category !== cat) { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.color = ""; } }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="w-full h-48 rounded-xl" />)
            : (
              <AnimatePresence>
                {items?.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden"
                    onClick={() => setLightbox({ url: item.imageUrl, title: item.title })}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                      <div className="p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: RED }}>{item.category}</span>
                        <p className="text-white text-xs font-semibold mt-1 line-clamp-2">{item.title}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-xl" />
              <p className="text-white text-center mt-3 font-semibold">{lightbox.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

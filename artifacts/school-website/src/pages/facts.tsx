import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListFacts, useListSubjects } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Facts() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(undefined);
  const { data: facts, isLoading: factsLoading } = useListFacts();
  const { data: subjects, isLoading: subjectsLoading } = useListSubjects();

  const filteredFacts = selectedSubjectId
    ? facts?.filter(f => f.subjectId === selectedSubjectId)
    : facts;

  return (
    <Layout>
      <div className="py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-primary" /> Amazing Facts
          </h1>
          <p className="text-muted-foreground text-lg font-semibold mb-6">Mind-blowing things to discover about the world!</p>
        </motion.div>

        {/* Subject filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedSubjectId(undefined)}
            className={cn(
              "px-4 py-2 rounded-xl border-2 border-foreground font-bold text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
              selectedSubjectId === undefined ? "bg-foreground text-background" : "bg-card"
            )}
          >
            All
          </button>
          {!subjectsLoading && subjects?.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={cn(
                "px-4 py-2 rounded-xl border-2 border-foreground font-bold text-sm transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                selectedSubjectId === s.id ? "bg-foreground text-background" : "bg-card"
              )}
            >
              {s.emoji} {s.name}
            </button>
          ))}
        </div>

        {/* Facts grid */}
        <div className="grid md:grid-cols-2 gap-5 pb-10">
          {factsLoading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
            : (
              <AnimatePresence>
                {filteredFacts?.map((fact, i) => (
                  <motion.div
                    key={fact.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-5 flex gap-4 items-start"
                  >
                    <div className="text-4xl flex-shrink-0">{fact.emoji}</div>
                    <div>
                      <span className="text-xs font-bold bg-muted px-2 py-0.5 rounded-full border border-foreground/20 mb-2 inline-block">{fact.subjectName}</span>
                      <p className="font-semibold text-base leading-relaxed">{fact.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
        </div>
      </div>
    </Layout>
  );
}

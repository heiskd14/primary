import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListSubjects, useListScores } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const medals = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(undefined);
  const { data: subjects, isLoading: subjectsLoading } = useListSubjects();
  const { data: scores, isLoading: scoresLoading } = useListScores(
    selectedSubjectId !== undefined ? { subjectId: selectedSubjectId, limit: 20 } : { limit: 20 }
  );

  return (
    <Layout>
      <div className="py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10 text-secondary" /> Hall of Fame
          </h1>
          <p className="text-muted-foreground text-lg font-semibold mb-6">The top players in every subject!</p>
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
            All Subjects
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

        {/* Scores table */}
        <div className="bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden">
          {scoresLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : scores?.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-xl font-bold text-muted-foreground">No scores yet! Be the first to play!</p>
            </div>
          ) : (
            <AnimatePresence>
              {scores?.map((score, i) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 border-b-2 border-foreground/10 last:border-0",
                    i === 0 ? "bg-secondary/30" : i === 1 ? "bg-muted/40" : ""
                  )}
                >
                  <div className="w-10 text-center text-2xl font-bold flex-shrink-0">
                    {medals[i] ?? <span className="text-muted-foreground text-lg">#{i + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-lg truncate">{score.playerName}</div>
                    <div className="text-sm text-muted-foreground font-semibold">{score.subjectName}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-center">
                      <div className="font-extrabold text-xl text-primary">{score.percentage}%</div>
                      <div className="text-xs text-muted-foreground">{score.score}/{score.totalQuestions}</div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: score.percentage >= 80 ? 3 : score.percentage >= 50 ? 2 : 1 }).map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-secondary fill-secondary" />
                      ))}
                    </div>
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

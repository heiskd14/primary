import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListSubjects, useGetRandomFact, useGetStats } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Star, Users, BookOpen, Lightbulb } from "lucide-react";

export default function Home() {
  const { data: subjects, isLoading: subjectsLoading } = useListSubjects();
  const { data: fact } = useGetRandomFact();
  const { data: stats } = useGetStats();

  return (
    <Layout>
      {/* Hero */}
      <section className="text-center py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold font-['Bricolage_Grotesque'] leading-tight mb-4">
            Learning is{" "}
            <span className="text-primary underline decoration-wavy decoration-secondary underline-offset-4">
              Fun!
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-semibold max-w-2xl mx-auto mb-8">
            Play quizzes, discover amazing facts, and become a learning superstar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-xl font-bold px-8 py-6 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-primary text-primary-foreground">
              <Link href="/quiz">
                <Play className="w-6 h-6 mr-2" /> Play a Quiz
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-xl font-bold px-8 py-6 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-secondary text-secondary-foreground">
              <Link href="/facts">
                <Lightbulb className="w-6 h-6 mr-2" /> Explore Facts
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      {stats && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Quizzes Taken", value: stats.totalQuizzesTaken, icon: "🎯" },
            { label: "Playing Today", value: stats.totalPlayersToday, icon: "🌟" },
            { label: "Avg. Score", value: `${stats.averageScore}%`, icon: "📈" },
            { label: "Fun Facts", value: stats.totalFacts, icon: "💡" },
          ].map((s, i) => (
            <div key={i} className="bg-card border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-4 text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl font-extrabold font-['Bricolage_Grotesque']">{s.value}</div>
              <div className="text-sm text-muted-foreground font-semibold">{s.label}</div>
            </div>
          ))}
        </motion.section>
      )}

      {/* Subjects */}
      <section className="mb-12">
        <h2 className="text-3xl font-extrabold font-['Bricolage_Grotesque'] mb-6 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-accent" /> Choose a Subject
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {subjectsLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)
            : subjects?.map((subject, i) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={`/quiz?subjectId=${subject.id}`}>
                  <div className="group cursor-pointer bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-2xl p-5 text-center">
                    <div className="text-5xl mb-3">{subject.emoji}</div>
                    <div className="font-extrabold text-lg font-['Bricolage_Grotesque']">{subject.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{subject.questionCount} questions</div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Daily Fact */}
      {fact && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="bg-secondary border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 flex items-start gap-4">
            <div className="text-5xl">{fact.emoji}</div>
            <div>
              <div className="font-extrabold text-lg font-['Bricolage_Grotesque'] mb-1 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" /> Fact of the Day
                <span className="ml-2 text-sm font-bold bg-card px-2 py-0.5 rounded-full border border-foreground">{fact.subjectName}</span>
              </div>
              <p className="text-lg font-semibold">{fact.text}</p>
            </div>
          </div>
        </motion.section>
      )}

      {/* Leaderboard CTA */}
      <section className="text-center pb-10">
        <Button asChild size="lg" variant="outline" className="text-lg font-bold px-6 py-5 border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <Link href="/leaderboard">
            <Users className="w-5 h-5 mr-2" /> View the Hall of Fame
          </Link>
        </Button>
      </section>
    </Layout>
  );
}

import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListSubjects } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function Subjects() {
  const { data: subjects, isLoading } = useListSubjects();

  return (
    <Layout>
      <div className="py-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] mb-2">All Subjects</h1>
          <p className="text-muted-foreground text-lg font-semibold mb-8">Pick a subject to start learning and playing!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
            : subjects?.map((subject, i) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl border-2 border-foreground flex items-center justify-center text-4xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      style={{ backgroundColor: subject.color + "20" }}
                    >
                      {subject.emoji}
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold font-['Bricolage_Grotesque']">{subject.name}</h2>
                      <span className="text-sm font-bold bg-muted px-2 py-0.5 rounded-full">{subject.questionCount} questions</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-semibold">{subject.description}</p>
                  <div className="flex gap-2 mt-auto">
                    <Button asChild className="flex-1 font-bold border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-primary text-primary-foreground">
                      <Link href={`/quiz?subjectId=${subject.id}`}>
                        <Play className="w-4 h-4 mr-2" /> Play Quiz
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 font-bold border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                      <Link href={`/facts?subjectId=${subject.id}`}>Fun Facts</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </Layout>
  );
}

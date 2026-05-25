import { useState } from "react";
import { useSearch, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListSubjects,
  useListQuestions,
  useSubmitScore,
  getListScoresQueryKey,
  getGetStatsQueryKey,
  getListQuestionsQueryKey,
} from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Trophy, ChevronRight, RotateCcw, Star } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type Phase = "setup" | "playing" | "finished";

const DIFFICULTIES: { value: Difficulty; label: string; emoji: string }[] = [
  { value: "easy", label: "Easy", emoji: "⭐" },
  { value: "medium", label: "Medium", emoji: "⭐⭐" },
  { value: "hard", label: "Hard", emoji: "⭐⭐⭐" },
];

const QUESTION_COUNT = 5;

function StarRating({ percentage }: { percentage: number }) {
  const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1;
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3].map((s) => (
        <motion.div
          key={s}
          initial={{ scale: 0, rotate: -30 }}
          animate={s <= stars ? { scale: 1, rotate: 0 } : { scale: 0.6, rotate: 0 }}
          transition={{ delay: s * 0.2, type: "spring", stiffness: 300 }}
        >
          <Star
            className={cn("w-12 h-12", s <= stars ? "text-secondary fill-secondary" : "text-muted-foreground")}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default function Quiz() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const preselectedSubjectId = params.get("subjectId") ? Number(params.get("subjectId")) : undefined;

  const [phase, setPhase] = useState<Phase>("setup");
  const [playerName, setPlayerName] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(preselectedSubjectId);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const queryClient = useQueryClient();
  const { data: subjects } = useListSubjects();
  const questionsParams = { subjectId: selectedSubjectId, difficulty: selectedDifficulty, limit: QUESTION_COUNT };
  const { data: questions, refetch: refetchQuestions } = useListQuestions(
    questionsParams,
    { query: { enabled: false, queryKey: getListQuestionsQueryKey(questionsParams) } }
  );
  const { mutate: submitScore } = useSubmitScore();

  const currentQuestion = questions?.[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === currentQuestion?.correctIndex;

  function handleStart() {
    if (!playerName.trim() || !selectedSubjectId) return;
    refetchQuestions().then(() => {
      setPhase("playing");
      setCurrentIndex(0);
      setScore(0);
      setAnswers([]);
      setSelectedAnswer(null);
    });
  }

  function handleAnswer(idx: number) {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    const correct = idx === currentQuestion?.correctIndex;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  }

  function handleNext() {
    if (currentIndex + 1 >= (questions?.length ?? 0)) {
      const total = questions?.length ?? QUESTION_COUNT;
      const finalScore = score + (isCorrect ? 0 : 0); // score already updated
      const pct = Math.round((score / total) * 100);
      submitScore(
        { data: { playerName: playerName.trim(), subjectId: selectedSubjectId!, score, totalQuestions: total } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListScoresQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          },
        }
      );
      setPhase("finished");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  }

  function handleRestart() {
    setPhase("setup");
    setSelectedAnswer(null);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
  }

  const subjectName = subjects?.find((s) => s.id === selectedSubjectId)?.name ?? "";
  const total = questions?.length ?? QUESTION_COUNT;
  const percentage = Math.round((score / total) * 100);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6">
        <AnimatePresence mode="wait">
          {/* ── SETUP ── */}
          {phase === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h1 className="text-4xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] mb-2">Play a Quiz!</h1>
              <p className="text-muted-foreground text-lg font-semibold mb-8">Set up your quiz then see how many you can get right!</p>

              <div className="bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 space-y-6">
                {/* Player name */}
                <div>
                  <label className="block font-extrabold text-lg mb-2">Your Name</label>
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    className="text-lg font-bold border-2 border-foreground rounded-xl py-3 px-4 focus-visible:ring-primary"
                    maxLength={30}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block font-extrabold text-lg mb-2">Choose a Subject</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {subjects?.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSubjectId(s.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-foreground font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                          selectedSubjectId === s.id ? "bg-foreground text-background" : "bg-muted"
                        )}
                      >
                        <span className="text-3xl">{s.emoji}</span>
                        <span className="text-sm">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block font-extrabold text-lg mb-2">Difficulty</label>
                  <div className="flex gap-3">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDifficulty(d.value)}
                        className={cn(
                          "flex-1 py-3 rounded-xl border-2 border-foreground font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                          selectedDifficulty === d.value ? "bg-foreground text-background" : "bg-muted"
                        )}
                      >
                        <div>{d.emoji}</div>
                        <div className="text-sm">{d.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleStart}
                  disabled={!playerName.trim() || !selectedSubjectId}
                  size="lg"
                  className="w-full text-xl font-bold py-6 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Quiz!
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── PLAYING ── */}
          {phase === "playing" && currentQuestion && (
            <motion.div key={`q-${currentIndex}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-muted-foreground">Question {currentIndex + 1} of {total}</span>
                  <span className="font-bold text-muted-foreground">Score: {score}</span>
                </div>
                <div className="w-full bg-muted border-2 border-foreground rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: `${(currentIndex / total) * 100}%` }}
                    animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 mb-5">
                <div className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="bg-muted px-2 py-0.5 rounded-full border border-foreground/20">{currentQuestion.subjectName}</span>
                  <span className="capitalize">{currentQuestion.difficulty}</span>
                </div>
                <h2 className="text-2xl font-extrabold font-['Bricolage_Grotesque'] leading-snug">{currentQuestion.text}</h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3 mb-5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isRight = idx === currentQuestion.correctIndex;
                  let bg = "bg-card hover:bg-muted";
                  if (isAnswered) {
                    if (isRight) bg = "bg-green-100 border-green-600";
                    else if (isSelected) bg = "bg-red-100 border-red-500";
                  }

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      whileHover={!isAnswered ? { scale: 1.01 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      className={cn(
                        "w-full text-left px-5 py-4 rounded-xl border-2 border-foreground font-bold text-lg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                        bg,
                        isAnswered ? "cursor-default shadow-none" : "hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                      )}
                    >
                      <span className="font-extrabold mr-3 text-muted-foreground">{["A", "B", "C", "D"][idx]}.</span>
                      {option}
                      {isAnswered && isRight && <span className="ml-2 text-green-600">✓</span>}
                      {isAnswered && isSelected && !isRight && <span className="ml-2 text-red-500">✗</span>}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "rounded-xl border-2 border-foreground p-4 mb-5",
                      isCorrect ? "bg-green-50 border-green-500" : "bg-red-50 border-red-400"
                    )}
                  >
                    <p className="font-extrabold text-lg mb-1">{isCorrect ? "Brilliant! That's right!" : "Not quite — but great try!"}</p>
                    <p className="font-semibold text-muted-foreground">{currentQuestion.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {isAnswered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="w-full text-xl font-bold py-6 border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-accent text-accent-foreground"
                  >
                    {currentIndex + 1 >= total ? "See Results!" : "Next Question"} <ChevronRight className="w-6 h-6 ml-1" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── FINISHED ── */}
          {phase === "finished" && (
            <motion.div key="finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                className="text-8xl mb-4"
              >
                {percentage >= 80 ? "🎉" : percentage >= 50 ? "👍" : "💪"}
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-['Bricolage_Grotesque'] mb-2">
                {percentage >= 80 ? "Amazing!" : percentage >= 50 ? "Well done!" : "Keep practising!"}
              </h1>
              <p className="text-xl text-muted-foreground font-semibold mb-6">
                You got <span className="text-primary font-extrabold">{score} out of {total}</span> correct in {subjectName}!
              </p>

              <div className="mb-6">
                <StarRating percentage={percentage} />
              </div>

              <div className="bg-card border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 mb-6">
                <div className="text-5xl font-extrabold font-['Bricolage_Grotesque'] text-primary mb-1">{percentage}%</div>
                <div className="text-muted-foreground font-bold">Your Score</div>
                <div className="flex justify-center gap-2 mt-4">
                  {answers.map((correct, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center text-sm font-bold",
                        correct ? "bg-green-200 text-green-800" : "bg-red-200 text-red-700"
                      )}
                    >
                      {correct ? "✓" : "✗"}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleRestart}
                  size="lg"
                  className="flex-1 text-lg font-bold py-5 border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-primary text-primary-foreground"
                >
                  <RotateCcw className="w-5 h-5 mr-2" /> Play Again
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="flex-1 text-lg font-bold py-5 border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <Link href="/leaderboard">
                    <Trophy className="w-5 h-5 mr-2" /> View Leaderboard
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

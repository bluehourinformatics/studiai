"use client";
import { motion } from "framer-motion";
import { Brain, Target, Flame, Trophy, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const weeklyData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.8 },
  { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 0.5 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 4.1 },
  { day: "Sun", hours: 1.5 },
];

const maxHours = Math.max(...weeklyData.map((d) => d.hours));

const quizHistory = [
  {
    book: "Machine Learning",
    topic: "Neural Networks",
    score: 92,
    date: "Today",
  },
  { book: "Organic Chemistry", topic: "Bonding", score: 78, date: "Yesterday" },
  { book: "Physics", topic: "Quantum Mechanics", score: 85, date: "Feb 10" },
  { book: "Calculus", topic: "Integration", score: 95, date: "Feb 9" },
];

const achievements = [
  { title: "7-Day Streak", icon: Flame, earned: true },
  { title: "Quiz Master", icon: Brain, earned: true },
  { title: "Bookworm", icon: BookOpen, earned: true },
  { title: "Perfect Score", icon: Trophy, earned: false },
  { title: "50 Hours", icon: Target, earned: false },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function DashboardProgressPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Study Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your learning journey
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyData.map((d) => (
                <div
                  key={d.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.hours / maxHours) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-full max-w-[32px] rounded-t-md bg-primary/80"
                  />
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Total:{" "}
              <span className="text-foreground font-medium">
                {weeklyData.reduce((a, b) => a + b.hours, 0).toFixed(1)}h
              </span>{" "}
              this week
            </p>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {achievements.map((a) => (
                <motion.div
                  key={a.title}
                  variants={item}
                  className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                    a.earned ? "bg-primary/5" : "opacity-40"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${a.earned ? "bg-primary/10" : "bg-muted"}`}
                  >
                    <a.icon
                      className={`h-4 w-4 ${a.earned ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <span className="text-sm font-medium">{a.title}</span>
                  {a.earned && (
                    <span className="ml-auto text-xs text-primary">✓</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Quiz History */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Quizzes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quizHistory.map((q, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{q.topic}</p>
                <p className="text-xs text-muted-foreground">{q.book}</p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className={`text-sm font-bold ${q.score >= 90 ? "text-primary" : "text-foreground"}`}
                >
                  {q.score}%
                </p>
                <p className="text-xs text-muted-foreground">{q.date}</p>
              </div>
              <Progress
                value={q.score}
                className="h-1.5 w-20 hidden sm:block"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

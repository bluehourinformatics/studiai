"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { BookOpen, Brain, Clock, TrendingUp } from "lucide-react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stats = [
  {
    label: "Books Uploaded",
    value: "12",
    icon: BookOpen,
    change: "+3 this week",
  },
  { label: "Study Hours", value: "47h", icon: Clock, change: "+5h this week" },
  { label: "Quizzes Taken", value: "28", icon: Brain, change: "86% avg score" },
  {
    label: "Streak",
    value: "7 days",
    icon: TrendingUp,
    change: "Personal best!",
  },
];

const DashboardStatus = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={item}>
          <Card className="glass border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-primary mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardStatus;

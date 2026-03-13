"use client";
import { motion } from "framer-motion";
import { BookOpen, Brain, Mic, Upload, Zap, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Drop Any PDF",
    description:
      "Upload textbooks, research papers, or notes. Our AI instantly processes and indexes every page.",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Mic,
    title: "Voice Conversations",
    description:
      "Ask questions naturally using your voice. Get spoken answers that feel like talking to a real tutor.",
    color: "text-accent",
    glow: "glow-accent",
  },
  {
    icon: Brain,
    title: "Deep Understanding",
    description:
      "AI that truly comprehends context, cross-references chapters, and connects ideas across your materials.",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: MessageSquare,
    title: "Smart Follow-ups",
    description:
      "The AI remembers your conversation history and builds on previous answers for deeper learning.",
    color: "text-accent",
    glow: "glow-accent",
  },
  {
    icon: Zap,
    title: "Instant Summaries",
    description:
      "Get chapter summaries, key takeaways, and study guides generated in seconds.",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: BookOpen,
    title: "Multi-Book Library",
    description:
      "Build your personal AI library. Cross-reference multiple books and find connections between topics.",
    color: "text-accent",
    glow: "glow-accent",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Features
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
            Everything you need to{" "}
            <span className="text-gradient-primary">study smarter</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Powered by advanced AI that turns passive reading into active,
            conversational learning.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-card ${feature.color} mb-4`}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

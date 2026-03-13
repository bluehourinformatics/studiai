"use client";
import { motion } from "framer-motion";
import { Upload, MessageSquare, GraduationCap } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your PDF",
    description:
      "Drag & drop any textbook, paper, or notes. AI processes it instantly.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Ask Questions by Voice",
    description:
      "Tap the mic and ask anything. Your AI tutor responds conversationally.",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Learn & Master",
    description:
      "Get summaries, explanations, and quizzes tailored to your learning pace.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
            Three steps to{" "}
            <span className="text-gradient-primary">mastery</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass glow-primary">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

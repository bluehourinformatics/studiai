"use client";
import { motion } from "framer-motion";
import { ArrowRight, Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBook from "@/public/hero-book.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20">
      {/* Animated orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-75 h-75 rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 w-fit"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              AI-Powered Learning
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
            Talk to your
            <br />
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              textbooks
            </span>
            <br />
            like never before
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Upload any PDF and start a voice conversation with your study
            material. Your AI tutor understands context, answers questions, and
            helps you learn faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button size="lg" className="gap-2 text-base">
              Start Learning Free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-card text-base"
            >
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">PDF Upload</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Voice Chat</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 rounded-full bg-primary/10 blur-[80px]" />
          </div>
          <img
            src={"hero-book.png"}
            alt="AI-powered book with glowing particles"
            className="relative z-10 w-full max-w-md lg:max-w-lg drop-shadow-2xl"
          />
          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-4 glass rounded-xl px-4 py-3 flex items-center gap-2 z-20"
          >
            <Mic className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">"Explain chapter 3"</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-16 left-0 glass rounded-xl px-4 py-3 flex items-center gap-2 z-20"
          >
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium">AI is responding...</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

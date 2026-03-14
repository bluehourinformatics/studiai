"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl glass glow-primary p-10 sm:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to transform how you{" "}
              <span className="text-gradient-primary">study</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Join thousands of students who are learning faster with AI-powered
              voice conversations.
            </p>
            <Link href={"/sign-up"}>
              <Button size="lg" className="gap-2 text-base">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground mt-4">
              No credit card required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

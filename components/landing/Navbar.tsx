"use client";
import { motion } from "framer-motion";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-primary">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold font-display text-foreground">
            Studi
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              AI
            </span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton>
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm">Get Started</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass border-t border-border/50 px-6 py-4 flex flex-col gap-4"
        >
          <a href="#features" className="text-sm text-muted-foreground">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground">
            How it Works
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground">
            Pricing
          </a>
          <Button size="sm" className="w-full">
            Get Started
          </Button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

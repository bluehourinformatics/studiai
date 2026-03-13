"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, Sparkles, CheckCircle2 } from "lucide-react";

export type UploadStage = "uploading" | "synthesizing" | "done";

interface UploadProgressDialogProps {
  open: boolean;
  stage: UploadStage;
  progress: number; // 0-100
  fileName?: string;
}

const stageConfig: Record<
  UploadStage,
  { icon: typeof Upload; title: string; description: string }
> = {
  uploading: {
    icon: Upload,
    title: "Uploading your book",
    description:
      "Your file is being securely uploaded. Please don't close this page.",
  },
  synthesizing: {
    icon: Sparkles,
    title: "Synthesizing content",
    description:
      "Our AI is analyzing chapters, extracting key concepts, and preparing your study materials.",
  },
  done: {
    icon: CheckCircle2,
    title: "All done!",
    description:
      "Your book has been processed and is ready for study sessions.",
  },
};

export function UploadProgressDialog({
  open,
  stage,
  progress,
  fileName,
}: UploadProgressDialogProps) {
  const config = stageConfig[stage];
  const Icon = config.icon;

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="items-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Animated icon */}
              <div className="relative">
                <motion.div
                  className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                  animate={
                    stage === "synthesizing"
                      ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }
                      : stage === "uploading"
                        ? { y: [0, -4, 0] }
                        : {}
                  }
                  transition={{
                    repeat: stage !== "done" ? Infinity : 0,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <Icon
                    className={`h-8 w-8 ${stage === "done" ? "text-green-500" : "text-primary"}`}
                  />
                </motion.div>

                {/* Pulsing ring for active stages */}
                {stage !== "done" && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>

              <DialogTitle className="text-lg font-display">
                {config.title}
              </DialogTitle>
              <DialogDescription className="text-sm max-w-xs">
                {config.description}
              </DialogDescription>
            </motion.div>
          </AnimatePresence>
        </DialogHeader>

        {/* Progress bar */}
        <div className="space-y-2 mt-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{fileName && stage !== "done" ? fileName : "\u00A0"}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

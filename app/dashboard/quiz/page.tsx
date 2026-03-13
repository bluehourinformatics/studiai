"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const sampleQuizzes = [
  { id: "ml", title: "Machine Learning Basics", icon: "🤖", questionCount: 5 },
  { id: "chem", title: "Organic Chemistry", icon: "🧪", questionCount: 5 },
  { id: "physics", title: "Modern Physics", icon: "⚛️", questionCount: 5 },
];

const questionBank: Record<
  string,
  { question: string; options: string[]; correct: number }[]
> = {
  ml: [
    {
      question: "What is the primary goal of supervised learning?",
      options: [
        "Cluster similar data points",
        "Learn a mapping from inputs to outputs",
        "Reduce data dimensionality",
        "Generate new data samples",
      ],
      correct: 1,
    },
    {
      question: "Which algorithm is commonly used for classification tasks?",
      options: ["K-Means", "Linear Regression", "Random Forest", "PCA"],
      correct: 2,
    },
    {
      question: "What does 'overfitting' mean in machine learning?",
      options: [
        "The model is too simple",
        "The model performs well on unseen data",
        "The model memorizes training data and fails on new data",
        "The model trains too slowly",
      ],
      correct: 2,
    },
    {
      question: "What is a neural network 'epoch'?",
      options: [
        "A single neuron's activation",
        "One complete pass through the training dataset",
        "The learning rate schedule",
        "A type of loss function",
      ],
      correct: 1,
    },
    {
      question: "Which technique helps prevent overfitting?",
      options: [
        "Increasing model complexity",
        "Removing validation data",
        "Regularization",
        "Using a smaller dataset",
      ],
      correct: 2,
    },
  ],
  chem: [
    {
      question: "What type of bond involves sharing electrons?",
      options: [
        "Ionic bond",
        "Covalent bond",
        "Metallic bond",
        "Hydrogen bond",
      ],
      correct: 1,
    },
    {
      question: "What is the hybridization of carbon in methane (CH₄)?",
      options: ["sp", "sp²", "sp³", "sp³d"],
      correct: 2,
    },
    {
      question: "Which functional group defines an alcohol?",
      options: ["-COOH", "-OH", "-NH₂", "-CHO"],
      correct: 1,
    },
    {
      question: "What is an isomer?",
      options: [
        "A radioactive isotope",
        "A molecule with the same formula but different structure",
        "A charged atom",
        "A type of polymer",
      ],
      correct: 1,
    },
    {
      question: "Which reaction type involves addition of water?",
      options: ["Dehydration", "Hydrolysis", "Oxidation", "Reduction"],
      correct: 1,
    },
  ],
  physics: [
    {
      question: "What does E = mc² describe?",
      options: [
        "Gravitational force",
        "Mass-energy equivalence",
        "Electromagnetic induction",
        "Wave interference",
      ],
      correct: 1,
    },
    {
      question: "What is the uncertainty principle associated with?",
      options: ["Einstein", "Heisenberg", "Bohr", "Schrödinger"],
      correct: 1,
    },
    {
      question: "What is a photon?",
      options: [
        "A unit of sound",
        "A quantum of light",
        "A subatomic particle with mass",
        "A type of electron",
      ],
      correct: 1,
    },
    {
      question: "What phenomenon demonstrates wave-particle duality?",
      options: [
        "Photoelectric effect",
        "Ohm's law",
        "Newton's third law",
        "Thermodynamics",
      ],
      correct: 0,
    },
    {
      question: "What is quantum entanglement?",
      options: [
        "Particles orbiting each other",
        "Correlated quantum states regardless of distance",
        "Nuclear fusion process",
        "Electromagnetic resonance",
      ],
      correct: 1,
    },
  ],
};

type Phase = "select" | "quiz" | "results";

export default function DashboardQuiz() {
  const [phase, setPhase] = useState<Phase>("select");
  const [quizId, setQuizId] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string>("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = questionBank[quizId] || [];
  const question = questions[currentQ];
  const score = answers.filter(
    (a, i) => a === questionBank[quizId]?.[i]?.correct,
  ).length;

  const startQuiz = (id: string) => {
    setQuizId(id);
    setCurrentQ(0);
    setSelected("");
    setAnswers([]);
    setShowFeedback(false);
    setPhase("quiz");
  };

  const submitAnswer = () => {
    const answerIndex = parseInt(selected);
    setAnswers([...answers, answerIndex]);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelected("");
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("results");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Take a Quiz</h1>
        <p className="text-muted-foreground mt-1">
          Test your knowledge on uploaded materials
        </p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid sm:grid-cols-3 gap-4"
          >
            {sampleQuizzes.map((q) => (
              <Card
                key={q.id}
                className="glass border-border/50 cursor-pointer hover:border-primary/30 transition-all"
                onClick={() => startQuiz(q.id)}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <span className="text-4xl">{q.icon}</span>
                  <h3 className="font-semibold">{q.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {q.questionCount} questions
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Start
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {phase === "quiz" && question && (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass border-border/50">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Question {currentQ + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-primary font-medium">
                    {Math.round(
                      ((currentQ + (showFeedback ? 1 : 0)) / questions.length) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    ((currentQ + (showFeedback ? 1 : 0)) / questions.length) *
                    100
                  }
                  className="h-1.5"
                />
                <CardTitle className="text-lg leading-relaxed">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={selected}
                  onValueChange={setSelected}
                  disabled={showFeedback}
                >
                  {question.options.map((opt, i) => {
                    const isCorrect = i === question.correct;
                    const isSelected = parseInt(selected) === i;
                    let extraClass = "";
                    if (showFeedback) {
                      if (isCorrect) extraClass = "border-primary bg-primary/5";
                      else if (isSelected && !isCorrect)
                        extraClass = "border-destructive bg-destructive/5";
                    }
                    return (
                      <Label
                        key={i}
                        htmlFor={`opt-${i}`}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${extraClass || "border-border/50 hover:bg-muted/50"}`}
                      >
                        <RadioGroupItem value={String(i)} id={`opt-${i}`} />
                        <span className="text-sm">{opt}</span>
                        {showFeedback && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-primary ml-auto" />
                        )}
                        {showFeedback && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-destructive ml-auto" />
                        )}
                      </Label>
                    );
                  })}
                </RadioGroup>

                <div className="flex justify-end pt-2">
                  {!showFeedback ? (
                    <Button onClick={submitAnswer} disabled={!selected}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion}>
                      {currentQ + 1 < questions.length ? "Next" : "See Results"}{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <Card className="glass border-border/50">
              <CardContent className="p-8 space-y-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {Math.round((score / questions.length) * 100)}%
                  </h2>
                  <p className="text-muted-foreground">
                    You got {score} out of {questions.length} correct
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {score === questions.length
                    ? "Perfect score! 🎉"
                    : score >= questions.length * 0.8
                      ? "Great job! 🌟"
                      : score >= questions.length * 0.6
                        ? "Good effort! Keep studying 📚"
                        : "Keep practicing, you'll get there! 💪"}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => startQuiz(quizId)}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Retry
                  </Button>
                  <Button onClick={() => setPhase("select")}>
                    Choose Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { BookOpen, Phone, PhoneOff, User } from "lucide-react";
import robotAvatar from "@/public/robot-avatar.png";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { endSession, startSession } from "@/lib/actions/session";
import { toast } from "sonner";

interface TranscriptEntry {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  sources?: { text: string; pageNumber?: number }[];
}

interface Props {
  book: any;
}

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

export default function ChatPageClient({ book }: Props) {
  const { user } = useUser();
  const [callStatus, setCallStatus] = useState<
    "inactive" | "connecting" | "active"
  >("inactive");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [liveTranscript, setLiveTranscript] = useState<{
    role: string;
    text: string;
  } | null>(null);
  const vapiRef = useRef<Vapi | null>(null);
  const idRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Keep sessionId accessible inside VAPI event callbacks without stale closure
  const sessionIdRef = useRef<string | null>(null);

  const addTranscript = useCallback(
    (role: "user" | "assistant", content: string) => {
      setTranscripts((prev) => [
        ...prev,
        { role, content, createdAt: new Date() },
      ]);
      setLiveTranscript(null);
    },
    [],
  );

  //   Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts, liveTranscript]);

  // vapi
  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
    vapiRef.current = vapi;

    vapi.on("call-start", () => setCallStatus("active"));
    vapi.on("call-end", () => {
      setCallStatus("inactive");
      setIsSpeaking(false);
      setVolumeLevel(0);
      setLiveTranscript(null);
      if (sessionIdRef.current) {
        endSession(sessionIdRef.current);
      }
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));
    vapi.on("volume-level", (level: number) => setVolumeLevel(level));

    vapi.on("message", (msg: any) => {
      if (msg.type === "transcript") {
        const role = msg.role === "assistant" ? "assistant" : "user";
        if (msg.transcriptType === "final") {
          addTranscript(role as "user" | "assistant", msg.transcript);
        } else {
          setLiveTranscript({ role, text: msg.transcript });
        }
      }
    });

    vapi.on("error", (err: any) => {
      console.error("Vapi error:", err);
      setCallStatus("inactive");
      if (sessionIdRef.current) {
        endSession(sessionIdRef.current);
      }
    });

    return () => {
      vapi.stop();
    };
  }, [addTranscript]);

  const firstMessage = `Hey, good to meet you. Quick question before we dive in - have you actually read ${book.title} yet, or are we starting fresh?`;
  const toggleCall = async () => {
    if (!vapiRef.current) return;
    if (callStatus === "active") {
      vapiRef.current.stop();
    } else {
      setCallStatus("connecting");
      setTranscripts([]);

      try {
        const session = await startSession(book._id);
        if (!session.success) {
          toast.error(session.error);
          return;
        }
        sessionIdRef.current = session.sessionId;
        await vapiRef.current.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID, {
          firstMessage,
          maxDurationSeconds: session.maxDuration,
          variableValues: {
            title: book.title,
            bookId: book._id,
          },
        });
      } catch (e) {
        console.error("Failed to start call:", e);
        setCallStatus("inactive");
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Book Title Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">{book?.title}</p>
          <p className="text-xs text-muted-foreground">
            {book?.pageCount} pages
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 max-w-3xl mx-auto flex flex-col items-center justify-center px-4 w-full">
        <AnimatePresence mode="wait">
          {callStatus === "inactive" ? (
            /* ── Idle State ── */
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                  <Image
                    src={robotAvatar}
                    alt="AI Assistant"
                    className="h-full w-full object-cover"
                    width={128}
                    height={128}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-muted-foreground border-2 border-background" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Study Assistant
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Tap the button below to start a voice conversation with your
                  AI tutor
                </p>
              </div>
              <Button
                size="lg"
                className="rounded-full gap-2 px-8 glow-primary"
                onClick={toggleCall}
              >
                <Phone className="h-5 w-5" />
                Start Call
              </Button>
            </motion.div>
          ) : (
            /* ── Active / Connecting State ── */
            <motion.div
              key="call"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center w-full h-full py-6"
            >
              {/* Avatars row */}
              <div className="flex items-center justify-center gap-12 mb-6">
                {/* Robot avatar */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <AnimatePresence>
                      {isSpeaking && (
                        <>
                          <motion.div
                            className="absolute rounded-full border-2 border-primary/40"
                            initial={{ width: 96, height: 96, opacity: 0 }}
                            animate={{
                              width: 96 + volumeLevel * 50,
                              height: 96 + volumeLevel * 50,
                              opacity: 0.6,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                            }}
                          />
                          <motion.div
                            className="absolute rounded-full bg-primary/10"
                            initial={{ width: 96, height: 96, opacity: 0 }}
                            animate={{
                              width: 96 + volumeLevel * 30,
                              height: 96 + volumeLevel * 30,
                              opacity: 0.4,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          />
                        </>
                      )}
                    </AnimatePresence>
                    <div
                      className={`relative h-24 w-24 rounded-full overflow-hidden border-2 transition-colors ${isSpeaking ? "border-primary glow-primary" : "border-border"} bg-muted`}
                    >
                      <Image
                        src={robotAvatar}
                        alt="AI Assistant"
                        className="h-full w-full object-cover"
                        width={96}
                        height={96}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {callStatus === "connecting"
                      ? "Connecting..."
                      : isSpeaking
                        ? "Speaking..."
                        : "Listening"}
                  </span>
                </div>

                {/* Connection indicator */}
                <div className="flex flex-col items-center gap-1">
                  {callStatus === "connecting" ? (
                    <motion.div
                      className="flex gap-1"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-6 rounded-full bg-primary/60"
                          animate={{
                            opacity: isSpeaking ? [0.3, 1, 0.3] : 0.4,
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* User avatar */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <AnimatePresence>
                      {!isSpeaking && callStatus === "active" && (
                        <motion.div
                          className="absolute rounded-full bg-accent/10"
                          initial={{ width: 96, height: 96, opacity: 0 }}
                          animate={{
                            width: 96 + volumeLevel * 30,
                            height: 96 + volumeLevel * 30,
                            opacity: 0.4,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        />
                      )}
                    </AnimatePresence>
                    <div
                      className={`relative h-24 w-24 rounded-full overflow-hidden border-2 transition-colors ${!isSpeaking && callStatus === "active" ? "border-accent glow-accent" : "border-border"} bg-secondary flex items-center justify-center`}
                    >
                      {user?.imageUrl ? (
                        <Image
                          src={user?.imageUrl}
                          alt="profile url"
                          width={100}
                          height={100}
                          className="h-24 w-24 rounded-full text-muted-foreground object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {user?.firstName}
                  </span>
                </div>
              </div>

              {/* Call duration / status */}
              <p className="text-sm text-muted-foreground mb-4">
                {callStatus === "connecting"
                  ? "Setting up your call..."
                  : "Voice call in progress"}
              </p>

              {/* Transcription area */}
              <div className="flex-1 w-full overflow-auto glass rounded-2xl p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
                  Live Transcription
                </p>
                <div className="space-y-3">
                  {transcripts.length === 0 && !liveTranscript && (
                    <p className="text-sm text-muted-foreground/60 text-center py-8">
                      {callStatus === "connecting"
                        ? "Connecting to assistant..."
                        : "Start speaking — your conversation will appear here"}
                    </p>
                  )}
                  {transcripts.map((t) => (
                    <motion.div
                      key={t.content}
                      initial={{ opacity: 0, x: t.role === "user" ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-2 ${t.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {t.role === "assistant" && (
                        <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-border">
                          <Image
                            src={robotAvatar}
                            alt=""
                            className="h-full w-full object-cover"
                            width={24}
                            height={24}
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                          t.role === "assistant"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {t.content}
                      </div>
                      {t.role === "user" && (
                        <div className="h-6 w-6 rounded-full shrink-0 border border-border bg-secondary flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {liveTranscript && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      className={`flex gap-2 ${liveTranscript.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {liveTranscript.role === "ai" && (
                        <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-border">
                          <Image
                            src={robotAvatar}
                            alt=""
                            className="h-full w-full object-cover"
                            width={24}
                            height={24}
                          />
                        </div>
                      )}
                      <div className="max-w-[80%] rounded-xl px-3 py-2 text-sm italic bg-muted text-muted-foreground">
                        {liveTranscript.text}...
                      </div>
                      {liveTranscript.role === "user" && (
                        <div className="h-6 w-6 rounded-full shrink-0 border border-border bg-secondary flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </motion.div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>

              {/* End call button */}
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full gap-2 px-8"
                onClick={toggleCall}
                disabled={callStatus === "connecting"}
              >
                <PhoneOff className="h-5 w-5" />
                {callStatus === "connecting" ? "Connecting..." : "End Call"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

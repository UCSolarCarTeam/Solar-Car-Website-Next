"use client";

import { useRef, useEffect, useState } from "react";
import { useChat, UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "framer-motion";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTED = [
  "Tell me about the team",
  "Who are the sponsors?",
  "What is a solar car?",
  "When are the next races?",
  "Tell me about Vyapak",
];

function parseMarkdownBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-[#FF5A5A] font-bold">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter(
      (p): p is { type: "text"; text: string } =>
        p.type === "text" && typeof (p as { text?: unknown }).text === "string",
    )
    .map((p) => p.text)
    .join("");
}

// ---- Car Avatar Component (Replacing the Sun Logo) ----
function CarAvatar({
  size = 48,
  isThinking = false,
}: {
  size?: number;
  isThinking?: boolean;
}) {
  return (
    <motion.div
      style={{ width: size, height: size * 0.7, flexShrink: 0 }}
      animate={
        isThinking
          ? { filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"], y: [0, -4, 0] }
          : { y: [0, -2, 0] }
      }
      transition={{
        duration: isThinking ? 1.5 : 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      className="relative flex items-center justify-center"
    >
      <img
        src="/HeliosSideview.png"
        alt="Helios car"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-[5px] items-center p-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[7px] h-[7px] rounded-full bg-[#FF0000] opacity-80"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function Message({ msg }: { msg: UIMessage }) {
  const isUser = msg.role === "user";
  const text = getMessageText(msg);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <div className="mt-1">
          <CarAvatar size={44} isThinking={false} />
        </div>
      )}
      <div
        className={`max-w-[72%] flex flex-col gap-1.5 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 text-[14.5px] leading-relaxed tracking-tight ${
            isUser
              ? "rounded-[20px_20px_4px_20px] bg-gradient-to-br from-[#FF0000] to-[#8B0000] border-none shadow-[0_4px_20px_rgba(255,0,0,0.3)]"
              : "rounded-[4px_20px_20px_20px] bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          } text-[#F0EDE8]`}
        >
          {isUser ? text : parseMarkdownBold(text)}
        </div>
      </div>
    </motion.div>
  );
}

export default function SolarChatbot() {
  const { messages, status, sendMessage } = useChat({
    transport: chatTransport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent,
  ) => {
    e?.preventDefault();
    (e as React.FormEvent)?.stopPropagation?.();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      sendMessage({ text: input });
      setInput("");
    }
  };

  const showTypingDots = status === "submitted";

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open SOLARIS chat assistant"
            className="fixed bottom-7 right-7 w-20 h-20 rounded-full border-none cursor-pointer flex items-center justify-center z-50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-gradient-to-br from-[#FF8080] via-[#FF0000] to-[#8B0000]"
          >
            <motion.div
              className="absolute inset-[10px] rounded-full"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255,0,0,0.5)",
                  "0 0 0 12px rgba(255,0,0,0)",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src="/HeliosSideview.png"
              alt="Helios solar car"
              className="relative z-10 w-[90%] h-auto object-contain drop-shadow-lg"
              style={{ transform: "rotate(-10deg)" }}
              animate={{ rotate: [-10, -7, -10] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            role="dialog"
            aria-label="SOLARIS chat assistant"
            className="fixed bottom-6 right-6 w-[calc(100vw-48px)] max-w-[420px] h-[calc(100vh-48px)] max-h-[620px] flex flex-col rounded-3xl overflow-hidden z-[60] border border-[#FF0000]/20 bg-[#08101a]/90 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-b from-[#FF0000]/10 to-transparent border-b border-white/5 flex items-center gap-3">
              <CarAvatar size={56} isThinking={isLoading} />
              <div className="flex-1">
                <div className="font-bold text-base text-[#F0EDE8] tracking-wide">
                  SOLARIS
                </div>
                <div
                  className={`text-xs mt-0.5 flex items-center gap-1.5 ${isLoading ? "text-[#FF0000]" : "text-[#4CAF80]"}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-[#FF0000]" : "bg-[#4CAF80]"}`}
                    style={{
                      boxShadow: `0 0 6px ${isLoading ? "#FF0000" : "#4CAF80"}`,
                    }}
                  />
                  {isLoading ? "Thinking..." : "Solar Car Team Assistant"}
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="w-8 h-8 shrink-0 rounded-full border border-white/10 bg-white/5 text-[#F0EDE8]/60 flex items-center justify-center hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF0000]"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 flex-row"
                >
                  <div className="mt-1">
                    <CarAvatar size={44} isThinking={false} />
                  </div>
                  <div className="max-w-[72%] flex flex-col gap-1.5 items-start">
                    <div className="px-4 py-3 text-[14.5px] rounded-[4px_20px_20px_20px] bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-[#F0EDE8] leading-relaxed">
                      Hello! ☀️ I&apos;m SOLARIS, the AI assistant for our Solar
                      Car Team. Ask me anything about the team, sponsors, or solar technology!
                    </div>
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => (
                <Message key={msg.id} msg={msg} />
              ))}

              {showTypingDots && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <CarAvatar size={48} isThinking={true} />
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-[4px_20px_20px_20px]">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="px-4 pb-3 flex flex-wrap gap-1.5"
                role="group"
                aria-label="Suggested questions"
              >
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#FF5A5A]/25 bg-[#FF5A5A]/5 text-[#FF5A5A] hover:bg-[#FF5A5A]/15 hover:border-[#FF5A5A]/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A5A]"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit as React.FormEventHandler<HTMLFormElement>}
              className="p-3 border-t border-white/5 flex gap-2.5 items-end"
            >
              <textarea
                ref={(el) => {
                  (
                    inputRef as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = el;
                  (
                    textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = el;
                }}
                value={input}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                placeholder="Ask about the team..."
                rows={1}
                aria-label="Message input"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[#F0EDE8] text-sm resize-none leading-relaxed focus:outline-none focus:border-[#FF0000]/40 transition-colors overflow-hidden"
                style={{ maxHeight: "120px" }}
              />
              <button
                type="submit"
                disabled={!input?.trim() || isLoading}
                aria-label="Send message"
                className={`w-10 h-10 shrink-0 rounded-xl border border-[#FF0000]/30 shadow-none flex items-center justify-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF0000] ${
                  input?.trim() && !isLoading
                    ? "bg-gradient-to-br from-[#FF0000] to-[#8B0000] cursor-pointer hover:scale-105"
                    : "bg-white/5 cursor-not-allowed opacity-40"
                }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

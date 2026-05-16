"use client";

import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { type UIMessage, useChat } from "@ai-sdk/react";

import styles from "./ChatBot.module.scss";

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
      <strong className={styles.boldText} key={i}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function getMessageText(msg: UIMessage): string {
  if (!msg.parts) return "";
  return (msg.parts as { type: string; text?: string }[])
    .filter(
      (p): p is { type: "text"; text: string } =>
        p?.type === "text" && typeof p.text === "string",
    )
    .map((p) => p.text)
    .join("");
}

// ---- Car Avatar Component (Replacing the Sun Logo) ----
function CarAvatar({
  isThinking = false,
  size = 48,
}: {
  size?: number;
  isThinking?: boolean;
}) {
  return (
    <motion.div
      animate={
        isThinking
          ? {
              filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
              y: [0, -4, 0],
            }
          : { y: [0, -2, 0] }
      }
      className={styles.avatarContainer}
      style={{ flexShrink: 0, height: size * 0.7, width: size }}
      transition={{
        duration: isThinking ? 1.5 : 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <img
        alt="Helios car"
        className={styles.avatarImage}
        src="/assets/HeliosSideview.png"
      />
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className={styles.typingDotsContainer}>
      {[0, 1, 2].map((i) => (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], y: [0, -6, 0] }}
          className={styles.typingDot}
          key={i}
          transition={{
            delay: i * 0.2,
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
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
      animate={{ opacity: 1, y: 0 }}
      className={`${styles.messageRow} ${isUser ? styles.messageRowUser : ""}`}
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {!isUser && (
        <div className={styles.avatarWrapper}>
          <CarAvatar isThinking={false} size={44} />
        </div>
      )}
      <div
        className={`${styles.messageBubbleWrapper} ${
          isUser
            ? styles.messageBubbleWrapperUser
            : styles.messageBubbleWrapperBot
        }`}
      >
        <div
          className={`${styles.messageBubble} ${
            isUser ? styles.messageBubbleUser : styles.messageBubbleBot
          }`}
        >
          {isUser ? text : parseMarkdownBold(text)}
        </div>
      </div>
    </motion.div>
  );
}

export default function SolarChatbot() {
  const { messages, sendMessage, status } = useChat({
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
    void sendMessage({ text: input });
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      void sendMessage({ text: input });
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
            animate={{ scale: 1 }}
            aria-label="Open SOLARIS chat assistant"
            className={styles.triggerButton}
            exit={{ scale: 0 }}
            initial={{ scale: 0 }}
            key="trigger"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255,0,0,0.5)",
                  "0 0 0 12px rgba(255,0,0,0)",
                ],
              }}
              className={styles.triggerRing}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
            <motion.img
              alt="Helios solar car"
              animate={{ rotate: [-10, -7, -10] }}
              className={styles.triggerImage}
              src="/assets/HeliosSideview.png"
              style={{ transform: "rotate(-10deg)" }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label="SOLARIS chat assistant"
            className={styles.chatPanel}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            key="chat"
            role="dialog"
            transition={{ bounce: 0, duration: 0.4, type: "spring" }}
          >
            {/* Header */}
            <div className={styles.header}>
              <CarAvatar isThinking={isLoading} size={56} />
              <div className={styles.headerInfo}>
                <div className={styles.headerTitle}>SOLARIS</div>
                <div
                  className={`${styles.headerStatus} ${isLoading ? styles.headerStatusLoading : styles.headerStatusReady}`}
                >
                  <div
                    className={`${styles.statusDot} ${isLoading ? styles.statusDotLoading : styles.statusDotReady}`}
                  />
                  {isLoading ? "Thinking..." : "Solar Car Team Assistant"}
                </div>
              </div>
              <button
                aria-label="Close chat"
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.length === 0 && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={`${styles.messageRow}`}
                  initial={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={styles.avatarWrapper}>
                    <CarAvatar isThinking={false} size={44} />
                  </div>
                  <div className={styles.messageBubbleWrapperBot}>
                    <div
                      className={`${styles.messageBubble} ${styles.messageBubbleBot}`}
                    >
                      Hello! ☀️ I&apos;m SOLARIS, the AI assistant for our Solar
                      Car Team. Ask me anything about the team, sponsors, or
                      solar technology!
                    </div>
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => (
                <Message key={msg.id} msg={msg} />
              ))}

              {showTypingDots && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.messageRow}
                  initial={{ opacity: 0, y: 14 }}
                >
                  <CarAvatar isThinking={true} size={48} />
                  <div
                    className={`${styles.messageBubble} ${styles.messageBubbleBot}`}
                  >
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                aria-label="Suggested questions"
                className={styles.suggestionsContainer}
                initial={{ opacity: 0, x: 30 }}
                role="group"
                transition={{ delay: 0.3 }}
              >
                {SUGGESTED.map((s) => (
                  <button
                    className={styles.suggestionButton}
                    key={s}
                    onClick={() => {
                      void sendMessage({ text: s });
                    }}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input */}
            <form className={styles.inputForm} onSubmit={handleSubmit}>
              <textarea
                aria-label="Message input"
                className={styles.inputField}
                onChange={handleInputChange}
                onKeyDown={onKeyDown}
                placeholder="Ask about the team..."
                ref={(el) => {
                  (
                    inputRef as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = el;
                  (
                    textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
                  ).current = el;
                }}
                rows={1}
                style={{ maxHeight: "120px" }}
                value={input}
              />
              <button
                aria-label="Send message"
                className={`${styles.sendButton} ${
                  input?.trim() && !isLoading
                    ? styles.sendButtonActive
                    : styles.sendButtonDisabled
                }`}
                disabled={!input?.trim() || isLoading}
                type="submit"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="16"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <line x1="22" x2="11" y1="2" y2="13" />
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

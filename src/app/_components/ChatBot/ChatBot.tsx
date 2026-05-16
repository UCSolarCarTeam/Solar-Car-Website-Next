"use client";

import { DefaultChatTransport } from "ai";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useChat } from "@ai-sdk/react";

import styles from "./ChatBot.module.scss";
import { ChatPanel } from "./ChatPanel";
import { ChatTrigger } from "./ChatTrigger";

const chatTransport = new DefaultChatTransport({ api: "/api/chat" });

export default function SolarChatbot() {
  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.chatBotContainer}>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && <ChatTrigger onClick={() => setIsOpen(true)} />}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            messages={messages}
            onClose={() => setIsOpen(false)}
            sendMessage={sendMessage}
            status={status}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

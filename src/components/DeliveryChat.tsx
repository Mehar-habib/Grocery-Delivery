"use client";
import { getSocket } from "@/lib/socket";
import { IMessage } from "@/models/message.model";
import axios from "axios";
import { Send, Sparkles, Bot, User as UserIcon, Clock } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type props = {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userType: "user" | "delivery_boy";
};

const DeliveryChat = ({ orderId, userId, userType }: props) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join-room", orderId);

    socket.on("send-message", (message) => {
      if (message.roomId === orderId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("send-message");
    };
  }, [orderId]);

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post("/api/chat/masseges", {
          roomId: orderId,
        });
        setMessages(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAllMessages();
  }, [orderId]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = getSocket();
    const message = {
      text: newMessage,
      senderId: userId,
      roomId: orderId,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("send-message", message);
    setNewMessage("");
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getSuggestion = async () => {
    try {
      setLoadingSuggestions(true);
      const lastMessage = messages
        ?.filter((msg) => msg.senderId !== userId)
        .at(-1);

      const result = await axios.post("/api/chat/ai-suggestions", {
        message: lastMessage?.text,
        role: userType,
      });
      setSuggestions(result.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse" />
          <h3 className="text-white font-medium">Live Chat</h3>
        </div>
        <button
          onClick={getSuggestion}
          disabled={loadingSuggestions}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {loadingSuggestions ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>AI Suggest</span>
        </button>
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 bg-green-50/50"
          >
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Bot className="w-3 h-3" />
                Suggested replies
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => {
                      setNewMessage(s);
                      setShowSuggestions(false);
                    }}
                    className="bg-white border border-green-200 hover:border-green-500 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors shadow-sm"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        ref={chatBoxRef}
        className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50/50"
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-gray-400">
              <div>
                <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the conversation</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === userId;
              return (
                <motion.div
                  key={msg._id?.toString() || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      isMe
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    } rounded-2xl px-4 py-2 shadow-sm`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isMe ? "text-green-100" : "text-gray-400"
                      } flex items-center gap-1`}
                    >
                      <Clock className="w-3 h-3" />
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-2.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryChat;

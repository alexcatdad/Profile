'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { WebLLMService, type ResumeChatResponse } from '@/lib/web-llm';
import type { JSONResume } from '@/types/json-resume';
import { useResumeHighlight } from '@/hooks/useResumeHighlight';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sections?: Array<'experience' | 'skills' | 'projects' | 'personal'>;
}

interface ResumeChatProps {
  resume: JSONResume;
}

const sectionLabels: Record<'experience' | 'skills' | 'projects' | 'personal', string> = {
  experience: 'Experience',
  skills: 'Skills',
  projects: 'Projects',
  personal: 'Personal',
};

export function ResumeChat({ resume }: ResumeChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [initText, setInitText] = useState('');
  const [llmService, setLlmService] = useState<WebLLMService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { highlightSection } = useResumeHighlight();

  // Initialize WebLLM service
  useEffect(() => {
    if (isOpen && !llmService) {
      setIsInitializing(true);
      const service = new WebLLMService(resume, {
        onProgress: (progress, text) => {
          setInitProgress(progress);
          setInitText(text);
        },
      });

      service
        .initialize()
        .then(() => {
          setLlmService(service);
          setIsInitializing(false);
        })
        .catch((error) => {
          console.error('Failed to initialize WebLLM:', error);
          setIsInitializing(false);
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `Failed to load the AI model: ${error instanceof Error ? error.message : 'Unknown error'}. Please refresh the page and try again.`,
            },
          ]);
        });
    }

    return () => {
      if (llmService) {
        llmService.dispose();
      }
    };
  }, [isOpen, resume, llmService]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !llmService || isInitializing) {
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantMessage: Message = {
      role: 'assistant',
      content: '',
      sections: [],
    };

    try {
      let fullContent = '';
      const generator = llmService.askQuestion(userMessage.content, (chunk) => {
        fullContent += chunk;
        assistantMessage.content = fullContent;
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[updated.length - 1]?.role === 'assistant') {
            updated[updated.length - 1] = { ...assistantMessage };
          } else {
            updated.push({ ...assistantMessage });
          }
          return updated;
        });
      });

      const response: ResumeChatResponse = await generator.next().then((r) => r.value || { answer: '', sections: [] });
      assistantMessage.content = response.answer || fullContent;
      assistantMessage.sections = response.sections || [];

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role === 'assistant') {
          updated[lastIndex] = { ...assistantMessage };
        } else {
          updated.push({ ...assistantMessage });
        }
        return updated;
      });
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, llmService, isInitializing]);

  const handleSectionClick = useCallback(
    (section: 'experience' | 'skills' | 'projects' | 'personal') => {
      highlightSection(section);
    },
    [highlightSection]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <AnimatePresence>
        {/* Chat Panel */}
        {isOpen && (
          <motion.div
            className="absolute bottom-20 left-0 flex h-[600px] w-[400px] flex-col rounded-3xl border border-white/10 bg-background/95 shadow-apple-lg backdrop-blur supports-[backdrop-filter]:bg-background/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#45caff]" />
              <h3 className="text-sm font-semibold text-white">Resume Q&A</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff47c0]/60"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {isInitializing ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#45caff]" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{initText || 'Loading AI model...'}</p>
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff47c0] to-[#45caff] transition-[width]"
                      style={{ width: `${initProgress * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-400">{Math.round(initProgress * 100)}%</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col gap-2 py-8 text-center">
                <p className="text-sm text-zinc-300">Ask me anything about Alex's resume!</p>
                <p className="text-xs text-zinc-500">Try: "What's his experience with Next.js?"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex flex-col gap-2',
                      message.role === 'user' ? 'items-end' : 'items-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2 text-sm',
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-[#ff47c0] to-[#45caff] text-white'
                          : 'bg-white/[0.04] text-zinc-200'
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    {message.sections && message.sections.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.sections.map((section) => (
                          <button
                            key={section}
                            type="button"
                            onClick={() => handleSectionClick(section)}
                            className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs text-[#45caff] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#45caff]/60"
                          >
                            {sectionLabels[section]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="rounded-2xl bg-white/[0.04] px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#45caff]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          {!isInitializing && (
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about the resume..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-[#45caff]/50 focus:outline-none focus:ring-2 focus:ring-[#45caff]/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl bg-gradient-to-r from-[#ff47c0] to-[#45caff] p-2 text-white transition-opacity disabled:opacity-50 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff47c0]/60"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Bubble */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff47c0] via-[#b04bff] to-[#45caff] transition-all duration-300 shadow-apple-lg hover:shadow-[0_20px_50px_rgba(255,71,192,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ff47c0]/40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        aria-label={isOpen ? 'Close resume chat' : 'Open resume chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}


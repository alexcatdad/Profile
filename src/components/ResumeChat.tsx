'use client';

import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useResumeHighlight } from '@/hooks/useResumeHighlight';
import { getAccessData } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { WebLLMService } from '@/lib/web-llm';
import type { JSONResume } from '@/types/json-resume';

interface Message {
  id: string;
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

export function ResumeChat({
  resume,
  alignment = 'right',
}: ResumeChatProps & { alignment?: 'left' | 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [initText, setInitText] = useState('');
  const [llmService, setLlmService] = useState<WebLLMService | null>(null);
  const [visitorName, setVisitorName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { highlightSection } = useResumeHighlight();

  useEffect(() => {
    const data = getAccessData();
    if (data?.name) {
      setVisitorName(data.name);
    }
  }, []);

  // Initialize WebLLM service
  useEffect(() => {
    if (!llmService) {
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
              id: crypto.randomUUID(),
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
  }, [resume, llmService]);

  // Auto-scroll to bottom when messages change
  useEffect(
    () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
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

      let result = await generator.next();
      while (!result.done) {
        result = await generator.next();
      }
      const response = result.value;

      assistantMessage.content = response.answer || fullContent;
      assistantMessage.sections = response.sections || [];

      // Auto-scroll/highlight if items are found
      if (response.sections && response.sections.length > 0) {
        // Fallback to section highlight if no specific items
        highlightSection(response.sections[0]);
      }

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
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, llmService, isInitializing, highlightSection]);

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
    <div className={cn('fixed bottom-8 z-50', alignment === 'left' ? 'left-8' : 'right-8')}>
      {isOpen && (
        <div
          className={cn(
            'absolute bottom-20 flex h-[600px] w-[400px] flex-col rounded-3xl border border-border bg-card/95 shadow-apple-lg backdrop-blur transition-all duration-200 supports-[backdrop-filter]:bg-card/90 dark:bg-card/95 dark:supports-[backdrop-filter]:bg-card/90',
            alignment === 'left' ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Resume Q&A</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-secondary dark:hover:text-foreground dark:focus-visible:ring-primary"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {isInitializing ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {initText || 'Loading AI model...'}
                  </p>
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width]"
                      style={{ width: `${initProgress * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{Math.round(initProgress * 100)}%</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col gap-2 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {visitorName
                    ? `Hi ${visitorName}, I'm a small assistant running in your browser to help you find specific details in Alex's resume.`
                    : "Ask me anything about Alex's resume!"}
                </p>
                <p className="text-xs text-muted-foreground/80">
                  Try: "What's his experience with Next.js?"
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex flex-col gap-2',
                      message.role === 'user' ? 'items-end' : 'items-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-2xl px-4 py-2 text-sm',
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground light:text-foreground'
                          : 'bg-secondary text-foreground'
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
                            className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-accent transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-secondary dark:text-accent dark:hover:bg-secondary dark:hover:text-foreground dark:focus-visible:ring-accent"
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
                    <div className="rounded-2xl bg-secondary px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          {!isInitializing && (
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about the resume..."
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 dark:bg-secondary dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-accent dark:focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl bg-gradient-to-r from-primary to-accent p-2 text-primary-foreground light:text-foreground transition-opacity disabled:opacity-50 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isInitializing}
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent transition-all duration-300 shadow-apple-lg hover:shadow-primary/45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40',
          isInitializing && 'opacity-80 cursor-not-allowed'
        )}
        style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
        aria-label={
          isInitializing
            ? 'Initializing AI model'
            : isOpen
              ? 'Close resume chat'
              : 'Open resume chat'
        }
        aria-expanded={isOpen}
      >
        {isInitializing ? (
          <Loader2 className="w-6 h-6 text-primary-foreground animate-spin" />
        ) : isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>
    </div>
  );
}



"use client";

import React, { useState, useRef, useEffect, FC } from "react";
import type { LucideIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Loader2, Send, User, Book, BrainCircuit, Rocket, Puzzle, Newspaper, Sun } from "lucide-react";
import { handleChat } from "@/app/canvas-chatbot/actions";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { useSearchParams } from "next/navigation";
import { useGlobal } from "@/contexts/global-state-context";
import { CalendarDayCard } from './calendar-day-card';
import { BookOfLifeView } from "./book-of-life-view";
import { HumanDesignTransitForm } from "./human-design-transit-form";
import { H5PContent } from './h5p-content';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --- Main Chatbot Client Page ---
type DisplayMessage = {
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
  id: string;
}

type HistoryMessage = {
  role: 'user' | 'model';
  content: { text: string }[];
};

function CanvasChatbotPageContent() {
    const searchParams = useSearchParams();
    const courseId = searchParams.get('course_id');
    const [parentOrigin, setParentOrigin] = useState<string | null>(null);
    useEffect(() => {
        try {
            const ref = document.referrer;
            if (ref) {
                try { setParentOrigin(new URL(ref).origin); } catch { setParentOrigin(ref); }
            }
        } catch {}
    }, []);
  
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [history, setHistory] = useState<HistoryMessage[]>([]);
    const [input, setInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const { activeHexagram, sunActiveLine } = useGlobal();

    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);
    
    const handleServerAction = async (prompt: string, currentHistory: HistoryMessage[]) => {
        setIsChatLoading(true);
        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, { role: 'assistant', content: '', id: assistantMessageId }]);

        try {
            const responseText = await handleChat(prompt, currentHistory);

            setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId ? { ...msg, content: responseText } : msg
            ));
            
            setHistory(prev => [...prev, { role: 'model', content: [{ text: responseText }] }]);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
            setMessages(prev => prev.map(msg => 
                msg.id === assistantMessageId ? { ...msg, content: `Sorry, I encountered an error: ${errorMessage}` } : msg
            ));
        } finally {
            setIsChatLoading(false);
        }
    }

    const handleSubmit = async (e?: React.FormEvent, prompt?: string) => {
        if (e) e.preventDefault();
        const currentInput = prompt || input;
        if (!currentInput.trim() || isChatLoading) return;

        const userMessage: DisplayMessage = { role: 'user', content: currentInput, id: `user-${Date.now()}` };
        setMessages(prev => [...prev, userMessage]);
        
        const newHistory: HistoryMessage[] = [...history, { role: 'user', content: [{ text: currentInput }] }];
        setHistory(newHistory);

        setInput("");
        await handleServerAction(currentInput, newHistory);
    };
    
    const handleIxAction = () => {
        const userMessage: DisplayMessage = {
            id: `user-ix-${Date.now()}`,
            role: 'user',
            content: 'Show iX Content'
        };

        const ixMessage: DisplayMessage = {
            id: `assistant-ix-${Date.now()}`,
            role: 'assistant',
            content: (
                <Card>
                    <CardContent className="p-0">
                        <H5PContent 
                            embedUrl="https://helixium.h5p.com/content/1292716558248918928/embed"
                            resizerUrl="https://helixium.h5p.com/js/h5p-resizer.js"
                        />
                    </CardContent>
                </Card>
            )
        };

        setMessages(prev => [...prev, userMessage, ixMessage]);
    };
    
    const handleDecideAction = () => {
        const userMessage: DisplayMessage = {
            id: `user-decide-${Date.now()}`,
            role: 'user',
            content: 'Show the Human Design Calculator.'
        };

        const hdFormMessage: DisplayMessage = {
            id: `assistant-hdform-${Date.now()}`,
            role: 'assistant',
            content: (
                <div className="p-4 bg-background rounded-lg">
                    <HumanDesignTransitForm />
                </div>
            )
        };

        setMessages(prev => [...prev, userMessage, hdFormMessage]);
    }
    
    const handleBookOfLifeAction = () => {
        const userMessage: DisplayMessage = {
          id: `user-book-${Date.now()}`,
          role: 'user',
          content: `Show me my Book of Life.`
        };
    
        const bookMessage: DisplayMessage = {
          id: `assistant-book-${Date.now()}`,
          role: 'assistant',
          content: <div className="overflow-x-auto"><BookOfLifeView /></div>
        };
    
        setMessages(prev => [...prev, userMessage, bookMessage]);
    };

    const handleTodayAction = () => {
      const userMessage: DisplayMessage = {
        id: `user-today-${Date.now()}`,
        role: 'user',
        content: `Show today's Rave Wheel hexagram`
      };
  
      if (activeHexagram) {
          const todayCard = (
              <CalendarDayCard
                  day={{
                      day: new Date().getDate(),
                      date: new Date(),
                      hexagramId: activeHexagram.id,
                      hexagram: activeHexagram,
                      isAnchor: false, 
                      lineChangePercentage: 0,
                  }}
                  onClick={() => {}}
                  isToday={true}
                  dateFormat="MMM d"
                  activeLine={sunActiveLine}
                  activeSequenceKey="raveWheel"
              />
          );

          const assistantMessage: DisplayMessage = {
              id: `assistant-today-${Date.now()}`,
              role: 'assistant',
              content: todayCard
          };
           setMessages(prev => [...prev, userMessage, assistantMessage]);
      } else {
           const sorryMessage: DisplayMessage = {
              id: `assistant-today-sorry-${Date.now()}`,
              role: 'assistant',
              content: "I'm sorry, I couldn't retrieve today's Rave Wheel information at the moment."
          };
          setMessages(prev => [...prev, userMessage, sorryMessage]);
      }
    };
    
    // Initial message setup
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            
            const welcomeMessage: DisplayMessage = {
                id: 'assistant-welcome',
                role: 'assistant',
                content: "Hello! I am your assistant. You can use the buttons to navigate or ask me questions."
            };
            setMessages([welcomeMessage]);
        }
    }, []); 

  
    useEffect(() => {
        const scrollContainer = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // This function is kept in case you want to handle external links in markdown differently in the future.
        const target = e.target as HTMLAnchorElement;
        if (target.tagName === 'A' && target.href && target.target === '_blank') {
          // It's an external link, default browser behavior is fine.
          return;
        }
    };
    
    type ActionWithIcon = { label: string; action: () => void; icon: LucideIcon };
    type ActionWithPrompt = { label: string; prompt: string; icon?: LucideIcon };
    const suggestedActions: Array<ActionWithIcon | ActionWithPrompt> = [
        { label: "Book of Life", action: handleBookOfLifeAction, icon: Book },
        { label: "Human Design", action: handleDecideAction, icon: BrainCircuit },
        { label: "H5P Content", action: handleIxAction, icon: Puzzle },
        { label: "Today's Hexagram", action: handleTodayAction, icon: Sun },
    ];
  
    return (
        <div className="relative h-full">
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 bg-card/50 backdrop-blur-sm rounded-full hidden lg:block">
                 <TooltipProvider>
                    <div className="flex flex-col items-center gap-2">
                        {suggestedActions.map((action) => {
                            const IconComp: LucideIcon = ('icon' in action && action.icon ? action.icon : Newspaper) as LucideIcon;
                            return (
                                <Tooltip key={action.label}>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => 'prompt' in action ? handleSubmit(undefined, action.prompt) : (action as ActionWithIcon).action()}
                                            disabled={isChatLoading}
                                            className="h-12 w-12"
                                        >
                                            <IconComp className="h-6 w-6"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>{action.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </div>
                </TooltipProvider>
            </div>

            <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm overflow-hidden">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4 max-w-4xl mx-auto" onClick={handleLinkClick}>
                    {messages.map((message) => (
                        <div
                        key={message.id}
                        className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : 'justify-start')}
                        >
                        {message.role === 'assistant' && (
                            <div className="p-2 rounded-full bg-primary/20 text-primary flex-shrink-0">
                                <Bot className="h-6 w-6" />
                            </div>
                        )}
                        <div
                            className={cn(
                                "rounded-lg",
                                message.role === 'user' && "bg-secondary text-secondary-foreground p-3 max-w-xl",
                                message.role === 'assistant' && typeof message.content === 'string' && "p-3 bg-muted prose prose-sm dark:prose-invert prose-p:my-2 prose-a:text-primary hover:prose-a:underline max-w-xl",
                                message.role === 'assistant' && typeof message.content !== 'string' && "w-full"
                            )}
                        >
                            {typeof message.content === 'string' ? 
                                <ReactMarkdown
                                    components={{
                                        a: (props) => <a {...props} rel="noopener noreferrer" />
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown> 
                                : message.content
                            }
                        </div>
                        {message.role === 'user' && (
                            <div className="p-2 rounded-full bg-foreground/20 text-foreground flex-shrink-0">
                                <User className="h-6 w-6" />
                            </div>
                        )}
                        </div>
                    ))}
                    {isChatLoading && messages[messages.length -1]?.role !== 'assistant' && (
                        <div className="flex items-start gap-4 justify-start">
                            <div className="p-2 rounded-full bg-primary/20 text-primary">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div className="max-w-md p-3 rounded-lg bg-muted flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
                        <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isChatLoading}
                        />
                        <Button type="submit" disabled={isChatLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}

// Wrap the component that uses searchParams in a Suspense boundary
export default function CanvasChatbotClientPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <CanvasChatbotPageContent />
        </React.Suspense>
    );
}

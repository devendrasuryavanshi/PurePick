'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Send, Copy, MoreVertical, Check, Share, ThumbsDown, ThumbsUp, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
    id: string
    text: string
    sender: 'user' | 'ai'
    isTyping?: boolean
}

const dummyResponses = [
    "That's an interesting perspective! Let me add that...",
    "Based on my analysis, I would suggest...",
    "Here's what I found about that topic...",
    "Let me help you understand this better...",
    "That's a great question! Here's what I think...",
];

const Page = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollTo({
            top: messagesEndRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    const simulateAIResponse = () => {
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                text: randomResponse,
                sender: 'ai'
            }]);
            
        }, 2000);
    };

    const handleSend = () => {
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: crypto.randomUUID(),
            text: inputMessage,
            sender: 'user'
        };

        setMessages(prev => [...prev, newMessage]);

        setInputMessage('');
        simulateAIResponse();
    };

    const handleCopyMessage = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);

        setTimeout(() => setCopiedId(null), 2000);
        toast.success('Message copied to clipboard');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
            e.preventDefault();
            handleSend();
        }
    };

    const EmptyChat = () => (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center overflow-auto">
            <div className="max-w-2xl space-y-6">
                <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 w-fit mx-auto">
                    <svg
                        className="w-12 h-12 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                    Welcome to Gemini Chat
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                    Experience intelligent conversations powered by advanced AI. Ask questions, get insights, and explore ideas together.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {[
                        "Get instant, accurate responses",
                        "Complex problem solving",
                        "24/7 AI assistance",
                        "Multi-topic expertise",
                        "Natural conversations",
                        "Continuous learning"
                    ].map((feature) => (
                        <div
                            key={feature}
                            className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
                        >
                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        className="px-6 py-3 text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 transition-colors font-medium"
                        onClick={() => setMessages([{
                            id: crypto.randomUUID(),
                            text: "Hello! I'm your AI assistant. How can I help you today?",
                            sender: 'ai'
                        }])}
                    >
                        Start Chatting
                    </button>
                </div>
            </div>
        </div>
    );

    const MessageActions = ({ message }: { message: Message }) => (
        <div className={`absolute bottom-0 left-0 right-0 translate-y-full pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex items-center justify-start gap-2 px-2">
                {message.sender === 'ai' && (
                    <>
                        <button
                        >
                            <ThumbsUp className="h-4 w-4" color='#16a34a' />
                        </button>
                        <button
                        >
                            <ThumbsDown className="h-4 w-4" color='#dc2626' />
                        </button>
                    </>
                )}
                <button
                    onClick={() => handleCopyMessage(message.text, message.id)}
                    className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500`}
                >
                    {copiedId === message.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-950">
            <div className="sticky top-0 z-10 p-4 border-b dark:border-gray-700 bg-white dark:bg-zinc-900 backdrop-blur-lg bg-opacity-80">
                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">Pagal GPT</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">our most duffer LLM model ever, ek baar baat to karo!</span>
            </div>

            {messages.length === 0 ? (
                <EmptyChat />
            ) : (
                <div className="flex-1 overflow-y-auto" ref={messagesEndRef}>
                    <div className="max-w-3xl mx-auto p-4 space-y-6">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="group relative max-w-[85%] md:max-w-[75%]">
                                    <div
                                        className={`px-4 py-3 ${message.sender === 'user'
                                            ? 'dark:bg-zinc-800 bg-slate-300 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tr-sm'
                                            : 'dark:bg-[#2a2a2c] bg-slate-200 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm shadow-sm'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                    </div>
                                    <MessageActions message={message} />
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="dark:bg-[#2a2a2c] bg-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


            <div className="sticky bottom-0 z-10 p-4">
                <div className="max-w-3xl mx-auto">
                    <div className="relative flex justify-center align-center gap-2 bg-white dark:bg-zinc-950 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="type kar na !"
                            className="flex-1 resize-none p-3 bg-transparent focus:outline-none dark:text-gray-200 min-h-[24px] text-zinc-900 max-h-32 rounded-2xl"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputMessage.trim() || isTyping}
                            className="self-end p-3 rounded-full dark:text-white text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0.5"
                        >
                            <ArrowUp className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Page;

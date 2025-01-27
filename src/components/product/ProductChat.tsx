import { GoogleGenerativeAI, Tool } from "@google/generative-ai";
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { nanoid } from 'nanoid';
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizontal, Bot, Slack } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { canSendMsg } from "@/lib/can-send-msg";
import { MAX_MESSAGES } from "@/data/constants";
import { Image } from "@nextui-org/react";
import { Message, ProductInsights, userDetails } from "@/types/product.types";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

export const ProductChat = ({ productId, productInsights, userDetails }: {
    productId: string,
    productInsights: ProductInsights,
    userDetails: userDetails,
}) => {
    const [messages, setMessages] = useState<Message[]>(
        productInsights.chat.messages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.timestamp),
            isComplete: true
        }))
    );
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { data: session, update, status } = useSession();
    const chatRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);

    useEffect(() => {
        const systemInstruction = `You are PurePick AI, an advanced product analysis and health advisory system. Your expertise covers product analysis, nutritional science, ingredient safety, and personalized health recommendations.

            Response Guidelines:
            - Deliver factual, scientifically-backed information
            - Cite reliable medical and research sources
            - Maintain clear, professional communication
            - Focus on product and health-related queries
            - Structure responses for easy understanding
            - Keep responses under 500 words
            - Use bullet points for key information
            - Include relevant health warnings
            - Highlight important safety considerations

            User Context:
            ${JSON.stringify(userDetails)}
            
            Current Product Context:
            ${JSON.stringify(productInsights)}`;

        const initChat = async () => {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: {
                    temperature: 0.3,
                    topK: 3,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
                systemInstruction: systemInstruction
            });
            chatRef.current = model.startChat({
                history: messages.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }))
            });
        };
        initChat();
    }, []);

    useEffect(() => {
        if (isLoading) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '/') {
                inputRef?.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [inputRef]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputValue = inputRef?.current?.value.trim();
        if (!inputValue || aiMessageCount > MAX_MESSAGES || !chatRef.current) return;
        if (inputValue.length > 2000) {
            toast.error('Message too long. Please keep it under 2000 characters.');
            return;
        }

        const userMessage: Message = {
            id: nanoid(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        let aiMessage: Message = {
            id: nanoid(),
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isComplete: false
        };

        if (inputRef.current) inputRef.current.value = '';

        setMessages(prev => [...prev, userMessage, aiMessage]);
        setIsLoading(true);

        const canSend = await canSendMsg(productId, productInsights, session?.user?.id.toString() || '');
        if (!canSend) {
            toast.error('You have reached the maximum number of messages for this product.');
            setIsLoading(false);
            let n = messages.length;
            setMessages(prev => prev.slice(0, n));
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                inputRef.current?.focus();
            }, 100);
            return;
        }

        try {
            const prompt = `User's Question:
            ${inputValue}`;

            const result = await chatRef.current.sendMessageStream(prompt);

            let fullResponse = '';
            for await (const chunk of result.stream) {
                fullResponse += chunk.text();
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === aiMessage.id
                            ? { ...msg, content: fullResponse }
                            : msg
                    )
                );
            }

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessage.id
                        ? { ...msg, isComplete: true }
                        : msg
                )
            );

            aiMessage = {
                id: aiMessage.id,
                role: 'assistant',
                content: fullResponse.trim(),
                timestamp: new Date()
            };

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    userMessage,
                    aiMessage
                }),
            });

            const res = await response.json();

            if (res?.error) {
                let n = messages.length;
                setMessages(prev => prev.slice(0, n));
                toast.error(res.error);
                setTimeout(() => {
                    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }

            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            let n = messages.length;
            setMessages(prev => prev.slice(0, n));
            toast.error('An error occurred while sending the message.');
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                inputRef?.current?.focus();
            }, 500);
        }
    };

    const aiMessageCount = messages.filter(m => m.role === 'assistant').length;
    return (

        <Card className="w-full flex flex-col justify-center items-center mx-auto bg-gradient-to-b from-white/90 to-gray-100/80 dark:from-background/80 dark:to-muted/10 backdrop-blur-sm shadow-lg rounded-t-[50px] border-3 border-b-0 rounded-b-none">
            <div className="w-full">
                <div className="md:h-[600px] h-[80vh] flex flex-col p-4 pb-0">
                    {/* Message Counter */}
                    <div className="flex items-center justify-end gap-3 mb-4 lg:px-[20%] overflow-y-auto">
                        {messages.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-12 p-4 md:py-8 md:px-0">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl opacity-20 animate-pulse" />
                                    <Slack className="relative w-12 h-12 md:w-16 md:h-16 animate-float" />
                                </div>

                                <div className="space-y-4 md:space-y-6 text-center">
                                    <div className="space-y-2">
                                        <h2 className="text-xl md:text-2xl font-bold">
                                            Your Personal Product Expert
                                        </h2>
                                        <p className="text-sm md:text-base text-muted-foreground">
                                            Ask me anything about ingredients, safety, or sustainability
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 shrink-0">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold truncate text-start">Ingredient Analysis</h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate text-start">Get detailed breakdown of components</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/30 shrink-0">
                                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold truncate text-start">Health Insights</h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate text-start">Understand health implications</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 shrink-0">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold truncate text-start">Smart Recommendations</h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate text-start">Get personalized advice</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Powered by advanced AI for accurate product analysis
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 text-sm text-muted-foreground">
                                    <span>Type your question</span>
                                    <span className="px-2 py-0.5 rounded bg-muted text-xs">ctrl + /</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin lg:px-[20%]">
                        <AnimatePresence mode="wait">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                                    max-w-[85%] p-4
                                    ${message.role === 'user'
                                            ? ' border-r-2 ml-4'
                                            : 'mr-4 border-l-2'
                                        }
                                `}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {message.role === 'assistant' && (
                                                <Slack className="w-5 h-5" />
                                            )}
                                            <span className="text-xs opacity-70">
                                                {message.role === 'assistant' ? 'PurePick AI' : 'You'}
                                            </span>
                                        </div>
                                        <div className="prose prose-sm dark:prose-invert max-w-none overflow-x-auto">
                                            {message.role === 'assistant' ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                    components={{
                                                        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-primary my-3" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="space-y-1 my-2" {...props} />,
                                                        li: ({ node, ...props }) => <li className="flex items-center gap-2 before:content-['•'] before:text-primary" {...props} />,
                                                        table: ({ node, ...props }) => <table className="w-full my-3 border-collapse" {...props} />,
                                                        td: ({ node, ...props }) => <td className="p-2 border-b border-muted" {...props} />,
                                                        th: ({ node, ...props }) => <th className="p-2 text-left bg-muted/50 border-b border-primary/20" {...props} />,
                                                        strong: ({ node, ...props }) => <strong className="font-medium text-primary" {...props} />,
                                                        em: ({ node, ...props }) => <em className="text-primary/80 italic" {...props} />,
                                                        a: ({ node, href, children, ...props }) => {
                                                            const isImage = href?.match(/\.(jpg|jpeg|gif|png|webp)$/i);
                                                            if (isImage) {
                                                                return (
                                                                    <Image
                                                                        width={200}
                                                                        height={200}
                                                                        src={href}
                                                                        alt="img"
                                                                        className="rounded-lg max-w-full h-auto my-4 border border-muted shadow-sm"
                                                                        loading="lazy"
                                                                    />
                                                                );
                                                            }
                                                            return (
                                                                <a
                                                                    href={href}
                                                                    className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    {...props}
                                                                >
                                                                    {children}
                                                                </a>
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>

                                            ) : (
                                                message.content
                                            )}
                                        </div>
                                        <span className={`pt-2 text-xs opacity-70 ${message.role === 'assistant' ? 'text-left' : 'text-right'} block ${(message.role === 'assistant' && message.isComplete) || message.role === 'user' ? '' : 'hidden'}`}>
                                            {new Date(message.timestamp).toLocaleDateString()}
                                            {' '}
                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                        {!message.isComplete && message.role === 'assistant' && (
                                            <div className="mt-2 space-y-2">
                                                <div className="flex items-center gap-0.5">
                                                    <motion.span
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="text-sm font-medium bg-gradient-to-r from-blue-500 to-rose-500 bg-clip-text text-transparent"
                                                    >
                                                        Generating response
                                                    </motion.span>
                                                    <motion.span
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                            delay: 0.3,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="text-blue-500 text-xs pt-2"
                                                    >
                                                        •
                                                    </motion.span>
                                                    <motion.span
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                            delay: 0.6,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="text-violet-500 text-xs pt-2"
                                                    >
                                                        •
                                                    </motion.span>
                                                    <motion.span
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 2,
                                                            delay: 0.9,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="text-rose-500 text-xs pt-2"
                                                    >
                                                        •
                                                    </motion.span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full lg:px-[20%]">
                        <div className="relative h-8 w-8">
                            <svg className="w-8 h-8 transform -rotate-90">
                                <circle
                                    cx="16"
                                    cy="16"
                                    r="14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    className="text-muted"
                                />
                                <circle
                                    cx="16"
                                    cy="16"
                                    r="14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray={88}
                                    strokeDashoffset={88 - (88 * aiMessageCount) / MAX_MESSAGES}
                                    className="text-primary transition-all duration-500 ease-out"
                                />
                            </svg>
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium">
                                {aiMessageCount}/{MAX_MESSAGES}
                            </span>
                        </div>
                        <input
                            maxLength={2000}
                            ref={inputRef}
                            placeholder="Ask about this product..."
                            className="bg-transparent w-full rounded-full h-10 border-1 p-1 px-4 focus:outline-none"
                            disabled={isLoading || aiMessageCount >= MAX_MESSAGES}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || aiMessageCount >= MAX_MESSAGES}
                            className="rounded-full px-6 bg-black"
                        >
                            <SendHorizontal className="w-5 h-5" />
                        </Button>
                    </form>
                    <span className="text-xs text-muted-foreground w-full text-center p-0.5">
                        PurePick AI can make mistakes.
                    </span>
                </div>
            </div>
        </Card>
    );
};

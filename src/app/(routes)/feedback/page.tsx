'use client'

import { motion } from "framer-motion";
import { Button, Card, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { IconMoodHappy, IconMoodSad, IconMoodNeutral, IconSend, IconSparkles, IconMoodCry, IconMoodCrazyHappy } from '@tabler/icons-react';
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const FeedbackPage = () => {
    const { data: session } = useSession();
    const [isSending, setIsSending] = useState(false);
    const [feedback, setFeedback] = useState({
        type: '',
        subject: '',
        message: '',
        rating: 0,
        email: session?.user?.email || ''
    });

    const quickFeedbacks = [
        "The AI analysis was very helpful",
        "Product scanning needs improvement",
        "Love the personalized recommendations",
        "App interface is intuitive",
        "Loading times could be faster"
    ];

    const handleSubmit = async () => {
        if (!feedback.type || !feedback.message || !feedback.rating) {
            toast.error("Please fill in all required fields");
            return;
        }
        setIsSending(true);
        toast.loading("Sending feedback...");

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...feedback, email: session?.user?.email })
            });

            if (response.ok) {
                toast.success("Thank you for your feedback!");
                setFeedback({ type: '', subject: '', message: '', rating: 0, email: session?.user?.email || '' });
            }
        } catch (error) {
            toast.error("Failed to submit feedback");
        }
        setIsSending(false);
        toast.dismiss();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
            <motion.div
                className="max-w-4xl mx-auto px-4 py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            We Value Your Feedback
                        </h1>
                    </div>

                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <Select
                                label="Feedback Type"
                                value={feedback.type}
                                onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
                                className="md:w-1/2"
                                isRequired
                            >
                                <SelectItem key="suggestion" value="suggestion">💡 Suggestion</SelectItem>
                                <SelectItem key="bug" value="bug">🐛 Bug Report</SelectItem>
                                <SelectItem key="appreciation" value="appreciation">💝 Appreciation</SelectItem>
                                <SelectItem key="other" value="other">✨ Other</SelectItem>
                            </Select>

                            <Input
                                label="Subject (Optional)"
                                value={feedback.subject}
                                onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
                                className="md:w-1/2"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-default-500">How would you rate your experience?</label>
                            <div className="flex justify-center gap-4 p-4 bg-default-100 rounded-xl">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <motion.button
                                        key={rating}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setFeedback({ ...feedback, rating })}
                                        className={`md:p-4 p-2 rounded-full transition-all ${feedback.rating === rating
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-default-200 hover:bg-default-300'
                                            }`}
                                    >
                                        {rating === 1 ? <IconMoodCry /> :
                                            rating === 2 ? <IconMoodSad /> :
                                                rating === 3 ? <IconMoodNeutral /> :
                                                    rating === 4 ? <IconMoodHappy /> :
                                                        <IconMoodCrazyHappy />}
                                    </motion.button>
                                ))}

                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-default-500">Quick Suggestions</label>
                            <div className="flex flex-wrap gap-2">
                                {quickFeedbacks.map((text, index) => (
                                    <Button
                                        key={index}
                                        size="sm"
                                        variant="flat"
                                        onClick={() => setFeedback({ ...feedback, message: text })}
                                        className="bg-default-100 hover:bg-default-200"
                                    >
                                        {text}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Textarea
                            label="Your Message"
                            value={feedback.message}
                            onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                            minRows={4}
                            isRequired
                            className="w-full"
                        />

                        <Button
                            disabled={isSending}
                            color="primary"
                            size="lg"
                            className="w-full font-semibold"
                            endContent={<IconSend />}
                            onClick={handleSubmit}
                        >
                            Send Feedback
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default FeedbackPage;

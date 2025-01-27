"use client"
import React from "react";
import { Modal, ModalContent, Button } from "@nextui-org/react";
import Link from "next/link";
import { Phone, ExternalLink, SquareArrowOutUpRight } from "lucide-react";

interface CrisisModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

const CrisisModal = ({ isOpen, onClose, message }: CrisisModalProps) => {
    const emergencyNumber = "9152987821";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            placement="center"
            size="3xl"
            classNames={{
                base: "bg-white dark:bg-black",
                wrapper: "bg-black/50",
            }}
        >
            <ModalContent>
                <div className="p-8">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-1 bg-blue-600 dark:bg-blue-500" />
                            <div>
                                <h2 className="text-2xl font-medium text-black dark:text-white">You&apos;re Not Alone</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-300">We&apos;re here to support you</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-600 dark:text-gray-400">We have detected:</p>
                            <p className="text-gray-800 dark:text-gray-200 text-md font-medium">
                                {message || "Content that could be concerning. Support is available 24/7."}
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Link href={`tel:${emergencyNumber}`} className="flex-1">
                                <Button
                                    className="w-full h-14 text-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                                    startContent={<Phone className="w-5 h-5" />}
                                >
                                    Call {emergencyNumber}
                                </Button>
                            </Link>

                            <Link href="https://www.nimh.nih.gov/" target="_blank" className="flex-1">
                                <Button
                                    className="w-full h-14 text-lg border-2 border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                                    startContent={<ExternalLink className="w-5 h-5" />}
                                >
                                    Visit NIMH
                                </Button>
                            </Link>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col justify-between">
                            Free · Confidential · Hours: 10:00 am to 8:00 pm, Monday to Saturday
                            <Link href="https://icallhelpline.org/" target="_blank" className="text-blue-600 dark:text-blue-500 hover:underline self-end">
                                icallhelpline.org <ExternalLink className="inline-block w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    );
}

export default CrisisModal;
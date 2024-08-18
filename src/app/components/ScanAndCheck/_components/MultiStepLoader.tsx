"use client";
import React, { useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

const loadingStates = [
    // First entry
    {
        progress: {
            text: "Sending images",
            desc: "This depends on your internet connection",
        },
        success: {
            text: "Sent images",
            desc: "Your images have been sent successfully",
        }
    },
    // Second entry
    {
        progress: {
            text: "Uploading data",
            desc: "Please wait while we upload your data",
        },
        success: {
            text: "Uploaded",
            desc: "Your data has been uploaded successfully",
        }
    },
    // Third entry
    {
        progress: {
            text: "Processing",
            desc: "We are processing your request",
        },
        success: {
            text: "Completed",
            desc: "The process completed successfully",
        }
    }
];


export function MultiStepLoaderDemo({
    loading,
    setLoading,
    status,
    setStatus,
    statusInfo,
    setStatusInfo,
}: {
    loading: boolean;
    status: string;
    setStatus: (status: string) => void;
    statusInfo: { text: string; desc: string };
    setLoading: (loading: boolean) => void;
    setStatusInfo: (statusInfo: { text: string; desc: string }) => void;
}) {

    return (
        <div className="w-full h-[60vh] flex items-center justify-center">
            {/* Core Loader Modal */}
            <Loader loadingStates={loadingStates} loading={loading} status={status} setStatus={setStatus} statusInfo={statusInfo} setStatusInfo={setStatusInfo} />

            {/* The buttons are for demo only, remove it in your actual code ⬇️ */}
            <button
                onClick={() => setLoading(true)}
                className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center"
                style={{
                    boxShadow:
                        "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
                }}
            >
                Click to load
            </button>

            {loading && (
                <button
                    className="fixed top-4 right-4 text-black dark:text-white z-[120]"
                    onClick={() => setLoading(false)}
                >
                    <IconSquareRoundedX className="h-10 w-10" />
                </button>
            )}
        </div>
    );
};
"use client";
import React, { useState } from "react";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { loadingStates } from "@/data/constants";


export const MultiStepLoaderDemo = ({
    socket,
    loading,
    setLoading,
    status,
    setStatus,
    statusInfo,
    setStatusInfo,
}: {
    socket: any;
    loading: boolean;
    status: string;
    setStatus: (status: string) => void;
    statusInfo: { text: string; desc: string };
    setLoading: (loading: boolean) => void;
    setStatusInfo: (statusInfo: { text: string; desc: string }) => void;
}) => {

    return (
        <div className="w-full h-[60vh] flex items-center justify-center">
            {/* Core Loader Modal */}
            <Loader loadingStates={loadingStates} loading={loading} status={status} setStatus={setStatus} statusInfo={statusInfo} setStatusInfo={setStatusInfo} />

            {loading && (
                <button
                    className="fixed top-4 right-4 text-black dark:text-white z-[120]"
                    onClick={() => {
                        setLoading(false);
                        setStatus("");
                        setStatusInfo(loadingStates[0].progress);
                        socket.disconnect();
                    }
                    }
                >
                    <IconSquareRoundedX className="h-10 w-10" />
                </button>
            )}
        </div>
    );
};
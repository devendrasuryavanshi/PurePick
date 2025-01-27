import React from "react";
import Webcam from "react-webcam";
import { Spinner } from "@nextui-org/react";
import { useScanStore } from "@/zustand/useScanStore";
import { CameraViewProps } from "@/types/scanner.types";

export const CameraView = ({ webcamRef, frameRef }: CameraViewProps) => {
    const { loading, videoConstraints, cameraEnabled } = useScanStore();

    return (
        <>
            {loading ? (
                <Spinner label="Loading Camera" color="default" />
            ) : (
                cameraEnabled && videoConstraints && (
                    <div className="rounded-2xl aspect-square" ref={frameRef}>
                        <Webcam
                            videoConstraints={videoConstraints}
                            className="rounded-xl border-0 border-gray-600"
                            audio={false}
                            screenshotFormat="image/jpeg"
                            screenshotQuality={1}
                            ref={webcamRef}
                        />
                    </div>
                )
            )}
        </>
    );
};

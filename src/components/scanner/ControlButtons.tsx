import React from "react";
import useSound from "use-sound";
import { Button, Tooltip } from "@nextui-org/react";
import { useScanStore } from "@/zustand/useScanStore";
import { cameraUtils } from "@/utils/camera";
import { useImageDropzone } from "@/utils/drag-and-drop";
import { ControlButtonsProps } from "@/types/scanner.types";
import { Camera, CameraOff, ImageUp, Flashlight, FlashlightOff, CircleDot } from "lucide-react";

export const ControlButtons = ({ webcamRef, frameRef }: ControlButtonsProps) => {
    const { cameraEnabled, torchEnabled, loading, images } = useScanStore();
    const { getRootProps, getInputProps } = useImageDropzone();

    const [playJoinSound] = useSound('/Sounds/scan2.mp3');

    return (
        <>
            <div className="flex justify-center items-center gap-2 my-1">
                <Tooltip showArrow={true} color="foreground" content="Open Camera" className="capitalize">
                    <Button
                        onClick={cameraUtils.toggleCamera}
                        radius="full"
                        color={cameraEnabled ? "danger" : "default"}
                        isIconOnly
                        variant="flat"
                    >
                        {cameraEnabled ? <CameraOff /> : <Camera />}
                    </Button>
                </Tooltip>
                <Tooltip showArrow={true} color="foreground" content="Upload images" className="capitalize">
                    <div {...getRootProps()}>
                        <div
                            className="inline-flex items-center justify-center rounded-full w-10 h-10 transition-all bg-default-100 hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none text-default-600"
                            role="button"
                            tabIndex={0}
                        >
                            <input {...getInputProps()} />
                            <ImageUp />
                        </div>
                    </div>
                </Tooltip>
            </div>

            {cameraEnabled && !loading && (
                <div className="flex justify-center items-center gap-2 p-1 dark:bg-zinc-800 bg-zinc-200 rounded-full">
                    <Button
                        isIconOnly
                        variant="flat"
                        disabled={images.length >= 2}
                        className={`dark:bg-black bg-white rounded-full ${images.length < 2 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={async () => await cameraUtils.captureImage(webcamRef, frameRef, playJoinSound)}
                    >
                        <CircleDot
                            strokeWidth={3}
                            className={`${images.length < 2 ? 'opacity-100' : 'opacity-50'} dark:text-white text-black`}
                            size={50}
                        />
                    </Button>
                    <Tooltip showArrow={true} color="foreground" content="Toggle Torch" className="capitalize">
                        <Button
                            onClick={async () => await cameraUtils.toggleTorch(webcamRef)}
                            size="sm"
                            radius="full"
                            isIconOnly
                            variant="flat"
                            color={torchEnabled ? "success" : "default"}
                        >
                            {torchEnabled ? <FlashlightOff /> : <Flashlight />}
                        </Button>
                    </Tooltip>
                </div>
            )}
        </>
    );
};

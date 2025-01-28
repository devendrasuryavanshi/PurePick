"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { toast } from 'sonner';
import { MultiStepLoaderDemo } from "../global/MultiStepLoader";
import { useSession } from "next-auth/react";
import { useScanStore } from "@/zustand/useScanStore";
import { CameraView } from "./CameraView";
import { ImagePreview } from "./ImagePreview";
import { ControlButtons } from "./ControlButtons";
import { useImageProcessing } from "../../hooks/use-image-processing";

import Webcam from "react-webcam";
import io from 'socket.io-client';
import Link from "next/link";

import { ImageData, ScannerModalProps } from "@/types/scanner.types";
import { processImages, uploadImages, verifyUserAuth } from "@/utils/image-analysis";
import CrisisModal from "./CrisisModal";
import { loadingStates, triggerWords } from "@/data/constants";
import { useRouter } from 'next/navigation';
import { cameraUtils } from "@/utils/camera";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

const ScannerModal = ({ isOpen, onOpenChange }: ScannerModalProps) => {
    const [showCrisisModal, setShowCrisisModal] = useState(false);
    const { isClient, multiStepLoading, status, statusInfo, checkingAuth, images, cameraEnabled } = useScanStore();
    const { setIsClient, setMultiStepLoading, setStatus, setStatusInfo, setCheckingAuth, setCameraEnabled, setTorchEnabled, setLoading, setImages } = useScanStore();
    const { calculatePhash, calculateHammingDistanceHelper } = useImageProcessing();

    const webcamRef = useRef<Webcam>(null);
    const frameRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const { data: session } = useSession();

    const removeImage = useCallback((index: number) => {
        if (checkingAuth) return;
        setImages(images.filter((_, i) => i !== index));
    }, [images, setImages, checkingAuth]);


    const calculateHammingDistance = async () => {
        if (images.length === 2) {
            const hash1 = await calculatePhash(images[0] instanceof File ? URL.createObjectURL(images[0] as File) : images[0] as string);
            const hash2 = await calculatePhash(images[1] instanceof File ? URL.createObjectURL(images[1] as File) : images[1] as string);
            const hammingDistance = calculateHammingDistanceHelper(hash1, hash2);
            if (hammingDistance <= 2) {
                removeImage(images.length - 1);
                toast.warning('Images are too similar. Please try again with different images.');
            }
        }
    };

    useEffect(() => {
        calculateHammingDistance();
    }, [images]);

    useEffect(() => {
        setIsClient(true);
    }, [setIsClient]);

    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    const resetState = () => {
        setCameraEnabled(false);
        setImages([]);
        setTorchEnabled(false);
        setLoading(false);
    };

    const updateLoadingState = (data: any, step: number) => {
        setStatus('success');
        if (step < loadingStates.length - 1) {
            setStatusInfo(loadingStates[step + 1].progress);
        }

    };

    const handleError = (text: string, data: any) => {
        setStatus('error');
        setStatusInfo({
            text: text,
            desc: data.message,
        });

        const messageContainsTriggerWord = triggerWords.some(word =>
            data.message.toLowerCase().includes(word)
        );

        if (messageContainsTriggerWord) {
            setMultiStepLoading(false);
            setShowCrisisModal(true);
        }
    };

    const handleSuccess = (insightId: string) => {
        toast("Showing Results...");
        router.push(`/product-insights/${insightId}`);
    };


    const handleAnalyze = async () => {
        socket.connect();

        if (!session?.user.id) {
            toast.warning("Please login to analyze images.", {
                action: (
                    <Link className="mx-auto" href="/login">
                        <Button variant="flat" size="sm">
                            Login
                        </Button>
                    </Link>
                )
            });
            return;
        }
        if (images.length < 2) {
            toast.warning("Please select exactly 2 images.");
            return;
        }

        setCheckingAuth(true);
        const authStatus = await verifyUserAuth(socket, session.user.id);

        if (authStatus.authenticated === null) {
            toast.error("Server is not responding. Please try again later.");
            setCheckingAuth(false);
            return;
        }

        if (!authStatus.authenticated) {
            toast.error("Authentication failed. Please login.", {
                action: (
                    <Link className="mx-auto" href="/login">
                        <Button variant="flat" size="sm">
                            Login
                        </Button>
                    </Link>
                )
            });
            setCheckingAuth(false);
            return;
        }

        if (cameraEnabled) {
            cameraUtils.toggleCamera();
        }

        try {
            const imageData: ImageData[] = await processImages(images);
            if (imageData.length < 2) {
                return;
            }

            setCheckingAuth(false);
            setMultiStepLoading(true);

            uploadImages(socket, imageData);

            socket.on("product-scanning", (data) => {
                if (!data.isSuccess) {
                    const text = "Product Scanning Failed";
                    handleError(text, data);
                    return;
                }
                updateLoadingState(data, 1);
            });

            socket.on("product-info-search", (data) => {
                if (!data.isSuccess) {
                    const text = "Product Info Search Failed";
                    handleError(text, data);
                    return;
                }
                updateLoadingState(data, 2);
            });

            socket.on("extraction", (data) => {
                if (!data.isSuccess) {
                    const text = "Extraction Failed";
                    handleError(text, data);
                    return;
                }
                updateLoadingState(data, 3);
            });

            socket.on("product-analysis", (data) => {
                if (!data.isSuccess) {
                    const text = "Product Analysis Failed";
                    handleError(text, data);
                    return;
                }
                updateLoadingState(data, 4);
            });

            socket.on("alternative-search", (data) => {
                if (!data.isSuccess) {
                    const text = "Alternative Search Failed";
                    handleError(text, data);
                    return;
                }
                updateLoadingState(data, 5);
            });

            socket.on("result-preparation", (data) => {
                if (!data.isSuccess) {
                    const text = "Result Preparation Failed";
                    handleError(text, data);
                    return;
                }
                updateLoadingState(data, 6);
                handleSuccess(data.productInsightId);
            });

            socket.on("process-error", (data) => {
                const text = "Process Error";
                handleError(text, data);
            });
        } catch (error) {
            toast.error("An error occurred while processing the images.");
        }
    };


    return (
        <>
            <CrisisModal
                isOpen={showCrisisModal}
                onClose={() => setShowCrisisModal(false)}
                message={statusInfo?.desc || ""}
            />
            {multiStepLoading && (<MultiStepLoaderDemo socket={socket} loading={multiStepLoading} setLoading={setMultiStepLoading} status={status} setStatus={setStatus} statusInfo={statusInfo} setStatusInfo={setStatusInfo} />)}
            <Modal
                isOpen={isOpen}
                backdrop={"blur"}
                placement={"bottom"}
                onOpenChange={(open) => {
                    if (checkingAuth) return;
                    if (!multiStepLoading) {
                        onOpenChange(open);
                    }
                }}
                scrollBehavior={isClient && window.innerHeight < 600 ? 'outside' : 'normal'}
            >
                <ModalContent className="justify-center items-center h-auto">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex justify-center items-center gap-3">
                                <div className="flex flex-col justify-center items-center gap-2">
                                    <h1 className="dark:text-white text-black">Select Pic</h1>
                                    <p className="text-xs dark:text-gray-400 text-gray-500 text-center">
                                        Capture or upload exactly <span className="font-bold text-pink-700">2 images</span> of the product, showcasing both the front and back sides.
                                    </p>
                                </div>
                            </ModalHeader>
                            <ModalBody className="flex h-auto p-0 m-0 justify-center items-center gap-3 px-10">
                                <div className="w-full min-h-72 flex flex-col justify-center items-center gap-3">
                                    <ImagePreview
                                        removeImage={removeImage}
                                    />
                                    <CameraView
                                        webcamRef={webcamRef}
                                        frameRef={frameRef}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter className="w-full flex justify-between items-center gap-4">
                                <ControlButtons
                                    webcamRef={webcamRef}
                                    frameRef={frameRef}
                                />
                                <Button isLoading={checkingAuth} onClick={() => handleAnalyze()} className={`text-lg font-bold ${images.length < 2 ? 'cursor-not-allowed' : 'cursor-pointer'}`} color="primary" radius="full">{checkingAuth ? 'Verifying...' : 'Analyze'}</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ScannerModal;
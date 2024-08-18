"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Image,
    Badge,
    Tooltip,
    Spinner,
} from "@nextui-org/react";
import {
    Camera,
    CameraOff,
    CircleDot,
    Flashlight,
    FlashlightOff,
    ImageUp,
    X,
} from "lucide-react";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import { CarouselProduct } from "./_components/Carousel";
import useSound from 'use-sound';
import { toast } from 'sonner';
import { MultiStepLoaderDemo } from "./_components/MultiStepLoader";
import io from 'socket.io-client';
import { createCanvas, loadImage } from 'canvas';
import { useSession } from "next-auth/react";
import Link from "next/link";

const socket = io('http://localhost:8000');

interface ScannerModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

// Max resolution variables for video
let maxWidth = 0;
let maxHeight = 0;

export default function ScannerModal({ isOpen, onOpenChange }: ScannerModalProps) {
    const [images, setImages] = useState<(File | string)[]>([]);
    const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
    const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
    const [videoConstraints, setVideoConstraints] = useState<{ width: number; height: number; facingMode: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const [playJoinSound] = useSound('/Sounds/scan2.mp3');
    const [isClient, setIsClient] = useState(false);
    const [multiStepLoading, setMultiStepLoading] = useState(false);
    const [status, setStatus] = useState<string>('loading');
    const [statusInfo, setStatusInfo] = useState<{ text: string; desc: string }>({ text: '', desc: '' });
    const [checkingAuth, setCheckingAuth] = useState<boolean>(false);
    const { data: session } = useSession();

    // calculate the perceptual hash
    const phash = useCallback(async (imagePath: string): Promise<string> => {
        const image = await loadImage(imagePath);
        const canvas = createCanvas(16, 16);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 16, 16);
        const imageData = ctx.getImageData(0, 0, 16, 16);
        const grayscaleData = new Uint8Array(16 * 16);

        for (let i = 0; i < imageData.data.length; i += 4) {
            const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            grayscaleData[i / 4] = Math.round(avg);
        }

        const dctCoefficients = dct(grayscaleData);
        const dct8x8 = dctCoefficients.slice(0, 64);
        const avg = dct8x8.reduce((sum, value) => sum + value, 0) / dct8x8.length;

        let hash = '';
        for (const value of dct8x8) {
            hash += value >= avg ? '1' : '0';
        }

        return hash;
    }, []);

    const removeImage = useCallback((index: number) => {
        setImages(images.filter((_, i) => i !== index));
    }, [images]);

    useEffect(() => {
        const calculateHammingDistance = async () => {
            if (images.length === 2) {
                const hash1 = await phash(images[0] instanceof File ? URL.createObjectURL(images[0] as File) : images[0] as string);
                const hash2 = await phash(images[1] instanceof File ? URL.createObjectURL(images[1] as File) : images[1] as string);
                const hammingDistance = calculateHamming(hash1, hash2);
                // toast.success(`Hamming Distance: ${hammingDistance}`);
                if (hammingDistance <= 2) {
                    removeImage(images.length - 1);
                    toast.warning('Images are too similar. Please try again with different images.');
                }

            }
        };

        calculateHammingDistance();
    }, [images, phash, removeImage]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    const dct = (data: Uint8Array): number[] => {
        const N = Math.sqrt(data.length);
        const coefficients = new Array(data.length).fill(0);
        for (let u = 0; u < N; u++) {
            for (let v = 0; v < N; v++) {
                let sum = 0;
                for (let x = 0; x < N; x++) {
                    for (let y = 0; y < N; y++) {
                        sum += data[x * N + y] * Math.cos(((2 * x + 1) * u * Math.PI) / (2 * N)) *
                            Math.cos(((2 * y + 1) * v * Math.PI) / (2 * N));
                    }
                }
                coefficients[u * N + v] = sum * (u === 0 ? 1 / Math.sqrt(2) : 1) * (v === 0 ? 1 / Math.sqrt(2) : 1);
            }
        }
        return coefficients;
    };

    const calculateHamming = (hash1: string, hash2: string): number => {
        let distance = 0;
        for (let i = 0; i < hash1.length; i++) {
            if (hash1[i] !== hash2[i]) {
                distance++;
            }
        }
        return distance;
    };

    // Utility Functions

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles) => {
            // Ensure the total images do not exceed 2
            if (images.length + acceptedFiles.length <= 2) {
                const filteredFiles = acceptedFiles.filter(file => file.type !== 'image/gif');
                setImages([...images, ...filteredFiles].slice(0, 2));
            } else {
                toast.warning("You can only select up to 2 images.");
            }
        },
    });

    async function dataUrlToFile(dataUrl: string, filename: string) {
        try {
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            return new File([blob], filename, { type: blob.type });
        } catch (error) {
            console.error("Error converting data URL to File:", error);
        }
    }

    const formatDate = () => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        return `${year}${month}${day}-${hours}${minutes}${seconds}${milliseconds}`;
    };

    // Helper Functions

    const resetState = () => {
        setCameraEnabled(false);
        setImages([]);
        setTorchEnabled(false);
        setLoading(false);
    };

    async function getMaxResolution(videoInputDevice: MediaDeviceInfo): Promise<{ width: number; height: number; access: boolean }> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: videoInputDevice.deviceId,
                },
            });
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            let width = capabilities.width?.max || 700;
            let height = capabilities.height?.max || 700;

            track.stop();
            return { width, height, access: true };
        } catch (error) {
            setCameraEnabled(false);
            setLoading(true);
            return { width: 0, height: 0, access: false };
        }
    }

    // Get the maximum camera resolution available
    const getResolution = async (): Promise<boolean> => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        let accessGranted = false;

        for (const device of videoDevices) {
            const { width, height, access } = await getMaxResolution(device);
            accessGranted = accessGranted || access;
            if (width * height > maxWidth * maxHeight) {
                maxWidth = width;
                maxHeight = height;
            }
        }

        let minResolution = Math.min(maxWidth, maxHeight);
        maxWidth = maxHeight = minResolution >= 1440 ? 1440 : minResolution;

        setVideoConstraints({ width: maxWidth, height: maxHeight, facingMode: 'environment' });

        return accessGranted;
    };

    async function checkCameraSupportAndPermissions() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            toast.error("Your browser does not support media devices API.");
            return false;
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === "videoinput");
            const supportsCamera = videoDevices.length > 0;

            if (!supportsCamera) {
                toast.error("No camera detected.");
                return false;
            }

            const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
            if (permissionStatus.state === "granted") {
                setLoading(true);
                if (!videoConstraints) {
                    getResolution();
                }
                return true;
            } else if (permissionStatus.state === "prompt") {
                setLoading(true);
                toast.warning("Camera permission requested.");
                const accessGranted = await getResolution();
                if (accessGranted) {
                    toast.success("Camera permission granted.");
                    return true;
                }
                return false;
            } else {
                toast.error("Camera permission denied.", {
                    description: "Please allow camera access in your browser settings.",
                });
                return false;
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Unknown error');
        }
    }

    async function monitorPermissionChange() {
        try {
            const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });

            permissionStatus.onchange = () => {
                if (permissionStatus.state !== "granted") {
                    setCameraEnabled(false);
                    setTorchEnabled(false);
                }
            };
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Unknown error');
        }
    }

    // Adds a flash effect when capturing an image
    const flashEffect = () => {
        const webcam = webcamRef.current;
        const frame = frameRef.current;

        if (webcam && frame && webcam.video) {
            const video = webcam.video as HTMLVideoElement;
            video.classList.add('flash');
            frame.classList.add('bg-white', 'border-4', 'border-zinc-800');

            setTimeout(() => {
                video.classList.remove('flash');
                frame.classList.remove('bg-white', 'border-4', 'border-zinc-800');
            }, 200);
        }
    };

    // Event Handlers

    const captureImage = () => {
        if (webcamRef.current && images.length < 2) {
            const imageSrc = webcamRef.current.getScreenshot({
                width: videoConstraints!.width,
                height: videoConstraints!.height
            });

            if (imageSrc) {
                setImages([...images, imageSrc]);
                playJoinSound();
                flashEffect();
            }
        }
    };

    const cameraToggle = async () => {
        if (cameraEnabled) {
            setCameraEnabled(false);
            setTorchEnabled(false);
        } else {
            // setLoading(true);
            const accessGranted = await checkCameraSupportAndPermissions();
            if (accessGranted) {
                setCameraEnabled(true);
                monitorPermissionChange();
            }
            setLoading(false);
        }
    };

    const toggleTorch = async () => {
        if (webcamRef.current?.video) {
            const stream = webcamRef.current.video.srcObject as MediaStream;
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };

            if (capabilities.torch) {
                await track.applyConstraints({
                    advanced: [{ torch: !torchEnabled } as MediaTrackConstraintSet],
                });
                setTorchEnabled(!torchEnabled);
            } else {
                toast.error("Torch is not supported on this device.");
            }
        }
    };

    const handleAnalyze = async () => {
        if (images.length < 2) {
            toast.warning("Please select exactly 2 images.");
            return;
        }
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
        setCheckingAuth(true);
        // toast(session?.user.id);
        const authStatus = await new Promise<{ authenticated: boolean | null }>((resolve) => {
            try {
                const timeOut = setTimeout(() => {
                    resolve({ authenticated: null });
                }, 10000);
                socket.emit('user-auth', { id: session?.user.id }, (status: any) => {
                    clearTimeout(timeOut);
                    resolve(status);
                });
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Unknown error');
            }

        });
        setCheckingAuth(false);

        // Check if authentication failed
        if (authStatus.authenticated === null) {
            toast.error("Server is not responding. Please try again later.");
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
            return;
        }

        setMultiStepLoading(true);

        try {
            let imageData: { file: File; fileName: string }[] = [];
            // Convert images to an array of objects
            await Promise.all(images.map(async (image) => {
                let file: File | undefined;
                let fileName: string | undefined;

                if (image instanceof File) {
                    file = image;
                    fileName = image.name;
                } else if (typeof image === 'string') {
                    // Convert string to file
                    const fileDate = formatDate();
                    const newFile = await dataUrlToFile(image, `image-${fileDate}.jpg`);
                    if (newFile) {
                        file = newFile;
                        fileName = newFile.name;
                    } else {
                        toast.error("Failed to convert data URL to File");
                        return;
                    }
                }

                if (file && fileName) {
                    imageData.push({ file, fileName });
                } else {
                    toast.error("Failed to convert data URL to File");
                    return;
                }
            }));

            // Emit the imageData array to the server
            socket.emit("upload", imageData, (status: any, message: string) => {
                if (status.isSuccess == false) {
                    setStatus('error');
                    setStatusInfo({
                        text: "Sent Failed",
                        desc: status.message,
                    })
                } else {
                    setStatus('success');
                }
            });
        } catch (error) {
            toast.error("Error sending images to server.");
            console.log(error);
        }

        // setTimeout(() => {
        //     setStatus('success');
        // }, 3000);

        // Listen for confirmation from the server
        socket.on('upload-success', () => {
            toast.success("Images uploaded successfully.");
        });

        socket.on('upload-error', () => {
            toast.error("Error uploading images.");
        });

        // setMultiStepLoading(false);
    }

    return (
        <>
            {multiStepLoading && (<MultiStepLoaderDemo loading={multiStepLoading} setLoading={setMultiStepLoading} status={status} setStatus={setStatus} statusInfo={statusInfo} setStatusInfo={setStatusInfo} />)}
            <Modal
                isOpen={isOpen}
                backdrop={"blur"}
                placement={"bottom"}
                onOpenChange={(open) => {
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
                                {cameraEnabled && maxWidth !== 0 && (
                                    <p className="text-xs dark:text-gray-400 text-gray-700 dark:bg-gray-900 bg-gray-200 p-1 rounded-full">
                                        {videoConstraints?.width}x{videoConstraints?.height}
                                    </p>
                                )}
                                {images.length > 0 && cameraEnabled && (
                                    <div className="flex justify-center items-center gap-3">
                                        {images.map((image, index) => (
                                            <Badge key={index} className="w-6 h-6 cursor-pointer" onClick={() => removeImage(index)} content={<X strokeWidth={5} />} color="danger">
                                                <Image
                                                    radius="md"
                                                    src={image instanceof File ? URL.createObjectURL(image) : image}
                                                    width={100}
                                                    alt="Captured"
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                <div className="w-full min-h-72 flex flex-col justify-center items-center">
                                    {loading ? (<Spinner label="Loading Camera" color="default" />) :
                                        cameraEnabled && videoConstraints ? (
                                            <div className="rounded-2xl aspect-square" ref={frameRef}>
                                                <Webcam
                                                    videoConstraints={videoConstraints}
                                                    className="rounded-xl border-0 border-gray-600"
                                                    audio={false}
                                                    screenshotFormat="image/jpeg"
                                                    screenshotQuality={1}
                                                    ref={webcamRef}
                                                />
                                            </div>) :
                                            images.length !== 0 ? (<CarouselProduct removeImg={removeImage} images={images} />) :
                                                (<Tooltip showArrow={true} color={"foreground"} content={"Drag & drop some files here, or click to select files"} className="capitalize">
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <Image src="https://cdni.iconscout.com/illustration/premium/thumb/female-photographer-doing-product-photoshoot-4658374-3880537.png?f=webp" alt="demo image" width={'100%'} />
                                                    </div>
                                                </Tooltip>)}
                                </div>
                            </ModalBody>
                            <ModalFooter className="w-full flex justify-between items-center gap-4">
                                <div className="flex justify-center items-center gap-2 my-1">
                                    <Tooltip showArrow={true} color={"foreground"} content={"Open Camera"} className="capitalize">
                                        <Button onClick={cameraToggle} radius="full" color={cameraEnabled ? "danger" : "default"} isIconOnly variant="flat" aria-label="Take a photo">
                                            {cameraEnabled ? <CameraOff /> : <Camera />}
                                        </Button>
                                    </Tooltip>
                                    <Tooltip showArrow={true} color={"foreground"} content={"Drag & drop some files here, or click to select files"} className="capitalize">
                                        <Button radius="full" isIconOnly variant="flat">
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <ImageUp />
                                            </div>
                                        </Button>
                                    </Tooltip>
                                </div>
                                {cameraEnabled && !loading && (
                                    <div className={`flex justify-center items-center gap-2 p-1 dark:bg-zinc-800 bg-zinc-200 rounded-full`}>
                                        <Button isIconOnly variant="flat" disabled={images.length >= 2} className={`dark:bg-black bg-white rounded-full ${images.length < 2 ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                            <CircleDot
                                                strokeWidth={3}
                                                className={`${images.length < 2 ? 'opacity-100' : 'opacity-50'} dark:text-white text-black`}
                                                size={50}
                                                onClick={captureImage}
                                            />
                                        </Button>
                                        <Tooltip showArrow={true} color={"foreground"} content={"Toggle Torch"} className="capitalize">
                                            <Button onClick={toggleTorch} size="sm" radius="full" isIconOnly variant="flat" aria-label="Toggle torch" color={torchEnabled ? "success" : "default"}>
                                                {torchEnabled ? <FlashlightOff /> : <Flashlight />}
                                            </Button>
                                        </Tooltip>
                                    </div>
                                )}
                                <Button isLoading={checkingAuth} onClick={() => handleAnalyze()} className={`text-lg font-bold ${images.length < 2 ? 'cursor-not-allowed' : 'cursor-pointer'}`} color="primary" radius="full">{checkingAuth ? 'Verifying...' : 'Analyze'}</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
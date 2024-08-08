import React, { useEffect, useRef, useState } from "react";
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
    ArrowUpRight,
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
    const [loading, setLoading] = useState<boolean>(true);
    const webcamRef = useRef<Webcam>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const [playJoinSound] = useSound('/Sounds/scan2.mp3');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    // reset state variables
    const resetState = () => {
        setCameraEnabled(false);
        setImages([]);
        setTorchEnabled(false);
        setLoading(true);
    };

    // Dropzone configuration
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

    // Capture an image from the webcam
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

    // Retrieve the maximum resolution for a specific video device
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

    // Check camera support and permissions
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
                if (!videoConstraints) {
                    getResolution();
                }
                return true;
            } else if (permissionStatus.state === "prompt") {
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

    // Remove an image from the list
    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Toggle the camera torch (if supported)
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

    // Monitor camera permission changes
    async function monitorPermissionChange() {
        try {
            const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });

            permissionStatus.onchange = () => {
                if (permissionStatus.state === "denied") {
                    setCameraEnabled(false);
                    setTorchEnabled(false);
                }
            };
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Unknown error');
        }
    }

    // Toggle camera access
    const cameraToggle = async () => {
        if (cameraEnabled) {
            setCameraEnabled(false);
            setTorchEnabled(false);
        } else {
            setLoading(true);
            const accessGranted = await checkCameraSupportAndPermissions();
            if (accessGranted) {
                setCameraEnabled(true);
                monitorPermissionChange();
            }
            setLoading(false);
        }
    };

    // Render the modal component
    return (
        <Modal
            isOpen={isOpen}
            backdrop={"blur"}
            placement={"bottom"}
            onOpenChange={onOpenChange}
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
                                {cameraEnabled && videoConstraints ? (
                                    <>
                                        {loading ? (
                                            <Spinner label="Opening Camera" color="warning" />
                                        ) : (
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
                                        )}
                                    </>
                                ) : (images.length !== 0 ? (
                                    <CarouselProduct removeImg={removeImage} images={images} />
                                ) : (
                                    <Tooltip showArrow={true} color={"foreground"} content={"Drag & drop some files here, or click to select files"} className="capitalize">
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Image src="https://cdni.iconscout.com/illustration/premium/thumb/female-photographer-doing-product-photoshoot-4658374-3880537.png?f=webp" alt="demo image" width={'100%'} />
                                        </div>
                                    </Tooltip>
                                ))}
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
                            <Button className="text-lg font-bold" color="primary">Scan<ArrowUpRight strokeWidth={3} /></Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
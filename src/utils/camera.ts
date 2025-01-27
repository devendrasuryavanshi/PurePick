
import { toast } from 'sonner';
import { useScanStore } from '@/zustand/useScanStore';
import Webcam from 'react-webcam';

export const cameraUtils = {
    getMaxResolution: async (videoInputDevice: MediaDeviceInfo): Promise<{ width: number; height: number; access: boolean }> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: videoInputDevice.deviceId },
            });
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();
            const width = capabilities.width?.max || 700;
            const height = capabilities.height?.max || 700;
            track.stop();
            return { width, height, access: true };
        } catch (error) {
            return { width: 0, height: 0, access: false };
        }
    },

    getResolution: async (): Promise<boolean> => {
        const { setVideoConstraints } = useScanStore.getState();

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        let maxWidth = 0, maxHeight = 0;
        let accessGranted = false;

        for (const device of videoDevices) {
            const { width, height, access } = await cameraUtils.getMaxResolution(device);
            accessGranted = accessGranted || access;
            if (width * height > maxWidth * maxHeight) {
                maxWidth = width;
                maxHeight = height;
            }
        }

        const minResolution = Math.min(maxWidth, maxHeight);
        maxWidth = maxHeight = minResolution >= 1440 ? 1440 : minResolution;
        setVideoConstraints({ width: maxWidth, height: maxHeight, facingMode: 'environment' });

        return accessGranted;
    },

    checkCameraPermissions: async (): Promise<boolean> => {
        const { setLoading, videoConstraints } = useScanStore.getState();

        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            toast.error("Browser doesn't support media devices API");
            return false;
        }

        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === "videoinput");

            if (!videoDevices.length) {
                toast.error("No camera detected");
                return false;
            }

            const permissionStatus = await navigator.permissions.query({ name: "camera" as PermissionName });
            if (permissionStatus.state === "granted") {
                setLoading(true);
                if (!videoConstraints) {
                    cameraUtils.getResolution();
                }
                return true;
            } else if (permissionStatus.state === "prompt") {
                setLoading(true);
                toast.warning("Camera permission requested.");
                const accessGranted = await cameraUtils.getResolution();
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
            toast.error("Camera access error");
            return false;
        }
    },

    monitorPermissionChange: async (): Promise<void> => {
        const { setCameraEnabled, setTorchEnabled } = useScanStore.getState();

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
    },

    flashEffect: (webcamRef: React.RefObject<Webcam>, frameRef: React.RefObject<HTMLDivElement>): void => {
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
    },

    captureImage: async (webcamRef: React.RefObject<Webcam>, frameRef: React.RefObject<HTMLDivElement>, playJoinSound: () => void): Promise<void> => {
        const { images, setImages, videoConstraints } = useScanStore.getState();

        if (webcamRef.current && images.length < 2) {
            const imageSrc = webcamRef.current.getScreenshot({
                width: videoConstraints!.width,
                height: videoConstraints!.height
            });

            if (imageSrc) {
                setImages([...images, imageSrc]);
                playJoinSound();
                cameraUtils.flashEffect(webcamRef, frameRef);
            }
        }
    },

    toggleCamera: async (): Promise<void> => {
        const { cameraEnabled, setCameraEnabled, setTorchEnabled, setLoading } = useScanStore.getState();

        if (cameraEnabled) {
            setCameraEnabled(false);
            setTorchEnabled(false);
        } else {
            //   setLoading(true);
            const accessGranted = await cameraUtils.checkCameraPermissions();
            if (accessGranted) {
                setCameraEnabled(true);
                await cameraUtils.monitorPermissionChange();
            }
            setLoading(false);
        }
    },

    toggleTorch: async (webcamRef: React.RefObject<Webcam>): Promise<void> => {
        const { torchEnabled, setTorchEnabled } = useScanStore.getState();

        if (webcamRef.current?.video) {
            const stream = webcamRef.current.video.srcObject as MediaStream;

            if (!stream) {
                toast.error("Camera stream not ready. Please try again.");
                return;
            }

            const tracks = stream.getVideoTracks();
            if (!tracks || tracks.length === 0) {
                toast.error("Camera stream not initialized. Please try again.");
                return;
            }

            const track = tracks[0];
            const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };

            if (capabilities.torch) {
                await track.applyConstraints({
                    advanced: [{ torch: !torchEnabled } as MediaTrackConstraintSet],
                });
                setTorchEnabled(!torchEnabled);
            } else {
                toast.error("Torch is not supported on this device");
            }
        }
    }

};

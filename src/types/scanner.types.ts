import Webcam from "react-webcam";

export interface ScannerModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface VideoConstraints {
    width: number;
    height: number;
    facingMode: string;
}

export interface BarcodeInfo {
    rawText: string;
    barcodeFormat: string;
    parsedResult: string;
}

export interface ImageData {
    file: File;
    fileName: string;
    barcodeInfo: BarcodeInfo[];
}

export interface SocketStatus {
    isSuccess: boolean;
    message: string;
}

export interface StatusInfo {
    text: string;
    desc: string;
}

export interface WebcamRef {
    current: Webcam | null;
}

export interface AuthStatus {
    authenticated: boolean | null;
}

export interface CameraViewProps {
    webcamRef: React.RefObject<Webcam>;
    frameRef: React.RefObject<HTMLDivElement>;
}

export interface ControlButtonsProps {
    webcamRef: React.RefObject<Webcam>;
    frameRef: React.RefObject<HTMLDivElement>;
}

export interface ImagePreviewProps {
    removeImage: (index: number) => void;
}
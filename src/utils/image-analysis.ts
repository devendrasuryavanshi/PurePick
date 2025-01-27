import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { formatDate } from '@/utils/date';
import { scanBarcode } from '@/utils/barcode';
import { AuthStatus, BarcodeInfo, ImageData } from '@/types/scanner.types';
import { useScanStore } from '@/zustand/useScanStore';

export const verifyUserAuth = async (socket: Socket, userId: string): Promise<AuthStatus> => {
    return new Promise((resolve) => {
        try {
            const timeOut = setTimeout(() => {
                resolve({ authenticated: null });
            }, 10000);

            socket.emit('user-auth', { id: userId }, (status: any) => {
                clearTimeout(timeOut);
                resolve(status);
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Unknown error');
        }
    });
};

export const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File | undefined> => {
    try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        return undefined;
    }
};

export const processImages = async (images: (File | string)[]): Promise<ImageData[]> => {
    let imageData: ImageData[] = [];

    await Promise.all(images.map(async (image) => {
        let file: File | undefined;
        let fileName: string | undefined;
        let barcodeInfo: BarcodeInfo[] = [];

        if (image instanceof File) {
            file = image;
            fileName = image.name;
        } else if (typeof image === 'string') {
            const fileDate = formatDate();
            const newFile = await dataUrlToFile(image, `image-${fileDate}.jpg`);
            if (newFile) {
                file = newFile;
                fileName = newFile.name;
            } else {
                toast.error("Someething went wrong. Please try again.");
                return;
            }
        }

        if (file && fileName) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            await new Promise<void>((resolve) => {
                fileReader.onload = async () => {
                    try {
                        const imageUrl = fileReader.result as string;
                        const imgElement = document.createElement('img');
                        imgElement.src = imageUrl;

                        imgElement.onload = async () => {
                            try {
                                const scannedBarcode = await scanBarcode(imgElement);
                                if (scannedBarcode) {
                                    barcodeInfo.push(scannedBarcode);
                                }
                                resolve();
                            } catch (err) {
                                resolve();
                            }
                        };
                    } catch (err) {
                        resolve();
                    }
                };
            });
            imageData.push({ file, fileName, barcodeInfo });
        } else {
            toast.error("Failed to process image");
            return [];
        }
    }));

    return imageData;
};

export const uploadImages = (socket: Socket, imageData: ImageData[]) => {
    const { setStatus, setStatusInfo } = useScanStore.getState();
    socket.emit("image-upload", imageData, (status: any) => {
        if (status.isSuccess === false) {
            setStatus('error');
            setStatusInfo({
                text: "Sent Failed",
                desc: status.message,
            });
        } else {
            setStatus('success');
        }
    });
};

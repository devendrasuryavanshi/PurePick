import { useScanStore } from '@/zustand/useScanStore';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

export const useImageDropzone = () => {
    const { images, setImages } = useScanStore.getState();
    const maxImages = 2;

    return useDropzone({
        accept: {
            'image/*': [],
        },
        onDrop: (acceptedFiles) => {
            if (images.length + acceptedFiles.length <= maxImages) {
                const filteredFiles = acceptedFiles.filter(file => file.type !== 'image/gif');
                setImages([...images, ...filteredFiles].slice(0, maxImages));
            } else {
                toast.warning(`You can only select up to ${maxImages} images.`);
            }
        },
        onDragEnter: () => {
            return true;
        },
        onDragLeave: () => {
            return false;
        }
    });
};

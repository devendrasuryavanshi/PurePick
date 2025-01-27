import React from "react";
import { ImagePlus, X } from "lucide-react";
import { Badge, Image, Tooltip } from "@nextui-org/react";
import { CarouselProduct } from "../global/Carousel";
import { useScanStore } from "@/zustand/useScanStore";
import { useImageDropzone } from "@/utils/drag-and-drop";
import { ImagePreviewProps } from "@/types/scanner.types";

export const ImagePreview = ({ removeImage }: ImagePreviewProps) => {
    const { images, cameraEnabled } = useScanStore();
    const { getRootProps, getInputProps, isDragActive } = useImageDropzone();

    if (images.length === 0 && !cameraEnabled) {
        return (
            <Tooltip showArrow={true} color="foreground" content="Drag & drop some files here, or click to select files" className={`capitalize`}>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background rounded-xl border-2 border-primary border-dashed">
                            <ImagePlus className="w-32 h-32 text-primary animate-bounce" />
                            <p className="mt-4 text-xl font-semibold text-primary">Drop images here</p>
                        </div>
                    ) : (
                        <Image
                            src="https://cdni.iconscout.com/illustration/premium/thumb/female-photographer-doing-product-photoshoot-4658374-3880537.png?f=webp"
                            alt="demo image"
                            width="100%"
                        />
                    )}
                </div>
            </Tooltip>
        );
    }

    return cameraEnabled ? (
        <>
            <div className="flex justify-center items-center gap-6">
                {images.map((image, index) => (
                    <Badge
                        key={index}
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => removeImage(index)}
                        content={<X strokeWidth={5} />}
                        color="danger"
                    >
                        <Image
                            radius="md"
                            src={image instanceof File ? URL.createObjectURL(image) : image}
                            width={70}
                            height={70}
                            className="object-cover"
                            alt="Captured"
                            style={{
                                minWidth: '50px',
                                minHeight: '50px',
                                aspectRatio: '1/1'
                            }}
                        />

                    </Badge>
                ))}
            </div>
        </>
    ) : (<CarouselProduct removeImg={removeImage} images={images} />);
};
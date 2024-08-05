import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Badge, Tooltip } from "@nextui-org/react";
import { ArrowUpRight, Camera, CameraOff, CircleDot, ImageUp, X } from "lucide-react";
import InfoTooltip from "./_components/InfoTooltip";
import Webcam from "react-webcam";
import { useDropzone } from "react-dropzone";
import { CarouselProduct } from "./_components/Carousel";
import useSound from 'use-sound';
interface ScannerModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ScannerModal({ isOpen, onOpenChange }: ScannerModalProps) {
    const [images, setImages] = useState<(File | string)[]>([]);
    const [cameraEnabled, setCameraEnabled] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const [playJoinSound] = useSound('/Sounds/scan2.mp3',);

    useEffect(() => {
        if(!isOpen) {
            setImages([]);
            setCameraEnabled(false);
        }
    }, [isOpen])

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: (acceptedFiles) => {
            if (images.length + acceptedFiles.length <= 2) {
                const filteredFiles = acceptedFiles.filter(file => file.type !== 'image/gif');
                setImages([...images, ...filteredFiles].slice(0, 2));
            } else {
                alert("You can only select up to 2 images.");
            }
        }
    });

    const captureImage = () => {
        if (webcamRef.current && images.length < 2) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setImages([...images, imageSrc]);

                playJoinSound();
                const webcam = webcamRef.current;
                const frame = frameRef.current;
                if (webcam && frame && webcam.video) {
                    const video = webcam.video as HTMLVideoElement;
                    video.classList.add('flash');
                    frame.classList.add('bg-white');
                    setTimeout(() => {
                        video.classList.remove('flash');
                        frame.classList.remove('bg-white');
                    }, 200);
                }
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                backdrop={"blur"}
                placement={"auto"}
                onOpenChange={onOpenChange}
            >
                <ModalContent className="justify-center items-center">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex justify-center items-center gap-3">Select Pic<InfoTooltip /></ModalHeader>
                            <ModalBody className="flex justify-center items-center gap-3 px-10 mt-2">
                                <div className="w-full h-72 flex flex-col justify-center items-center">
                                    {cameraEnabled ? (
                                        <>
                                            <div
                                                className="rounded-xl border-4 border-gray-600"
                                                ref={frameRef}
                                            >
                                                <Webcam
                                                    className="rounded-xl"
                                                    audio={false}
                                                    screenshotFormat="image/jpeg"
                                                    ref={webcamRef}
                                                    width={600}
                                                    height={600}
                                                />
                                            </div>
                                            <button disabled={images.length < 2 ? false : true} className={`bg-black rounded-full p-1 relative bottom-14 ${images.length < 2 ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                                <CircleDot
                                                    className={`${images.length < 2 ? 'opacity-100' : 'opacity-50'}`}
                                                    color="white"
                                                    size={40}
                                                    onClick={captureImage}
                                                />
                                            </button></>
                                    ) : (images.length != 0 ?
                                        (<CarouselProduct removeImg={removeImage} images={images} />) :
                                        (
                                            <Tooltip showArrow={true} color={"foreground"} content={"Drag & drop some files here, or click to select files"} className="capitalize">
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <Image src="https://nikhil-belide.netlify.app/images/aboutgif.gif" alt="demo image"/>
                                                </div>
                                            </Tooltip>
                                        )
                                    )
                                    }
                                </div>
                                {images.length > 0 && cameraEnabled &&
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
                                }
                            </ModalBody>
                            <ModalFooter className="w-full flex justify-between gap-4">
                                <div className="flex justify-center items-center gap-2">
                                    <Tooltip showArrow={true} color={"foreground"} content={"Open Camera"} className="capitalize">
                                        <Button onClick={() => setCameraEnabled(!cameraEnabled)} radius="full" color={cameraEnabled ? "danger" : "default"} isIconOnly variant="ghost" aria-label="Take a photo">
                                            {cameraEnabled ? <CameraOff /> : <Camera />}
                                        </Button>
                                    </Tooltip>
                                    <Tooltip showArrow={true} color={"foreground"} content={"Drag & drop some files here, or click to select files"} className="capitalize">
                                        <Button radius="full" isIconOnly variant="ghost"
                                        >
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <ImageUp />
                                            </div>
                                        </Button>
                                    </Tooltip>
                                </div>
                                <Button className="text-lg font-bold" color="primary">Scan<ArrowUpRight strokeWidth={3} /></Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
"use client"
import React from 'react'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
export default function HeroButton({ onOpen }) {
    const { data: session, status } = useSession();
    return (
        // status === "loading" ? ('') : status === 'authenticated' ?
        // (
        <button onClick={onOpen} className="mt-8 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-offset-2 focus:ring-offset-black">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-lg font-medium text-white backdrop-blur-3xl">
                Start Scanning Now
            </span>
        </button>
        // ) :
        // (
        //     <Link href="/login" className="mt-8 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-offset-2 focus:ring-offset-black">
        //         <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        //         <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-lg font-medium text-white backdrop-blur-3xl">
        //             Get Started
        //         </span>
        //     </Link>
        // )
    )
}


// ---------------------------------------------------------------------------------------------------------------------

// import React, { useEffect, useRef, useState } from "react";
// import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Badge, Tooltip } from "@nextui-org/react";
// import { ArrowUpRight, Camera, CameraOff, CircleDot, ImageUp, X } from "lucide-react";
// import InfoTooltip from "./_components/InfoTooltip";
// import Webcam from "react-webcam";
// import { useDropzone } from "react-dropzone";
// import { CarouselProduct } from "./_components/Carousel";
// import useSound from 'use-sound';
// interface ScannerModalProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// export default function ScannerModal({ isOpen, onOpenChange }: ScannerModalProps) {
//     const [images, setImages] = useState < (File | string)[] > ([]);
//     const [cameraEnabled, setCameraEnabled] = useState < boolean > (false);
//     const webcamRef = useRef < Webcam > (null);
//     const frameRef = useRef < HTMLDivElement > (null);
//     const [playJoinSound] = useSound('/Sounds/scan2.mp3',);
//     const [isClient, setIsClient] = useState(false);

//     useEffect(() => {
//         setIsClient(true);
//     }, []);

//     useEffect(() => {
//         if (!isOpen) {
//             setImages([]);
//             setCameraEnabled(false);
//         }
//     }, [isOpen])

//     const { getRootProps, getInputProps } = useDropzone({
//         accept: {
//             'image/*': []
//         },
//         onDrop: (acceptedFiles) => {
//             if (images.length + acceptedFiles.length <= 2) {
//                 const filteredFiles = acceptedFiles.filter(file => file.type !== 'image/gif');
//                 setImages([...images, ...filteredFiles].slice(0, 2));
//             } else {
//                 alert("You can only select up to 2 images.");
//             }
//         }
//     });

//     const captureImage = () => {
//         if (webcamRef.current && images.length < 2) {
//             const imageSrc = webcamRef.current.getScreenshot();
//             if (imageSrc) {
//                 setImages([...images, imageSrc]);

//                 playJoinSound();
//                 const webcam = webcamRef.current;
//                 const frame = frameRef.current;
//                 if (webcam && frame && webcam.video) {
//                     const video = webcam.video as HTMLVideoElement;
//                     video.classList.add('flash');
//                     frame.classList.add('bg-white', 'border-4', 'border-gray-600');
//                     setTimeout(() => {
//                         video.classList.remove('flash');
//                         frame.classList.remove('bg-white', 'border-4', 'border-gray-600');
//                     }, 200);
//                 }
//             }
//         }
//     };

//     const removeImage = (index: number) => {
//         setImages(images.filter((_, i) => i !== index));
//     };

//     return (
//         <>
//             <Modal
//                 isOpen={isOpen}
//                 backdrop={"blur"}
//                 placement={"bottom"}
//                 onOpenChange={onOpenChange}
//                 scrollBehavior={isClient && window.innerHeight < 500 ? 'outside' : 'normal'}
//             >
//                 <ModalContent className="justify-center items-center h-auto">
//                     {(onClose) => (
//                         <>
//                             <ModalHeader className="flex justify-center items-center gap-3">Select Pic<InfoTooltip /></ModalHeader>
//                             <ModalBody className="flex h-auto p-0 m-0 justify-center items-center gap-3 px-10">
//                                 {images.length > 0 && cameraEnabled &&
//                                     <div className="flex justify-center items-center gap-3">
//                                         {images.map((image, index) => (
//                                             <Badge key={index} className="w-6 h-6 cursor-pointer" onClick={() => removeImage(index)} content={<X strokeWidth={5} />} color="danger">
//                                                 <Image
//                                                     radius="md"
//                                                     src={image instanceof File ? URL.createObjectURL(image) : image}
//                                                     width={100}
//                                                     alt="Captured"
//                                                 />
//                                             </Badge>
//                                         ))}
//                                     </div>
//                                 }
//                                 <div className="w-full min-h-72 flex flex-col justify-center items-center">
//                                     {cameraEnabled ? (
//                                         <>
//                                             <div
//                                                 className="rounded-2xl"
//                                                 ref={frameRef}
//                                             >
//                                                 <Webcam
//                                                     videoConstraints={{ facingMode: 'environment' }}
//                                                     className="rounded-xl border-4 border-gray-600"
//                                                     audio={false}
//                                                     screenshotFormat="image/jpeg"
//                                                     ref={webcamRef}
//                                                     width={600}
//                                                     height={600}
//                                                 />
//                                             </div>
//                                         </>
//                                     ) : (images.length != 0 ?
//                                         (<CarouselProduct removeImg={removeImage} images={images} />) :
//                                         (
//                                             <Tooltip showArrow={true} color={"foreground"} content={"Drag & drop some files here, or click to select files"} className="capitalize">
//                                                 <div {...getRootProps()}>
//                                                     <input {...getInputProps()} />
//                                                     <Image src="https://nikhil-belide.netlify.app/images/aboutgif.gif" alt="demo image" width={'100%'} />
//                                                 </div>
//                                             </Tooltip>
//                                         )
//                                     )
//                                     }
//                                 </div>
//                             </ModalBody>
//                             <ModalFooter className="w-full flex justify-between gap-4">
//                                 <div className="flex justify-center items-center gap-2">
//                                     <Tooltip showArrow={true} color={"foreground"} content={"Open Camera"} className="capitalize">
//                                         <Button onClick={() => setCameraEnabled(!cameraEnabled)} radius="full" color={cameraEnabled ? "danger" : "default"} isIconOnly variant="ghost" aria-label="Take a photo">
//                                             {cameraEnabled ? <CameraOff /> : <Camera />}
//                                         </Button>
//                                     </Tooltip>
//                                     <Tooltip showArrow={true} color={"foreground"} content={"Drag & drop some files here, or click to select files"} className="capitalize">
//                                         <Button radius="full" isIconOnly variant="ghost"
//                                         >
//                                             <div {...getRootProps()}>
//                                                 <input {...getInputProps()} />
//                                                 <ImageUp />
//                                             </div>
//                                         </Button>
//                                     </Tooltip>
//                                 </div>
//                                 {cameraEnabled && (
//                                     <button disabled={images.length < 2 ? false : true} className={`bg-black rounded-full ${images.length < 2 ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
//                                         <CircleDot
//                                             strokeWidth={3}
//                                             className={`${images.length < 2 ? 'opacity-100' : 'opacity-50'}`}
//                                             color="white"
//                                             size={40}
//                                             onClick={captureImage}
//                                         />
//                                     </button>
//                                 )}
//                                 <Button className="text-lg font-bold" color="primary">Scan<ArrowUpRight strokeWidth={3} /></Button>
//                             </ModalFooter>
//                         </>
//                     )}
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// }
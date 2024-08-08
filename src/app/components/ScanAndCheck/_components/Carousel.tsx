import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge, Button, Image } from "@nextui-org/react";
import { X } from "lucide-react";

export function CarouselProduct({
  removeImg,
  images,
}: {
  removeImg: (index: number) => void;
  images: (File | string)[];
}) {
  const handleDownload = (image: File | string) => {
    const link = document.createElement("a");
    link.href = image instanceof File ? URL.createObjectURL(image) : image;
    link.download = image instanceof File ? image.name : "downloaded_image.jpg"; // Set a default name for images
    link.click();
  };

  return (
    <Carousel className="w-4/5">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem
            className="flex justify-center items-center"
            key={index}
          >
            <div className="p-1">
              <Card>
                <Badge
                  className="w-6 h-6 cursor-pointer flex justify-center items-center"
                  onClick={() => removeImg(index)}
                  content={<X strokeWidth={5} />}
                  color="danger"
                >
                  <CardContent className="flex aspect-square items-center justify-center p-1">
                    <Image
                      className="max-h-72"
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt="Captured"
                    />
                  </CardContent>
                </Badge>
                <Button
                  onClick={() => handleDownload(image)}
                  color="primary"
                  className="mt-2"
                >
                  Download
                </Button>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}



// ---------------------------------------------------------------------------------------

// import * as React from "react"

// import { Card, CardContent } from "@/components/ui/card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"
// import { Badge, Button, Image } from "@nextui-org/react"
// import { X } from "lucide-react";

// export function CarouselProduct({ removeImg, images }: { removeImg: (index: number) => void; images: (File | string)[] }) {
//   return (
//     <Carousel className="w-4/5">
//       <CarouselContent>
//         {images.map((image, index) => (
//           <CarouselItem className="flex justify-center items-center" key={index}>
//             <div className="p-1">
//               <Card>
//                 <Badge className="w-6 h-6 cursor-pointer flex justify-center items-center" onClick={() => removeImg(index)} content={<X strokeWidth={5} />} color="danger">
//                   <CardContent className="flex aspect-square items-center justify-center p-1">
//                     <Image className="max-h-72" src={image instanceof File ? URL.createObjectURL(image) : image} alt="Captured"/>
//                   </CardContent>
//                 </Badge>
//               </Card>
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious />
//       <CarouselNext />
//     </Carousel>
//   )
// }
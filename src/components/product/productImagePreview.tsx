import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductImagePreviewProps } from "@/types/product.types";
import { Image } from "@nextui-org/react";

export const ProductImagePreview = ({ images }: ProductImagePreviewProps) => {
    const getGoogleDriveThumbnail = (url: string) => {
        const fileId = url.split('id=')[1];
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=s4000`;
    };

    return (
        <Carousel className="md:w-4/5 md:h-4/5 w-2/3 h-2/3 flex justify-center items-center">
            <CarouselContent>
                {images.map((imageUrl, index) => (
                    <CarouselItem
                        className="flex justify-center items-center"
                        key={index}
                    >
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-1">
                                    <Image
                                        className="max-h-72"
                                        src={getGoogleDriveThumbnail(imageUrl)}
                                        alt="Captured"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

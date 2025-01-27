'use client'
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Progress } from "@nextui-org/react";
import { ProductDetailsTable } from "@/components/product/ProductDetailsTable";
import { AlternativeProducts } from "@/components/product/AlternativeProducts";
import { SourcesCard } from "@/components/product/SourcesCard";
import { ProductChat } from "@/components/product/ProductChat";
import { TopLeft } from "@/components/product/TopLeft";
import { TopRight } from "@/components/product/TopRight";
import { ProductInsights, userDetails } from "@/types/product.types";
import { IngredientContainer } from "@/components/product/IngredientContainer";
import { NutritionContainer } from "@/components/product/NutritionContainer";
import { Modal, Button, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const ProductInsightPage = ({ params }: { params: { id: string } }) => {
    const { data: session, update, status } = useSession();
    const [productInsights, setProductInsights] = useState<ProductInsights>();
    const [userDetails, setUserDetails] = useState<userDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const { id } = params;

    useEffect(() => {
        if (productInsights) {
            setTimeout(() => setIsLoading(false), 1000);
        }
    }, [productInsights]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/product-insights`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'productId': id,
                    'userId': session?.user?.id || ''
                },
            });

            const data = await response.json();

            if (data.error) {
                setIsModalOpen(true);
                toast.error(data.error);
                return;
            }

            setProductInsights(data.productInsight);
            if (data.productInsight?.userIdCopy) {
                setUserDetails(data.productInsight.userIdCopy);
            }
        };

        if (productInsights || status === 'loading') {
            return;
        }

        fetchData();

    }, [id, productInsights, session?.user?.id, status]);

    return (
        <>
            {!productInsights && !isModalOpen && <Progress isIndeterminate aria-label="Loading..." className="w-full" size="sm" color='primary' />}
            <div className="w-full min-h-screen flex flex-col p-3 pb-0 border-b-2 dark:bg-black bg-white">
                <AnimatePresence>
                    {productInsights && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 5,
                                delay: 2,
                                ease: [0.545, 0.045, 0.355, 1]
                            }}
                            className="fixed top-16 inset-x-0 bottom-0 z-50 pointer-events-none overflow-hidden h-[150vh]"
                        >
                            <motion.div
                                initial={{ y: "-20%" }}
                                animate={{ y: "100%" }}
                                transition={{
                                    duration: 5,
                                    ease: [0.545, 0.045, 0.355, 1]
                                }}
                                className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(124,58,237,0.05)_10%,rgba(236,72,153,0.1)_20%,rgba(255,255,255,0.95)_30%,white_40%)] dark:bg-[linear-gradient(to_bottom,transparent,rgba(124,58,237,0.15)_10%,rgba(236,72,153,0.25)_20%,rgba(0,0,0,0.95)_30%,black_40%)]"

                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <Modal className="text-default-foreground" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ModalContent>
                        <ModalHeader>Access Denied</ModalHeader>
                        <ModalBody>
                            You are not authorized to view this product insight.
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                onPress={() => {
                                    setIsModalOpen(false);
                                    router.back();
                                }}
                            >
                                Go Back
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                {productInsights &&
                    <>
                        <div className="flex flex-col justify-center items-start md:flex-row gap-5 w-full h-full">
                            <TopLeft {...productInsights} />
                            <TopRight {...productInsights} />
                        </div>
                        <IngredientContainer ingredients={productInsights.productDetails.ingredients} />
                        <NutritionContainer nutrition={productInsights.productDetails.nutrition} />
                        <div className="w-full full flex flex-col justify-center items-center md:px-3 mt-16 text-default-foreground">
                            <div className="w-full h-full">
                                <h2 className="text-2xl font-bold mb-6">Additional Product Details</h2>
                                <ProductDetailsTable productDetails={productInsights.productDetails} />
                            </div>
                        </div>
                        <div className="w-full md:px-3 py-6 mt-16 text-default-foreground">
                            <AlternativeProducts alternatives={productInsights.alternatives} />
                        </div>
                        <div className="flex flex-col justify items-center w-full mt-6 md:p-3 text-default-foreground">
                            <div className="flex flex-col w-full">
                                <h2 className="text-2xl font-bold mb-6">Research Sources</h2>
                                <SourcesCard sources={productInsights.sources} />
                            </div>
                        </div>

                        {userDetails && (
                            <div className="flex flex-col items-center w-full text-default-foreground">
                                <h2 className="text-2xl font-bold mb-6">PurePick AI Chat</h2>
                                <ProductChat
                                    productId={id}
                                    productInsights={productInsights}
                                    userDetails={userDetails}
                                />
                            </div>
                        )}
                    </>
                }
            </div>
        </>
    );
}

export default ProductInsightPage;
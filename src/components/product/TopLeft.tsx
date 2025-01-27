import { Button } from "@nextui-org/react";
import { ComparisonModal } from "./ComparisonModal";
import { ProductImagePreview } from "./productImagePreview";
import { ProductInsights } from "@/types/product.types";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const TopLeft = (productInsights: ProductInsights) => {
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [products, setProducts] = useState<ProductInsights[]>([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const { data: session } = useSession();

    const fetchProducts = async () => {
        const response = await fetch('/api/product-history', {
            headers: {
                'user-id': session?.user?.id || ''
            }
        });
        const data = await response.json();
        const filteredProducts = data.products.filter(
            (p: ProductInsights) => 
                p.productDetails.productType === productInsights.productDetails.productType &&
                p._id !== productInsights._id
        );
        setProducts(filteredProducts);
    };

    return (
        <div className="flex flex-col justify-evenly md:justify-start md:gap-5 gap-0 items-center w-full sm:h-[90vh] h-[70vh] md:w-2/5">
            <div className="dark:bg-zinc-900 bg-zinc-200 w-full h-14 rounded-full px-4 flex items-center">
                <h2 className="text-2xl text-default-foreground font-semibold w-full text-center truncate">
                    {productInsights.productDetails.productName}
                </h2>
            </div>

            <div className="w-full h-2/3 dark:bg-zinc-900 bg-zinc-200 gap-3 rounded-3xl flex justify-center items-center">
                <ProductImagePreview images={Object.values(productInsights.images)} />
            </div>
            <div className="flex justify-center items-center w-full">
                <Button
                    onClick={() => {
                        fetchProducts();
                        setIsCompareModalOpen(true);
                    }}
                    size="lg"
                    radius="full"
                    className="w-2/3 bg-indigo-700 text-xl text-white font-semibold mt-4"
                >
                    Compare with alt
                </Button>
            </div>
            <ComparisonModal 
                isOpen={isCompareModalOpen}
                onClose={() => setIsCompareModalOpen(false)}
                products={products}
                productInsights={productInsights}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
            />
        </div>
    );
};

'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Input, Select, SelectItem, Card, CardBody, Progress, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Switch, Chip } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProductHistory, ProductInsights } from "@/types/product.types";
import { toast } from "sonner";
import { MoreVertical, Share2, Copy, Trash2, Search, Filter } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

const ProductHistoryPage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<ProductHistory[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductHistory[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    const productTypes = ["all", "Food", "Beverage", "Bodycare", "Inhale", "Other"];

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        productId: ''
    });

    const openDeleteModal = (productId: string) => {
        setDeleteModal({ isOpen: true, productId });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, productId: '' });
    };

    const confirmDelete = async () => {
        const response = await fetch('/api/product-history', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'user-id': session?.user?.id || ''
            },
            body: JSON.stringify({ productId: deleteModal.productId })
        });

        const data = await response.json();
        if (data.success) {
            setProducts(products.filter(p => p._id !== deleteModal.productId));
            toast.success('Product removed from history');
        }
        closeDeleteModal();
    };

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            const response = await fetch('/api/product-history', {
                headers: {
                    'user-id': session?.user?.id || ''
                }
            });
            const data = await response.json();
            if(data.error) {
                toast.error(data.error);
                return;
            }
            setProducts(data.products);
            setFilteredProducts(data.products);
            setIsLoading(false);
        };

        if (session?.user?.id && !products.length) {
            fetchHistory();
        }
    }, [session, products.length]);

    useEffect(() => {
        let filtered = [...products];

        if (selectedType !== "all") {
            filtered = filtered.filter(p => p?.productDetails?.productType === selectedType);
        }

        if (searchQuery) {
            filtered = filtered.filter(p => {
                const searchLower = searchQuery.toLowerCase();

                return (
                    // Product Details
                    p?.productDetails?.productName?.toLowerCase().includes(searchLower) ||
                    p?.productDetails?.brand?.toLowerCase().includes(searchLower) ||
                    p?.productDetails?.description?.toLowerCase().includes(searchLower) ||
                    p?.productDetails?.certifications?.some(cert => cert?.toLowerCase().includes(searchLower)) ||
                    p?.productDetails?.price?.amount?.toLowerCase().includes(searchLower) ||

                    // Ingredients
                    p?.productDetails?.ingredients?.some(ing =>
                        ing?.name?.toLowerCase().includes(searchLower) ||
                        ing?.simplifiedName?.toLowerCase().includes(searchLower) ||
                        ing?.purpose?.toLowerCase().includes(searchLower)
                    ) ||

                    // Ratings and Reasons
                    p?.overall?.reason?.toLowerCase().includes(searchLower) ||
                    p?.overall?.key_factors?.some(factor => factor?.toLowerCase().includes(searchLower)) ||
                    p?.eco_rating?.reason?.toLowerCase().includes(searchLower) ||
                    p?.eco_rating?.impact_factors?.some(factor => factor?.toLowerCase().includes(searchLower)) ||

                    // Manufacturing
                    p?.productDetails?.manufacturing?.manufacturer?.toLowerCase().includes(searchLower) ||
                    p?.productDetails?.manufacturing?.countryOfOrigin?.toLowerCase().includes(searchLower) ||

                    // Safety
                    p?.productDetails?.safety?.warnings?.some(warning => warning?.toLowerCase().includes(searchLower)) ||
                    p?.productDetails?.safety?.restrictions?.some(restriction => restriction?.toLowerCase().includes(searchLower)) ||

                    // Benefits and Risks
                    p?.user?.benefits?.some(benefit => benefit?.toLowerCase().includes(searchLower)) ||
                    p?.user?.risks?.some(risk => risk?.toLowerCase().includes(searchLower))
                );
            });
        }

        setFilteredProducts(filtered);
    }, [searchQuery, selectedType, products]);

    const handleShare = async (productId: string, currentShared: boolean) => {
        const response = await fetch('/api/product-history', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'user-id': session?.user?.id || ''
            },
            body: JSON.stringify({ productId, shared: !currentShared })
        });

        const data = await response.json();
        if (data.success) {
            setProducts(products.map(p =>
                p._id === productId ? { ...p, shared: !currentShared } : p
            ));
            toast.success(`Product sharing turned ${!currentShared ? 'ON' : 'OFF'} successfully`);
        }
    };

    const handleCopyLink = (productId: string) => {
        const link = `${window.location.origin}/product-insights/${productId}`;
        navigator.clipboard.writeText(link);
        toast.success('Share link copied to clipboard');
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-black">
            <Modal isOpen={deleteModal.isOpen} onClose={closeDeleteModal}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-default-foreground">Confirm Removal</ModalHeader>
                    <ModalBody>
                        <p className="text-default-foreground">Are you sure you want to remove this product from your history? This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="light"
                            onPress={closeDeleteModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={confirmDelete}
                        >
                            Remove
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <div className="flex flex-col md:flex-row gap-4 mb-6 pt-4 px-6">
                <Input
                    startContent={<Search className="text-default-foreground" size={20} />}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-2/3"
                />
                <Select
                    startContent={<Filter className="text-default-foreground" size={20} />}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="md:w-1/3 text-default-foreground"
                >
                    {productTypes.map((type) => (
                        <SelectItem className="text-default-foreground" key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            {isLoading ? (
                <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className="w-full"
                />
            ) : products.length === 0 ? (
                <div className="text-center py-10">
                    <h3 className="text-xl font-semibold">No products scanned yet</h3>
                    <p className="text-gray-500 mt-2">Start scanning products to build your history</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                    <h3 className="text-xl font-semibold">No matching products found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
                    {filteredProducts.map((product) => (
                        <Card key={product._id} className="group hover:shadow-xl transition-all duration-300 border-none bg-white/70 dark:bg-black/70 backdrop-blur-lg">
                            <CardBody className="p-0">
                                <div
                                    onClick={() => router.push(`/product-insights/${product._id}`)}
                                    className="cursor-pointer p-5"
                                >
                                    <div className="relative w-full h-64 mb-5 overflow-hidden rounded-2xl">
                                        <Image
                                            src={product.images.image1}
                                            alt={product.productDetails?.productName}
                                            fill
                                            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        <div className="absolute top-4 right-4">
                                            <Dropdown className="text-default-foreground">
                                                <DropdownTrigger>
                                                    <Button
                                                        size="sm"
                                                        radius="full"
                                                        isIconOnly
                                                        variant="flat"
                                                        className="bg-white/90 dark:bg-black/90 backdrop-blur-lg"
                                                    >
                                                        <MoreVertical className="h-5 w-5" />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Product actions">
                                                    <DropdownItem
                                                        key="share"
                                                        startContent={<Share2 className="h-4 w-4" />}
                                                        endContent={
                                                            <Switch
                                                                size="sm"
                                                                color="success"
                                                                isSelected={product.shared}
                                                                onValueChange={() => handleShare(product._id, product.shared)}
                                                            />
                                                        }
                                                        className="cursor-default"
                                                    >
                                                        Share Product
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        isDisabled={!product.shared}
                                                        key="copy"
                                                        startContent={<Copy className="h-4 w-4" />}
                                                        onClick={() => handleCopyLink(product._id)}
                                                    >
                                                        Copy share link
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="remove"
                                                        className="text-danger"
                                                        color="danger"
                                                        startContent={<Trash2 className="h-4 w-4" />}
                                                        onClick={() => openDeleteModal(product._id)}
                                                    >
                                                        Delete
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-default-500 mb-1">{product.productDetails?.brand}</p>
                                            <h3 className="text-xl font-semibold line-clamp-2">{product.productDetails?.productName}</h3>
                                        </div>
                                        <div className="flex justify-between items-center gap-4">
                                            <Chip color="primary" variant="flat" size="sm">Overall: {product.overall.rating}/10</Chip>
                                            <Chip color="success" variant="flat" size="sm">Eco: {product.eco_rating.rating}/10</Chip>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductHistoryPage;
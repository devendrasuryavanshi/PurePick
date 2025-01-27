'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Input, Select, SelectItem, Card, CardBody, Progress, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, User, Chip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { AdminUser, ProductHistory } from "@/types/product.types";
import { toast } from "sonner";
import { Package, SearchIcon, Share2, Users } from "lucide-react";

interface DashboardStats {
    totalProducts: number;
    totalUsers: number;
    sharedProducts: number;
}

const AdminDashboard = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<ProductHistory[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductHistory[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [newAdminEmail, setNewAdminEmail] = useState('');

    const productTypes = ["all", "Food", "Beverage", "Bodycare", "Inhale", "Other"];

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/admin/dashboard', {
                    headers: {
                        'user-id': session?.user?.id || ''
                    }
                });

                if (!response.ok) {
                    toast.error('You are not authorized to access this page');
                    router.push('/');
                    return;
                }

                const data = await response.json();
                setProducts(data.products);
                setAdmins(data.admins);
                setFilteredProducts(data.products);
                setStats(data.stats);
            } catch (error) {
                toast.error('Failed to fetch dashboard data');
            }
            setIsLoading(false);
        };

        if (session?.user?.id && products.length === 0 && admins.length === 0) {
            fetchDashboardData();
        }
    }, [session, products.length, router]);

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

    const handleAddAdmin = async () => {
        try {
            const response = await fetch('/api/admin/dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-email': session?.user?.email || ''
                },
                body: JSON.stringify({ adminEmail: newAdminEmail })
            });

            const data = await response.json();

            if (data.success) {
                setAdmins([...admins, data.admin]);
                setShowAdminModal(false);
                setNewAdminEmail('');
                toast.success('Admin added successfully');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to add admin');
        }
    };

    const handleRemoveAdmin = async (adminUserId: string) => {
        try {
            const response = await fetch('/api/admin/dashboard', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': session?.user?.id || ''
                },
                body: JSON.stringify({ adminUserId })
            });

            const data = await response.json();

            if (data.success) {
                setAdmins(admins.filter(admin => admin.userId !== adminUserId));
                toast.success('Admin removed successfully');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Failed to remove admin');
        }
    };

    return (
        <div className="w-screen min-h-screen dark:bg-black bg-white">
            {isLoading ? (
                <Progress size="sm" isIndeterminate aria-label="Loading..." className="w-full" />
            ) : (
                <>
                    {/* Admin Management Section */}
                    <div className="space-y-6 md:px-20 p-4">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-900/30 dark:via-blue-800/20 dark:to-gray-900">
                                <CardBody className="flex flex-row items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                                        <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-600 dark:text-gray-400">Total Products</p>
                                        <p className="text-2xl font-semibold dark:text-white">{stats?.totalProducts}</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="bg-gradient-to-br from-emerald-100 via-emerald-50 to-white dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-gray-900">
                                <CardBody className="flex flex-row items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg">
                                        <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-600 dark:text-gray-400">Total Users</p>
                                        <p className="text-2xl font-semibold dark:text-white">{stats?.totalUsers}</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="bg-gradient-to-br from-amber-100 via-amber-50 to-white dark:from-amber-900/30 dark:via-amber-800/20 dark:to-gray-900">
                                <CardBody className="flex flex-row items-center gap-4">
                                    <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg">
                                        <Share2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-600 dark:text-gray-400">Shared Products</p>
                                        <p className="text-2xl font-semibold dark:text-white">{stats?.sharedProducts}</p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>


                        {/* Admin Management */}
                        <Card className="shadow-md">
                            <CardBody>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Admin Management</h2>
                                    <Button
                                        color="primary"
                                        onPress={() => setShowAdminModal(true)}
                                        startContent={<Users className="h-4 w-4" />}
                                    >
                                        Add Admin
                                    </Button>
                                </div>
                                <Table
                                    aria-label="Admins table"
                                    classNames={{
                                        wrapper: "shadow-none"
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>ADMIN</TableColumn>
                                        <TableColumn>EMAIL</TableColumn>
                                        <TableColumn>ACTIONS</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {admins.map((admin, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <User
                                                        name={''}
                                                        description={admin.email}
                                                        avatarProps={{
                                                            radius: "lg",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{admin.email}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        color="danger"
                                                        variant="flat"
                                                        size="sm"
                                                        isDisabled={admin.userId === session?.user?.id}
                                                        onPress={() => handleRemoveAdmin(admin.userId)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>

                        {/* Search and Filter Section */}
                        <Card className="shadow-md">
                            <CardBody>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="md:w-2/3"
                                        size="sm"
                                        startContent={<SearchIcon />}
                                    />
                                    <Select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="md:w-1/3 text-default-foreground"
                                        size="sm"
                                    >
                                        {productTypes.map((type) => (
                                            <SelectItem className="text-default-foreground" key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                {/* Products Table */}
                                <Table
                                    aria-label="Products table"
                                    classNames={{
                                        wrapper: "mt-4 shadow-none"
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>PRODUCT</TableColumn>
                                        <TableColumn>USER</TableColumn>
                                        <TableColumn>TYPE</TableColumn>
                                        <TableColumn>RATINGS</TableColumn>
                                        <TableColumn>STATUS</TableColumn>
                                        <TableColumn>CREATED AT</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProducts.map((product) => (
                                            <TableRow
                                                key={product._id}
                                                className="cursor-pointer hover:bg-default-100 transition-colors"
                                                onClick={() => router.push(`/product-insights/${product._id}`)}
                                            >
                                                <TableCell>
                                                    <User
                                                    className="truncate"
                                                        name={product.productDetails.productName}
                                                        description={product.productDetails.brand}
                                                        avatarProps={{
                                                            src: product.images.image1,
                                                            radius: "lg",
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{product.userIdCopy?.email}</TableCell>
                                                <TableCell>{product.productDetails.productType}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <Chip size="sm" variant="flat" color="primary">
                                                            Overall: {product.overall.rating}/10
                                                        </Chip>
                                                        <Chip size="sm" variant="flat" color="success">
                                                            Eco: {product.eco_rating.rating}/10
                                                        </Chip>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        color={product.shared ? "success" : "default"}
                                                        variant="flat"
                                                    >
                                                        {product.shared ? "Shared" : "Private"}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(product.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Admin Modal */}
                    <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)}>
                        <ModalContent>
                            <ModalHeader className="flex flex-col gap-1 text-default-foreground">Add New Admin</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="User Email"
                                    value={newAdminEmail}
                                    onChange={(e) => setNewAdminEmail(e.target.value)}
                                    type="email"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={() => setShowAdminModal(false)}>
                                    Cancel
                                </Button>
                                <Button color="primary" onPress={handleAddAdmin}>
                                    Add Admin
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;

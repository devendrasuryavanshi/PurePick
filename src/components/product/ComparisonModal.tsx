import { AgeGroupKeys, ComparisonModalProps, ProductInsights } from "@/types/product.types";
import { Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/react";

const RatingDisplay = ({ rating, max }: { rating: number; max: number }) => (
    <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{rating}</span>
        <div className="flex-1 dark:bg-zinc-800 bg-zinc-300 rounded-full h-2">
            <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${(rating / max) * 100}%` }}
            />
        </div>
    </div>
);

const ComparisonBadge = ({ result }: { result: string }) => {
    const getStyle = () => {
        switch (result) {
            case "Wins": return "bg-green-500/20 text-green-500";
            case "Loses": return "bg-red-500/20 text-red-500";
            default: return "bg-blue-500/20 text-blue-500";
        }
    };

    return (
        <div className={`px-3 py-1 rounded-full text-sm font-medium text-center ${getStyle()}`}>
            {result}
        </div>
    );
};

const determineOverallWinner = (product1: ProductInsights, product2: ProductInsights) => {
    let score1 = 0;
    let score2 = 0;

    score1 += product1.overall.rating;
    score2 += product2.overall.rating;
    score1 += product1.eco_rating.rating;
    score2 += product2.eco_rating.rating;
    score1 += product1.confidence.score / 10;
    score2 += product2.confidence.score / 10;

    Object.entries(product1.age_groups).forEach(([age, data]) => {
        const ageKey = age as AgeGroupKeys;
        score1 += data.rating;
        score2 += product2.age_groups[ageKey].rating;
    });

    return {
        winner: score1 > score2 ? product1 : score1 < score2 ? product2 : null,
        score1: Math.round(score1),
        score2: Math.round(score2)
    };
};

const compareRatings = (current: number, other: number) => {
    if (current > other) return "Wins";
    if (current < other) return "Loses";
    return "Tie";
};

export const ComparisonModal = ({ isOpen, onClose, products, productInsights, selectedProductId, setSelectedProductId }: ComparisonModalProps) => {
    const selectedProduct = products.find(p => p._id === selectedProductId);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="full"
            classNames={{
                base: "bg-gradient-to-b from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-950 overflow-y-auto",
                header: "border-b border-gray-200 dark:border-zinc-800",
                body: "py-6",
                closeButton: "hover:bg-gray-100 dark:hover:bg-white/5 active:bg-gray-200 dark:active:bg-white/10",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        Product Comparison
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                        Compare ratings and make informed decisions
                    </p>
                </ModalHeader>
                <ModalBody>
                    <Select
                        label="Select Product to Compare"
                        variant="bordered"
                        radius="lg"
                        className="mb-6"
                        classNames={{
                            trigger: "bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-900",
                            value: "text-gray-700 dark:text-zinc-200",
                        }}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                        {products.map((product) => (
                            <SelectItem className="text-default-foreground" key={product._id} value={product._id}>
                                {product.productDetails.productName}
                            </SelectItem>
                        ))}
                    </Select>

                    {selectedProduct && (
                        <>
                            <Table
                                aria-label="Comparison table"
                                shadow="none"
                                classNames={{
                                    base: "border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden",
                                    th: "bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 font-medium",
                                    td: "border-b border-gray-200 dark:border-zinc-800 text-default-foreground",
                                }}
                            >
                                <TableHeader className="text-default-foreground">
                                    <TableColumn className="w-1/4">Category</TableColumn>
                                    <TableColumn className="w-1/4">
                                        <div className="max-w-[150px] truncate">
                                            {productInsights.productDetails.productName}
                                        </div>
                                    </TableColumn>
                                    <TableColumn className="w-1/4 text-center">Comparison</TableColumn>
                                    <TableColumn className="w-1/4">
                                        <div className="max-w-[150px] truncate">
                                            {selectedProduct.productDetails.productName}
                                        </div>
                                    </TableColumn>
                                </TableHeader>
                                <TableBody className="text-default-foreground">
                                    <TableRow>
                                        <TableCell className="font-medium">Overall Rating</TableCell>
                                        <TableCell>
                                            <RatingDisplay rating={productInsights.overall.rating} max={10} />
                                        </TableCell>
                                        <TableCell>
                                            <ComparisonBadge result={compareRatings(productInsights.overall.rating, selectedProduct.overall.rating)} />
                                        </TableCell>
                                        <TableCell>
                                            <RatingDisplay rating={selectedProduct.overall.rating} max={10} />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium">Eco Rating</TableCell>
                                        <TableCell>
                                            <RatingDisplay rating={productInsights.eco_rating.rating} max={10} />
                                        </TableCell>
                                        <TableCell>
                                            <ComparisonBadge result={compareRatings(productInsights.eco_rating.rating, selectedProduct.eco_rating.rating)} />
                                        </TableCell>
                                        <TableCell>
                                            <RatingDisplay rating={selectedProduct.eco_rating.rating} max={10} />
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell className="font-medium">Confidence Score</TableCell>
                                        <TableCell>
                                            <RatingDisplay rating={productInsights.confidence.score} max={100} />
                                        </TableCell>
                                        <TableCell>
                                            <ComparisonBadge result={compareRatings(productInsights.confidence.score, selectedProduct.confidence.score)} />
                                        </TableCell>
                                        <TableCell>
                                            <RatingDisplay rating={selectedProduct.confidence.score} max={100} />
                                        </TableCell>
                                    </TableRow>

                                    {[...Object.entries(productInsights.age_groups)].map(([age, data]) => {
                                        const ageKey = age as AgeGroupKeys;
                                        return (
                                            <TableRow key={ageKey}>
                                                <TableCell className="font-medium">
                                                    {ageKey.charAt(0).toUpperCase() + ageKey.slice(1)}
                                                </TableCell>
                                                <TableCell>
                                                    <RatingDisplay rating={data.rating} max={10} />
                                                </TableCell>
                                                <TableCell>
                                                    <ComparisonBadge
                                                        result={compareRatings(
                                                            data.rating,
                                                            selectedProduct.age_groups[ageKey].rating
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <RatingDisplay rating={selectedProduct.age_groups[ageKey].rating} max={10} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }) as any}
                                </TableBody>
                            </Table>

                            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-100 dark:border-indigo-500/20">
                                {(() => {
                                    const { winner, score1, score2 } = determineOverallWinner(productInsights, selectedProduct);
                                    return (
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold mb-2">
                                                {winner ? (
                                                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                                        Winner: <span className="max-w-[200px] inline-block truncate align-bottom">
                                                            {winner.productDetails.productName}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    "It's a Tie!"
                                                )}
                                            </h3>
                                            <div className="flex justify-center items-center gap-4 text-sm text-default-foreground">
                                                <div className="max-w-[150px] truncate">
                                                    {productInsights.productDetails.productName}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-indigo-400">{score1}</span>
                                                    <span className="text-xs">vs</span>
                                                    <span className="font-semibold text-purple-400">{score2}</span>
                                                </div>
                                                <div className="max-w-[150px] truncate">
                                                    {selectedProduct.productDetails.productName}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

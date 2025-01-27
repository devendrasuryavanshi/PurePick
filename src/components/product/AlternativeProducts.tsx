'use client'

import { Alternative } from "@/types/product.types"
import { Card, CardBody, CardFooter, Chip, Button, Image } from "@nextui-org/react"
import { ExternalLink } from "lucide-react"

export const AlternativeProducts = ({ alternatives }: { alternatives: Alternative[] }) => {
    const ProductFallbackIcon = () => (
        <svg
            className="w-full h-full text-zinc-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Best Alternative Products</h2>
            <div className="md:px-3 pt-4">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {alternatives.map((alt, index) => (
                        <Card key={index} className="min-w-[300px] w-[300px] dark:bg-zinc-900">
                            <CardBody className="gap-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg truncate">{alt.name}</h3>
                                    <Chip
                                        variant="flat"
                                        className="bg-green-500/20 text-green-500"
                                    >
                                        {alt.rating}/10
                                    </Chip>
                                </div>

                                <div className="w-full h-60 relative my-2 flex justify-center items-center">
                                    {alt.imageUrl ? (
                                        <Image
                                            src={alt.imageUrl}
                                            alt={alt.name}
                                            className="object-cover rounded-lg h-60"
                                        />
                                    ) : (
                                        <div className="w-40 h-40">
                                            <ProductFallbackIcon />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Chip size="sm" variant="flat" className="bg-indigo-500/20 text-indigo-500">
                                        Eco Score: {alt.eco_score}
                                    </Chip>
                                    <Chip size="sm" variant="flat" className="bg-purple-500/20 text-purple-500">
                                        Price: {alt.price_comparison}
                                    </Chip>
                                </div>

                                <div className="mt-2">
                                    <p className="text-sm font-medium mb-1">Key Benefits:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {alt.key_benefits.slice(0, 2).map((benefit, i) => (
                                            <Chip key={i} size="sm" className="bg-zinc-100 dark:bg-zinc-800">
                                                {benefit}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    className="w-full"
                                    color="primary"
                                    endContent={<ExternalLink size={16} />}
                                    onClick={() => window.open(alt.link, '_blank')}
                                >
                                    View Product
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

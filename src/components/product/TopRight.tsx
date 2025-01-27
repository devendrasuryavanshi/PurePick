import { CustomChip } from "./CustomChip";
import { Leaf, Text } from "lucide-react";
import { Tab, Tabs } from "@nextui-org/react";
import { getBadgeClass, getExpiryStatus, getRatingColorClass } from "@/utils/product-utils";
import { InsightCard } from "./InsightCard";
import { ProductInsights } from "@/types/product.types";

export const TopRight = (productInsights: ProductInsights) => {

    const VegIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="8" r="4" fill="currentColor" />
        </svg>
    );
    
    return (
        <div className="flex flex-col justify-center items-center gap-3 w-full h-[90vh] md:w-3/5 dark:bg-zinc-950 bg-zinc-100 text-default-foreground rounded-2xl">
            <div className="flex flex-nowrap justify-evenly items-center gap-5 w-full h-16 px-3 overflow-x-auto mb-3 scrollbar-hide">
                <CustomChip
                    variant="flat"
                    className={`gap-1 pl-0 px-1 ${getRatingColorClass(productInsights.overall.rating)}`}
                    size="lg"
                    endContent={
                        <span className={`px-1 flex justify-center items-center rounded-full ${getBadgeClass(productInsights.overall.rating)} text-white`}>
                            {productInsights.overall.rating}/10
                        </span>
                    }
                >
                    Overall Rating
                </CustomChip>
                <CustomChip
                    variant="flat"
                    className={`gap-1 pl-0 px-1 ${getRatingColorClass(productInsights.eco_rating.rating)}`}
                    size="lg"
                    startContent={
                        <Leaf />
                    }
                    endContent={
                        <span className={`px-1 flex justify-center items-center rounded-full ${getBadgeClass(productInsights.eco_rating.rating)} text-white`}>
                            {productInsights.eco_rating.rating}/10
                        </span>
                    }
                >
                    Eco Rating
                </CustomChip>
                <CustomChip
                    variant="flat"
                    className={`gap-1 pl-3 ${!productInsights.productDetails.nutrition.dietaryInfo?.foodMark || productInsights.productDetails.nutrition.dietaryInfo?.foodMark?.includes('non') ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}
                    size="lg"
                    startContent={<VegIcon />}
                >
                    {productInsights.productDetails.nutrition.dietaryInfo.foodMark !== null ? productInsights.productDetails.nutrition.dietaryInfo.foodMark : "No Dietary Info"}
                </CustomChip>
                <CustomChip
                    variant="flat"
                    className={`gap-1 ${getExpiryStatus(productInsights.productDetails.manufacturing.dates.expiry).style}`}
                    size="lg"
                >
                    {getExpiryStatus(productInsights.productDetails.manufacturing.dates.expiry).text}
                </CustomChip>

                <CustomChip
                    variant="flat"
                    className={`gap-1 pl-0 px-1 ${getRatingColorClass(parseInt((productInsights.confidence.score / 10).toString()))}`}
                    size="lg"
                    endContent={
                        <span className={`px-1 flex justify-center items-center rounded-full ${getBadgeClass(parseInt((productInsights.confidence.score / 10).toString()))} text-white`}>
                            {productInsights.confidence.score}/100
                        </span>
                    }
                >
                    Confidence Score
                </CustomChip>
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full overflow-hidden">
                <Tabs color="primary" size="md" radius="full" aria-label="Options" className="mb-4">
                    <Tab key="You" title="You and More" className="w-full h-full overflow-hidden">
                        <div className="flex flex-col justify-center items-center w-full h-full gap-3 overflow-y-auto px-3">
                            <div className="w-full h-full flex flex-col gap-10">
                                <InsightCard
                                    title="For You"
                                    rating={productInsights.user.rating}
                                    reason={productInsights.user.reason}
                                    risks={productInsights.user.risks}
                                    benefits={productInsights.user.benefits}
                                />
                                <InsightCard
                                    title="Overall"
                                    rating={productInsights.overall.rating}
                                    reason={productInsights.overall.reason}
                                    selectionLabel="Key Factors"
                                    cautions={productInsights.overall.key_factors}
                                />
                                <InsightCard
                                    title="Eco Rating"
                                    startContent={<Leaf />}
                                    rating={productInsights.eco_rating.rating}
                                    reason={productInsights.eco_rating.reason}
                                    selectionLabel="Impact Factors"
                                    cautions={productInsights.eco_rating.impact_factors}
                                />
                                <div className="flex flex-col">
                                    <div className="w-full h-40 rounded-tl-2xl rounded-tr-2xl dark:bg-zinc-900 bg-zinc-200 p-2">
                                        <div className="flex justify-start items-center gap-2 mb-3">
                                            <CustomChip
                                                variant="flat"
                                                className={`gap-1 pl-0 ${getRatingColorClass(parseInt((productInsights.confidence.score / 10).toString()))}`}
                                                size="md"
                                                endContent={
                                                    <span className={`px-1 flex justify-center items-center rounded-full ${getBadgeClass(parseInt((productInsights.confidence.score / 10).toString()))} text-white`}>
                                                        {productInsights.confidence.score}/100
                                                    </span>
                                                }
                                            >
                                                Confidence Score
                                            </CustomChip>
                                        </div>
                                        <p className="overflow-y-auto h-[80%] p-1 pb-3">
                                            {productInsights.confidence.reason}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 w-full dark:bg-zinc-800 bg-zinc-300 p-2 rounded-bl-2xl rounded-br-2xl">
                                        <span className="font-medium text-sm">Data Quality</span>
                                        <div className="flex overflow-y-auto scrollbar-hide gap-2">
                                            <CustomChip
                                                variant="flat"
                                                size="sm"
                                                className="dark:bg-zinc-900"
                                            >
                                                {productInsights.confidence.data_quality}
                                            </CustomChip>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-center items-center gap-2 mb-3">
                                        <CustomChip
                                            variant="dot"
                                            className={`gap-1 pl-0 `}
                                            size="lg"
                                            endContent={
                                                <Text />
                                            }
                                        >
                                            Description
                                        </CustomChip>
                                    </div>
                                    <div className="w-full h-40 overflow-y-auto rounded-2xl dark:bg-zinc-900 bg-zinc-200 p-2">
                                        {productInsights.productDetails.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab key="ageGroups" title="Age Groups" className="w-full h-full overflow-hidden">
                        <div className="flex flex-col justify-center items-center w-full h-full gap-3 overflow-y-auto px-3">
                            <div className="w-full h-full flex flex-col gap-10">
                                <InsightCard
                                    title="Babies"
                                    ageRange="0 - 2"
                                    rating={productInsights.age_groups.baby.rating}
                                    reason={productInsights.age_groups.baby.reason}
                                    selectionLabel="Cautions"
                                    cautions={productInsights.age_groups.baby.cautions}
                                />
                                <InsightCard
                                    title="Children"
                                    ageRange="3 - 12"
                                    rating={productInsights.age_groups.children.rating}
                                    reason={productInsights.age_groups.children.reason}
                                    selectionLabel="Cautions"
                                    cautions={productInsights.age_groups.children.cautions}
                                />
                                <InsightCard
                                    title="Teenagers"
                                    ageRange="13 - 19"
                                    rating={productInsights.age_groups.teenagers.rating}
                                    reason={productInsights.age_groups.teenagers.reason}
                                    selectionLabel="Cautions"
                                    cautions={productInsights.age_groups.teenagers.cautions}
                                />
                                <InsightCard
                                    title="Adults"
                                    ageRange="20 - 59"
                                    rating={productInsights.age_groups.adults.rating}
                                    reason={productInsights.age_groups.adults.reason}
                                    selectionLabel="Cautions"
                                    cautions={productInsights.age_groups.adults.cautions}
                                />
                                <InsightCard
                                    title="Seniors"
                                    ageRange="60+"
                                    rating={productInsights.age_groups.seniors.rating}
                                    reason={productInsights.age_groups.seniors.reason}
                                    selectionLabel="Cautions"
                                    cautions={productInsights.age_groups.seniors.cautions}
                                />
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
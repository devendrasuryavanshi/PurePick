import { getBadgeClass, getRatingColorClass } from "@/utils/product-utils";
import { CustomChip } from "./CustomChip";
import { InsightCardProps } from "@/types/product.types";

export const InsightCard = ({
    title,
    startContent,
    ageRange,
    rating,
    reason,
    selectionLabel,
    cautions,
    risks,
    benefits,
}: InsightCardProps) => {
    return (
        <div className="flex flex-col">
            <div className="w-full h-40 rounded-tl-2xl rounded-tr-2xl dark:bg-zinc-900 bg-zinc-200 p-2">
                <div className="flex justify-start items-center gap-2 mb-3">
                    <CustomChip
                        variant="flat"
                        className={`gap-1 pl-0 ${getRatingColorClass(rating)}`}
                        size="md"
                        startContent={startContent}
                        endContent={
                            <span className={`px-1 flex justify-center items-center rounded-full ${getBadgeClass(rating)} text-white`}>
                                {rating}/10
                            </span>
                        }
                    >
                        {title}
                    </CustomChip>
                    <span className="font-light text-sm opacity-50">{ageRange}</span>
                </div>
                <p className="overflow-y-auto h-[80%] p-1 pb-3">
                    {reason}
                </p>
            </div>
            {cautions && (
                <div className="flex gap-2 w-full dark:bg-zinc-800 bg-zinc-300 p-2 rounded-bl-2xl rounded-br-2xl">
                    <span className="font-medium text-sm">{selectionLabel}</span>
                    <div className="flex overflow-y-auto scrollbar-hide gap-2">
                        {cautions && cautions.map((caution, index) => (
                            <CustomChip
                                key={index}
                                variant="flat"
                                size="sm"
                                className="dark:bg-zinc-900"
                            >
                                {caution}
                            </CustomChip>
                        ))}
                    </div>
                </div>
            )}
            {risks && (
                <div className="flex gap-2 w-full dark:bg-zinc-800 bg-zinc-300 p-2">
                    <span className="font-medium text-sm">Risks:</span>
                    <div className="flex overflow-y-auto scrollbar-hide gap-2">
                        {risks && risks.map((risks, index) => (
                            <CustomChip
                                key={index}
                                variant="flat"
                                size="sm"
                                color="danger"
                            >
                                {risks}
                            </CustomChip>
                        ))}
                    </div>
                </div>
            )}
            {benefits && (
                <div className="flex gap-2 w-full dark:bg-zinc-800 bg-zinc-300 p-2 pt-0 rounded-bl-2xl rounded-br-2xl">
                    <span className="font-medium text-sm">Benefits:</span>
                    <div className="flex overflow-y-auto scrollbar-hide gap-2">
                        {benefits.map((benefits, index) => (
                            <CustomChip
                                key={index}
                                variant="flat"
                                size="sm"
                                color="success"                                                                    >
                                {benefits}
                            </CustomChip>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

import { CustomChipProps } from "@/types/product.types";
import { Chip } from "@nextui-org/react";
import { ReactNode } from "react";

export const CustomChip = ({
    variant = "flat",
    size = "md",
    className = "",
    startContent,
    endContent,
    children,
    color,
}: CustomChipProps) => {
    return (
        <Chip
            variant={variant}
            size={size}
            className={className}
            startContent={startContent}
            endContent={endContent}
            color={color}
        >
            {children}
        </Chip>
    );
};

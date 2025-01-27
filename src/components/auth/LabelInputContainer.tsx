import { cn } from "@/lib/utils";
import { LabelInputContainerProps } from "@/types/global.types";

export const LabelInputContainer = ({ children, className }: LabelInputContainerProps) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
    </div>
);

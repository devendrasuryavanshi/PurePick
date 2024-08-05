import React from "react";
import { Tooltip } from "@nextui-org/react";
import { Info } from "lucide-react";

export default function InfoTooltip() {
    return (
        <Tooltip
            showArrow={true}
            color="foreground"
            className="w-56"
            content={
                <p className="text-lg">
                    Capture or upload exactly <span className="font-bold text-pink-500">2 images</span> of the product, showcasing both the front and back sides.
                </p>
            }
        >
            <Info className="cursor-pointer" color="orange" />
        </Tooltip>
    );
}
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { NutritionTableProps } from "@/types/product.types";
import { Chip } from "@nextui-org/react"

export const NutritionTable = ({ nutritionalValues }: NutritionTableProps) => {
    if (!nutritionalValues.length || !nutritionalValues[0].nutrient) {
        return (
            <div className="flex justify-center items-center w-full h-[90vh]">
                <Chip className="bg-yellow-500/20 text-yellow-500" size="lg">
                    No nutritional data available
                </Chip>
            </div>
        );
    }

    const processAmount = (amount?: string) => {
        if (!amount) return 1;
        const numValue = parseFloat(amount);
        return isNaN(numValue) ? 1 : numValue;
    };

    const sortedNutrition = [...nutritionalValues].sort((a, b) => {
        if (!a.amount && !b.amount) return 0;
        if (!a.amount) return 1;
        if (!b.amount) return -1;
        return processAmount(b.amount) - processAmount(a.amount);
    });

    return (
        <div className="w-full md:h-[500px] overflow-y-auto">
            <Table className="table-fixed min-w-[500px]">
                <TableCaption>Nutritional Information</TableCaption>
                <TableHeader className="sticky top-0 dark:bg-background bg-zinc-200 z-10">
                    <TableRow>
                        <TableHead className="w-[25%] min-w-[150px] font-bold">Nutrient</TableHead>
                        <TableHead className="w-[25%] min-w-[150px] font-bold">Amount</TableHead>
                        <TableHead className="w-[15%] min-w-[100px] font-bold">Unit</TableHead>
                        <TableHead className="w-[25%] min-w-[150px] font-bold">Daily Value %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedNutrition.map((nutrition, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{nutrition.nutrient}</TableCell>
                            <TableCell>{nutrition.amount}</TableCell>
                            <TableCell>{nutrition.unit}</TableCell>
                            <TableCell>{nutrition.percentDailyValue || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

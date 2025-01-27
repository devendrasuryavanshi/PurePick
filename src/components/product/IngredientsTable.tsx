import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IngredientsTableProps } from "@/types/product.types";
import { Chip } from "@nextui-org/react"

export const IngredientsTable = ({ ingredients }: IngredientsTableProps) => {
    if (!ingredients.length) {
        return (
            <div className="flex justify-center items-center w-full h-[90vh]">
                <Chip className="bg-yellow-500/20 text-yellow-500" size="lg">
                    No ingredients data available
                </Chip>
            </div>
        );
    }

    const processQuantity = (qty?: string) => {
        if (!qty) return 1;
        const numValue = parseFloat(qty.replace?.('%', '') || '');
        return isNaN(numValue) ? 1 : numValue;
    };

    const sortedIngredients = [...ingredients].sort((a, b) => {
        if (!a.quantity && !b.quantity) return 0;
        if (!a.quantity) return 1;
        if (!b.quantity) return -1;
        return processQuantity(b.quantity) - processQuantity(a.quantity);
    });

    return (
        <div className="w-full md:h-[500px] overflow-y-auto">
            <Table className="table-fixed min-w-[500px]">
                <TableCaption>List of all ingredients with details</TableCaption>
                <TableHeader className="sticky top-0 dark:bg-background bg-zinc-200 z-10">
                    <TableRow>
                        <TableHead className="w-[25%] min-w-[150px] font-bold">Name</TableHead>
                        <TableHead className="w-[25%] min-w-[150px] font-bold">Simplified Name</TableHead>
                        <TableHead className="w-[15%] min-w-[100px] font-bold">Quantity</TableHead>
                        <TableHead className="w-[35%] min-w-[200px] font-bold">Purpose</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedIngredients.map((ingredient, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{ingredient.name}</TableCell>
                            <TableCell>{ingredient.simplifiedName || '-'}</TableCell>
                            <TableCell>{ingredient.quantity || '-'}</TableCell>
                            <TableCell className="max-w-md">{ingredient.purpose || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ProductDetailsTableProps } from "@/types/product.types";
import { Chip } from "@nextui-org/react"

export const ProductDetailsTable = ({ productDetails }: ProductDetailsTableProps) => {
    const sections = [
        {
            title: "Basic Information",
            data: [
                { label: "Product Type", value: productDetails.productType },
                { label: "Product Name", value: productDetails.productName },
                { label: "Brand", value: productDetails.brand },
                { label: "Barcode", value: productDetails.barcode },
                { label: "Description", value: productDetails.description },
                { label: "Certifications", value: productDetails.certifications.join(", ") },
                { label: "Price", value: `${productDetails.price.amount} ${productDetails.price.currency}` },
                { label: "Weight", value: `${productDetails.weight.value} ${productDetails.weight.unit}` },
                { label: "Allergens", value: productDetails.allergens.join(", ") },
            ]
        },
        {
            title: "Manufacturing Details",
            data: [
                { label: "Manufacturer", value: productDetails.manufacturing.manufacturer },
                { label: "Locations", value: productDetails.manufacturing.locations.join(", ") },
                { label: "Country of Origin", value: productDetails.manufacturing.countryOfOrigin },
                { label: "Manufacture Date", value: productDetails.manufacturing.dates.manufacture },
                { label: "Expiry Date", value: productDetails.manufacturing.dates.expiry },
                { label: "Batch Number", value: productDetails.manufacturing.batch },
            ]
        },
        {
            title: "Packaging Information",
            data: [
                {
                    label: "Materials",
                    value: productDetails?.packaging?.materials?.map(m => `${m.materialType} (${m.percentage})`).join(", ")
                },
                { label: "Disposal Instructions", value: productDetails.packaging.disposalInstructions },
            ]
        },
        {
            title: "Safety Information",
            data: [
                { label: "Warnings", value: productDetails.safety.warnings.join(", ") },
                { label: "Restrictions", value: productDetails.safety.restrictions.join(", ") },
            ]
        },
        {
            title: "Storage Information",
            data: [
                { label: "Temperature", value: productDetails.storage.temperature },
                { label: "Condition", value: productDetails.storage.condition },
                { label: "Shelf Life", value: productDetails.storage.shelfLife },
            ]
        },
        {
            title: "Usage Information",
            data: [
                { label: "Instructions", value: productDetails.usage.instructions },
            ]
        },
        {
            title: "Contact Information",
            data: [
                { label: "Phone", value: productDetails.contact.phone.join(", ") },
                { label: "Email", value: productDetails.contact.email.join(", ") },
                { label: "Website", value: productDetails.contact.website },
                { label: "Address", value: productDetails.contact.address },
            ]
        },
    ];

    return (
        <div className="w-full h-full md:px-3">
            <div className="w-full md:h-[500px] h-[80vh] overflow-y-auto dark:bg-zinc-900 p-3 shadow-lg rounded-2xl">
                <Table className="min-w-[700px]">
                    <TableCaption>Complete Product Details</TableCaption>
                    <TableHeader className="sticky top-0 dark:bg-background bg-zinc-200 z-10">
                        <TableRow>
                            <TableHead className="w-1/3">Category</TableHead>
                            <TableHead className="w-1/3">Detail</TableHead>
                            <TableHead className="w-1/3">Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sections.map((section, sectionIndex) => (
                            <>
                                <TableRow key={`section-${sectionIndex}`} className="bg-muted/50">
                                    <TableCell colSpan={3} className="font-bold">
                                        {section.title}
                                    </TableCell>
                                </TableRow>
                                {section.data.map((item, itemIndex) => (
                                    <TableRow key={`${sectionIndex}-${itemIndex}`}>
                                        <TableCell></TableCell>
                                        <TableCell className="font-medium">{item.label}</TableCell>
                                        <TableCell>
                                            {item.value || <Chip size="sm" className="bg-yellow-500/20 text-yellow-500">Not available</Chip>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

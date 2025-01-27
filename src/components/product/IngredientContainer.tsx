import { Ingredients } from "@/types/product.types";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { IngredientsChart } from "./IngredientsChart";
import { IngredientsTable } from "./IngredientsTable";

export const IngredientContainer = ({ ingredients }: { ingredients: Ingredients[] }) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[90vh] overflow-hidden mt-6 text-default-foreground">
            <Tabs color="primary" size="md" radius="full" aria-label="Options" className="mb-4">
                <Tab key="pieChart" title="Ingredients Pie" className="w-full md:px-6 h-[90%]">
                    <Card className="w-full">
                        <CardBody>
                            <div className="flex flex-col items-center w-full h-full">
                                <h2 className="text-2xl font-bold mb-6">Ingredients Distribution</h2>
                                <IngredientsChart ingredients={ingredients} />
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="table" title="Ingredients Table" className="w-full md:px-6 h-[90%]">
                    <Card className="w-full h-full">
                        <CardBody className="w-full h-full">
                            <div className="flex flex-col justify-start items-center w-full h-full">
                                <h2 className="text-2xl font-bold mb-6">Ingredients Details</h2>
                                <IngredientsTable ingredients={ingredients} />
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    )
}
import { Nutrition } from "@/types/product.types";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { NutritionChart } from "./NutritionChart";
import { NutritionTable } from "./NutritionTable";

export const NutritionContainer = ({ nutrition }: { nutrition: Nutrition }) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-[90vh] overflow-hidden mt-6">
            <Tabs color="primary" size="md" radius="full" aria-label="Options" className="mb-4">
                <Tab key="nutritionPie" title="Nutrition Chart" className="w-full md:px-6 h-[90%]">
                    <Card className="w-full">
                        <CardBody>
                            <div className="flex flex-col items-center w-full h-full">
                                <h2 className="text-2xl font-bold mb-6">Nutritional Distribution</h2>
                                <NutritionChart nutritionalValues={nutrition.nutritionalValues} />
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key="nutritionTable" title="Nutrition Table" className="w-full md:px-6 h-[90%]">
                    <Card className="w-full h-full">
                        <CardBody className="w-full h-full">
                            <div className="flex flex-col justify-start items-center w-full h-full">
                                <h2 className="text-2xl font-bold mb-6">Nutritional Details</h2>
                                <NutritionTable nutritionalValues={nutrition.nutritionalValues} />
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>
        </div>
    )
}
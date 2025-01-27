import { ResponsivePie } from '@nivo/pie'
import { Chip } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { NutritionChartProps } from '@/types/product.types';
import { colorPalette } from '@/data/constants';

export const NutritionChart = ({ nutritionalValues }: NutritionChartProps) => {
    const { theme } = useTheme();

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

    const chartData = sortedNutrition.map(nut => ({
        id: nut.nutrient,
        label: `${nut.amount}${nut.unit}`,
        value: processAmount(nut.amount),
        dailyValue: nut.percentDailyValue || '',
        unit: nut.unit
    }));

    const hasQuantities = nutritionalValues.some(nut => nut.amount);

    return (
        <div className="flex flex-col w-full">
            {!hasQuantities && (
                <Chip
                    className="self-center mb-4 bg-yellow-500/20 text-yellow-500"
                    size="lg"
                >
                    Ingredient ratios are not available - showing equal distribution
                </Chip>
            )}
            <div className="flex flex-col md:flex-row w-full h-auto md:h-[470px] gap-6 p-4">
                <div className="w-full md:w-2/3 h-[300px] md:h-full">
                    <ResponsivePie
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                            ...(window.innerWidth > 768 && {
                                top: 40,
                                right: 80,
                                bottom: 40,
                                left: 80
                            })
                        }}
                        innerRadius={0}
                        padAngle={0}
                        cornerRadius={0}
                        colors={colorPalette}
                        borderWidth={2}
                        borderColor={theme === 'dark' ? '#1f2937' : '#f3f4f6'}
                        enableArcLinkLabels={window.innerWidth > 768}
                        arcLinkLabelsColor={{ from: 'color', modifiers: [['darker', 1]] }}
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsTextColor={theme === 'dark' ? '#ffffff' : '#000000'}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor="#ffffff"
                        arcLabel="label"
                        tooltip={({ datum }) => (
                            <div className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg border dark:border-zinc-700">
                                <span className="text-black dark:text-white font-medium">
                                    {datum.id}: {datum.value}{datum.data.unit} ({datum.data.dailyValue})
                                </span>
                            </div>
                        )}
                    />
                </div>

                <div className="w-full md:w-1/3 h-[300px] md:h-full overflow-y-auto rounded-xl dark:bg-zinc-900 p-4">
                    <h3 className="text-xl font-semibold mb-4 text-center">Nutrition List</h3>
                    <div className="space-y-3">
                        {sortedNutrition.map((nut, index) => (
                            <div
                                key={nut.nutrient}
                                className="flex items-center justify-between p-3 rounded-lg dark:bg-zinc-800"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                                    />
                                    <span className="font-medium text-sm md:text-base">{nut.nutrient}</span>
                                </div>
                                <div className="text-xs md:text-sm opacity-75">
                                    {nut.amount}{nut.unit} {nut.percentDailyValue ? '('+nut.percentDailyValue+')' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

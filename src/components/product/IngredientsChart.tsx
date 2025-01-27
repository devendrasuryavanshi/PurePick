import { ResponsivePie } from '@nivo/pie'
import { Chip } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { IngredientsChartProps } from '@/types/product.types';
import { colorPalette } from '@/data/constants';

export const IngredientsChart = ({ ingredients }: IngredientsChartProps) => {
    const { theme } = useTheme();

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

    const getUnit = (qty?: string) => {
        if (!qty) return '';
        if (qty.includes('%')) return '%';
        if (qty.includes('g')) return 'g';
        if (qty.includes('mg')) return 'mg';
        if (qty.includes('ml')) return 'ml';
        return '';
    };

    const sortedIngredients = [...ingredients].sort((a, b) => {
        if (!a.quantity && !b.quantity) return 0;
        if (!a.quantity) return 1;
        if (!b.quantity) return -1;
        return processQuantity(b.quantity) - processQuantity(a.quantity);
    });

    const chartData = sortedIngredients.map(ing => ({
        id: ing.name,
        label: `${processQuantity(ing.quantity)}${getUnit(ing.quantity)}`,
        value: processQuantity(ing.quantity),
        quantity: ing.quantity || 'No Info'
    }));

    const hasQuantities = ingredients.some(ing => ing.quantity);

    return (
        <div className="flex flex-col w-full h-full">
            {!hasQuantities && (
                <Chip
                    className="self-center mb-4 bg-yellow-500/20 text-yellow-500 text-xs md:text-lg"
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
                        enableArcLinkLabels={true}
                        arcLinkLabelsColor={{ from: 'color', modifiers: [['darker', 1]] }}
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsTextColor={theme === 'dark' ? '#ffffff' : '#000000'}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor="#ffffff"
                        arcLabel="label"
                        tooltip={({ datum }) => (
                            <div className="bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg border dark:border-zinc-700">
                                <span className="text-black dark:text-white font-medium">
                                    {datum.id}: {datum.data.quantity || ''}
                                </span>
                            </div>
                        )}
                    />
                </div>

                <div className="w-full md:w-1/3 h-[300px] md:h-full overflow-y-auto rounded-xl dark:bg-zinc-900 p-4">
                    <h3 className="text-xl font-semibold mb-4 text-center">Ingredients List</h3>
                    <div className="space-y-3">
                        {sortedIngredients.map((ing, index) => (
                            <div
                                key={ing.name}
                                className="flex items-center justify-between p-3 rounded-lg dark:bg-zinc-800"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: colorPalette[index % colorPalette.length] }}
                                    />
                                    <span className="font-medium text-sm md:text-base">{ing.name}</span>
                                </div>
                                <span className="text-xs md:text-sm opacity-75">
                                    {ing.quantity || '-'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

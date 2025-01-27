import { SourcesCardProps } from "@/types/product.types";
import { Card, CardBody, Chip, Link } from "@nextui-org/react";
import { ExternalLink, FileText, Globe, FlaskConical } from "lucide-react";

export const SourcesCard = ({ sources }: SourcesCardProps) => {
    const getSourceTypeIcon = (type: string) => {
        switch (type) {
            case 'regulatory':
                return <Globe className="w-4 h-4" />;
            case 'scientific':
                return <FlaskConical className="w-4 h-4" />;
            case 'market':
                return <FileText className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getSourceTypeColor = (type: string) => {
        switch (type) {
            case 'regulatory':
                return "bg-blue-500/20 text-blue-500";
            case 'scientific':
                return "bg-purple-500/20 text-purple-500";
            case 'market':
                return "bg-green-500/20 text-green-500";
            default:
                return "bg-gray-500/20 text-gray-500";
        }
    };

    if (!sources?.length) {
        return (
            <Card className="w-full h-[200px]">
                <CardBody className="flex justify-center items-center">
                    <Chip className="bg-yellow-500/20 text-yellow-500" size="lg">
                        No sources available
                    </Chip>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="w-full h-[200px] dark:bg-transparent">
            <CardBody className="md:px-3 px-0">
                <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {sources.map((source, index) => (
                        <Card 
                            key={index} 
                            className="bg-content2 dark:bg-content1 min-w-[300px]"
                            isPressable
                            as={Link}
                            href={source.link}
                            target="_blank"
                        >
                            <CardBody className="p-3">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <Chip
                                            startContent={getSourceTypeIcon(source.sourceType)}
                                            className={getSourceTypeColor(source.sourceType)}
                                            size="sm"
                                        >
                                            {source.sourceType}
                                        </Chip>
                                        <ExternalLink className="w-4 h-4 opacity-50" />
                                    </div>
                                    <p className="text-sm font-semibold line-clamp-2">{source.name}</p>
                                    <p className="text-xs opacity-70 line-clamp-1">{source.relevance}</p>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

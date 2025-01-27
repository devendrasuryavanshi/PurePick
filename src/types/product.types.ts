import { ReactNode } from "react";

export interface ProductInsights {
    _id?: string;
    userId: string;
    userIdCopy: {
        _id?: string;
        firstName?: string;
        email?: string;
    }
    productDetails: {
        productType: 'Food' | 'Beverage' | 'Bodycare' | 'Inhale' | 'Other';
        productName: string;
        brand: string;
        barcode: string;
        description: string;
        certifications: string[];
        price: {
            amount: string;
            currency: string;
        };
        weight: {
            value: string;
            unit: string;
        };
        ingredients: Array<{
            name: string;
            simplifiedName: string;
            quantity: string;
            purpose: string;
        }>;
        nutrition: {
            servingInfo: {
                servingSize: string;
                servingsPerContainer: string;
            };
            nutritionalValues: Array<{
                nutrient: string;
                amount: string;
                unit: string;
                percentDailyValue: string;
            }>;
            dietaryInfo: {
                foodMark: string;
                isGlutenFree: Boolean
            }
        };
        allergens: string[];
        manufacturing: {
            manufacturer: string;
            locations: string[];
            countryOfOrigin: string;
            dates: {
                manufacture: string;
                expiry: string;
            };
            batch: string;
        };
        packaging: {
            materials: Array<{
                materialType: string;
                percentage: string;
            }>;
            disposalInstructions: string;
        };
        safety: {
            warnings: string[];
            restrictions: string[];
        };
        storage: {
            temperature: string;
            condition: string;
            shelfLife: string;
        };
        usage: {
            instructions: string;
        };
        contact: {
            phone: string[];
            email: string[];
            website: string;
            address: string;
        };
    };
    images: {
        image1: string;
        image2: string;
    };
    rawText: {
        image1: string;
        image2: string;
    };
    overall: {
        rating: number;
        reason: string;
        key_factors: string[];
    };
    user: {
        rating: number;
        reason: string;
        risks: string[];
        benefits: string[];
    };
    age_groups: {
        baby: {
            rating: number;
            reason: string;
            cautions: string[];
        };
        children: {
            rating: number;
            reason: string;
            cautions: string[];
        };
        teenagers: {
            rating: number;
            reason: string;
            cautions: string[];
        };
        adults: {
            rating: number;
            reason: string;
            cautions: string[];
        };
        seniors: {
            rating: number;
            reason: string;
            cautions: string[];
        };
    };
    eco_rating: {
        rating: number;
        reason: string;
        impact_factors: string[];
    };
    confidence: {
        score: number;
        reason: string;
        data_quality: string;
    };
    sources: Array<{
        name: string;
        sourceType: string;
        link: string;
        relevance: string;
    }>;
    alternatives: Array<{
        name: string;
        rating: number;
        key_benefits: string[];
        health_advantages: string[];
        eco_score: number;
        price_comparison: string;
        imageUrl: string;
        link: string;
    }>;
    chat: {
        messages: Array<{
            id: string;
            role: 'user' | 'assistant';
            content: string;
            timestamp: Date;
        }>;
        messageCount: number;
    };
    shared: boolean;
    createdAt: Date;
}

export interface ProductHistory extends ProductInsights {
    _id: string;
}

export interface Ingredients {
    name: string;
    simplifiedName: string;
    quantity: string;
    purpose: string;
}

export interface Nutrition {
    servingInfo: {
        servingSize: string;
        servingsPerContainer: string;
    };
    nutritionalValues: Array<{
        nutrient: string;
        amount: string;
        unit: string;
        percentDailyValue: string;
    }>;
    dietaryInfo: {
        foodMark: string;
        isGlutenFree: Boolean
    }
}

export interface CustomChipProps {
    variant?: "flat" | "solid" | "dot" | "bordered";
    size?: "sm" | "md" | "lg";
    className?: string;
    startContent?: ReactNode;
    endContent?: ReactNode;
    children: ReactNode;
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

export interface IngredientsChartProps {
    ingredients: Array<{
        name: string;
        quantity?: string;
    }>;
}

export interface IngredientsTableProps {
    ingredients: Array<{
        name: string;
        simplifiedName: string;
        quantity: string;
        purpose: string;
    }>;
}

export interface InsightCardProps {
    title: string;
    startContent?: React.ReactNode;
    ageRange?: string;
    rating: number;
    reason: string;
    selectionLabel?: string;
    cautions?: string[];
    risks?: string[];
    benefits?: string[];
}

export interface NutritionChartProps {
    nutritionalValues: Array<{
        nutrient: string;
        amount: string;
        unit: string;
        percentDailyValue: string;
    }>;
}

export interface NutritionTableProps {
    nutritionalValues: Array<{
        nutrient: string;
        amount: string;
        unit: string;
        percentDailyValue: string;
    }>;
}

export interface ProductDetailsTableProps {
    productDetails: {
        productType: string;
        productName: string;
        brand: string;
        barcode: string;
        description: string;
        certifications: string[];
        price: {
            amount: string;
            currency: string;
        };
        weight: {
            value: string;
            unit: string;
        };
        allergens: string[];
        manufacturing: {
            manufacturer: string;
            locations: string[];
            countryOfOrigin: string;
            dates: {
                manufacture: string;
                expiry: string;
            };
            batch: string;
        };
        packaging: {
            materials: Array<{
                materialType: string;
                percentage: string;
            }>;
            disposalInstructions: string;
        };
        safety: {
            warnings: string[];
            restrictions: string[];
        };
        storage: {
            temperature: string;
            condition: string;
            shelfLife: string;
        };
        usage: {
            instructions: string;
        };
        contact: {
            phone: string[];
            email: string[];
            website: string;
            address: string;
        };
    };
}

export interface ProductImagePreviewProps {
    images: string[]
}

export interface Source {
    name: string;
    sourceType: string;
    link: string;
    relevance: string;
}

export interface SourcesCardProps {
    sources: Source[];
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isComplete?: boolean;
}
export interface userDetails {
    _id: string;
    age: number | null;
    gender: string | null;
    allergies: [String] | null;
    diseases: [String] | null;
}

export interface AdminUser {
    email: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Alternative {
    name: string
    rating: number
    key_benefits: string[]
    health_advantages: string[]
    eco_score: number
    price_comparison: string
    link: string
    imageUrl: string
}

export type AgeGroupKeys = 'baby' | 'children' | 'teenagers' | 'adults' | 'seniors';

export interface ComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: ProductInsights[];
    productInsights: ProductInsights;
    selectedProductId: string;
    setSelectedProductId: (id: string) => void;
}
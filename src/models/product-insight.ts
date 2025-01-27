import mongoose, { Schema, model, models, Model, Document } from 'mongoose';

interface IProductInsight extends Document {
    userId: Schema.Types.ObjectId;
    userIdCopy: Schema.Types.ObjectId;
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
                isGlutenFree: Boolean;
            };
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
        image1: {
            type: string,
            required: true
        },
        image2: {
            type: string,
            required: true
        }
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

const productInsightSchema = new Schema<IProductInsight>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    userIdCopy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    productDetails: {
        productType: {
            type: String,
            enum: ['Food', 'Beverage', 'Bodycare', 'Inhale', 'Other'],
            default: 'Other',
            required: true
        },
        productName: String,
        brand: String,
        barcode: String,
        description: String,
        certifications: [String],
        price: {
            amount: String,
            currency: String
        },
        weight: {
            value: String,
            unit: String
        },
        ingredients: [{
            name: String,
            simplifiedName: String,
            quantity: String,
            purpose: String
        }],
        nutrition: {
            servingInfo: {
                servingSize: String,
                servingsPerContainer: String
            },
            nutritionalValues: [{
                nutrient: String,
                amount: String,
                unit: String,
                percentDailyValue: String
            }],
            dietaryInfo: {
                foodMark: {
                    type: String,
                    enum: ['veg', 'non-veg', 'vegan', null],
                },
                isGlutenFree: Boolean
            }
        },
        allergens: [String],
        manufacturing: {
            manufacturer: String,
            locations: [String],
            countryOfOrigin: String,
            dates: {
                manufacture: String,
                expiry: String
            },
            batch: String
        },
        packaging: {
            materials: [{
                materialType: { type: String },
                percentage: { type: String }
            }],
            disposalInstructions: String
        },
        safety: {
            warnings: [String],
            restrictions: [String]
        },
        storage: {
            temperature: String,
            condition: String,
            shelfLife: String
        },
        usage: {
            instructions: String
        },
        contact: {
            phone: [String],
            email: [String],
            website: String,
            address: String
        }
    },
    images: {
        image1: String,
        image2: String
    },
    rawText: {
        image1: String,
        image2: String
    },
    overall: {
        rating: Number,
        reason: String,
        key_factors: [String]
    },
    user: {
        rating: Number,
        reason: String,
        risks: [String],
        benefits: [String]
    },
    age_groups: {
        baby: {
            rating: Number,
            reason: String,
            cautions: [String]
        },
        children: {
            rating: Number,
            reason: String,
            cautions: [String]
        },
        teenagers: {
            rating: Number,
            reason: String,
            cautions: [String]
        },
        adults: {
            rating: Number,
            reason: String,
            cautions: [String]
        },
        seniors: {
            rating: Number,
            reason: String,
            cautions: [String]
        }
    },
    eco_rating: {
        rating: Number,
        reason: String,
        impact_factors: [String]
    },
    confidence: {
        score: Number,
        reason: String,
        data_quality: String
    },
    sources: [{
        name: { type: String },
        sourceType: { type: String },
        link: { type: String },
        relevance: { type: String }
    }],
    alternatives: [{
        name: String,
        rating: Number,
        key_benefits: [String],
        health_advantages: [String],
        eco_score: Number,
        price_comparison: String,
        imageUrl: String,
        link: String
    }],
    chat: {
        messages: [{
            id: { type: String, required: true },
            role: { type: String, enum: ['user', 'assistant'], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }],
        messageCount: { type: Number, default: 0, max: 10 }
    },
    shared: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProductInsight = mongoose.models.ProductInsight || mongoose.model<IProductInsight>('ProductInsight', productInsightSchema);

export default ProductInsight;

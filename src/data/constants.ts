import { LoginFormData, LoginFormValidation, SignupForm, SignupFormValidation } from "@/types/auth.types";
import { ProfileFormData, ProfileFormValidation } from "@/types/profile.types";

export const loadingStates = [
    {
        progress: {
            text: "Uploading Images",
            desc: "Sending product images for analysis",
        },
        success: {
            text: "Images Uploaded",
            desc: "Images received successfully",
        }
    },
    {
        progress: {
            text: "Scanning Product",
            desc: "Detecting barcode and dates",
        },
        success: {
            text: "Product Scanned",
            desc: "Product identifiers confirmed",
        }
    },
    {
        progress: {
            text: "Finding information",
            desc: "Searching product databases",
        },
        success: {
            text: "Information found",
            desc: "Product data retrieved",
        }
    },
    {
        progress: {
            text: "Extracting Information",
            desc: "Reading product details from images",
        },
        success: {
            text: "Information Extracted",
            desc: "Product details retrieved successfully",
        }
    },
    {
        progress: {
            text: "Analyzing Product",
            desc: "Evaluating product composition",
        },
        success: {
            text: "Analysis Complete",
            desc: "Product evaluation finished",
        }
    },
    {
        progress: {
            text: "Finding Alternatives",
            desc: "Searching for best alternatives",
        },
        success: {
            text: "Alternatives Found",
            desc: "Product suggestions ready",
        }
    },
    {
        progress: {
            text: "Preparing Results",
            desc: "Compiling final analysis",
        },
        success: {
            text: "Results Ready",
            desc: "Analysis completed successfully",
        }
    }
];

export const ALLERGIES = [
    "Peanuts", "Tree Nuts", "Milk", "Eggs", "Soy", "Wheat", "Fish", "Shellfish",
    "Sesame", "Mustard", "Celery", "Sulphites", "Lupin", "Molluscs", "Corn",
    "Strawberries", "Kiwi", "Peaches", "Latex", "Dust Mites", "Pollen",
    "Pet Dander", "Mold", "Bee Stings", "Sunflower Seeds", "Garlic", "Onion",
    "Avocado", "Banana", "Coconut", "Almonds", "Cashews", "Pistachios", "Macadamia", "Pecans", "Walnuts",
    "Hazelnuts", "Pine Nuts", "Brazil Nuts", "Chestnuts", "Mangoes", "Apples",
    "Cherries", "Plums", "Apricots", "Pears", "Carrots", "Cucumber", "Tomatoes",
    "Bell Peppers", "Mushrooms", "Asparagus", "Broccoli", "Cauliflower",
    "Cabbage", "Brussels Sprouts", "Spinach", "Lettuce", "Watermelon",
    "Cantaloupe", "Honeydew", "Grapes", "Raspberries", "Blackberries",
    "Blueberries", "Pineapple", "Papaya", "Pomegranate", "Figs", "Dates",
    "Raisins", "Chocolate", "Coffee", "Tea", "Beef", "Pork", "Chicken",
    "Turkey", "Lamb", "Duck", "Goose", "Quail", "Rabbit", "Venison", "Bison",
    "Octopus", "Squid", "Crab", "Lobster", "Shrimp", "Oysters", "Mussels",
    "Clams", "Scallops", "Rice", "Barley", "Oats", "Rye", "Quinoa", "Buckwheat",
    "Amaranth", "Millet", "Spelt", "Kamut", "Yeast", "Citrus Fruits", "Melon",
    "Cinnamon", "Ginger", "Turmeric", "Cardamom", "Cumin", "Coriander",
    "Fennel", "Anise", "Caraway", "Dill", "Rosemary", "Thyme", "Sage",
    "Oregano", "Basil", "Mint", "Parsley", "Chives", "Tarragon", "Bay Leaves",
    "Poppy Seeds", "Chia Seeds", "Flax Seeds", "Hemp Seeds", "Pumpkin Seeds"
];

export const MEDICAL_CONDITIONS = [
    "Diabetes Type 1", "Diabetes Type 2", "Hypertension", "Asthma",
    "Heart Disease", "Arthritis", "Osteoporosis", "Celiac Disease",
    "Crohn's Disease", "Ulcerative Colitis", "GERD", "Migraine", "Epilepsy",
    "Multiple Sclerosis", "Parkinson's Disease", "Alzheimer's Disease", "Hyperhidrosis", "Cholinergic urticaria (CholU)",
    "Depression", "Anxiety Disorder", "Bipolar Disorder", "Hypothyroidism",
    "Hyperthyroidism", "Anemia", "Psoriasis", "Eczema", "Fibromyalgia",
    "Sleep Apnea", "Chronic Fatigue Syndrome", "Lupus", "Rheumatoid Arthritis",
    "Chronic Kidney Disease", "Acute Bronchitis", "ADHD", "Addison's Disease", "Agoraphobia",
    "Alcoholism", "ALS", "Amenorrhea", "Anorexia Nervosa", "Antisocial Personality Disorder",
    "Appendicitis", "Arrhythmia", "Autism Spectrum Disorder", "Barrett's Esophagus",
    "Bell's Palsy", "Benign Prostatic Hyperplasia", "Borderline Personality Disorder",
    "Bronchiectasis", "Bulimia Nervosa", "Bursitis", "Carpal Tunnel Syndrome",
    "Cataracts", "Cerebral Palsy", "Cervical Spondylosis", "Chronic Bronchitis",
    "Chronic Sinusitis", "Cirrhosis", "Cluster Headaches", "Colitis",
    "Color Blindness", "Conjunctivitis", "COPD", "Cushing's Syndrome",
    "Cystic Fibrosis", "Dengue", "Dermatitis", "Diabetic Neuropathy",
    "Diverticulitis", "Down Syndrome", "Dyslexia", "Emphysema",
    "Endometriosis", "Enlarged Prostate", "Fatty Liver Disease", "Gallstones",
    "Gastritis", "Glaucoma", "Gout", "Graves' Disease", "Guillain-Barre Syndrome",
    "Hashimoto's Thyroiditis", "Hemophilia", "Hepatitis A", "Hepatitis B",
    "Hepatitis C", "Hernia", "High Cholesterol", "HIV/AIDS", "Hodgkin's Lymphoma",
    "Huntington's Disease", "Hydrocephalus", "Hypoglycemia", "IBS",
    "Impetigo", "Insomnia", "Interstitial Cystitis", "Iritis",
    "Irritable Bowel Syndrome", "Kawasaki Disease", "Keratoconus",
    "Kidney Stones", "Klinefelter Syndrome", "Lactose Intolerance",
    "Laryngitis", "Leukemia", "Liver Cancer", "Macular Degeneration",
    "Malaria", "Melanoma", "Meniere's Disease", "Meningitis",
    "Metabolic Syndrome", "Myasthenia Gravis", "Narcolepsy",
    "Non-Hodgkin's Lymphoma", "OCD", "Osteoarthritis", "Osteomyelitis",
    "Osteoporosis", "Otitis Media", "Ovarian Cysts", "Pancreatic Cancer",
    "Panic Disorder", "Pelvic Inflammatory Disease", "Peptic Ulcer",
    "Peripheral Neuropathy", "Personality Disorders", "Pneumonia",
    "Post-Traumatic Stress Disorder", "Prediabetes", "Prostate Cancer",
    "Raynaud's Disease", "Restless Legs Syndrome", "Rosacea", "Sarcoidosis",
    "Schizophrenia", "Scleroderma", "Scoliosis", "Seasonal Affective Disorder"
];


export const CHIP_COLORS = [
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "default"
] as const;

export const genderOptions = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "other", label: "Other" },
];

export const initialSignupFormData: SignupForm = {
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    password: "",
    gender: "",
    age: "",
    type: 'signup'
};

export const initialSignupFormValidation: SignupFormValidation = {
    firstName: { isValid: true, message: '' },
    lastName: { isValid: true, message: '' },
    age: { isValid: true, message: '' },
    gender: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
    otp: { isValid: true, message: '' },
};

export const initialLoginFormValidation: LoginFormValidation = {
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
};

export const initialLoginFormData: LoginFormData = {
    email: '',
    password: '',
    type: 'login'
};

// profile

export const initialProfileFormData: ProfileFormData = {
    firstName: "",
    lastName: "",
    age: 0,
    gender: "",
    allergies: [] as string[],
    diseases: [] as string[]
}

export const initialProfileFormValidation: ProfileFormValidation = {
    firstName: { isValid: true, message: '' },
    lastName: { isValid: true, message: '' },
    age: { isValid: true, message: '' },
    gender: { isValid: true, message: '' },
    allergies: { isValid: true, message: '' },
    diseases: { isValid: true, message: '' },
};

export const MAX_MESSAGES = 10;

export const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#FF8C42', '#A8E6CF', '#3498DB', '#E84393', '#00B894',
    '#FD79A8', '#6C5CE7', '#FDCB6E', '#00CEC9', '#55EFC4'
];

export const triggerWords = [
    'dangerous',
    'suicide',
    'harmful',
    'harm',
    'self-harm',
    'pesticide',
    'kill',
    'death',
    'hurt',
    'poison',
    'overdose',
    'end life',
    'harmful substance',
    'toxic',
    'lethal',
    'fatal',
    'cancer'
];
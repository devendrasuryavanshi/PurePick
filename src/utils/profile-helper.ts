import { profileSchema } from "@/schemas/auth.schema";
import { useProfileStore } from "@/zustand/useProfileStore";
import { validateField } from "./form-helpers";

export const handleInputChange = (field: string, value: string) => {
    const { profileFormData, setProfileFormData, profileFormValidation, setProfileFormValidation } = useProfileStore.getState();
    
    const processedValue = field === 'age' ? parseInt(value) : value;
    setProfileFormData({ ...profileFormData, [field]: processedValue });

    const validationResult = validateField(profileSchema.shape[field as keyof typeof profileSchema.shape], processedValue);
    setProfileFormValidation({ ...profileFormValidation, [field]: validationResult }); 
};
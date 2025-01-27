import { ValidationState } from "./global.types";

export interface ProfileFormData {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    allergies: string[];
    diseases: string[];
}

export interface ProfileFormValidation {
    firstName: ValidationState;
    lastName: ValidationState;
    age: ValidationState;
    gender: ValidationState;
    allergies: ValidationState;
    diseases: ValidationState;
}

export interface MedicalConditionsSelectorProps {
    formData: ProfileFormData;
    setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
    openAllergies: boolean;
    setOpenAllergies: React.Dispatch<React.SetStateAction<boolean>>;
    openDiseases: boolean;
    setOpenDiseases: React.Dispatch<React.SetStateAction<boolean>>;
    selectedAllergies: string;
    setSelectedAllergies: React.Dispatch<React.SetStateAction<string>>;
    selectedDiseases: string;
    setSelectedDiseases: React.Dispatch<React.SetStateAction<string>>;
    isEditing: boolean;
}

export interface ConditionSelectorProps {
    title: string;
    items: string[];
    selectedItems: string[];
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    onItemSelect: (value: string) => void;
    onItemRemove: (index: number) => void;
    isEditing: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export interface ConditionSelectorProps {
    title: string;
    items: string[];
    selectedItems: string[];
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    onItemSelect: (value: string) => void;
    onItemRemove: (index: number) => void;
    isEditing: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
}
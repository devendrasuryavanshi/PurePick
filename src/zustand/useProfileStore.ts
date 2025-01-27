import { initialProfileFormData, initialProfileFormValidation } from "@/data/constants";
import { ProfileFormData, ProfileFormValidation } from "@/types/profile.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ProfileState {
    profileFormData: ProfileFormData;
    copyFormData: ProfileFormData | null;
    profileFormValidation: ProfileFormValidation;
    isEditing: boolean;
    isLoadingData: boolean;

    setProfileFormData: (data: ProfileFormData) => void;
    setCopyFormData: (data: ProfileFormData | null) => void;
    setProfileFormValidation: (data: ProfileFormValidation) => void;
    setIsEditing: (isEditing: boolean) => void;
    setIsLoadingData: (isLoadingData: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(
    devtools((set) => ({
        profileFormData: initialProfileFormData,
        copyFormData: null,
        profileFormValidation: initialProfileFormValidation,
        isEditing: false,
        isLoadingData: true,

        setProfileFormData: (data) => set({ profileFormData: data }),
        setCopyFormData: (data) => set({ copyFormData: data }),
        setProfileFormValidation: (data) => set({ profileFormValidation: data }),
        setIsEditing: (isEditing) => set({ isEditing }),
        setIsLoadingData: (isLoadingData) => set({ isLoadingData }),
        resetForm: () => set({
            profileFormData: initialProfileFormData,
            copyFormData: null,
            profileFormValidation: initialProfileFormValidation,
            isEditing: false,
            isLoadingData: true,
        })
    }))
)
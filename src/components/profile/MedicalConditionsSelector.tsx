'use client';
import React, { useState } from 'react';
import { ALLERGIES, MEDICAL_CONDITIONS } from '@/data/constants';
import { Divider } from '@nextui-org/react';
import { ConditionSelector } from './ConditionSelector';
import { useProfileStore } from '@/zustand/useProfileStore';

export const MedicalConditionsSelector = () => {
    const { profileFormData, isEditing } = useProfileStore();
    const { setProfileFormData } = useProfileStore();
    const [openAllergies, setOpenAllergies] = useState(false);
    const [openDiseases, setOpenDiseases] = useState(false);

    return (
        <div className="space-y-8 bg-gradient-to-b from-background to-background/40 p-8 rounded-xl backdrop-blur-sm border border-border/100">
            <ConditionSelector
                title="Select Allergies"
                items={ALLERGIES}
                selectedItems={profileFormData.allergies}
                isOpen={openAllergies}
                setIsOpen={setOpenAllergies}
                onItemSelect={(currentValue) => {
                    if (isEditing) {
                        const isSelected = profileFormData.allergies.includes(currentValue);
                        setProfileFormData({
                            ...profileFormData,
                            allergies: isSelected
                                ? profileFormData.allergies.filter(item => item !== currentValue)
                                : [...profileFormData.allergies, currentValue]
                        });
                    }
                }}
                onItemRemove={(index) => {
                    setProfileFormData({
                        ...profileFormData,
                        allergies: profileFormData.allergies.filter((_, i) => i !== index)
                    });
                }}
                isEditing={isEditing}
                searchPlaceholder="Search allergies..."
                emptyMessage="No allergy found."
            />

            <Divider className="my-4 md:hidden col-span-2 h-0.5 rounded-full" />

            <ConditionSelector
                title="Select Medical Conditions"
                items={MEDICAL_CONDITIONS}
                selectedItems={profileFormData.diseases}
                isOpen={openDiseases}
                setIsOpen={setOpenDiseases}
                onItemSelect={(currentValue) => {
                    if (isEditing) {
                        const isSelected = profileFormData.diseases.includes(currentValue);
                        setProfileFormData({
                            ...profileFormData,
                            diseases: isSelected
                                ? profileFormData.diseases.filter(item => item !== currentValue)
                                : [...profileFormData.diseases, currentValue]
                        });
                    }
                }}
                onItemRemove={(index) => {
                    setProfileFormData({
                        ...profileFormData,
                        diseases: profileFormData.diseases.filter((_, i) => i !== index)
                    });
                }}
                isEditing={isEditing}
                searchPlaceholder="Search medical conditions..."
                emptyMessage="No medical condition found."
            />
        </div>

    );
};

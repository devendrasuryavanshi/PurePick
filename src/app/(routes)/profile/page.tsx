'use client';
import React, { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Avatar, Button, Divider, Progress } from '@nextui-org/react';
import { MedicalConditionsSelector } from '@/components/profile/MedicalConditionsSelector';
import { UserDetails } from '@/components/profile/UserDetails';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useProfileStore } from '@/zustand/useProfileStore';
import { isFormValid, validateField } from '@/utils/form-helpers';
import { profileSchema } from '@/schemas/auth.schema';

const Page = () => {
    const { data: session, update } = useSession();
    const { profileFormData, copyFormData, profileFormValidation, isEditing, isLoadingData } = useProfileStore();
    const { setProfileFormData, setCopyFormData, setProfileFormValidation, setIsEditing, setIsLoadingData } = useProfileStore();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (session && copyFormData === null) {
            fetchData();
        }
    }, [session, copyFormData]);

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const response = await fetch(`/api/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': session?.user?.id || '',
                },
            });
            const userData = await response.json();

            const newFormData = {
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                age: userData.age || '',
                gender: userData.gender || '',
                allergies: Array.isArray(userData.allergies) ? userData.allergies : [],
                diseases: Array.isArray(userData.diseases) ? userData.diseases : []
            };


            setCopyFormData(newFormData);
            setProfileFormData(newFormData);
            setIsLoadingData(false);
        } catch (error) {
            toast.error('Something went wrong, please try again later.');
        }
    };

    const handleCancel = () => {
        if (copyFormData) {
            const validationResults = Object.keys(copyFormData).reduce((acc, key) => {
                let value = copyFormData[key as keyof typeof copyFormData];

                if (key === 'age') {
                    value = parseInt(value as string, 10);
                }

                return {
                    ...acc,
                    [key]: validateField(profileSchema.shape[key as keyof typeof profileSchema.shape], value),
                };
            }, {});

            setProfileFormValidation({ ...profileFormValidation, ...validationResults });
        }

        setIsEditing(false);

        if (copyFormData) {
            setProfileFormData(copyFormData);
        }
    }


    const handleSave = async () => {
        setIsSaving(true);
        if (copyFormData && JSON.stringify(copyFormData) === JSON.stringify(profileFormData)) {
            toast.error('No changes made');
            setIsEditing(false);
            setIsSaving(false);
            return;
        }

        const response = await fetch(`/api/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...profileFormData, userId: session?.user?.id }),
        });

        const data = await response.json();

        if (data.error) {
            toast.error(data.error);
            handleCancel();
        } else {
            await update({
                ...session,
                user: {
                    ...session?.user,
                    ...profileFormData
                }
            });
            toast.success(data.message);
            setCopyFormData(profileFormData);
        }
        setIsSaving(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid(profileSchema, profileFormData)) {
            toast.error('Please add valid data to all fields.');
            return;
        }
        await handleSave();
        setIsEditing(false);
    };

    return (
        <>
            {isLoadingData && <Progress isIndeterminate aria-label="Loading..." className="w-full" size="sm" color='primary' />}

            <div className="w-full min-h-screen mx-auto p-6 md:p-8 bg-white dark:bg-black backdrop-blur-md shadow-sm">
                {!isLoadingData && (
                    <>
                        <div className="flex items-center gap-3 mb-12 justify-between">
                            <h1 className="text-3xl font-bold text-default-500">
                                Profile Details
                            </h1>
                            <div className="relative flex h-9 items-center">
                                {isEditing ? (
                                    <div className="flex items-center gap-4">
                                        {!isSaving && (
                                            <Button
                                                size='sm'
                                                radius='full'
                                                onClick={handleCancel}
                                                variant='light'
                                                color='danger'
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Button
                                            size='sm'
                                            radius='full'
                                            variant='solid'
                                            color='success'
                                            type='submit'
                                            isLoading={isSaving}
                                            onClick={handleSubmit}
                                        >
                                            {isSaving ? '' : 'Save'}
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        variant='light'
                                        color='primary'
                                        radius='full'
                                    >
                                        <Edit /> Edit
                                    </Button>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 md:gap-12">
                            <div className="space-y-16 w-full bg-gradient-to-b from-background to-background/40 p-8 rounded-xl backdrop-blur-sm border border-border/100">
                                <div className="w-full flex flex-col items-center justify-center gap-3 mb-12">
                                    <Avatar
                                        color='primary'
                                        className="w-28 h-28 text-6xl font-semibold ring-4 ring-primary/20"
                                        src={session?.user?.image}
                                        fallback={profileFormData.firstName[0]?.toUpperCase() || "U"}
                                    />
                                    <span
                                        className='font-semibold text-xs text-default-500'
                                    >{session?.user.email}</span>
                                </div>

                                <UserDetails />
                            </div>

                            <Divider className="my-4 md:hidden col-span-2 h-0.5 rounded-full" />

                            <MedicalConditionsSelector />
                        </form >
                    </>
                )}

            </div >
        </>
    );
};
export default Page;
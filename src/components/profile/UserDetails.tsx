'use client';
import { useProfileStore } from "@/zustand/useProfileStore";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { handleInputChange } from "@/utils/profile-helper";
import { ValidationMessage } from "../global/ValidationMessage";

export const UserDetails = () => {
    const { profileFormData, profileFormValidation, isEditing } = useProfileStore();

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="border-l-2 border-primary pl-6">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col">
                        <Label className="text-xs dark:text-default-500" htmlFor="firstName">First Name</Label>
                        <input
                            id="firstName"
                            disabled={!isEditing}
                            value={profileFormData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="bg-transparent border-none focus:outline-none focus:ring-0 text-black dark:text-white"
                        />
                        <ValidationMessage
                            show={!profileFormValidation.firstName.isValid}
                            message={profileFormValidation.firstName.message}
                        />

                    </div>

                    <div className="flex flex-col">
                        <Label className="text-xs dark:text-default-500" htmlFor="lastName">Last Name</Label>
                        <input
                            id="lastName"
                            disabled={!isEditing}
                            value={profileFormData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="bg-transparent border-none focus:outline-none focus:ring-0 text-black dark:text-white"
                        />
                        <ValidationMessage
                            show={!profileFormValidation.lastName.isValid}
                            message={profileFormValidation.lastName.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-xs dark:text-default-500" htmlFor="age">Age</Label>
                        <input
                            id="age"
                            type="number"
                            disabled={!isEditing}
                            value={profileFormData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            className="bg-transparent border-none focus:outline-none focus:ring-0 text-black dark:text-white"
                        />
                        <ValidationMessage
                            show={!profileFormValidation.age.isValid}
                            message={profileFormValidation.age.message}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Label className="text-xs dark:text-default-500" htmlFor="gender">Gender</Label>
                        <Select
                            disabled={!isEditing}
                            value={profileFormData.gender}
                            onValueChange={(value) => handleInputChange('gender', value)}
                        >
                            <SelectTrigger className="text-black dark:text-white p-0 w-full bg-transparent dark:bg-transparent border-0 ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-zinc-900 border-1">
                                <SelectGroup>
                                    <SelectItem value="male" className="focus:bg-gray-100 dark:focus:bg-zinc-800">Male</SelectItem>
                                    <SelectItem value="female" className="focus:bg-gray-100 dark:focus:bg-zinc-800">Female</SelectItem>
                                    <SelectItem value="other" className="focus:bg-gray-100 dark:focus:bg-zinc-800">Other</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <ValidationMessage
                            show={!profileFormValidation.gender.isValid}
                            message={profileFormValidation.gender.message}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

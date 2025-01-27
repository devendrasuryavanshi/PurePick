export interface LabelInputContainerProps {
    children: React.ReactNode;
    className?: string;
}

export interface userData { // get user data from db
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    allergies: string[];
    diseases: string[];
}

export interface ValidationMessageProps {
    show: boolean;
    message: string;
}

export interface ValidationState {
    isValid: boolean;
    message: string;
}
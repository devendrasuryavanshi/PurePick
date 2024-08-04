import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        firstName: string;
        lastName?: string;
        image?: string;
        age?: number;
        email: string;
    }

    interface Session {
        user: {
            id: string;
            firstName: string;
            lastName?: string;
            image?: string;
            age?: number;
            email: string;
        };
        url: {
            previousUrl?: string;
        }
    }

    interface JWT {
        id?: string;
        firstName?: string;
        lastName?: string;
        age?: number;
    }
}
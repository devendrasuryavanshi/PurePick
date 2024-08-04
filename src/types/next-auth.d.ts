import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        firstName: string;
        lastName?: string;
        image?: string;
        age?: Number;
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
            previousUrl?: String;
        }
    }

    interface JWT {
        id?: string;
        firstName?: string;
        lastName?: string;
    }
}
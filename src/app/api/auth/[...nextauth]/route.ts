import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { saveNewUser } from "../../../../lib/save-to-db/save-user";
import User from "@/models/user-model";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db-connect";

const authOptions: any = {
    providers: [
        // Google Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID_2 as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET_2 as string,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    email: profile.email,
                    image: profile.picture,
                    birthdate: profile.birthday
                };
            }
        }),
        // Credentials Provider
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                firstName: { label: "First Name", type: "text" },
                lastName: { label: "Last Name", type: "text" },
                age: { label: "Age", type: "number" },
                gender: { label: "Gender", type: "text" },
                otp: { label: "OTP", type: "text" },
                type: { label: "Type", type: "text" },
            },
            async authorize(credentials) {
                const { email, password, firstName, lastName, age, gender, otp, type } = credentials as any;

                if(!email || !password) {
                    throw new Error("Missing required fields.");
                }

                await connectDB();
                const existingUser = await User.findOne({ email });

                if (!existingUser && type === 'signup') {
                    if (!firstName || !lastName || !age || !gender || !email || !password || !otp || !type) {
                        throw new Error("Missing required fields.");
                    }

                    // otp verify
                    try {
                        const response = await fetch('https://purepick.vercel.app/api/verify-otp', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email, otp: otp, type: "Verification" }),
                        });

                        const resData = await response.json();
                        if (resData.error) {
                            throw new Error(resData.error);
                        }

                    } catch (error) {
                        throw new Error("Something went wrong. Please try again." + error);
                    }
                }

                if (existingUser && existingUser.authType === 'Google') {
                    throw new Error("Incorrect authentication method. Please sign in with Google.");
                }

                if (type === 'login') {
                    try {
                        if (existingUser) {
                            if (bcrypt.compareSync(password, existingUser.password)) {
                                return existingUser;
                            } else {
                                throw new Error("Incorrect password.");
                            }
                        } else {
                            throw new Error("User not found.");
                        }
                    } catch (error) {
                        throw new Error(error instanceof Error ? error.message : "Error authorizing user.");
                    }
                } else if (type === 'signup') {
                    if (existingUser) {
                        throw new Error("User already exists. Please login.");
                    }
                    // Validate input
                    if (!email || !password || !firstName || !lastName || !age || !gender || !otp || !type) {
                        throw new Error("Missing required fields.");
                    }

                    try {
                        const newUser = await saveNewUser({
                            email,
                            password,
                            firstName,
                            lastName,
                            age: Number(age),
                            gender: gender,
                            authType: 'Credentials',
                        });

                        return newUser;
                    } catch (error) {
                        throw new Error(error instanceof Error ? error.message : "Error authorizing user.");
                    }
                } else {
                    throw new Error("Invalid type.");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, profile, trigger, session }: any) {
            if (trigger === "update" && session?.user) {
                return {
                    ...token,
                    firstName: session.user.firstName,
                    lastName: session.user.lastName,
                    age: session.user.age,
                    gender: session.user.gender,
                    allergies: session.user.allergies,
                    diseases: session.user.diseases,
                };
            }

            if (profile) {
                const email = profile.email as string;
                const firstName = (profile as any).given_name as string;
                const lastName = (profile as any).family_name as string;
                const birthday = (profile as any).birthday as string | null;
                const age = birthday ? getAge(birthday) : 0;

                if (email) {
                    try {
                        await connectDB();
                        let existingUser = await User.findOne({ email });

                        if (!existingUser) {
                            existingUser = await saveNewUser({
                                email,
                                firstName,
                                lastName,
                                age: age ?? 0,
                                gender: 'other',
                                authType: 'Google',
                            });
                        }

                        token.id = existingUser.id;
                        token.age = existingUser.age;
                        token.gender = existingUser.gender;
                        token.firstName = existingUser.firstName;
                        token.lastName = existingUser.lastName;
                        token.allergies = existingUser.allergies;
                        token.diseases = existingUser.diseases;
                    } catch (error) {
                        throw new Error("Error saving new user.");
                    }
                } else {
                    throw new Error("Profile information is incomplete.");
                }
            } else if (user) {
                token.id = user.id;
                token.age = user.age;
                token.gender = user.gender;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.allergies = user.allergies;
                token.diseases = user.diseases;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.age = token.age as number;
                session.user.gender = token.gender as string;
                session.user.allergies = token.allergies as string[];
                session.user.diseases = token.diseases as string[];
            }

            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

const getAge = (birthdate: string): number => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { saveNewUser } from "../saveUser";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/dbConnect";

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
      },
      async authorize(credentials) {
        const { email, password, firstName, lastName, age, type } = credentials as any;

        if (!email || !password) {
          console.error("Missing required fields.");
          throw new Error("Missing required fields.");
        }

        await connectDB();
        const existingUser = await User.findOne({ email });
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
            console.error("Error authorizing user:", error);
            throw new Error(error instanceof Error ? error.message : "Error authorizing user.");
          }
        } else if (type === 'signup') {
          if(existingUser) {
            throw new Error("User already exists. Please login.");
          }
          // Validate input
          if (!email || !password || !firstName || !lastName || !age) {
            console.error("Missing required fields.");
            throw new Error("Missing required fields.");
          }

          try {
            const newUser = await saveNewUser({
              email,
              password,
              firstName,
              lastName,
              age: Number(age),
              authType: 'Credentials',
            });

            return newUser;
          } catch (error) {
            console.error("Error authorizing user:", error);
            throw new Error(error instanceof Error ? error.message : "Error authorizing user.");
          }
        } else {
          throw new Error("Invalid type.");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, profile }: any) {
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
                authType: 'Google',
              });
            }

            token.id = existingUser.id;
            token.age = existingUser.age;
            token.firstName = existingUser.firstName;
            token.lastName = existingUser.lastName;
          } catch (error) {
            console.error("Error saving new user:", error);
            throw new Error("Error saving new user.");
          }
        } else {
          console.error("Profile information is incomplete.");
          throw new Error("Profile information is incomplete.");
        }
      } else if (user) {
        token.id = user.id;
        token.age = user.age;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.age = token.age as number;
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

function getAge(birthdate: string): number {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
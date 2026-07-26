import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getMongoClientPromise } from "@/infrastructure/mongodb/client";
import { verifyCredentials } from "@/application/use-cases/verifyCredentials";
import { createUserRepository } from "@/composition/userComposition";

/**
 * One file, not the documented auth.config.ts/auth.ts split: that split exists
 * so Edge middleware can check auth state without pulling in the (Node-only)
 * database adapter. We don't use middleware - JWT sessions don't need
 * Supabase-style cookie refresh - so the split buys nothing here.
 *
 * Session strategy is explicitly "jwt", not the adapter's "database" default:
 * Credentials + database sessions is a known source of null-session bugs
 * (nextauthjs/next-auth#12848). The adapter is still used - it persists the
 * `users`/`accounts` collections - just not for session storage.
 *
 * No explicit `secret` here: Auth.js infers AUTH_SECRET from process.env
 * itself. Reading it through our own getServerEnv()-style validator would
 * mean evaluating it synchronously right here, at module import time - which
 * is exactly the eager-env trap this file's Mongo client promise already
 * has to dodge (see infrastructure/mongodb/client.ts).
 */
const mongoClientPromise = getMongoClientPromise();
// Marks the promise as "handled" for Node's unhandled-rejection tracking.
// This does NOT swallow the error for real consumers - the adapter below,
// and anything calling getMongoDb() elsewhere, still await this exact same
// promise reference and see the real rejection. Without this, a missing
// MONGODB_URI logs as an uncaught "unhandledRejection" even on requests that
// never actually needed the database (e.g. Auth.js bailing out earlier for
// an unrelated reason), because this promise is created here at module
// import time, before anything is guaranteed to await it.
mongoClientPromise.catch(() => {});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise),
  session: { strategy: "jwt" },
  // Required for any host other than Vercel (e.g. Netlify) - without it Auth.js throws
  // "UntrustedHost", which renders as a generic /api/auth/error "server configuration" page.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const userRepository = await createUserRepository();
        const user = await verifyCredentials({ userRepository }, email, password);
        if (!user) return null;

        return { id: user.id, email: user.email, name: user.fullName ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
});

import passport from "passport";
import prisma from "../../utils/prisma";
import logger from "../../utils/logger";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.AUTH_CLIENT_ID!,
    clientSecret: process.env.AUTH_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    logger.info(accessToken, refreshToken, profile);

    const user = await prisma.user.findUnique({
      where: { email: profile.emails?.[0].value },
    });

    if (user) {
      return done(null, user);
    }

    const newUser = await prisma.user.create({
      data: {
        email: profile.emails?.[0].value!,
        name: profile.displayName,
      },
    });

    return done(null, newUser);
  }
);

passport.use(googleStrategy);

passport.serializeUser((user: any, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

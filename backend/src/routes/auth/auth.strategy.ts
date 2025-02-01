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
  async (_accessToken, _refreshToken, profile, done) => {
    logger.info("--- Inside googleStrategy ---");

    const existingUser = await prisma.user.findUnique({
      where: { email: profile.emails?.[0].value },
    });

    if (existingUser) {
      logger.info("--- User already exists ---");
      const updatedUser = await prisma.user.update({
        where: { email: existingUser.email },
        data: {
          name: profile.displayName,
          photo: profile.photos?.[0].value,
        },
      });

      logger.info("--- User updated ---");
      return done(null, updatedUser);
    }

    logger.info("--- Creating new user ---");
    const newUser = await prisma.user.create({
      data: {
        email: profile.emails?.[0].value!,
        name: profile.displayName,
        photo: profile.photos?.[0].value,
      },
    });

    logger.info("--- New user created ---");
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

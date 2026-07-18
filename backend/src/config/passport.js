const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user.model');

/**
 * Find or create user from OAuth profile
 */
const findOrCreateUser = async (provider, profile) => {
  const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
  const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
  const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();

  // Try to find existing user by provider + providerId
  let user = await User.findOne({ authProvider: provider, providerId: profile.id });

  // If not found, try by email (user might have signed up with different provider)
  if (!user && email) {
    user = await User.findOne({ email });
    if (user) {
      // Update provider info if user exists with same email
      user.authProvider = provider;
      user.providerId = profile.id;
      if (avatar) user.avatar = avatar;
      await user.save();
    }
  }

  // Create new user if not found
  if (!user) {
    user = await User.create({
      name,
      email: email || `${provider}_${profile.id}@loomistrystudio.com`,
      avatar,
      authProvider: provider,
      providerId: profile.id,
      role: 'buyer',
    });
  } else {
    // Update avatar if changed, but never override role
    if (avatar && avatar !== user.avatar) {
      user.avatar = avatar;
      await user.save();
    }
  }

  return user;
};

/**
 * Configure Passport strategies
 */
const configurePassport = () => {
  // Serialize/Deserialize for session (not used with JWT, but required by Passport)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback',
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await findOrCreateUser('google', profile);
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
    console.log('✅ Google OAuth strategy configured');
  } else {
    console.warn('⚠️  Google OAuth not configured — missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  }

  // Facebook Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5001/api/auth/facebook/callback',
          profileFields: ['id', 'displayName', 'email', 'photos'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = await findOrCreateUser('facebook', profile);
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
    console.log('✅ Facebook OAuth strategy configured');
  } else {
    console.warn('⚠️  Facebook OAuth not configured — missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET');
  }

  // Twitter Strategy
  if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
    passport.use(
      new TwitterStrategy(
        {
          consumerKey: process.env.TWITTER_CLIENT_ID,
          consumerSecret: process.env.TWITTER_CLIENT_SECRET,
          callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:5001/api/auth/twitter/callback',
          includeEmail: true,
        },
        async (accessToken, tokenSecret, profile, done) => {
          try {
            const user = await findOrCreateUser('twitter', profile);
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
    console.log('✅ Twitter OAuth strategy configured');
  } else {
    console.warn('⚠️  Twitter OAuth not configured — missing TWITTER_CLIENT_ID or TWITTER_CLIENT_SECRET');
  }
};

module.exports = { configurePassport };

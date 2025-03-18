import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Google Strategy
passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) return done(null, user);
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        user.provider = 'google';
        await user.save();
        return done(null, user);
      }

      // Fetch the candidate role _id
      const candidateRole = await Role.findOne({ name: 'candidate' });
      if (!candidateRole) {
        throw new Error('Candidate role not found');
      }

      const newUser = await User.create({
        fullname: profile.displayName,
        username: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google',
        googleId: profile.id,
        role: candidateRole._id, // Assign candidate role
      });
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

// GitHub Strategy
passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ['user:email'],
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Attempt to get email from the profile
        let email = profile.emails && profile.emails.length 
            ? profile.emails[0].value 
            : null;

        // Fallback to GitHub API if no email in profile
        if (!email) {
            const { data } = await axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            email = data.find(e => e.primary)?.email || data[0]?.email;
        }

        let user = await User.findOne({ githubId: profile.id });
        if (user) return done(null, user);

        if (email) {
            user = await User.findOne({ email });
            if (user) {
                user.githubId = profile.id;
                user.provider = 'github';
                await user.save();
                return done(null, user);
            }
        }

        const candidateRole = await Role.findOne({ name: 'candidate' });
        if (!candidateRole) throw new Error('Candidate role not found');

        const newUser = await User.create({
            fullname: profile.displayName || profile.username,
            username: profile.username,
            email: email || '',
            provider: 'github',
            githubId: profile.id,
            role: candidateRole._id,
        });
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));

// Serialization & deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

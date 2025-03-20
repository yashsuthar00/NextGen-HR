import { Router } from 'express';
import passport from '../config/passport-config.js';
import OAuthController from '../controllers/OAuthController.js';

const router = Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), OAuthController.googleCallback);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), OAuthController.githubCallback);

export default router;

import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

class OAuthController {
  static async googleCallback(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'Google authentication failed' });
      }
      res.redirect('/profile'); // Redirect to profile or dashboard
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }

  static async githubCallback(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'GitHub authentication failed' });
      }
      res.redirect('/profile'); // Redirect to profile or dashboard
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
}

export default OAuthController;

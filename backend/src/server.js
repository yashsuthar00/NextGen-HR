import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import { env } from './utils/validateEnv.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import oauthRoutes from './routes/oauthRoutes.js';
import jobRoutes from './routes/jobRoutes.js'
import { initializeRoles } from './utils/initRoles.js';
import { initializeAdmin } from './utils/initAdmin.js';
import cors from 'cors';
import passport from './config/passport-config.js';
import session from 'express-session';
import applyForJobRoute from './routes/applyForJobRoute.js'; 
import { connectRabbitMQ, closeRabbitMQ } from './utils/rabbitMQ.js';

dotenv.config();
const app = express();

const { PORT, MONGO_URI, SESSION_SECRET, CLIENT_URL } = env;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// Session middleware setup
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to profile or dashboard.
    res.redirect('/profile');
  }
);

// GitHub OAuth
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

// ----------------------
// Protected Routes Example
// ----------------------
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    provider: req.user.provider,
    // Include other fields (like picture) as needed
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ message: "Logout error" });
    }
    res.redirect('/');
  });
});

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', oauthRoutes); 
app.use ('/api/jobs', jobRoutes);
app.use('/api/job', applyForJobRoute); // Assuming you have a route for job applications

connectDB(MONGO_URI)
  .then(async () => {
    await connectRabbitMQ(); // Connect to RabbitMQ
    await initializeRoles();
    await initializeAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

process.on('SIGINT', async () => {
  await closeRabbitMQ(); // Close RabbitMQ connection on server shutdown
  process.exit(0);
});

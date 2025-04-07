import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGO_URI'];

const validateEnv = () => {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}`);
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  return {
    // Server Configuration
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

    // Session and JWT Configuration
    SESSION_SECRET: process.env.SESSION_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',

    // Cloudinary Configuration
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,

    // Google Cloud Configuration
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
    GCLOUD_KEY_FILE: process.env.GCLOUD_KEY_FILE,

    // Admin Configuration for admin login access
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_ROLE: process.env.ADMIN_ROLE || 'admin',

    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    // GitHub OAuth Configuration
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  };
};

export const env = validateEnv();

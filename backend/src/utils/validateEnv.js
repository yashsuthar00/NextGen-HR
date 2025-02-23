import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGO_URI'];

const validateEnv = () => {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
  };
};

export default validateEnv;

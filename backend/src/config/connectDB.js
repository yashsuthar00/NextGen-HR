import mongoose from 'mongoose';

const connectDB = async (mongoUri) => {
  try {
    const conn = await mongoose.connect(mongoUri);

    console.log(
      `MongoDB Connected: ${conn.connection.host} in ${conn.connection.port} port and ${conn.connection.name} database`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

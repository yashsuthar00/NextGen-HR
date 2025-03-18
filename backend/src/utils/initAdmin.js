// backend/utils/initAdmin.js
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

export const initializeAdmin = async () => {
  try {
    // Ensure the admin role exists before creating an admin account
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      throw new Error('Admin role not found. Please initialize roles first.');
    }
    
    // Retrieve admin credentials from environment variables or use defaults for development
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexgenhr.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminFullname = process.env.ADMIN_FULLNAME || 'Admin User';
    
    // Check if the admin account already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin account already exists');
      return;
    }
    
    // Create a new admin account
    const adminUser = new User({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: adminRole._id,
      fullname: adminFullname,
    });
    
    await adminUser.save();
    console.log('Admin account created successfully');
  } catch (error) {
    console.error('Error initializing admin account:', error);
  }
};

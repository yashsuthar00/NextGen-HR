// backend/controllers/userController.js
import User from '../models/userModel.js';
import Role from '../models/roleModels.js';

const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Ensure the role exists in the Role collection
    const roleDoc = await Role.findOne({ name: role });
    if (!roleDoc) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }
    
    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create a new user linked to the appropriate role
    const newUser = new User({
      username,
      email,
      password,
      role: roleDoc._id
    });
    
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { createUser, deleteUser };

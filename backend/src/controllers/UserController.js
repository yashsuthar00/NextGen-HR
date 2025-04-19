import User from '../models/userModel.js';
import Role from '../models/roleModel.js';

class UserController {
  static async createUser(req, res) {
    try {
      const { username, email, password, role, fullname, department } = req.body;
      
      // Validate required fields
      if (!username || !email || !password || !role || !fullname || !department) {
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
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      
      // Create a new user linked to the appropriate role
      const newUser = new User({
        username,
        email,
        password,
        role: roleDoc._id,
        fullname,
        department
      });
      
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }

  static async deleteUser(req, res) {
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
  }

  static async getUsers(req, res) {
    try {
      // Fetch roles 'employee' and 'hr'
      const roles = await Role.find({ name: { $in: ['employee', 'hr'] } });
      const roleIds = roles.map(role => role._id);

      // Fetch users with the specified roles
      const users = await User.find({ role: { $in: roleIds } }).populate('role', 'name');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      // Fetch user by ID and populate the role
      const user = await User.findById(id).populate('role', 'name');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, password, role, fullname, department } = req.body;

      // Validate required fields
      if (!username || !email || !role || !fullname || !department) {
        return res.status(400).json({ message: 'All fields except password are required' });
      }

      // Ensure the role exists in the Role collection
      const roleDoc = await Role.findOne({ name: role });
      if (!roleDoc) {
        return res.status(400).json({ message: 'Invalid role provided' });
      }

      // Find the user by ID and update the details
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          username,
          email,
          password,
          role: roleDoc._id,
          fullname,
          department
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
}

export default UserController;
// backend/controllers/authController.js
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('role');
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role.name }, process.env.JWT_SECRET || 'NextGenHR', {
      expiresIn: '1h',
    });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { fullname, username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const existingRole = await Role.findOne({ name: role });
    if (!existingRole) return res.status(400).json({ message: 'Invalid role' });

    const roleId = existingRole._id;
    const newUser = new User({ fullname, username, email, password, role: roleId });
    await newUser.save();

    // Populate role name in the response
    const populatedUser = await User.findById(newUser._id).populate('role', 'name');
    res.status(201).json({ message: 'User registered successfully', user: populatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { login, register };

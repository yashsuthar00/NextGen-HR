import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create new user (only allow candidate role for public registration)
    const user = await User.create({
      name,
      email,
      password,
      // If admin is creating a user, they can specify a role, otherwise default to candidate
      role: req.user && req.user.role === 'admin' ? role : 'candidate',
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id, user.role),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message,
    });
  }
};

/**
 * Authenticate user & get token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        jobTitle: user.jobTitle,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        jobTitle: user.jobTitle,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/me
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    const { name, email, password, company, jobTitle } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (company) user.company = company;
    if (jobTitle) user.jobTitle = jobTitle;

    // Don't allow role update through this endpoint
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        company: updatedUser.company,
        jobTitle: updatedUser.jobTitle,
        token: req.body.password ? generateToken(updatedUser._id, updatedUser.role) : undefined,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// ------ ADMIN ONLY ENDPOINTS ------

/**
 * Get all users
 * @route GET /api/auth/users
 * @access Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message,
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/auth/users/:id
 * @access Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message,
    });
  }
};

/**
 * Update user
 * @route PUT /api/auth/users/:id
 * @access Private/Admin
 */
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    const { name, email, role, company, jobTitle } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (company) user.company = company;
    if (jobTitle) user.jobTitle = jobTitle;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        company: updatedUser.company,
        jobTitle: updatedUser.jobTitle,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

/**
 * Delete user
 * @route DELETE /api/auth/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({
      success: true,
      message: 'User removed successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};
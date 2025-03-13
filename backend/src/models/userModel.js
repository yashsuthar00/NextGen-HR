// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    username: { 
        type: String, 
        required: [true, "username must be required"] 
    },
    email: { 
        type: String, 
        required: true, 
        unique: [true, "email must be required"]
    },
    password: { 
        type: String, 
        required: [true, "password must be required"]
     },
    role: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role', 
        required: [true, "role must be required"] 
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash password if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;

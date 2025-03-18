// backend/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name must be required"],
    },
    username: { 
        type: String, 
        required: function () {
          return this.provider === 'local';
        } 
    },
    email: { 
        type: String, 
        required: true, 
        unique: [true, "email must be required"]
    },
    password: { 
        type: String, 
        required: function () {
          return this.provider === 'local';
        }
     },
     googleId: { 
       type: String 
     },
     githubId: { 
      type: String 
    },
     provider: { 
       type: String, 
       enum: ['local', 'google', 'github'], 
       default: 'local' 
     },
     department: {
        type: String,
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

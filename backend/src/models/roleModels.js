// backend/models/roleModel.js
import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
    },
  },
  { timestamps: true }
);

const Role = mongoose.model('Role', RoleSchema);

export default Role;

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['employer', 'manager'],
    required: true
  },
}, {
  timestamps: true
});


userSchema.methods.comparePassword = function (password) {
  return password === this.password;
};

export const User = mongoose.model('User', userSchema);

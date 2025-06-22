import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'],
    default: 'PENDING'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  notes: {
    type: [String],
    default: []
  },
}, {
  timestamps: true
});

export const Lead = mongoose.model('Lead', leadSchema);

import { Lead } from '../models/lead.model.js';
import { User } from '../models/user.model.js';

export const getDashboardStats = async (req, res) => {
  const stats = await Lead.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    PENDING: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELED: 0
  };

  stats.forEach(stat => {
    result[stat._id] = stat.count;
  });

  res.json(result);
};



export const getManagers = async (req, res) => {
  const managers = await User.find({ role: 'manager' }).select('-password');
  res.json(managers);
};

export const createManager = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Manager already exists' });

  const manager = await User.create({ name, email, password, role: 'manager' });
  res.status(201).json({ id: manager._id, name: manager.name, email: manager.email });
};

export const updateManager = async (req, res) => {
  const { name, email, password } = req.body;
  const updates = { name, email };
  if (password) updates.password = password;
  const updated = await User.findByIdAndUpdate(req.params.managerId, updates, { new: true });
  res.json(updated);
};

export const deleteManager = async (req, res) => {
  await User.findByIdAndDelete(req.params.managerId);
  res.json({ message: 'Manager deleted' });
};



import { Lead } from '../models/lead.model.js';

export const getLeads = async (req, res) => {
  const { managerId, status } = req.query;
  const filter = {};
  if (managerId) filter.managerId = managerId;
  if (status) filter.status = status;
  const leads = await Lead.find(filter).populate('managerId', 'name email');
  res.json(leads);
};

export const createLead = async (req, res) => {
  const { contactName, contactEmail, companyName, status = "PENDING", manager } = req.body;
  const lead = await Lead.create({ contactName, contactEmail, companyName, status, manager });
  res.status(201).json(lead);
};

export const updateLead = async (req, res) => {
  const updates = req.body;
  const lead = await Lead.findByIdAndUpdate(req.params.leadId, updates, { new: true });
  res.json(lead);
};

export const deleteLead = async (req, res) => {
  await Lead.findByIdAndDelete(req.params.leadId);
  res.json({ message: 'Lead deleted' });
};

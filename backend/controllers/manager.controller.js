import { Lead } from '../models/leads.model.js';

export const getAssignedLeads = async (req, res) => {
    const managerId = req.user.id;
    const leads = await Lead.find({ managerId });
    res.json(leads);
}


export const updateLeadByManager = async (req, res) => {
  const leadId = req.params.id;
  const managerId = req.user.id;
  const { status, note } = req.body;

  const lead = await Lead.findById(leadId);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });

  if (lead.manager.toString() !== managerId)
    return res.status(403).json({ error: 'Access denied: Not your lead' });


  if (status) {
    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    lead.status = status;
  }

  if (note) {
    lead.notes.push(note);
  }

  await lead.save();
  res.json(lead);
};

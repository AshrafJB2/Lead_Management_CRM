import {Router} from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { getAssignedLeads, updateLeadByManager } from '../controllers/manager.controller.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('manager'));

router.get('/leads', getAssignedLeads);
router.patch('/leads/:id', updateLeadByManager);

export const ManagerRoutes = router;

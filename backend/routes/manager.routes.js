import {Router} from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { getAssignedLeads, updateLeadByManager } from '../controllers/manager.controller.js';

const router = Router();

router.use(authenticate);
router.use(requireRole('manager'));

router.get('/leads', getAssignedLeads);
router.patch('/leads/:id', updateLeadByManager);

export const ManagerRoutes = router;

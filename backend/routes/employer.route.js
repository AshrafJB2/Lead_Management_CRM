import { Router } from "express";
import { getDashboardStats,createLead,updateLead,deleteLead,getLeads,getManagers,createManager,updateManager,deleteManager } from "../controllers/employer.controller";

const router = Router();

router.get('/dashboard-stats', getDashboardStats);

router.get('/managers', getManagers);
router.post('/managers', createManager);
router.put('/managers/:managerId', updateManager);
router.delete('/managers/:managerId', deleteManager);

router.get('/leads', getLeads);
router.post('/leads', createLead);
router.put('/leads/:leadId', updateLead);
router.delete('/leads/:leadId', deleteLead);

export const EmpoloyerRouter = router;



import { Router } from "express";

const router = Router();

router.get('/', (req,res)=>{
    res.json("this is a manager");
})

export const managersRouter = router;
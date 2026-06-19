import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiryRouter from "./enquiry";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiryRouter);

export default router;

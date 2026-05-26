import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsRouter from "./news";
import eventsRouter from "./events";
import staffRouter from "./staff";
import galleryRouter from "./gallery";
import admissionsRouter from "./admissions";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/news", newsRouter);
router.use("/events", eventsRouter);
router.use("/staff", staffRouter);
router.use("/gallery", galleryRouter);
router.use("/admissions", admissionsRouter);

export default router;

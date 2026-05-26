import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsRouter from "./news";
import eventsRouter from "./events";
import staffRouter from "./staff";
import galleryRouter from "./gallery";
import admissionsRouter from "./admissions";
import schoolLifeRouter from "./school_life";
import siteContentRouter from "./site_content";
import studentAuthRouter from "./student_auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/news", newsRouter);
router.use("/events", eventsRouter);
router.use("/staff", staffRouter);
router.use("/gallery", galleryRouter);
router.use("/admissions", admissionsRouter);
router.use("/school-life", schoolLifeRouter);
router.use("/site-content", siteContentRouter);
router.use("/student", studentAuthRouter);

export default router;

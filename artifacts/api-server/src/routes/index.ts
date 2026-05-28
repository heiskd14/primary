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
import resultsRouter from "./results";
import attendanceRouter from "./attendance";
import timetableRouter from "./timetable";
import noticesRouter from "./notices";
import schoolFeesRouter from "./school_fees";
import uploadRouter from "./upload";

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
router.use("/results", resultsRouter);
router.use("/attendance", attendanceRouter);
router.use("/timetable", timetableRouter);
router.use("/notices", noticesRouter);
router.use("/school-fees", schoolFeesRouter);
router.use("/upload", uploadRouter);

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subjectsRouter from "./subjects";
import questionsRouter from "./questions";
import scoresRouter from "./scores";
import factsRouter from "./facts";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/subjects", subjectsRouter);
router.use("/questions", questionsRouter);
router.use("/scores", scoresRouter);
router.use("/facts", factsRouter);
router.use("/stats", statsRouter);

export default router;

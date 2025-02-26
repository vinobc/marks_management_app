// import express, { Router } from "express";
// import { scoreController } from "../controllers/scoreController";

// const router: Router = express.Router();

// type RequestHandler = (
//   req: express.Request,
//   res: express.Response
// ) => Promise<void>;

// router.get(
//   "/course/:courseId",
//   scoreController.getScoresByCourse as RequestHandler
// );
// router.get(
//   "/student/:studentId",
//   scoreController.getScoresByStudent as RequestHandler
// );
// router.post("/course", scoreController.updateCourseScores as RequestHandler);
// router.get(
//   "/course/:courseId/summary",
//   scoreController.getCourseSummary as RequestHandler
// );

// export default router;

import express, { Router } from "express";
import scoreController from "../controllers/scoreController";

const router: Router = express.Router();

type RequestHandler = (
  req: express.Request,
  res: express.Response
) => Promise<void>;

router.get(
  "/course/:courseId",
  scoreController.getScoresByCourse as RequestHandler
);
router.get(
  "/student/:studentId",
  scoreController.getScoresByStudent as RequestHandler
);
router.post("/course", scoreController.updateCourseScores as RequestHandler);
router.get(
  "/course/:courseId/summary",
  scoreController.getCourseSummary as RequestHandler
);

export default router;

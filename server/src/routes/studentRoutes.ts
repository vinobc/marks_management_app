import express, { Request, Response, Router } from "express";
import { studentController } from "../controllers/studentController";

const router: Router = express.Router();

type RequestHandler = (req: Request, res: Response) => Promise<void>;

router.get("/", studentController.getAllStudents as RequestHandler);
router.get(
  "/course/:courseId",
  studentController.getStudentsByCourse as RequestHandler
);
router.get("/:id", studentController.getStudent as RequestHandler);
router.post("/", studentController.createStudent as RequestHandler);
router.post("/bulk", studentController.bulkCreateStudents as RequestHandler);
router.put("/:id", studentController.updateStudent as RequestHandler);
router.delete("/:id", studentController.deleteStudent as RequestHandler);

export default router;

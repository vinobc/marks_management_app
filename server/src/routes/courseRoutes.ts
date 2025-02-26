import express, { Router, Request, Response } from "express";
import { courseController } from "../controllers/courseController";

const router: Router = express.Router();

type RequestHandler = (req: Request, res: Response) => Promise<void>;

router.get("/", courseController.getAllCourses as RequestHandler);
router.get("/:id", courseController.getCourse as RequestHandler);
router.post("/", courseController.createCourse as RequestHandler);
router.put("/:id", courseController.updateCourse as RequestHandler);
router.delete("/:id", courseController.deleteCourse as RequestHandler);

export default router;

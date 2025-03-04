import { Request, Response } from "express";
import Score, { IScore } from "../models/Score";
import Course from "../models/Course";
import Student from "../models/Student";
import mongoose from "mongoose";
import { ScoreInput } from "../types";

interface QuestionPartInput {
  partName: string;
  maxMarks: number;
  obtainedMarks: number;
}

interface QuestionInput {
  questionNumber: number;
  parts: QuestionPartInput[];
}

// Extended score input to include top-level questions
interface ExtendedScoreInput extends ScoreInput {
  questions?: QuestionInput[];
}

// Define the processed question type
interface ProcessedQuestion {
  questionNumber: number;
  parts: {
    partName: string;
    maxMarks: number;
    obtainedMarks: number;
  }[];
}

export default {
  // GET scores by course
  getScoresByCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.courseId;
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: "Invalid course ID format" });
        return;
      }
      const scores = await Score.find({ courseId })
        .populate("studentId", "registrationNumber name program")
        .populate("courseId", "code name type evaluationScheme")
        .sort({ "studentId.registrationNumber": 1 });
      res.json(scores);
    } catch (error) {
      console.error("Error fetching scores by course:", error);
      res.status(500).json({ message: "Error fetching scores", error });
    }
  },

  // GET scores by student
  getScoresByStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const studentId = req.params.studentId;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ message: "Invalid student ID format" });
        return;
      }
      const scores = await Score.find({ studentId })
        .populate("studentId", "registrationNumber name program")
        .populate("courseId", "code name type evaluationScheme");
      res.json(scores);
    } catch (error) {
      console.error("Error fetching scores by student:", error);
      res.status(500).json({ message: "Error fetching scores", error });
    }
  },

  // POST: Create or update scores for multiple students in a course
  updateCourseScores: async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, scores } = req.body;
      console.log(`Updating scores for course ${courseId}:`, scores);

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: "Invalid course ID format" });
        return;
      }
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }

      const updatedScores = await Promise.all(
        scores.map(async (scoreData: ExtendedScoreInput) => {
          if (!mongoose.Types.ObjectId.isValid(scoreData.studentId)) {
            throw new Error(
              `Invalid student ID format: ${scoreData.studentId}`
            );
          }
          const student = await Student.findById(scoreData.studentId);
          if (!student) {
            throw new Error(`Student not found: ${scoreData.studentId}`);
          }
          if (!student.courseIds.includes(courseId)) {
            throw new Error(
              `Student ${scoreData.studentId} is not enrolled in this course`
            );
          }

          const filter = {
            studentId: scoreData.studentId,
            courseId: courseId,
            academicYear: scoreData.academicYear,
          };

          const processedScores = scoreData.scores
            ? scoreData.scores.map((score: any) => ({
                componentName: score.componentName,
                maxMarks: Number(score.maxMarks),
                obtainedMarks: Number(score.obtainedMarks) || 0,
              }))
            : [];

          const processedQuestions: ProcessedQuestion[] = [];
          if (scoreData.questions && scoreData.questions.length > 0) {
            scoreData.questions.forEach((question) => {
              processedQuestions.push({
                questionNumber: Number(question.questionNumber),
                parts: question.parts.map((part) => ({
                  partName: part.partName,
                  maxMarks: Number(part.maxMarks),
                  obtainedMarks: Number(part.obtainedMarks) || 0,
                })),
              });
            });
          }

          let totalMarks = 0;
          if (processedScores.length > 0) {
            totalMarks += processedScores.reduce(
              (sum: number, score: any) =>
                sum + (Number(score.obtainedMarks) || 0),
              0
            );
          }
          if (processedQuestions.length > 0) {
            processedQuestions.forEach((question) => {
              question.parts.forEach((part) => {
                totalMarks += part.obtainedMarks;
              });
            });
          }

          const updateData: {
            academicYear: string;
            totalMarks: number;
            scores?: any[];
            questions?: ProcessedQuestion[];
          } = {
            academicYear: scoreData.academicYear,
            totalMarks,
          };

          if (processedScores.length > 0) {
            updateData.scores = processedScores;
          }
          if (processedQuestions.length > 0) {
            updateData.questions = processedQuestions;
          }

          return await Score.findOneAndUpdate(
            filter,
            { $set: updateData },
            { new: true, upsert: true, runValidators: true }
          ).populate("studentId", "registrationNumber name program");
        })
      );

      res.json(updatedScores);
    } catch (error: any) {
      console.error("Error updating scores:", error);
      res
        .status(400)
        .json({ message: "Error updating scores", error: error.message });
    }
  },

  // GET: Retrieve course summary
  getCourseSummary: async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.courseId;
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: "Invalid course ID format" });
        return;
      }
      const scores = await Score.find({ courseId })
        .populate("studentId", "registrationNumber name program")
        .populate("courseId", "code name type evaluationScheme");

      if (!scores || scores.length === 0) {
        res.json({
          totalStudents: 0,
          overallStats: { highest: 0, lowest: 0, average: 0 },
          componentStats: {},
          questionStats: {},
        });
        return;
      }

      const totalMarks = scores.map((s) => s.totalMarks);
      const summary = {
        totalStudents: scores.length,
        overallStats: {
          highest: Math.max(...totalMarks),
          lowest: Math.min(...totalMarks),
          average:
            totalMarks.reduce((acc, val) => acc + val, 0) / scores.length,
        },
        componentStats: {} as any,
        questionStats: {} as any,
      };

      if (scores.length > 0 && scores[0].scores.length > 0) {
        const componentScores: { [key: string]: number[] } = {};
        scores.forEach((scoreDoc) => {
          scoreDoc.scores.forEach((component) => {
            if (!componentScores[component.componentName]) {
              componentScores[component.componentName] = [];
            }
            componentScores[component.componentName].push(
              component.obtainedMarks
            );
          });
        });
        Object.entries(componentScores).forEach(([componentName, marks]) => {
          summary.componentStats[componentName] = {
            highest: Math.max(...marks),
            lowest: Math.min(...marks),
            average: marks.reduce((acc, val) => acc + val, 0) / marks.length,
          };
        });
      }

      if (
        scores.length > 0 &&
        scores.some((s) => s.questions && s.questions.length > 0)
      ) {
        const questionPartStats: { [key: string]: number[] } = {};
        scores.forEach((scoreDoc) => {
          if (scoreDoc.questions && scoreDoc.questions.length > 0) {
            scoreDoc.questions.forEach((question) => {
              question.parts.forEach((part) => {
                const key = `Q${question.questionNumber}${part.partName}`;
                if (!questionPartStats[key]) {
                  questionPartStats[key] = [];
                }
                questionPartStats[key].push(part.obtainedMarks);
              });
            });
          }
        });
        Object.entries(questionPartStats).forEach(([key, marks]) => {
          summary.questionStats[key] = {
            highest: Math.max(...marks),
            lowest: Math.min(...marks),
            average: marks.reduce((acc, val) => acc + val, 0) / marks.length,
            count: marks.length,
          };
        });
      }

      res.json(summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(500).json({ message: "Error generating summary", error });
    }
  },
};

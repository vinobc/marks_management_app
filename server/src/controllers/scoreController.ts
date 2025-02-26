// import { Request, Response } from "express";
// import Score, { IScore } from "../models/Score";
// import Course, { ICourse, IEvaluationScheme } from "../models/Course";
// import Student from "../models/Student";

// interface ScoreInput {
//   studentId: string;
//   academicYear: string;
//   scores: {
//     componentName: string;
//     maxMarks: number;
//     obtainedMarks: number;
//   }[];
// }

// export const scoreController = {
//   getScoresByCourse: async (req: Request, res: Response): Promise<void> => {
//     try {
//       const scores = await Score.find({ courseId: req.params.courseId })
//         .populate("studentId", "registrationNumber name")
//         .populate("courseId", "code name type evaluationScheme")
//         .sort({ "studentId.registrationNumber": 1 });
//       res.json(scores);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching scores", error });
//     }
//   },

//   getScoresByStudent: async (req: Request, res: Response): Promise<void> => {
//     try {
//       const scores = await Score.find({ studentId: req.params.studentId })
//         .populate("studentId", "registrationNumber name")
//         .populate("courseId", "code name type evaluationScheme");
//       res.json(scores);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching scores", error });
//     }
//   },

//   updateCourseScores: async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { courseId, scores } = req.body as {
//         courseId: string;
//         scores: ScoreInput[];
//       };

//       const course = await Course.findById(courseId);
//       if (!course) {
//         res.status(404).json({ message: "Course not found" });
//         return;
//       }

//       const studentIds = scores.map((s) => s.studentId);
//       const students = await Student.find({
//         _id: { $in: studentIds },
//         courseIds: courseId,
//       });

//       if (students.length !== studentIds.length) {
//         res.status(400).json({
//           message:
//             "One or more students are not found or not enrolled in this course",
//         });
//         return;
//       }

//       const updatedScores = await Promise.all(
//         scores.map(async (scoreData) => {
//           // Validate marks against evaluation scheme
//           for (const score of scoreData.scores) {
//             const component = score.componentName;
//             const evaluationScheme =
//               course.evaluationScheme as IEvaluationScheme;
//             const schemeWeight = evaluationScheme[component];

//             if (typeof schemeWeight !== "number") {
//               throw new Error(`Invalid component: ${component}`);
//             }

//             const maxPossible = schemeWeight * 100;
//             if (score.obtainedMarks > maxPossible) {
//               throw new Error(
//                 `Obtained marks for ${component} cannot exceed ${maxPossible}`
//               );
//             }
//           }

//           return await Score.findOneAndUpdate(
//             {
//               studentId: scoreData.studentId,
//               courseId: courseId,
//               academicYear: scoreData.academicYear,
//             },
//             {
//               $set: {
//                 scores: scoreData.scores,
//                 academicYear: scoreData.academicYear,
//               },
//             },
//             {
//               new: true,
//               upsert: true,
//               runValidators: true,
//             }
//           ).populate("studentId", "registrationNumber name");
//         })
//       );

//       res.json(updatedScores);
//     } catch (error) {
//       res.status(400).json({ message: "Error updating scores", error });
//     }
//   },

//   getCourseSummary: async (req: Request, res: Response): Promise<void> => {
//     try {
//       const courseId = req.params.courseId;
//       const scores = await Score.find({ courseId })
//         .populate("studentId", "registrationNumber name")
//         .populate("courseId", "code name type evaluationScheme");

//       const summary = {
//         totalStudents: scores.length,
//         componentStats: {} as Record<
//           string,
//           { highest: number; lowest: number; average: number }
//         >,
//         overallStats: {
//           highest: scores.length
//             ? Math.max(...scores.map((s) => s.totalMarks))
//             : 0,
//           lowest: scores.length
//             ? Math.min(...scores.map((s) => s.totalMarks))
//             : 0,
//           average: scores.length
//             ? scores.reduce((acc, s) => acc + s.totalMarks, 0) / scores.length
//             : 0,
//         },
//       };

//       if (scores.length > 0) {
//         scores[0].scores.forEach((component) => {
//           const componentScores = scores.map(
//             (s) =>
//               s.scores.find((c) => c.componentName === component.componentName)
//                 ?.obtainedMarks || 0
//           );
//           summary.componentStats[component.componentName] = {
//             highest: Math.max(...componentScores),
//             lowest: Math.min(...componentScores),
//             average:
//               componentScores.reduce((acc, val) => acc + val, 0) /
//               componentScores.length,
//           };
//         });
//       }

//       res.json(summary);
//     } catch (error) {
//       res.status(500).json({ message: "Error generating summary", error });
//     }
//   },
// };

import { Request, Response } from "express";
import Score, { IScore } from "../models/Score";
import Course, { ICourse } from "../models/Course";
import Student, { IStudent } from "../models/Student";
import mongoose from "mongoose";

export default {
  // Get scores by course
  getScoresByCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.courseId;

      // Validate the courseId
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

  // Get scores by student
  getScoresByStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const studentId = req.params.studentId;

      // Validate the studentId
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

  // Create or update scores for multiple students in a course
  updateCourseScores: async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, scores } = req.body;
      console.log(`Updating scores for course ${courseId}:`, scores);

      // Validate the courseId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: "Invalid course ID format" });
        return;
      }

      // Verify course exists
      const course = await Course.findById(courseId);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }

      // Process each student's scores
      const updatedScores = await Promise.all(
        scores.map(async (scoreData: any) => {
          // Validate student ID
          if (!mongoose.Types.ObjectId.isValid(scoreData.studentId)) {
            throw new Error(
              `Invalid student ID format: ${scoreData.studentId}`
            );
          }

          // Check if student exists
          const student = await Student.findById(scoreData.studentId);
          if (!student) {
            throw new Error(`Student not found: ${scoreData.studentId}`);
          }

          // Check if student is enrolled in the course
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

          // Process scores to ensure they're valid
          const processedScores = scoreData.scores.map((score: any) => ({
            componentName: score.componentName,
            maxMarks: Number(score.maxMarks),
            obtainedMarks: Number(score.obtainedMarks) || 0, // Default to 0 if not provided
          }));

          // Calculate total marks
          const totalMarks = processedScores.reduce(
            (sum: number, score: any) =>
              sum + (Number(score.obtainedMarks) || 0),
            0
          );

          // Update or create score
          return await Score.findOneAndUpdate(
            filter,
            {
              $set: {
                scores: processedScores,
                totalMarks,
                academicYear: scoreData.academicYear,
              },
            },
            {
              new: true,
              upsert: true,
              runValidators: true,
            }
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

  // Get score summary for a course
  getCourseSummary: async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.courseId;

      // Validate courseId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: "Invalid course ID format" });
        return;
      }

      const scores = await Score.find({ courseId })
        .populate("studentId", "registrationNumber name program")
        .populate("courseId", "code name type evaluationScheme");

      // If no scores, return empty summary
      if (!scores || scores.length === 0) {
        res.json({
          totalStudents: 0,
          overallStats: { highest: 0, lowest: 0, average: 0 },
          componentStats: {},
        });
        return;
      }

      // Calculate overall statistics
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
      };

      // Calculate component-wise statistics
      if (scores.length > 0 && scores[0].scores.length > 0) {
        // Group all scores by component name
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

        // Calculate stats for each component
        Object.entries(componentScores).forEach(([componentName, marks]) => {
          summary.componentStats[componentName] = {
            highest: Math.max(...marks),
            lowest: Math.min(...marks),
            average: marks.reduce((acc, val) => acc + val, 0) / marks.length,
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

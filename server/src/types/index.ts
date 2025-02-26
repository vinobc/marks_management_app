import { CourseType, IEvaluationScheme } from "../models/Course";

export type { CourseType, IEvaluationScheme };

export interface ScoreInput {
  studentId: string;
  academicYear: string;
  scores: {
    componentName: string;
    maxMarks: number;
    obtainedMarks: number;
  }[];
}

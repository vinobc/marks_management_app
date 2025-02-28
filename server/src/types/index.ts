// import { CourseType, IEvaluationScheme } from "../models/Course";

// export type { CourseType, IEvaluationScheme };

// export interface ScoreInput {
//   studentId: string;
//   academicYear: string;
//   scores: {
//     componentName: string;
//     maxMarks: number;
//     obtainedMarks: number;
//   }[];
// }

import { CourseType, IEvaluationScheme } from "../models/Course";

export type { CourseType, IEvaluationScheme };

export interface QuestionPartInput {
  partName: string;
  maxMarks: number;
  obtainedMarks: number;
}

export interface QuestionInput {
  questionNumber: number;
  parts: QuestionPartInput[];
}

export interface ScoreInput {
  studentId: string;
  academicYear: string;
  scores: {
    componentName: string;
    maxMarks: number;
    obtainedMarks: number;
  }[];
  questions?: QuestionInput[];
}

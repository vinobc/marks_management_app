// import mongoose, { Schema, Document } from "mongoose";

// interface ScoreComponent {
//   componentName: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// export interface IScore extends Document {
//   studentId: mongoose.Types.ObjectId;
//   courseId: mongoose.Types.ObjectId;
//   academicYear: string;
//   scores: ScoreComponent[];
//   totalMarks: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ScoreSchema: Schema = new Schema(
//   {
//     studentId: {
//       type: Schema.Types.ObjectId,
//       ref: "Student",
//       required: true,
//     },
//     courseId: {
//       type: Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },
//     academicYear: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     scores: [
//       {
//         componentName: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         maxMarks: {
//           type: Number,
//           required: true,
//           min: 0,
//         },
//         obtainedMarks: {
//           type: Number,
//           required: true,
//           min: 0,
//           validate: {
//             validator: function (this: any, value: number) {
//               const score = this as ScoreComponent;
//               return value <= score.maxMarks;
//             },
//             message: "Obtained marks cannot exceed maximum marks",
//           },
//         },
//       },
//     ],
//     totalMarks: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Middleware to calculate total marks before saving
// ScoreSchema.pre("save", function (this: IScore, next) {
//   this.totalMarks = this.scores.reduce(
//     (total, score) => total + score.obtainedMarks,
//     0
//   );
//   next();
// });

// // Add indexes for faster queries
// ScoreSchema.index({ studentId: 1, courseId: 1 });
// ScoreSchema.index({ courseId: 1 });
// ScoreSchema.index({ academicYear: 1 });

// export default mongoose.model<IScore>("Score", ScoreSchema);

import mongoose, { Schema, Document } from "mongoose";

// New interface for question parts
interface QuestionPart {
  partName: string; // e.g., 'a', 'b', 'c'
  maxMarks: number;
  obtainedMarks: number;
}

// New interface for questions with parts
interface Question {
  questionNumber: number;
  parts: QuestionPart[];
}

// Original ScoreComponent (keeping for backward compatibility)
interface ScoreComponent {
  componentName: string;
  maxMarks: number;
  obtainedMarks: number;
}

export interface IScore extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  academicYear: string;
  // Original scores array (keeping for backward compatibility)
  scores: ScoreComponent[];
  // New structure for detailed question-part scores
  questions?: Question[];
  totalMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for question parts
const QuestionPartSchema = new Schema({
  partName: {
    type: String,
    required: true,
    trim: true,
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 0,
  },
  obtainedMarks: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (this: any, value: number) {
        return value <= this.maxMarks;
      },
      message: "Obtained marks cannot exceed maximum marks",
    },
  },
});

// Schema for questions
const QuestionSchema = new Schema({
  questionNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  parts: [QuestionPartSchema],
});

const ScoreSchema: Schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    // Original scores structure (keep for backward compatibility)
    scores: [
      {
        componentName: {
          type: String,
          required: true,
          trim: true,
        },
        maxMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        obtainedMarks: {
          type: Number,
          required: true,
          min: 0,
          validate: {
            validator: function (this: any, value: number) {
              const score = this as ScoreComponent;
              return value <= score.maxMarks;
            },
            message: "Obtained marks cannot exceed maximum marks",
          },
        },
      },
    ],
    // New questions structure
    questions: [QuestionSchema],
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate total marks before saving
ScoreSchema.pre("save", function (this: IScore, next) {
  // Calculate total from original scores structure
  let total = this.scores.reduce(
    (total, score) => total + score.obtainedMarks,
    0
  );

  // Add marks from questions structure if it exists
  if (this.questions && this.questions.length > 0) {
    const questionTotal = this.questions.reduce((qTotal, question) => {
      return (
        qTotal +
        question.parts.reduce((pTotal, part) => {
          return pTotal + part.obtainedMarks;
        }, 0)
      );
    }, 0);

    // If only using questions structure, use that total
    // Otherwise, add to the existing total (although typically you'd use one or the other)
    if (this.scores.length === 0) {
      total = questionTotal;
    } else {
      total += questionTotal;
    }
  }

  this.totalMarks = total;
  next();
});

// Add indexes for faster queries
ScoreSchema.index({ studentId: 1, courseId: 1 });
ScoreSchema.index({ courseId: 1 });
ScoreSchema.index({ academicYear: 1 });

export default mongoose.model<IScore>("Score", ScoreSchema);

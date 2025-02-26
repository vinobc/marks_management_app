import mongoose, { Schema, Document } from "mongoose";

interface ScoreComponent {
  componentName: string;
  maxMarks: number;
  obtainedMarks: number;
}

export interface IScore extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  academicYear: string;
  scores: ScoreComponent[];
  totalMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  this.totalMarks = this.scores.reduce(
    (total, score) => total + score.obtainedMarks,
    0
  );
  next();
});

// Add indexes for faster queries
ScoreSchema.index({ studentId: 1, courseId: 1 });
ScoreSchema.index({ courseId: 1 });
ScoreSchema.index({ academicYear: 1 });

export default mongoose.model<IScore>("Score", ScoreSchema);

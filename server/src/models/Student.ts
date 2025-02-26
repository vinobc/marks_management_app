// import mongoose, { Schema, Document } from "mongoose";

// export interface IStudent extends Document {
//   registrationNumber: string;
//   name: string;
//   courseIds: string[]; // References to Course documents
//   semester: number;
//   academicYear: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const StudentSchema: Schema = new Schema(
//   {
//     registrationNumber: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     courseIds: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Course",
//         required: true,
//       },
//     ],
//     semester: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 8,
//     },
//     academicYear: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Add index for faster queries
// StudentSchema.index({ registrationNumber: 1 });
// StudentSchema.index({ courseIds: 1 });

// export default mongoose.model<IStudent>("Student", StudentSchema);

import mongoose, { Schema, Document } from "mongoose";

export type ProgramType =
  | "BBA"
  | "B.Com."
  | "B.Tech (CSE)"
  | "B.Tech (AI&ML)"
  | "B.Tech.(Biotechnology)"
  | "B.Pharm"
  | "BA Applied Psychology"
  | "B.Sc. Clinical Psychology"
  | "BA LLB"
  | "BA"
  | "B.Sc."
  | "B.A. LLB"
  | "B.Des."
  | "BCA"
  | "M.Sc. Data Science"
  | "M.Sc. Cyber Security"
  | "M.Tech."
  | "MCA"
  | "LLM"
  | "MBA"
  | "M.Sc. Clinical Psychology"
  | "M.Sc(Biotechnology)";

export interface IStudent extends Document {
  registrationNumber: string;
  name: string;
  program: ProgramType;
  courseIds: mongoose.Types.ObjectId[];
  semester: number;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const programTypes = [
  "BBA",
  "B.Com.",
  "B.Tech (CSE)",
  "B.Tech (AI&ML)",
  "B.Tech.(Biotechnology)",
  "B.Pharm",
  "BA Applied Psychology",
  "B.Sc. Clinical Psychology",
  "BA LLB",
  "BA",
  "B.Sc.",
  "B.A. LLB",
  "B.Des.",
  "BCA",
  "M.Sc. Data Science",
  "M.Sc. Cyber Security",
  "M.Tech.",
  "MCA",
  "LLM",
  "MBA",
  "M.Sc. Clinical Psychology",
  "M.Sc(Biotechnology)",
];

const StudentSchema: Schema = new Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    program: {
      type: String,
      required: true,
      enum: programTypes,
    },
    courseIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
StudentSchema.index({ registrationNumber: 1 });
StudentSchema.index({ courseIds: 1 });

export default mongoose.model<IStudent>("Student", StudentSchema);

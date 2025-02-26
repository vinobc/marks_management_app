// import { Request, Response } from "express";
// import Student, { IStudent } from "../models/Student";
// import Course from "../models/Course";

// interface StudentInput {
//   registrationNumber: string;
//   name: string;
//   courseIds: string[];
//   semester: number;
//   academicYear: string;
// }

// export const studentController = {
//   // Get all students
//   getAllStudents: async (req: Request, res: Response) => {
//     try {
//       const students = await Student.find()
//         .populate("courseIds", "code name type")
//         .sort({ createdAt: -1 });
//       res.json(students);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching students", error });
//     }
//   },

//   // Get students by course
//   getStudentsByCourse: async (req: Request, res: Response) => {
//     try {
//       const courseId = req.params.courseId;
//       const students = await Student.find({ courseIds: courseId }).populate(
//         "courseIds",
//         "code name type"
//       );
//       res.json(students);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching students", error });
//     }
//   },

//   // Get a single student
//   getStudent: async (req: Request, res: Response) => {
//     try {
//       const student = await Student.findById(req.params.id).populate(
//         "courseIds",
//         "code name type"
//       );
//       if (!student) {
//         return res.status(404).json({ message: "Student not found" });
//       }
//       res.json(student);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching student", error });
//     }
//   },

//   // Create a new student
//   createStudent: async (req: Request, res: Response) => {
//     try {
//       // Verify that all courseIds exist
//       const courseIds = req.body.courseIds;
//       const courses = await Course.find({ _id: { $in: courseIds } });

//       if (courses.length !== courseIds.length) {
//         return res
//           .status(400)
//           .json({ message: "One or more course IDs are invalid" });
//       }

//       const newStudent = new Student(req.body);
//       const savedStudent = await newStudent.save();

//       const populatedStudent = await Student.findById(
//         savedStudent._id
//       ).populate("courseIds", "code name type");

//       res.status(201).json(populatedStudent);
//     } catch (error) {
//       res.status(400).json({ message: "Error creating student", error });
//     }
//   },

//   // Update a student
//   updateStudent: async (req: Request, res: Response) => {
//     try {
//       if (req.body.courseIds) {
//         // Verify that all courseIds exist
//         const courses = await Course.find({ _id: { $in: req.body.courseIds } });
//         if (courses.length !== req.body.courseIds.length) {
//           return res
//             .status(400)
//             .json({ message: "One or more course IDs are invalid" });
//         }
//       }

//       const updatedStudent = await Student.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true, runValidators: true }
//       ).populate("courseIds", "code name type");

//       if (!updatedStudent) {
//         return res.status(404).json({ message: "Student not found" });
//       }
//       res.json(updatedStudent);
//     } catch (error) {
//       res.status(400).json({ message: "Error updating student", error });
//     }
//   },

//   // Delete a student
//   deleteStudent: async (req: Request, res: Response) => {
//     try {
//       const deletedStudent = await Student.findByIdAndDelete(req.params.id);
//       if (!deletedStudent) {
//         return res.status(404).json({ message: "Student not found" });
//       }
//       res.json({ message: "Student deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Error deleting student", error });
//     }
//   },

//   // Bulk create students (for Excel import)
//   bulkCreateStudents: async (req: Request, res: Response) => {
//     try {
//       const students = req.body.students as StudentInput[];

//       // Verify all course IDs first
//       const allCourseIds = [
//         ...new Set(students.flatMap((student) => student.courseIds)),
//       ];
//       const courses = await Course.find({ _id: { $in: allCourseIds } });

//       if (courses.length !== allCourseIds.length) {
//         return res
//           .status(400)
//           .json({ message: "One or more course IDs are invalid" });
//       }

//       const createdStudents = await Student.insertMany(students);
//       res.status(201).json(createdStudents);
//     } catch (error) {
//       res.status(400).json({ message: "Error creating students", error });
//     }
//   },
// };

import { Request, Response } from "express";
import Student, { IStudent, ProgramType } from "../models/Student";
import Course from "../models/Course";
import mongoose from "mongoose";

interface StudentInput {
  registrationNumber: string;
  name: string;
  program: ProgramType;
  courseIds: string[];
  semester: number;
  academicYear: string;
}

export const studentController = {
  // Get all students
  getAllStudents: async (req: Request, res: Response): Promise<void> => {
    try {
      const students = await Student.find()
        .populate("courseIds", "code name type")
        .sort({ createdAt: -1 });
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Error fetching students", error });
    }
  },

  // Get students by course
  getStudentsByCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.courseId;

      // Validate the courseId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: "Invalid course ID format" });
        return;
      }

      const students = await Student.find({ courseIds: courseId }).populate(
        "courseIds",
        "code name type"
      );
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Error fetching students", error });
    }
  },

  // Get a single student
  getStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const studentId = req.params.id;

      // Validate the studentId
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ message: "Invalid student ID format" });
        return;
      }

      const student = await Student.findById(studentId).populate(
        "courseIds",
        "code name type"
      );

      if (!student) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Error fetching student", error });
    }
  },

  // Create a new student
  createStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const studentData = req.body as StudentInput;
      console.log("Received student data:", studentData);

      // Ensure courseIds is an array
      const courseIds = Array.isArray(studentData.courseIds)
        ? studentData.courseIds
        : [];

      // Skip validation if no courses provided
      if (courseIds.length > 0) {
        // Validate the course IDs
        const invalidIds = courseIds.filter(
          (id) => !mongoose.Types.ObjectId.isValid(id)
        );
        if (invalidIds.length > 0) {
          res.status(400).json({
            message: "One or more course IDs have invalid format",
            invalidIds,
          });
          return;
        }

        // Verify that all courseIds exist
        const courses = await Course.find({ _id: { $in: courseIds } });

        // Extract IDs using a safe method without directly accessing _id
        const foundIds = courses.map((course) => String(course["_id"]));

        if (courses.length !== courseIds.length) {
          const missingIds = courseIds.filter((id) => !foundIds.includes(id));

          res.status(400).json({
            message: "One or more course IDs are invalid",
            missingIds,
          });
          return;
        }
      }

      const newStudent = new Student({
        ...studentData,
        courseIds,
      });

      const savedStudent = await newStudent.save();

      const populatedStudent = await Student.findById(
        savedStudent._id
      ).populate("courseIds", "code name type");

      res.status(201).json(populatedStudent);
    } catch (error: any) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({
            message: "A student with this registration number already exists",
          });
      } else {
        res
          .status(400)
          .json({ message: "Error creating student", error: error.message });
      }
    }
  },

  // Update a student
  updateStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const studentId = req.params.id;
      const studentData = req.body as Partial<StudentInput>;
      console.log(`Updating student ${studentId} with data:`, studentData);

      // Validate the studentId
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ message: "Invalid student ID format" });
        return;
      }

      // Check if student exists
      const existingStudent = await Student.findById(studentId);
      if (!existingStudent) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      // Validate course IDs if provided
      if (studentData.courseIds) {
        // Ensure courseIds is an array
        const courseIds = Array.isArray(studentData.courseIds)
          ? studentData.courseIds
          : [];

        // Skip validation if no courses provided
        if (courseIds.length > 0) {
          // Validate the course IDs
          const invalidIds = courseIds.filter(
            (id) => !mongoose.Types.ObjectId.isValid(id)
          );
          if (invalidIds.length > 0) {
            res.status(400).json({
              message: "One or more course IDs have invalid format",
              invalidIds,
            });
            return;
          }

          // Verify that all courseIds exist
          const courses = await Course.find({ _id: { $in: courseIds } });

          // Extract IDs using a safe method without directly accessing _id
          const foundIds = courses.map((course) => String(course["_id"]));

          if (courses.length !== courseIds.length) {
            const missingIds = courseIds.filter((id) => !foundIds.includes(id));

            res.status(400).json({
              message: "One or more course IDs are invalid",
              missingIds,
            });
            return;
          }

          // Update courseIds in studentData
          studentData.courseIds = courseIds;
        }
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        studentId,
        studentData,
        { new: true, runValidators: true }
      ).populate("courseIds", "code name type");

      res.json(updatedStudent);
    } catch (error: any) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({
            message: "A student with this registration number already exists",
          });
      } else {
        res
          .status(400)
          .json({ message: "Error updating student", error: error.message });
      }
    }
  },

  // Delete a student
  deleteStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const studentId = req.params.id;

      // Validate the studentId
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        res.status(400).json({ message: "Invalid student ID format" });
        return;
      }

      const deletedStudent = await Student.findByIdAndDelete(studentId);

      if (!deletedStudent) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      res.json({ message: "Student deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting student", error });
    }
  },

  // Bulk create students (for Excel import)
  bulkCreateStudents: async (req: Request, res: Response): Promise<void> => {
    try {
      const students = req.body.students as StudentInput[];

      // Validate student data
      for (const student of students) {
        // Ensure courseIds is an array
        student.courseIds = Array.isArray(student.courseIds)
          ? student.courseIds
          : [];

        // Skip validation if no courses provided
        if (student.courseIds.length > 0) {
          // Validate the course IDs
          const invalidIds = student.courseIds.filter(
            (id) => !mongoose.Types.ObjectId.isValid(id)
          );
          if (invalidIds.length > 0) {
            res.status(400).json({
              message: "One or more course IDs have invalid format",
              invalidIds,
              student: student.registrationNumber,
            });
            return;
          }
        }
      }

      // Collect all unique course IDs
      const allCourseIds = [...new Set(students.flatMap((s) => s.courseIds))];

      // Verify that all courseIds exist
      const courses = await Course.find({ _id: { $in: allCourseIds } });

      // Extract IDs using a safe method without directly accessing _id
      const foundIds = courses.map((course) => String(course["_id"]));

      if (courses.length !== allCourseIds.length) {
        const missingIds = allCourseIds.filter((id) => !foundIds.includes(id));

        res.status(400).json({
          message: "One or more course IDs are invalid",
          missingIds,
        });
        return;
      }

      const createdStudents = await Student.insertMany(students);
      res.status(201).json(createdStudents);
    } catch (error: any) {
      if (error.code === 11000) {
        res
          .status(400)
          .json({
            message: "One or more students have duplicate registration numbers",
          });
      } else {
        res
          .status(400)
          .json({ message: "Error creating students", error: error.message });
      }
    }
  },
};

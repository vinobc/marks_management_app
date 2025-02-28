import api from "./api";
import { Student } from "../types";

export const studentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await api.get("/api/students");
      return response.data;
    } catch (error) {
      console.error("Error fetching all students:", error);
      throw error;
    }
  },

  // Get students for a specific course
  getStudentsByCourse: async (courseId: string) => {
    try {
      if (!courseId) {
        throw new Error("Course ID is required");
      }

      const response = await api.get(`/api/students/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching students for course ${courseId}:`, error);
      throw error;
    }
  },

  // Get a student by ID
  getStudent: async (id: string) => {
    try {
      if (!id) {
        throw new Error("Student ID is required");
      }

      const response = await api.get(`/api/students/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      throw error;
    }
  },

  // Create a new student
  createStudent: async (studentData: Partial<Student>) => {
    try {
      // Validate required fields
      if (!studentData.registrationNumber || !studentData.name) {
        throw new Error("Registration number and name are required");
      }

      // Make sure courseIds is an array of strings
      const data = {
        ...studentData,
        courseIds: Array.isArray(studentData.courseIds)
          ? studentData.courseIds.map((id) => String(id))
          : [],
      };

      const response = await api.post("/api/students", data);
      return response.data;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  // Update a student
  updateStudent: async (id: string, studentData: Partial<Student>) => {
    try {
      if (!id) {
        throw new Error("Student ID is required");
      }

      // Clean up the data
      const data = { ...studentData };

      // Remove _id if present to avoid conflicts
      if ("_id" in data) delete data._id;

      // Make sure courseIds is properly formatted if present
      if (data.courseIds) {
        data.courseIds = Array.isArray(data.courseIds)
          ? data.courseIds.map((id) => String(id))
          : [];
      }

      const response = await api.put(`/api/students/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  },

  // Delete a student
  deleteStudent: async (id: string) => {
    try {
      if (!id) {
        throw new Error("Student ID is required");
      }

      const response = await api.delete(`/api/students/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error);
      throw error;
    }
  },

  // Add a student to a course
  addStudentToCourse: async (studentId: string, courseId: string) => {
    try {
      if (!studentId || !courseId) {
        throw new Error("Student ID and Course ID are required");
      }

      const response = await api.post("/api/students/add-to-course", {
        studentId,
        courseId,
      });

      return response.data;
    } catch (error) {
      console.error(
        `Error adding student ${studentId} to course ${courseId}:`,
        error
      );
      throw error;
    }
  },

  // Remove a student from a course
  removeStudentFromCourse: async (studentId: string, courseId: string) => {
    try {
      if (!studentId || !courseId) {
        throw new Error("Student ID and Course ID are required");
      }

      const response = await api.post("/api/students/remove-from-course", {
        studentId,
        courseId,
      });

      return response.data;
    } catch (error) {
      console.error(
        `Error removing student ${studentId} from course ${courseId}:`,
        error
      );
      throw error;
    }
  },

  // Bulk create students
  bulkCreateStudents: async (students: Partial<Student>[]) => {
    try {
      if (!Array.isArray(students) || students.length === 0) {
        throw new Error("Valid student data array is required");
      }

      // Ensure each student has the required fields and proper courseIds
      const data = students.map((student) => {
        if (!student.registrationNumber || !student.name) {
          throw new Error(
            "All students must have registration number and name"
          );
        }

        return {
          ...student,
          courseIds: Array.isArray(student.courseIds)
            ? student.courseIds.map((id) => String(id))
            : [],
        };
      });

      const response = await api.post("/api/students/bulk", { students: data });
      return response.data;
    } catch (error) {
      console.error("Error bulk creating students:", error);
      throw error;
    }
  },
};

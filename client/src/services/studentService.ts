import api from "./api";
import { Student } from "../types";

export const studentService = {
  getAllStudents: async () => {
    try {
      const response = await api.get("/api/students");
      console.log("All students response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all students:", error);
      throw error;
    }
  },

  getStudentsByCourse: async (courseId: string) => {
    try {
      const response = await api.get(`/api/students/course/${courseId}`);
      console.log(`Students for course ${courseId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching students for course ${courseId}:`, error);
      throw error;
    }
  },

  getStudent: async (id: string) => {
    try {
      const response = await api.get(`/api/students/${id}`);
      console.log(`Student ${id} details:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error);
      throw error;
    }
  },

  createStudent: async (studentData: Partial<Student>) => {
    try {
      console.log("Creating student with data:", studentData);

      // Ensure courseIds is always an array
      const data = {
        ...studentData,
        courseIds: Array.isArray(studentData.courseIds)
          ? studentData.courseIds
          : [],
      };

      const response = await api.post("/api/students", data);
      console.log("Create student response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>) => {
    try {
      console.log(`Updating student ${id} with data:`, studentData);

      // Ensure courseIds is always an array
      const data = {
        ...studentData,
        courseIds: Array.isArray(studentData.courseIds)
          ? studentData.courseIds
          : [],
      };

      // Make sure to remove _id from the data to avoid conflicts
      if (data._id) {
        delete data._id;
      }

      const response = await api.put(`/api/students/${id}`, data);
      console.log("Update student response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating student ${id}:`, error);
      throw error;
    }
  },

  deleteStudent: async (id: string) => {
    try {
      const response = await api.delete(`/api/students/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting student ${id}:`, error);
      throw error;
    }
  },

  bulkCreateStudents: async (students: Partial<Student>[]) => {
    try {
      // Ensure each student has courseIds as an array
      const data = students.map((student) => ({
        ...student,
        courseIds: Array.isArray(student.courseIds) ? student.courseIds : [],
      }));

      const response = await api.post("/api/students/bulk", { students: data });
      return response.data;
    } catch (error) {
      console.error("Error bulk creating students:", error);
      throw error;
    }
  },
};

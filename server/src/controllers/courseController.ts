import { Request, Response } from "express";
import Course, { ICourse } from "../models/Course";

export const courseController = {
  // Get all courses
  getAllCourses: async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await Course.find().sort({ createdAt: -1 });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses", error });
    }
  },

  // Get a single course
  getCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course", error });
    }
  },

  // Create a new course
  createCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const newCourse = new Course(req.body);
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (error) {
      res.status(400).json({ message: "Error creating course", error });
    }
  },

  // Update a course
  updateCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedCourse) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json(updatedCourse);
    } catch (error) {
      res.status(400).json({ message: "Error updating course", error });
    }
  },

  // Delete a course
  deleteCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedCourse = await Course.findByIdAndDelete(req.params.id);
      if (!deletedCourse) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting course", error });
    }
  },
};

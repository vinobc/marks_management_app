import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Course, Student } from "../types";
import { courseService } from "../services/courseService";
import { studentService } from "../services/studentService";
import DynamicScoreEntry from "../components/scores/DynamicScoreEntry";
import TotalScoreComponent from "../components/scores/TotalScoreComponent";

const ScoresPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await courseService.getAllCourses();
        setCourses(data);

        // Check for courseId in URL query params
        const searchParams = new URLSearchParams(location.search);
        const courseId = searchParams.get("courseId");

        if (courseId) {
          const course = data.find((c) => c._id === courseId);
          if (course) {
            setSelectedCourse(course);
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to fetch courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [location]);

  // Fetch students when course changes
  useEffect(() => {
    if (!selectedCourse) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentData = await studentService.getStudentsByCourse(
          selectedCourse._id
        );
        setStudents(studentData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to fetch students for this course.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedCourse]);

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const courseId = event.target.value as string;
    const course = courses.find((c) => c._id === courseId) || null;
    setSelectedCourse(course);
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Score Entry
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="course-select-label">Select Course</InputLabel>
          <Select
            labelId="course-select-label"
            id="course-select"
            value={selectedCourse?._id || ""}
            onChange={handleCourseChange}
            label="Select Course"
          >
            <MenuItem value="">
              <em>Select a course</em>
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course._id}>
                {course.code} - {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {loading && !selectedCourse ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : !selectedCourse ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1">
            Please select a course to manage scores
          </Typography>
        </Paper>
      ) : (
        <DynamicScoreEntry
          course={selectedCourse}
          students={students}
          onSaveComplete={() => {
            // You can add any refresh logic here if needed
          }}
        />
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScoresPage;

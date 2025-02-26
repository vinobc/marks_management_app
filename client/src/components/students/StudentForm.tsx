import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Box,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Course, Student, ProgramType } from "../../types";

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (student: Partial<Student>) => void;
  student?: Student;
  courses: Course[];
}

interface StudentFormData {
  registrationNumber: string;
  name: string;
  program: ProgramType;
  courseIds: string[];
  semester: number;
  academicYear: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const programOptions: ProgramType[] = [
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

const StudentForm: React.FC<StudentFormProps> = ({
  open,
  onClose,
  onSubmit,
  student,
  courses,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    registrationNumber: "",
    name: "",
    program: "BBA", // Default value
    courseIds: [],
    semester: 1,
    academicYear: "",
  });

  // Debug logs for the student prop
  useEffect(() => {
    if (student) {
      console.log("Student to edit:", student);
      console.log("Student courseIds:", student.courseIds);
    }
  }, [student]);

  useEffect(() => {
    if (student) {
      // Ensure courseIds is always an array
      const courseIds = Array.isArray(student.courseIds)
        ? student.courseIds
        : [];

      setFormData({
        registrationNumber: student.registrationNumber,
        name: student.name,
        program: student.program || "BBA", // Handling any undefined values
        courseIds: courseIds,
        semester: student.semester,
        academicYear: student.academicYear,
      });
    } else {
      setFormData({
        registrationNumber: "",
        name: "",
        program: "BBA",
        courseIds: [],
        semester: 1,
        academicYear: "",
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: StudentFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProgramChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev: StudentFormData) => ({
      ...prev,
      program: event.target.value as ProgramType,
    }));
  };

  const handleCourseChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    // On autofill we get a stringified value
    const courseIds = typeof value === "string" ? value.split(",") : value;

    console.log("Selected course IDs:", courseIds);

    setFormData((prev: StudentFormData) => ({
      ...prev,
      courseIds: courseIds,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  // Check if each course exists in the courses array
  const validateCourseIds = () => {
    if (!formData.courseIds || formData.courseIds.length === 0) return true;

    return formData.courseIds.every((id) =>
      courses.some((course) => course._id === id)
    );
  };

  const isCoursesValid = validateCourseIds();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {student ? "Edit Student" : "Add New Student"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="registrationNumber"
                label="Registration Number"
                value={formData.registrationNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Student Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="program-label">Program</InputLabel>
                <Select
                  labelId="program-label"
                  name="program"
                  value={formData.program}
                  onChange={handleProgramChange}
                  label="Program"
                  required
                >
                  {programOptions.map((program) => (
                    <MenuItem key={program} value={program}>
                      {program}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="semester"
                label="Semester"
                type="number"
                value={formData.semester}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ inputProps: { min: 1, max: 8 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="academicYear"
                label="Academic Year"
                value={formData.academicYear}
                onChange={handleChange}
                fullWidth
                required
                placeholder="2024-25"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!isCoursesValid}>
                <InputLabel id="courses-label">Courses</InputLabel>
                <Select
                  labelId="courses-label"
                  multiple
                  value={formData.courseIds}
                  onChange={handleCourseChange}
                  input={<OutlinedInput label="Courses" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((courseId) => {
                        const course = courses.find((c) => c._id === courseId);
                        return course ? (
                          <Chip
                            key={courseId}
                            label={`${course.code} - ${course.name}`}
                          />
                        ) : (
                          <Chip
                            key={courseId}
                            label={`ID: ${courseId.substring(0, 8)}...`}
                            color="error"
                          />
                        );
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.code} - {course.name}
                    </MenuItem>
                  ))}
                </Select>
                {!isCoursesValid && (
                  <Typography color="error" variant="caption">
                    One or more selected courses are invalid
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isCoursesValid}
          >
            {student ? "Update Student" : "Add Student"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentForm;

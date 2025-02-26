import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { Course, Student, ProgramType } from "../../types";
import { studentService } from "../../services/studentService";

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

// Academic year options - current year and next 5 years
const generateAcademicYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = [];

  for (let i = 0; i < 6; i++) {
    const startYear = currentYear - 1 + i;
    const endYear = startYear + 1;
    options.push(`${startYear}-${endYear.toString().slice(-2)}`);
  }

  return options;
};

const academicYearOptions = generateAcademicYearOptions();

interface StudentRow {
  id: string; // temporary ID for new rows, actual _id for existing students
  registrationNumber: string;
  name: string;
  program: ProgramType;
  semester: number;
  academicYear: string;
  isExisting: boolean;
  _id?: string; // MongoDB ID for existing students
}

interface CourseStudentsTableProps {
  course: Course;
  onSaveComplete?: () => void;
}

const CourseStudentsTable: React.FC<CourseStudentsTableProps> = ({
  course,
  onSaveComplete,
}) => {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!course) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);

        // Fetch students for this course
        const studentsData = await studentService.getStudentsByCourse(
          course._id
        );

        // Transform to StudentRow format
        const studentRows = studentsData.map((student: Student) => ({
          id: student._id,
          _id: student._id,
          registrationNumber: student.registrationNumber,
          name: student.name,
          program: student.program,
          semester: student.semester,
          academicYear: student.academicYear,
          isExisting: true,
        }));

        setStudents(studentRows);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [course]);

  const handleAddRow = () => {
    // Generate a temporary ID for the new row
    const newId = `new-${Date.now()}`;

    const newStudent: StudentRow = {
      id: newId,
      registrationNumber: "",
      name: "",
      program: "BBA",
      semester: 1,
      academicYear: "2023-24", // Default to 2023-24
      isExisting: false,
    };

    setStudents([...students, newStudent]);
  };

  const handleDeleteRow = (id: string) => {
    // If it's an existing student, we need to remove the course from the student
    const studentToDelete = students.find((s) => s.id === id);

    if (studentToDelete && studentToDelete.isExisting && studentToDelete._id) {
      // Confirm before removing existing student from course
      if (window.confirm("Remove this student from the course?")) {
        handleRemoveStudentFromCourse(studentToDelete._id);
      }
    } else {
      // Just remove the row for new students
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleRemoveStudentFromCourse = async (studentId: string) => {
    if (!course._id) return;

    try {
      // Get the student
      const student = await studentService.getStudent(studentId);

      // Remove this course from the student's courses
      const updatedCourseIds = student.courseIds.filter(
        (id) => id !== course._id
      );

      // Update the student
      await studentService.updateStudent(studentId, {
        ...student,
        courseIds: updatedCourseIds,
      });

      // Update the local state
      setStudents(students.filter((s) => s.id !== studentId));
      setSuccess("Student removed from course");
    } catch (err) {
      console.error("Error removing student from course:", err);
      setError("Failed to remove student from course");
    }
  };

  const handleSaveRow = async (id: string) => {
    if (!course._id) return;

    const studentToSave = students.find((s) => s.id === id);
    if (!studentToSave) return;

    // Validate required fields
    if (!studentToSave.registrationNumber || !studentToSave.name) {
      setError("Enrollment No. and Name are required fields");
      return;
    }

    try {
      if (studentToSave.isExisting && studentToSave._id) {
        // Update existing student
        await studentService.updateStudent(studentToSave._id, {
          registrationNumber: studentToSave.registrationNumber,
          name: studentToSave.name,
          program: studentToSave.program,
          semester: studentToSave.semester,
          academicYear: studentToSave.academicYear,
        });
      } else {
        // Check if a student with this registration number already exists
        const existingStudents = await studentService.getAllStudents();
        const existingStudent = existingStudents.find(
          (s) => s.registrationNumber === studentToSave.registrationNumber
        );

        if (existingStudent) {
          // If exists, just add this course to their courses
          const updatedCourseIds = [...existingStudent.courseIds, course._id];
          await studentService.updateStudent(existingStudent._id, {
            ...existingStudent,
            courseIds: updatedCourseIds,
          });
        } else {
          // Create a new student
          await studentService.createStudent({
            registrationNumber: studentToSave.registrationNumber,
            name: studentToSave.name,
            program: studentToSave.program,
            semester: studentToSave.semester,
            academicYear: studentToSave.academicYear,
            courseIds: [course._id],
          });
        }
      }

      setSuccess("Student saved successfully");

      // Refresh the student list
      const updatedStudents = await studentService.getStudentsByCourse(
        course._id
      );
      const updatedStudentRows = updatedStudents.map((student: Student) => ({
        id: student._id,
        _id: student._id,
        registrationNumber: student.registrationNumber,
        name: student.name,
        program: student.program,
        semester: student.semester,
        academicYear: student.academicYear,
        isExisting: true,
      }));

      setStudents(updatedStudentRows);

      // Notify parent component that save is complete
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      console.error("Error saving student:", err);
      setError("Failed to save student");
    }
  };

  const handleChangeField = (
    id: string,
    field: keyof StudentRow,
    value: any
  ) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveAll = async () => {
    if (!course._id) return;

    setSaving(true);
    try {
      // Validate all rows
      const invalidRows = students.filter(
        (s) => !s.registrationNumber || !s.name
      );

      if (invalidRows.length > 0) {
        setError("All students must have Enrollment No. and Name filled in");
        setSaving(false);
        return;
      }

      // Separate existing and new students
      const existingStudents = students.filter((s) => s.isExisting);
      const newStudents = students.filter((s) => !s.isExisting);

      // Process new students
      for (const student of newStudents) {
        try {
          // Check if a student with this registration number already exists
          const existingStudents = await studentService.getAllStudents();
          const existingStudent = existingStudents.find(
            (s) => s.registrationNumber === student.registrationNumber
          );

          if (existingStudent) {
            // If exists, just add this course to their courses
            const updatedCourseIds = [...existingStudent.courseIds, course._id];
            await studentService.updateStudent(existingStudent._id, {
              ...existingStudent,
              courseIds: updatedCourseIds,
            });
          } else {
            // Create a new student
            await studentService.createStudent({
              registrationNumber: student.registrationNumber,
              name: student.name,
              program: student.program,
              semester: student.semester,
              academicYear: student.academicYear,
              courseIds: [course._id],
            });
          }
        } catch (err) {
          console.error(
            `Error processing student ${student.registrationNumber}:`,
            err
          );
        }
      }

      // Process modified existing students
      for (const student of existingStudents) {
        if (student._id) {
          try {
            await studentService.updateStudent(student._id, {
              registrationNumber: student.registrationNumber,
              name: student.name,
              program: student.program,
              semester: student.semester,
              academicYear: student.academicYear,
            });
          } catch (err) {
            console.error(
              `Error updating student ${student.registrationNumber}:`,
              err
            );
          }
        }
      }

      setSuccess("All students saved successfully");

      // Refresh the student list
      const updatedStudents = await studentService.getStudentsByCourse(
        course._id
      );
      const updatedStudentRows = updatedStudents.map((student: Student) => ({
        id: student._id,
        _id: student._id,
        registrationNumber: student.registrationNumber,
        name: student.name,
        program: student.program,
        semester: student.semester,
        academicYear: student.academicYear,
        isExisting: true,
      }));

      setStudents(updatedStudentRows);

      // Notify parent component that save is complete
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      console.error("Error saving students:", err);
      setError("Failed to save students");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Students</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRow}
          >
            Add Student
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} /> : "Save All Students"}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%">SNo.</TableCell>
              <TableCell width="15%">Program</TableCell>
              <TableCell width="20%">Enrollment No.</TableCell>
              <TableCell width="25%">Name</TableCell>
              <TableCell width="10%">Semester</TableCell>
              <TableCell width="15%">Academic Year</TableCell>
              <TableCell width="10%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={student.program}
                      onChange={(e) =>
                        handleChangeField(student.id, "program", e.target.value)
                      }
                    >
                      {programOptions.map((program) => (
                        <MenuItem key={program} value={program}>
                          {program}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={student.registrationNumber}
                    onChange={(e) =>
                      handleChangeField(
                        student.id,
                        "registrationNumber",
                        e.target.value
                      )
                    }
                    size="small"
                    placeholder="Enter enrollment number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={student.name}
                    onChange={(e) =>
                      handleChangeField(student.id, "name", e.target.value)
                    }
                    size="small"
                    placeholder="Enter student name"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    fullWidth
                    value={student.semester}
                    onChange={(e) =>
                      handleChangeField(
                        student.id,
                        "semester",
                        Number(e.target.value)
                      )
                    }
                    size="small"
                    InputProps={{ inputProps: { min: 1, max: 8 } }}
                  />
                </TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={student.academicYear}
                      onChange={(e) =>
                        handleChangeField(
                          student.id,
                          "academicYear",
                          e.target.value as string
                        )
                      }
                    >
                      {academicYearOptions.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleSaveRow(student.id)}
                      size="small"
                      title="Save student"
                    >
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteRow(student.id)}
                      size="small"
                      title="Delete student from course"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No students available. Click "Add Student" to add students.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseStudentsTable;

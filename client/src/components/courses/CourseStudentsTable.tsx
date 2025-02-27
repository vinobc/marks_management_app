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

// Academic year options - starting from 2023-24 and next 5 years
const generateAcademicYearOptions = () => {
  const startYear = 2023;
  const options = [];

  for (let i = 0; i < 6; i++) {
    const year = startYear + i;
    const nextYear = year + 1;
    options.push(`${year}-${nextYear.toString().slice(-2)}`);
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
  isSaving?: boolean; // Track saving state for individual students
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
        setError(null);

        // Fetch students for this course
        console.log(`Fetching students for course: ${course._id}`);
        const studentsData = await studentService.getStudentsByCourse(
          course._id
        );
        console.log(`Received ${studentsData.length} students for course`);

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
          isSaving: false,
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
      isSaving: false,
    };

    setStudents([...students, newStudent]);
  };

  const handleDeleteRow = (id: string) => {
    // If it's an existing student, we need to remove the course from the student
    const studentToDelete = students.find((s) => s.id === id);

    if (!studentToDelete) return;

    if (studentToDelete.isExisting && studentToDelete._id) {
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
    if (!course || !course._id) return;

    if (
      window.confirm(
        "Do you want to permanently delete this student from the system?"
      )
    ) {
      try {
        console.log(`Permanently deleting student ${studentId}`);

        // Update UI immediately for better UX
        setStudents((prevStudents) =>
          prevStudents.filter((s) => s.id !== studentId)
        );
        setSuccess("Deleting student...");

        // Process in the background
        setTimeout(async () => {
          try {
            // Delete the student completely
            await studentService.deleteStudent(studentId);
            console.log(`Successfully deleted student ${studentId}`);
            setSuccess("Student permanently deleted");

            // Notify parent component
            if (onSaveComplete) {
              onSaveComplete();
            }
          } catch (err) {
            console.error(`Error deleting student ${studentId}:`, err);

            // Don't show error to user since UI already updated
            // But do refresh the list to ensure UI is in sync
            if (course?._id) {
              try {
                const refreshedStudents =
                  await studentService.getStudentsByCourse(course._id);
                const refreshedRows = refreshedStudents.map(
                  (student: Student) => ({
                    id: student._id,
                    _id: student._id,
                    registrationNumber: student.registrationNumber,
                    name: student.name,
                    program: student.program || "BBA",
                    semester: student.semester,
                    academicYear: student.academicYear,
                    isExisting: true,
                    isSaving: false,
                  })
                );
                setStudents(refreshedRows);
              } catch (refreshError) {
                console.error("Error refreshing student list:", refreshError);
              }
            }
          }
        }, 100);
      } catch (err: any) {
        console.error("Error initiating student deletion:", err);
        setError("Failed to delete student");
      }
    }
  };

  const handleSaveRow = async (id: string) => {
    if (!course || !course._id) return;

    const studentToSave = students.find((s) => s.id === id);
    if (!studentToSave) return;

    // Validate required fields
    if (!studentToSave.registrationNumber || !studentToSave.name) {
      setError("Enrollment No. and Name are required fields");
      return;
    }

    // Check if the registration number already exists in the current student list
    const duplicateInTable = students.find(
      (s) =>
        s.id !== id && s.registrationNumber === studentToSave.registrationNumber
    );

    if (duplicateInTable) {
      setError(
        `A student with enrollment number "${studentToSave.registrationNumber}" already exists in this course`
      );
      return;
    }

    try {
      // Update this specific student's saving state
      setStudents((prevStudents) =>
        prevStudents.map((s) => (s.id === id ? { ...s, isSaving: true } : s))
      );
      setError(null);

      // Get course ID as a string
      const courseIdString = String(course._id);
      console.log("Course ID for save:", courseIdString);

      if (studentToSave.isExisting && studentToSave._id) {
        // Handle existing student update
        try {
          console.log(`Updating existing student: ${studentToSave._id}`);

          // Only update basic info without changing courseIds
          const updatedData = {
            registrationNumber: studentToSave.registrationNumber,
            name: studentToSave.name,
            program: studentToSave.program,
            semester: studentToSave.semester,
            academicYear: studentToSave.academicYear,
          };

          console.log("Update data:", updatedData);
          await studentService.updateStudent(studentToSave._id, updatedData);

          // Mark as no longer saving and as existing
          setStudents((prevStudents) =>
            prevStudents.map((s) =>
              s.id === id
                ? {
                    ...s,
                    isExisting: true,
                    isSaving: false,
                  }
                : s
            )
          );

          setSuccess("Student updated successfully");
        } catch (err: any) {
          console.error("Error updating existing student:", err);
          throw err;
        }
      } else {
        // Handle new student creation or linking existing student by registration number
        try {
          console.log(
            `Handling new student: ${studentToSave.registrationNumber}`
          );

          // Check if a student with this registration number already exists
          const allStudents = await studentService.getAllStudents();
          const existingStudent = allStudents.find(
            (s) => s.registrationNumber === studentToSave.registrationNumber
          );

          if (existingStudent) {
            console.log(
              `Found existing student with same registration: ${existingStudent._id}`
            );

            try {
              // Retrieve current student data to get fresh courseIds
              const currentStudentData = await studentService.getStudent(
                existingStudent._id
              );

              // Check if student already has this course
              const existingCourseIds = Array.isArray(
                currentStudentData.courseIds
              )
                ? currentStudentData.courseIds
                : [];

              console.log("Existing course IDs:", existingCourseIds);

              // Convert all IDs to strings for comparison
              const normalizedCourseIds = existingCourseIds.map((id) =>
                typeof id === "string" ? id : String(id)
              );

              // Check if this course ID is already in the list
              const alreadyHasCourse = normalizedCourseIds.some(
                (id) => id === courseIdString
              );
              console.log("Course already exists:", alreadyHasCourse);

              if (!alreadyHasCourse) {
                console.log("Adding course to student");

                // Add course ID to the list
                normalizedCourseIds.push(courseIdString);

                // Update student with new course list
                await studentService.updateStudent(existingStudent._id, {
                  courseIds: normalizedCourseIds,
                  // Also update other info
                  name: studentToSave.name,
                  program: studentToSave.program,
                  semester: studentToSave.semester,
                  academicYear: studentToSave.academicYear,
                });

                setSuccess("Added existing student to this course");
              } else {
                console.log(
                  "Course already exists, just updating student info"
                );

                // Just update other info
                await studentService.updateStudent(existingStudent._id, {
                  name: studentToSave.name,
                  program: studentToSave.program,
                  semester: studentToSave.semester,
                  academicYear: studentToSave.academicYear,
                });

                setSuccess("Updated student information");
              }
            } catch (innerErr) {
              console.error("Error updating existing student:", innerErr);
              throw innerErr;
            }

            // Update the student in our local state with the existing ID
            setStudents((prevStudents) =>
              prevStudents.map((s) =>
                s.id === id
                  ? {
                      ...s,
                      _id: existingStudent._id,
                      isExisting: true,
                      isSaving: false,
                    }
                  : s
              )
            );
          } else {
            console.log("Creating brand new student");

            // Create brand new student with this course
            const newStudent = await studentService.createStudent({
              registrationNumber: studentToSave.registrationNumber,
              name: studentToSave.name,
              program: studentToSave.program,
              semester: studentToSave.semester,
              academicYear: studentToSave.academicYear,
              courseIds: [courseIdString],
            });

            // Update the student in our local state with the new ID
            setStudents((prevStudents) =>
              prevStudents.map((s) =>
                s.id === id
                  ? {
                      ...s,
                      _id: newStudent._id,
                      isExisting: true,
                      isSaving: false,
                    }
                  : s
              )
            );

            setSuccess("New student created successfully");
          }
        } catch (err: any) {
          console.error("Error handling student:", err);

          if (
            err.response?.status === 400 &&
            err.response?.data?.message?.includes(
              "registration number already exists"
            )
          ) {
            // This happens when the backend prevents duplicate registration numbers
            // But we should have already checked for this above
            setError(
              "A student with this enrollment number already exists in the system"
            );
          } else {
            throw err;
          }
        }
      }

      // Notify parent if needed - but don't refresh
      if (onSaveComplete) {
        // Delay to ensure database is updated
        setTimeout(() => onSaveComplete(), 300);
      }
    } catch (err: any) {
      console.error("Error saving student:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (
        err.message?.includes("One or more course IDs have invalid format")
      ) {
        setError("Error with course IDs format. Please try again.");
      } else if (!err.message?.includes("enrollment number already exists")) {
        setError("Failed to save student");
      }

      // Reset the saving state for this student
      setStudents((prevStudents) =>
        prevStudents.map((s) => (s.id === id ? { ...s, isSaving: false } : s))
      );
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
    if (!course || !course._id) return;
    if (students.length === 0) {
      setError("No students available to save");
      return;
    }

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

      console.log("Saving all students...");

      // Process each student one by one
      let successCount = 0;
      for (const student of students) {
        try {
          // Simply update student details without changing courseIds
          if (student.isExisting && student._id) {
            await studentService.updateStudent(student._id, {
              registrationNumber: student.registrationNumber,
              name: student.name,
              program: student.program,
              semester: student.semester,
              academicYear: student.academicYear,
              // Don't update courseIds
            });
          } else {
            // For new students, create them with minimal data
            await studentService.createStudent({
              registrationNumber: student.registrationNumber,
              name: student.name,
              program: student.program,
              semester: student.semester,
              academicYear: student.academicYear,
            });
          }
          successCount++;
        } catch (error) {
          console.error(
            `Error updating student ${student.registrationNumber}:`,
            error
          );
          // Continue with other students
        }
      }

      setSuccess(`${successCount} students saved successfully`);

      // Just mark all students as existing instead of refreshing
      setStudents((prevStudents) =>
        prevStudents.map((s) => ({
          ...s,
          isExisting: true,
          isSaving: false,
        }))
      );

      // Only notify the parent component if needed, but don't refresh
      if (onSaveComplete) {
        // Use a minimal version that doesn't trigger refresh
        setTimeout(() => {
          onSaveComplete();
        }, 100);
      }
    } catch (err: any) {
      console.error("Error saving students:", err);
      setError(err.response?.data?.message || "Failed to save students");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllStudents = async () => {
    if (!course || !course._id || students.length === 0) {
      setError("No students to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to permanently delete all ${students.length} students from the system?`
      )
    ) {
      try {
        setSaving(true);
        setError(null);

        // Store the current student list before clearing UI
        const studentsToProcess = [...students];

        // Update UI immediately for better UX
        setStudents([]);
        setSuccess(`Deleting ${studentsToProcess.length} students...`);

        // Process in the background
        setTimeout(async () => {
          try {
            // Process existing students only
            const existingStudents = studentsToProcess.filter(
              (s) => s.isExisting && s._id
            );
            console.log(
              `Permanently deleting ${existingStudents.length} students`
            );

            let successCount = 0;
            for (const student of existingStudents) {
              try {
                // Delete the student completely from the database
                await studentService.deleteStudent(student._id || "");
                console.log(`Successfully deleted student ${student._id}`);
                successCount++;
              } catch (err) {
                console.error(`Error deleting student ${student._id}:`, err);
              }
            }

            console.log(
              `Successfully deleted ${successCount} of ${existingStudents.length} students`
            );
            setSuccess(
              `Successfully deleted ${successCount} students from the system`
            );

            // Notify parent to refresh after all processing is complete
            if (onSaveComplete) {
              onSaveComplete();
            }
          } catch (err) {
            console.error("Background processing error:", err);
          } finally {
            setSaving(false);
          }
        }, 100); // Short delay before starting background processing
      } catch (err) {
        console.error("Error in delete operation:", err);
        setError("Failed to delete students");
        setSaving(false);
      }
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
            disabled={saving || students.length === 0}
          >
            {saving ? <CircularProgress size={24} /> : "Save All Students"}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAllStudents}
            disabled={saving || students.length === 0}
          >
            Delete All
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
                      disabled={student.isSaving}
                    >
                      {student.isSaving ? (
                        <CircularProgress size={18} />
                      ) : (
                        <SaveIcon fontSize="small" />
                      )}
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteRow(student.id)}
                      size="small"
                      title="Delete student from course"
                      disabled={student.isSaving}
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

// // import React, { useState, useEffect } from "react";
// // import {
// //   Box,
// //   Paper,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   TextField,
// //   Typography,
// //   Grid,
// //   Alert,
// // } from "@mui/material";
// // import { Student } from "../../types";

// // interface AssignmentScoreEntryComponentProps {
// //   students: Student[];
// //   componentName: string; // Should be "ASSIGNMENT"
// //   onScoresChange: (scores: any) => void;
// //   initialScores?: any;
// // }

// // // Convert number to words function
// // const numberToWords = (num: number): string => {
// //   const ones = [
// //     "",
// //     "One",
// //     "Two",
// //     "Three",
// //     "Four",
// //     "Five",
// //     "Six",
// //     "Seven",
// //     "Eight",
// //     "Nine",
// //     "Ten",
// //     "Eleven",
// //     "Twelve",
// //     "Thirteen",
// //     "Fourteen",
// //     "Fifteen",
// //     "Sixteen",
// //     "Seventeen",
// //     "Eighteen",
// //     "Nineteen",
// //   ];
// //   const tens = [
// //     "",
// //     "",
// //     "Twenty",
// //     "Thirty",
// //     "Forty",
// //     "Fifty",
// //     "Sixty",
// //     "Seventy",
// //     "Eighty",
// //     "Ninety",
// //   ];

// //   if (num === 0) return "Zero";

// //   if (num < 20) return ones[num];

// //   if (num < 100) {
// //     return (
// //       tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
// //     );
// //   }

// //   return "Number too large";
// // };

// // const AssignmentScoreEntryComponent: React.FC<
// //   AssignmentScoreEntryComponentProps
// // > = ({ students, componentName, onScoresChange, initialScores = {} }) => {
// //   // State for student scores
// //   const [scores, setScores] = useState<{ [studentId: string]: number }>({});
// //   const [error, setError] = useState<string | null>(null);

// //   // The max marks for assignment is 10 with passing threshold of 4
// //   const maxMarks = 10;
// //   const passingThreshold = 4;

// //   // Initialize scores from initial data if provided
// //   useEffect(() => {
// //     if (initialScores && Object.keys(initialScores).length > 0) {
// //       try {
// //         const initialStudentScores: { [studentId: string]: number } = {};
// //         Object.keys(initialScores).forEach((studentId) => {
// //           initialStudentScores[studentId] =
// //             initialScores[studentId].obtainedMarks || 0;
// //         });
// //         setScores(initialStudentScores);
// //       } catch (err) {
// //         console.error("Error parsing initial scores:", err);
// //         setError("Error loading initial scores");
// //       }
// //     }
// //   }, [initialScores]);

// //   // Handle score change for a student
// //   const handleScoreChange = (studentId: string, value: number) => {
// //     try {
// //       // Validate value is within range
// //       const validValue = Math.max(0, Math.min(maxMarks, value));

// //       // Update scores state
// //       setScores((prev) => ({
// //         ...prev,
// //         [studentId]: validValue,
// //       }));

// //       // Update parent component
// //       const updatedScores: any = {};
// //       students.forEach((student) => {
// //         const id = student._id;
// //         const obtainedMarks = id === studentId ? validValue : scores[id] || 0;

// //         updatedScores[id] = {
// //           componentName: "ASSIGNMENT",
// //           maxMarks: maxMarks,
// //           obtainedMarks: obtainedMarks,
// //         };
// //       });

// //       onScoresChange(updatedScores);
// //     } catch (err) {
// //       console.error("Error updating score:", err);
// //       setError("Failed to update score");
// //     }
// //   };

// //   return (
// //     <Box sx={{ width: "100%" }}>
// //       <Grid container spacing={2} sx={{ mb: 3 }}>
// //         <Grid item xs={12}>
// //           <Typography variant="h6">Internals/Assignment</Typography>
// //         </Grid>
// //       </Grid>

// //       {error && (
// //         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
// //           {error}
// //         </Alert>
// //       )}

// //       {/* Description */}
// //       <Typography variant="body2" sx={{ mb: 2, ml: 4 }}>
// //         - Faculty enters the internal score under Out_of_10 for each student
// //       </Typography>

// //       <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
// //         <Table size="small">
// //           <TableHead>
// //             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
// //               <TableCell>SNo.</TableCell>
// //               <TableCell>Academic_Year</TableCell>
// //               <TableCell>Program</TableCell>
// //               <TableCell>ENo.</TableCell>
// //               <TableCell>Name</TableCell>
// //               <TableCell>Semester</TableCell>
// //               <TableCell align="center">Out_of_10 (pass 4)</TableCell>
// //               <TableCell>Marks in Words</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {students.map((student, studentIndex) => {
// //               const score = scores[student._id] || 0;
// //               const isPassing = score >= passingThreshold;

// //               return (
// //                 <TableRow key={student._id} hover>
// //                   <TableCell>{studentIndex + 1}</TableCell>
// //                   <TableCell>{student.academicYear}</TableCell>
// //                   <TableCell>{student.program}</TableCell>
// //                   <TableCell>{student.registrationNumber}</TableCell>
// //                   <TableCell>{student.name}</TableCell>
// //                   <TableCell>{student.semester}</TableCell>
// //                   <TableCell align="center">
// //                     <TextField
// //                       type="number"
// //                       value={score}
// //                       onChange={(e) =>
// //                         handleScoreChange(student._id, Number(e.target.value))
// //                       }
// //                       inputProps={{
// //                         min: 0,
// //                         max: maxMarks,
// //                         style: { textAlign: "center" },
// //                       }}
// //                       size="small"
// //                       sx={{
// //                         width: 70,
// //                         "& input": {
// //                           color: isPassing ? "green" : "red",
// //                           fontWeight: "bold",
// //                         },
// //                       }}
// //                     />
// //                   </TableCell>
// //                   <TableCell>{numberToWords(score)}</TableCell>
// //                 </TableRow>
// //               );
// //             })}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //     </Box>
// //   );
// // };

// // export default AssignmentScoreEntryComponent;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   Grid,
//   Alert,
// } from "@mui/material";
// import { Student, CourseType } from "../../types";
// import { getComponentScale } from "../../utils/scoreUtils";

// interface AssignmentScoreEntryComponentProps {
//   students: Student[];
//   componentName: string; // Should be "ASSIGNMENT"
//   courseType: CourseType; // Add course type
//   onScoresChange: (scores: any) => void;
//   initialScores?: any;
// }

// // Convert number to words function
// const numberToWords = (num: number): string => {
//   const ones = [
//     "",
//     "One",
//     "Two",
//     "Three",
//     "Four",
//     "Five",
//     "Six",
//     "Seven",
//     "Eight",
//     "Nine",
//     "Ten",
//     "Eleven",
//     "Twelve",
//     "Thirteen",
//     "Fourteen",
//     "Fifteen",
//     "Sixteen",
//     "Seventeen",
//     "Eighteen",
//     "Nineteen",
//   ];
//   const tens = [
//     "",
//     "",
//     "Twenty",
//     "Thirty",
//     "Forty",
//     "Fifty",
//     "Sixty",
//     "Seventy",
//     "Eighty",
//     "Ninety",
//   ];

//   if (num === 0) return "Zero";

//   if (num < 20) return ones[num];

//   if (num < 100) {
//     return (
//       tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
//     );
//   }

//   return "Number too large";
// };

// const AssignmentScoreEntryComponent: React.FC<
//   AssignmentScoreEntryComponentProps
// > = ({
//   students,
//   componentName,
//   courseType,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   // State for student scores
//   const [scores, setScores] = useState<{ [studentId: string]: number }>({});
//   const [error, setError] = useState<string | null>(null);

//   // Get scale configuration based on course type
//   const scaleConfig = getComponentScale(courseType, componentName);
//   const maxMarks = scaleConfig.maxMarks;
//   const passingThreshold = scaleConfig.passingMarks;

//   // Initialize scores from initial data if provided
//   useEffect(() => {
//     if (initialScores && Object.keys(initialScores).length > 0) {
//       try {
//         const initialStudentScores: { [studentId: string]: number } = {};
//         Object.keys(initialScores).forEach((studentId) => {
//           initialStudentScores[studentId] =
//             initialScores[studentId].obtainedMarks || 0;
//         });
//         setScores(initialStudentScores);
//       } catch (err) {
//         console.error("Error parsing initial scores:", err);
//         setError("Error loading initial scores");
//       }
//     }
//   }, [initialScores]);

//   // Handle score change for a student
//   const handleScoreChange = (studentId: string, value: number) => {
//     try {
//       // Validate value is within range
//       const validValue = Math.max(0, Math.min(maxMarks, value));

//       // Update scores state
//       setScores((prev) => ({
//         ...prev,
//         [studentId]: validValue,
//       }));

//       // Update parent component
//       const updatedScores: any = {};
//       students.forEach((student) => {
//         const id = student._id;
//         const obtainedMarks = id === studentId ? validValue : scores[id] || 0;

//         updatedScores[id] = {
//           componentName: "ASSIGNMENT",
//           maxMarks: maxMarks,
//           obtainedMarks: obtainedMarks,
//         };
//       });

//       onScoresChange(updatedScores);
//     } catch (err) {
//       console.error("Error updating score:", err);
//       setError("Failed to update score");
//     }
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12}>
//           <Typography variant="h6">Internals/Assignment</Typography>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       {/* Description */}
//       <Typography variant="body2" sx={{ mb: 2, ml: 4 }}>
//         - Faculty enters the internal score under Out_of_{maxMarks} for each
//         student
//       </Typography>

//       <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
//         <Table size="small">
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>Enrollment No.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>
//               <TableCell align="center">
//                 Out_of_{maxMarks} (pass {passingThreshold})
//               </TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student, studentIndex) => {
//               const score = scores[student._id] || 0;
//               const isPassing = score >= passingThreshold;

//               return (
//                 <TableRow key={student._id} hover>
//                   <TableCell>{studentIndex + 1}</TableCell>
//                   <TableCell>{student.academicYear}</TableCell>
//                   <TableCell>{student.program}</TableCell>
//                   <TableCell>{student.registrationNumber}</TableCell>
//                   <TableCell>{student.name}</TableCell>
//                   <TableCell>{student.semester}</TableCell>
//                   <TableCell align="center">
//                     <TextField
//                       type="number"
//                       value={score}
//                       onChange={(e) =>
//                         handleScoreChange(student._id, Number(e.target.value))
//                       }
//                       inputProps={{
//                         min: 0,
//                         max: maxMarks,
//                         style: { textAlign: "center" },
//                       }}
//                       size="small"
//                       sx={{
//                         width: 70,
//                         "& input": {
//                           color: isPassing ? "green" : "red",
//                           fontWeight: "bold",
//                         },
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell>{numberToWords(score)}</TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default AssignmentScoreEntryComponent;

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Grid,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Student, CourseType } from "../../types";
import { getComponentScale, convertLabScore } from "../../utils/scoreUtils";

interface LabSession {
  date: string;
  maxMarks: number;
  obtainedMarks: number;
}

interface LabScore {
  componentName: string;
  sessions: LabSession[];
  maxMarks: number;
  totalObtained: number;
}

interface LabScoreEntryComponentProps {
  students: Student[];
  componentName: string;
  courseType: CourseType; // Add course type
  onScoresChange: (scores: { [studentId: string]: LabScore }) => void;
  initialScores?: { [studentId: string]: LabScore };
}

const LabScoreEntryComponent: React.FC<LabScoreEntryComponentProps> = ({
  students,
  componentName,
  courseType,
  onScoresChange,
  initialScores = {},
}) => {
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<string[]>([
    new Date().toISOString().split("T")[0],
    new Date().toISOString().split("T")[0],
  ]);

  // Use a simple 2D array for scores [studentIndex][sessionIndex]
  const [scoreMatrix, setScoreMatrix] = useState<number[][]>([]);

  // Get scale configuration based on course type
  const scaleConfig = getComponentScale(courseType, "LAB");
  const maxMarks = scaleConfig.maxMarks;
  const passingThreshold = scaleConfig.passingMarks;

  // Initialize from props
  useEffect(() => {
    // Initialize dates from initialScores if available
    let initialDates = [...dates];
    if (Object.keys(initialScores).length > 0) {
      const firstStudent = Object.values(initialScores)[0];
      if (
        firstStudent &&
        firstStudent.sessions &&
        firstStudent.sessions.length > 0
      ) {
        initialDates = firstStudent.sessions.map((s) => s.date);
        setDates(initialDates);
      }
    }

    // Initialize score matrix
    const matrix: number[][] = [];

    students.forEach((student, studentIndex) => {
      matrix[studentIndex] = [];

      // For each date, find the corresponding score or use 0
      initialDates.forEach((_, dateIndex) => {
        const studentScore = initialScores[student._id];
        const score = studentScore?.sessions?.[dateIndex]?.obtainedMarks || 0;
        matrix[studentIndex][dateIndex] = score;
      });
    });

    setScoreMatrix(matrix);

    // Initial update to parent
    setTimeout(() => {
      updateParent();
    }, 100);
  }, []);

  // Calculate total for a student based on course type
  const calculateTotal = (studentIndex: number): number => {
    if (!scoreMatrix[studentIndex]) return 0;

    const scores = scoreMatrix[studentIndex];
    if (!scores || scores.length === 0) return 0;

    let sum = 0;
    let count = 0;

    for (let i = 0; i < scores.length; i++) {
      if (scores[i] !== undefined) {
        sum += scores[i];
        count++;
      }
    }

    if (count === 0) return 0;

    // Calculate average and scale to max marks based on course type
    const average = sum / count;
    return convertLabScore(average, courseType);
  };

  // Handle date change
  const handleDateChange = (index: number, newDate: string) => {
    const newDates = [...dates];
    newDates[index] = newDate;
    setDates(newDates);
  };

  // Add a new session
  const handleAddSession = () => {
    // Add a new date
    const newDate = new Date().toISOString().split("T")[0];
    setDates((prevDates) => [...prevDates, newDate]);

    // Add a column of zeros to the score matrix
    setScoreMatrix((prevMatrix) => {
      const newMatrix = [...prevMatrix];
      for (let i = 0; i < students.length; i++) {
        if (!newMatrix[i]) newMatrix[i] = [];
        newMatrix[i].push(0);
      }
      return newMatrix;
    });

    // Ensure parent component is updated
    setTimeout(updateParent, 100);
  };

  // Remove a session
  const handleRemoveSession = (index: number) => {
    if (dates.length <= 2) {
      setError("You must have at least two lab sessions");
      return;
    }

    // Remove the date
    const newDates = dates.filter((_, i) => i !== index);
    setDates(newDates);

    // Remove the column from the score matrix
    const newMatrix = [...scoreMatrix];
    for (let i = 0; i < newMatrix.length; i++) {
      if (newMatrix[i]) {
        newMatrix[i] = newMatrix[i].filter((_, j) => j !== index);
      }
    }
    setScoreMatrix(newMatrix);
  };

  // Handle score change
  const handleScoreChange = (
    studentIndex: number,
    sessionIndex: number,
    value: string
  ) => {
    try {
      // Convert to number
      let numValue = parseInt(value);
      if (isNaN(numValue)) numValue = 0;

      // Ensure value is between 0 and 10
      numValue = Math.max(0, Math.min(10, numValue));

      // Update score matrix
      setScoreMatrix((prevMatrix) => {
        const newMatrix = [...prevMatrix];
        if (!newMatrix[studentIndex])
          newMatrix[studentIndex] = Array(dates.length).fill(0);
        newMatrix[studentIndex][sessionIndex] = numValue;
        return newMatrix;
      });

      // Update parent component with formatted scores
      setTimeout(updateParent, 0);
    } catch (err) {
      console.error("Error updating score:", err);
    }
  };

  // Convert to parent format and update
  const updateParent = () => {
    const formattedScores: { [studentId: string]: LabScore } = {};

    students.forEach((student, studentIndex) => {
      const sessions: LabSession[] = [];

      // Create sessions array
      dates.forEach((date, sessionIndex) => {
        sessions.push({
          date,
          maxMarks: 10,
          obtainedMarks: scoreMatrix[studentIndex]?.[sessionIndex] || 0,
        });
      });

      // Calculate total
      const total = calculateTotal(studentIndex);

      // Create the score object
      formattedScores[student._id] = {
        componentName: "LAB",
        sessions,
        maxMarks: maxMarks,
        totalObtained: total,
      };
    });

    // Update parent
    onScoresChange(formattedScores);
  };

  // Update parent when scores change
  useEffect(() => {
    if (scoreMatrix.length > 0) {
      updateParent();
    }
  }, [scoreMatrix, dates]);

  // Convert number to words
  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num === 0) return "Zero";
    if (num < 20) return ones[num];

    const digit = num % 10;
    return tens[Math.floor(num / 10)] + (digit > 0 ? " " + ones[digit] : "");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">LAB</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSession}
            size="small"
          >
            Add Lab Session
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
        - Faculty enters score under each date (out of 10)
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
        - Out_of_{maxMarks} is the average of all sessions scaled to {maxMarks}{" "}
        marks
      </Typography>

      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>SNo.</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Enrollment No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Semester</TableCell>

              {dates.map((date, index) => (
                <TableCell key={`date-${index}`} align="center">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      type="date"
                      value={date}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      size="small"
                      InputProps={{ sx: { fontSize: "0.875rem" } }}
                    />
                    {dates.length > 2 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveSession(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              ))}

              <TableCell align="center">
                Out_of_{maxMarks} (pass {passingThreshold})
              </TableCell>
              <TableCell>Marks in Words</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, studentIndex) => {
              const total = calculateTotal(studentIndex);
              const isPassing = total >= passingThreshold;

              return (
                <TableRow key={student._id} hover>
                  <TableCell>{studentIndex + 1}</TableCell>
                  <TableCell>{student.academicYear}</TableCell>
                  <TableCell>{student.program}</TableCell>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.semester}</TableCell>

                  {dates.map((_, sessionIndex) => {
                    const value =
                      scoreMatrix[studentIndex]?.[sessionIndex] || 0;

                    return (
                      <TableCell key={`score-${sessionIndex}`} align="center">
                        <TextField
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handleScoreChange(
                              studentIndex,
                              sessionIndex,
                              e.target.value
                            )
                          }
                          inputProps={{
                            min: 0,
                            max: 10,
                            style: { textAlign: "center" },
                          }}
                          size="small"
                          sx={{ width: 60 }}
                        />
                      </TableCell>
                    );
                  })}

                  <TableCell align="center">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color={isPassing ? "success.main" : "error.main"}
                    >
                      {total}
                    </Typography>
                  </TableCell>

                  <TableCell>{numberToWords(total)}</TableCell>
                </TableRow>
              );
            })}

            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={8 + dates.length} align="center">
                  No students enrolled in this course
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LabScoreEntryComponent;

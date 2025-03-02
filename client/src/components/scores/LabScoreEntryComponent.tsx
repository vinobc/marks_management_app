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
//   Button,
//   Alert,
//   IconButton,
// } from "@mui/material";
// import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
// import { Student } from "../../types";

// interface LabSession {
//   date: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// interface LabScore {
//   componentName: string;
//   sessions: LabSession[];
//   maxMarks: number;
//   totalObtained: number;
// }

// interface LabScoreEntryComponentProps {
//   students: Student[];
//   componentName: string;
//   onScoresChange: (scores: { [studentId: string]: LabScore }) => void;
//   initialScores?: { [studentId: string]: LabScore };
// }

// const LabScoreEntryComponent: React.FC<LabScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   const [error, setError] = useState<string | null>(null);
//   const [dates, setDates] = useState<string[]>([
//     new Date().toISOString().split("T")[0],
//     new Date().toISOString().split("T")[0],
//   ]);

//   // Use a simple 2D array for scores [studentIndex][sessionIndex]
//   const [scoreMatrix, setScoreMatrix] = useState<number[][]>([]);

//   // Initialize from props
//   useEffect(() => {
//     // Initialize dates from initialScores if available
//     if (Object.keys(initialScores).length > 0) {
//       const firstStudent = Object.values(initialScores)[0];
//       if (
//         firstStudent &&
//         firstStudent.sessions &&
//         firstStudent.sessions.length > 0
//       ) {
//         setDates(firstStudent.sessions.map((s) => s.date));
//       }
//     }

//     // Initialize score matrix
//     const matrix: number[][] = [];

//     students.forEach((student, studentIndex) => {
//       matrix[studentIndex] = [];

//       // For each date, find the corresponding score or use 0
//       dates.forEach((_, dateIndex) => {
//         const studentScore = initialScores[student._id];
//         const score = studentScore?.sessions?.[dateIndex]?.obtainedMarks || 0;
//         matrix[studentIndex][dateIndex] = score;
//       });
//     });

//     setScoreMatrix(matrix);
//   }, []);

//   // Calculate total (scaled to 30) for a student
//   const calculateTotal = (studentIndex: number): number => {
//     if (!scoreMatrix[studentIndex]) return 0;

//     const scores = scoreMatrix[studentIndex];
//     if (!scores || scores.length === 0) return 0;

//     let sum = 0;
//     let count = 0;

//     for (let i = 0; i < scores.length; i++) {
//       if (scores[i] !== undefined) {
//         sum += scores[i];
//         count++;
//       }
//     }

//     if (count === 0) return 0;

//     // Calculate average and scale to 30
//     const average = sum / count;
//     return Math.round((average / 10) * 30);
//   };

//   // Handle date change
//   const handleDateChange = (index: number, newDate: string) => {
//     const newDates = [...dates];
//     newDates[index] = newDate;
//     setDates(newDates);
//   };

//   // Add a new session
//   const handleAddSession = () => {
//     // Add a new date
//     setDates([...dates, new Date().toISOString().split("T")[0]]);

//     // Add a column of zeros to the score matrix
//     const newMatrix = [...scoreMatrix];
//     for (let i = 0; i < newMatrix.length; i++) {
//       if (!newMatrix[i]) newMatrix[i] = [];
//       newMatrix[i].push(0);
//     }
//     setScoreMatrix(newMatrix);
//   };

//   // Remove a session
//   const handleRemoveSession = (index: number) => {
//     if (dates.length <= 2) {
//       setError("You must have at least two lab sessions");
//       return;
//     }

//     // Remove the date
//     const newDates = dates.filter((_, i) => i !== index);
//     setDates(newDates);

//     // Remove the column from the score matrix
//     const newMatrix = [...scoreMatrix];
//     for (let i = 0; i < newMatrix.length; i++) {
//       if (newMatrix[i]) {
//         newMatrix[i] = newMatrix[i].filter((_, j) => j !== index);
//       }
//     }
//     setScoreMatrix(newMatrix);
//   };

//   // Handle score change
//   const handleScoreChange = (
//     studentIndex: number,
//     sessionIndex: number,
//     value: string
//   ) => {
//     try {
//       // Convert to number
//       let numValue = parseInt(value);
//       if (isNaN(numValue)) numValue = 0;

//       // Ensure value is between 0 and 10
//       numValue = Math.max(0, Math.min(10, numValue));

//       // Update score matrix
//       const newMatrix = [...scoreMatrix];
//       if (!newMatrix[studentIndex]) newMatrix[studentIndex] = [];
//       newMatrix[studentIndex][sessionIndex] = numValue;
//       setScoreMatrix(newMatrix);

//       // Update parent component with formatted scores
//       updateParent();
//     } catch (err) {
//       console.error("Error updating score:", err);
//     }
//   };

//   // Convert to parent format and update
//   const updateParent = () => {
//     const formattedScores: { [studentId: string]: LabScore } = {};

//     students.forEach((student, studentIndex) => {
//       const sessions: LabSession[] = [];

//       // Create sessions array
//       dates.forEach((date, sessionIndex) => {
//         sessions.push({
//           date,
//           maxMarks: 10,
//           obtainedMarks: scoreMatrix[studentIndex]?.[sessionIndex] || 0,
//         });
//       });

//       // Calculate total
//       const total = calculateTotal(studentIndex);

//       // Create the score object
//       formattedScores[student._id] = {
//         componentName: "LAB",
//         sessions,
//         maxMarks: 30,
//         totalObtained: total,
//       };
//     });

//     // Update parent
//     onScoresChange(formattedScores);
//   };

//   // Update parent when scores change
//   useEffect(() => {
//     if (scoreMatrix.length > 0) {
//       updateParent();
//     }
//   }, [scoreMatrix, dates]);

//   // Convert number to words
//   const numberToWords = (num: number): string => {
//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];
//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     if (num === 0) return "Zero";
//     if (num < 20) return ones[num];

//     const digit = num % 10;
//     return tens[Math.floor(num / 10)] + (digit > 0 ? " " + ones[digit] : "");
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">LAB</Typography>
//         </Grid>
//         <Grid
//           item
//           xs={12}
//           sm={6}
//           sx={{ display: "flex", justifyContent: "flex-end" }}
//         >
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={handleAddSession}
//             size="small"
//           >
//             Add Lab Session
//           </Button>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Faculty enters score under each date (out of 10)
//       </Typography>
//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Out_of_30 is the average of all sessions scaled to 30 marks
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

//               {dates.map((date, index) => (
//                 <TableCell key={`date-${index}`} align="center">
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <TextField
//                       type="date"
//                       value={date}
//                       onChange={(e) => handleDateChange(index, e.target.value)}
//                       size="small"
//                       InputProps={{ sx: { fontSize: "0.875rem" } }}
//                     />
//                     {dates.length > 2 && (
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={() => handleRemoveSession(index)}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     )}
//                   </Box>
//                 </TableCell>
//               ))}

//               <TableCell align="center">Out_of_30 (pass 15)</TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student, studentIndex) => {
//               const total = calculateTotal(studentIndex);
//               const isPassing = total >= 15;

//               return (
//                 <TableRow key={student._id} hover>
//                   <TableCell>{studentIndex + 1}</TableCell>
//                   <TableCell>{student.academicYear}</TableCell>
//                   <TableCell>{student.program}</TableCell>
//                   <TableCell>{student.registrationNumber}</TableCell>
//                   <TableCell>{student.name}</TableCell>
//                   <TableCell>{student.semester}</TableCell>

//                   {dates.map((_, sessionIndex) => {
//                     const value =
//                       scoreMatrix[studentIndex]?.[sessionIndex] || 0;

//                     return (
//                       <TableCell key={`score-${sessionIndex}`} align="center">
//                         <TextField
//                           type="number"
//                           value={value}
//                           onChange={(e) =>
//                             handleScoreChange(
//                               studentIndex,
//                               sessionIndex,
//                               e.target.value
//                             )
//                           }
//                           inputProps={{
//                             min: 0,
//                             max: 10,
//                             style: { textAlign: "center" },
//                           }}
//                           size="small"
//                           sx={{ width: 60 }}
//                         />
//                       </TableCell>
//                     );
//                   })}

//                   <TableCell align="center">
//                     <Typography
//                       variant="body1"
//                       fontWeight="bold"
//                       color={isPassing ? "success.main" : "error.main"}
//                     >
//                       {total}
//                     </Typography>
//                   </TableCell>

//                   <TableCell>{numberToWords(total)}</TableCell>
//                 </TableRow>
//               );
//             })}

//             {students.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={8 + dates.length} align="center">
//                   No students enrolled in this course
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default LabScoreEntryComponent;

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
//   Button,
//   Alert,
//   IconButton,
// } from "@mui/material";
// import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
// import { Student } from "../../types";

// interface LabSession {
//   date: string;
//   maxMarks: number;
//   obtainedMarks: number;
// }

// interface LabScore {
//   componentName: string;
//   sessions: LabSession[];
//   maxMarks: number;
//   totalObtained: number;
// }

// interface LabScoreEntryComponentProps {
//   students: Student[];
//   componentName: string;
//   onScoresChange: (scores: { [studentId: string]: LabScore }) => void;
//   initialScores?: { [studentId: string]: LabScore };
// }

// const LabScoreEntryComponent: React.FC<LabScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   const [error, setError] = useState<string | null>(null);
//   const [dates, setDates] = useState<string[]>([
//     new Date().toISOString().split("T")[0],
//     new Date().toISOString().split("T")[0],
//   ]);

//   // Use a simple 2D array for scores [studentIndex][sessionIndex]
//   const [scoreMatrix, setScoreMatrix] = useState<number[][]>([]);

//   // Initialize from props
//   useEffect(() => {
//     // Initialize dates from initialScores if available
//     let initialDates = [...dates];
//     if (Object.keys(initialScores).length > 0) {
//       const firstStudent = Object.values(initialScores)[0];
//       if (
//         firstStudent &&
//         firstStudent.sessions &&
//         firstStudent.sessions.length > 0
//       ) {
//         initialDates = firstStudent.sessions.map((s) => s.date);
//         setDates(initialDates);
//       }
//     }

//     // Initialize score matrix
//     const matrix: number[][] = [];

//     students.forEach((student, studentIndex) => {
//       matrix[studentIndex] = [];

//       // For each date, find the corresponding score or use 0
//       initialDates.forEach((_, dateIndex) => {
//         const studentScore = initialScores[student._id];
//         const score = studentScore?.sessions?.[dateIndex]?.obtainedMarks || 0;
//         matrix[studentIndex][dateIndex] = score;
//       });
//     });

//     setScoreMatrix(matrix);

//     // Initial update to parent
//     setTimeout(() => {
//       const formattedScores: { [studentId: string]: LabScore } = {};

//       students.forEach((student, studentIndex) => {
//         const sessions: LabSession[] = [];

//         // Create sessions array
//         initialDates.forEach((date, sessionIndex) => {
//           sessions.push({
//             date,
//             maxMarks: 10,
//             obtainedMarks: matrix[studentIndex]?.[sessionIndex] || 0,
//           });
//         });

//         formattedScores[student._id] = {
//           componentName: "LAB",
//           sessions,
//           maxMarks: 30,
//           totalObtained: calculateTotal(studentIndex),
//         };
//       });

//       onScoresChange(formattedScores);
//     }, 100);
//   }, []);

//   // Calculate total (scaled to 30) for a student
//   const calculateTotal = (studentIndex: number): number => {
//     if (!scoreMatrix[studentIndex]) return 0;

//     const scores = scoreMatrix[studentIndex];
//     if (!scores || scores.length === 0) return 0;

//     let sum = 0;
//     let count = 0;

//     for (let i = 0; i < scores.length; i++) {
//       if (scores[i] !== undefined) {
//         sum += scores[i];
//         count++;
//       }
//     }

//     if (count === 0) return 0;

//     // Calculate average and scale to 30
//     const average = sum / count;
//     return Math.round((average / 10) * 30);
//   };

//   // Handle date change
//   const handleDateChange = (index: number, newDate: string) => {
//     const newDates = [...dates];
//     newDates[index] = newDate;
//     setDates(newDates);
//   };

//   // Add a new session
//   const handleAddSession = () => {
//     // Add a new date
//     const newDate = new Date().toISOString().split("T")[0];
//     setDates((prevDates) => [...prevDates, newDate]);

//     // Add a column of zeros to the score matrix
//     setScoreMatrix((prevMatrix) => {
//       const newMatrix = [...prevMatrix];
//       for (let i = 0; i < students.length; i++) {
//         if (!newMatrix[i]) newMatrix[i] = [];
//         newMatrix[i].push(0);
//       }
//       return newMatrix;
//     });

//     // Ensure parent component is updated
//     setTimeout(updateParent, 100);
//   };

//   // Remove a session
//   const handleRemoveSession = (index: number) => {
//     if (dates.length <= 2) {
//       setError("You must have at least two lab sessions");
//       return;
//     }

//     // Remove the date
//     const newDates = dates.filter((_, i) => i !== index);
//     setDates(newDates);

//     // Remove the column from the score matrix
//     const newMatrix = [...scoreMatrix];
//     for (let i = 0; i < newMatrix.length; i++) {
//       if (newMatrix[i]) {
//         newMatrix[i] = newMatrix[i].filter((_, j) => j !== index);
//       }
//     }
//     setScoreMatrix(newMatrix);
//   };

//   // Handle score change
//   const handleScoreChange = (
//     studentIndex: number,
//     sessionIndex: number,
//     value: string
//   ) => {
//     try {
//       // Convert to number
//       let numValue = parseInt(value);
//       if (isNaN(numValue)) numValue = 0;

//       // Ensure value is between 0 and 10
//       numValue = Math.max(0, Math.min(10, numValue));

//       // Update score matrix
//       setScoreMatrix((prevMatrix) => {
//         const newMatrix = [...prevMatrix];
//         if (!newMatrix[studentIndex])
//           newMatrix[studentIndex] = Array(dates.length).fill(0);
//         newMatrix[studentIndex][sessionIndex] = numValue;
//         return newMatrix;
//       });

//       // Update parent component with formatted scores
//       setTimeout(updateParent, 0);
//     } catch (err) {
//       console.error("Error updating score:", err);
//     }
//   };

//   // Convert to parent format and update
//   const updateParent = () => {
//     const formattedScores: { [studentId: string]: LabScore } = {};

//     students.forEach((student, studentIndex) => {
//       const sessions: LabSession[] = [];

//       // Create sessions array
//       dates.forEach((date, sessionIndex) => {
//         sessions.push({
//           date,
//           maxMarks: 10,
//           obtainedMarks: scoreMatrix[studentIndex]?.[sessionIndex] || 0,
//         });
//       });

//       // Calculate total
//       const total = calculateTotal(studentIndex);

//       // Create the score object
//       formattedScores[student._id] = {
//         componentName: "LAB",
//         sessions,
//         maxMarks: 30,
//         totalObtained: total,
//       };
//     });

//     console.log("Updating parent with formatted scores:", formattedScores);

//     // Update parent
//     onScoresChange(formattedScores);
//   };

//   // Update parent when scores change
//   useEffect(() => {
//     if (scoreMatrix.length > 0) {
//       updateParent();
//     }
//   }, [scoreMatrix, dates]);

//   // Convert number to words
//   const numberToWords = (num: number): string => {
//     const ones = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];
//     const tens = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     if (num === 0) return "Zero";
//     if (num < 20) return ones[num];

//     const digit = num % 10;
//     return tens[Math.floor(num / 10)] + (digit > 0 ? " " + ones[digit] : "");
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">LAB</Typography>
//         </Grid>
//         <Grid
//           item
//           xs={12}
//           sm={6}
//           sx={{ display: "flex", justifyContent: "flex-end" }}
//         >
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={handleAddSession}
//             size="small"
//           >
//             Add Lab Session
//           </Button>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Faculty enters score under each date (out of 10)
//       </Typography>
//       <Typography variant="body2" sx={{ mb: 2, ml: 2 }}>
//         - Out_of_30 is the average of all sessions scaled to 30 marks
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

//               {dates.map((date, index) => (
//                 <TableCell key={`date-${index}`} align="center">
//                   <Box sx={{ display: "flex", alignItems: "center" }}>
//                     <TextField
//                       type="date"
//                       value={date}
//                       onChange={(e) => handleDateChange(index, e.target.value)}
//                       size="small"
//                       InputProps={{ sx: { fontSize: "0.875rem" } }}
//                     />
//                     {dates.length > 2 && (
//                       <IconButton
//                         size="small"
//                         color="error"
//                         onClick={() => handleRemoveSession(index)}
//                       >
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     )}
//                   </Box>
//                 </TableCell>
//               ))}

//               <TableCell align="center">Out_of_30 (pass 15)</TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student, studentIndex) => {
//               const total = calculateTotal(studentIndex);
//               const isPassing = total >= 15;

//               return (
//                 <TableRow key={student._id} hover>
//                   <TableCell>{studentIndex + 1}</TableCell>
//                   <TableCell>{student.academicYear}</TableCell>
//                   <TableCell>{student.program}</TableCell>
//                   <TableCell>{student.registrationNumber}</TableCell>
//                   <TableCell>{student.name}</TableCell>
//                   <TableCell>{student.semester}</TableCell>

//                   {dates.map((_, sessionIndex) => {
//                     const value =
//                       scoreMatrix[studentIndex]?.[sessionIndex] || 0;

//                     return (
//                       <TableCell key={`score-${sessionIndex}`} align="center">
//                         <TextField
//                           type="number"
//                           value={value}
//                           onChange={(e) =>
//                             handleScoreChange(
//                               studentIndex,
//                               sessionIndex,
//                               e.target.value
//                             )
//                           }
//                           inputProps={{
//                             min: 0,
//                             max: 10,
//                             style: { textAlign: "center" },
//                           }}
//                           size="small"
//                           sx={{ width: 60 }}
//                         />
//                       </TableCell>
//                     );
//                   })}

//                   <TableCell align="center">
//                     <Typography
//                       variant="body1"
//                       fontWeight="bold"
//                       color={isPassing ? "success.main" : "error.main"}
//                     >
//                       {total}
//                     </Typography>
//                   </TableCell>

//                   <TableCell>{numberToWords(total)}</TableCell>
//                 </TableRow>
//               );
//             })}

//             {students.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={8 + dates.length} align="center">
//                   No students enrolled in this course
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default LabScoreEntryComponent;

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
  const passingMarks = scaleConfig.passingMarks;

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

  // Convert number to words function
  const numberToWords = (num: number): string => {
    // Convert the number to a string to handle each digit
    const numStr = num.toString();
    const digits = numStr.split("");

    // Map each digit to its word representation
    const words = digits.map((digit) => {
      switch (digit) {
        case "0":
          return "ZERO";
        case "1":
          return "ONE";
        case "2":
          return "TWO";
        case "3":
          return "THREE";
        case "4":
          return "FOUR";
        case "5":
          return "FIVE";
        case "6":
          return "SIX";
        case "7":
          return "SEVEN";
        case "8":
          return "EIGHT";
        case "9":
          return "NINE";
        default:
          return "";
      }
    });

    // Join with spaces
    return words.join(" ");
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
              <TableCell>Academic_Year</TableCell>
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
                Out_of_{maxMarks} (pass {passingMarks})
              </TableCell>
              <TableCell>Marks in Words</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, studentIndex) => {
              const total = calculateTotal(studentIndex);
              const isPassing = total >= passingMarks;

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

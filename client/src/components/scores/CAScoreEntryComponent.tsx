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
// // } from "@mui/material";
// // import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// // import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// // import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// // interface Student {
// //   id: string;
// //   _id?: string;
// //   registrationNumber: string;
// //   name: string;
// //   program: string;
// //   semester: number;
// //   academicYear: string;
// // }

// // interface QuestionScores {
// //   a: number;
// //   b: number;
// //   c: number;
// //   d: number;
// //   total: number;
// // }

// // interface StudentScores {
// //   I: QuestionScores;
// //   II: QuestionScores;
// //   III: QuestionScores;
// //   IV: QuestionScores;
// //   V: QuestionScores;
// //   outOf50: number;
// //   outOf20: number;
// // }

// // interface StudentScoreMap {
// //   [studentId: string]: StudentScores;
// // }

// // interface CAScoreEntryComponentProps {
// //   students: Student[];
// //   componentName: string; // e.g., "CA1", "CA2"
// //   onScoresChange: (scores: any) => void;
// //   initialScores?: any;
// // }

// // // Max marks for each question part
// // const DEFAULT_MAX_MARKS = {
// //   I: { a: 3, b: 3, c: 2, d: 2 },
// //   II: { a: 4, b: 4, c: 1, d: 1 },
// //   III: { a: 3, b: 3, c: 2, d: 2 },
// //   IV: { a: 3, b: 2, c: 3, d: 2 },
// //   V: { a: 4, b: 3, c: 2, d: 1 },
// // };

// // // Function to convert number to words
// // const numberToWords = (num: number): string => {
// //   const units = [
// //     "Zero",
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

// //   if (num < 0) return "Negative " + numberToWords(Math.abs(num));
// //   if (num < 20) return units[num];
// //   if (num < 100) {
// //     return (
// //       tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "")
// //     );
// //   }

// //   // For simplicity we're only handling up to 99, but you can extend this
// //   return "Number too large";
// // };

// // const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
// //   students,
// //   componentName,
// //   onScoresChange,
// //   initialScores,
// // }) => {
// //   const [testDate, setTestDate] = useState<Date | null>(new Date());
// //   const [studentScores, setStudentScores] = useState<StudentScoreMap>({});

// //   // Initialize scores with default values
// //   useEffect(() => {
// //     const initialStudentScores: StudentScoreMap = {};

// //     students.forEach((student) => {
// //       // Check if we have initial scores for this student
// //       if (initialScores && initialScores[student.id]) {
// //         initialStudentScores[student.id] = initialScores[student.id];
// //       } else {
// //         // Create default score structure for each student
// //         initialStudentScores[student.id] = {
// //           I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //           II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //           III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //           IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //           V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //           outOf50: 0,
// //           outOf20: 0,
// //         };
// //       }
// //     });

// //     setStudentScores(initialStudentScores);
// //   }, [students, initialScores]);

// //   // Handle score change for a specific question part
// //   const handleScoreChange = (
// //     studentId: string,
// //     questionNum: "I" | "II" | "III" | "IV" | "V",
// //     part: "a" | "b" | "c" | "d",
// //     value: number
// //   ) => {
// //     // Make sure value is a number between 0 and the max for this part
// //     const maxValue = DEFAULT_MAX_MARKS[questionNum][part];
// //     const validValue = Math.max(0, Math.min(maxValue, value));

// //     setStudentScores((prev) => {
// //       const updatedScores = { ...prev };

// //       // Update the specific part score
// //       updatedScores[studentId][questionNum][part] = validValue;

// //       // Recalculate the question total
// //       updatedScores[studentId][questionNum].total =
// //         updatedScores[studentId][questionNum].a +
// //         updatedScores[studentId][questionNum].b +
// //         updatedScores[studentId][questionNum].c +
// //         updatedScores[studentId][questionNum].d;

// //       // Recalculate Out_of_50
// //       updatedScores[studentId].outOf50 =
// //         updatedScores[studentId].I.total +
// //         updatedScores[studentId].II.total +
// //         updatedScores[studentId].III.total +
// //         updatedScores[studentId].IV.total +
// //         updatedScores[studentId].V.total;

// //       // Recalculate Out_of_20 (converting from 50 to 20)
// //       updatedScores[studentId].outOf20 = Math.round(
// //         (updatedScores[studentId].outOf50 * 20) / 50
// //       );

// //       // Notify parent component about score changes
// //       onScoresChange(updatedScores);

// //       return updatedScores;
// //     });
// //   };

// //   return (
// //     <Box sx={{ width: "100%", overflow: "auto" }}>
// //       <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
// //         <Grid item xs={12} sm={6} md={4}>
// //           <Typography variant="h6">{componentName} Score Entry</Typography>
// //         </Grid>
// //         <Grid item xs={12} sm={6} md={4}>
// //           <LocalizationProvider dateAdapter={AdapterDateFns}>
// //             <DatePicker
// //               label="Test Date"
// //               value={testDate}
// //               onChange={(newDate) => setTestDate(newDate)}
// //               format="dd/MM/yyyy"
// //             />
// //           </LocalizationProvider>
// //         </Grid>
// //       </Grid>

// //       <TableContainer
// //         component={Paper}
// //         sx={{ maxWidth: "100%", overflowX: "auto" }}
// //       >
// //         <Table size="small" sx={{ minWidth: 1200 }}>
// //           <TableHead>
// //             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
// //               <TableCell align="center" rowSpan={2}>
// //                 SNo.
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Academic Year
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Program
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Enrollment No.
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Name
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Semester
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Q.No.
// //               </TableCell>
// //               <TableCell align="center" colSpan={4}>
// //                 Parts
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Total
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Out of 50
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Out of 20 (pass 8)
// //               </TableCell>
// //               <TableCell align="center" rowSpan={2}>
// //                 Marks in Words
// //               </TableCell>
// //             </TableRow>
// //             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
// //               <TableCell align="center" width="60px">
// //                 a
// //               </TableCell>
// //               <TableCell align="center" width="60px">
// //                 b
// //               </TableCell>
// //               <TableCell align="center" width="60px">
// //                 c
// //               </TableCell>
// //               <TableCell align="center" width="60px">
// //                 d
// //               </TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {students.map((student, index) => {
// //               // Get scores for this student
// //               const scores = studentScores[student.id] || {
// //                 I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                 II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                 III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                 IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                 V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
// //                 outOf50: 0,
// //                 outOf20: 0,
// //               };

// //               // Generate rows for questions I-V
// //               const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
// //                 "I",
// //                 "II",
// //                 "III",
// //                 "IV",
// //                 "V",
// //               ];

// //               return questions.map((question, qIndex) => (
// //                 <TableRow
// //                   key={`${student.id}-${question}`}
// //                   sx={{
// //                     backgroundColor: qIndex === 0 ? "#f8f9fa" : "inherit",
// //                     "&:hover": { backgroundColor: "#f0f0f0" },
// //                   }}
// //                 >
// //                   {/* Only show student info in the first question row */}
// //                   {qIndex === 0 && (
// //                     <>
// //                       <TableCell align="center" rowSpan={5}>
// //                         {index + 1}
// //                       </TableCell>
// //                       <TableCell align="center" rowSpan={5}>
// //                         {student.academicYear}
// //                       </TableCell>
// //                       <TableCell align="center" rowSpan={5}>
// //                         {student.program}
// //                       </TableCell>
// //                       <TableCell align="center" rowSpan={5}>
// //                         {student.registrationNumber}
// //                       </TableCell>
// //                       <TableCell align="center" rowSpan={5}>
// //                         {student.name}
// //                       </TableCell>
// //                       <TableCell align="center" rowSpan={5}>
// //                         {student.semester}
// //                       </TableCell>
// //                     </>
// //                   )}
// //                   <TableCell align="center">{question}</TableCell>

// //                   {/* Score input cells */}
// //                   <TableCell align="center">
// //                     <TextField
// //                       type="number"
// //                       size="small"
// //                       value={scores[question].a}
// //                       onChange={(e) =>
// //                         handleScoreChange(
// //                           student.id,
// //                           question,
// //                           "a",
// //                           Number(e.target.value)
// //                         )
// //                       }
// //                       inputProps={{
// //                         min: 0,
// //                         max: DEFAULT_MAX_MARKS[question].a,
// //                         style: { textAlign: "center", width: "40px" },
// //                       }}
// //                     />
// //                   </TableCell>
// //                   <TableCell align="center">
// //                     <TextField
// //                       type="number"
// //                       size="small"
// //                       value={scores[question].b}
// //                       onChange={(e) =>
// //                         handleScoreChange(
// //                           student.id,
// //                           question,
// //                           "b",
// //                           Number(e.target.value)
// //                         )
// //                       }
// //                       inputProps={{
// //                         min: 0,
// //                         max: DEFAULT_MAX_MARKS[question].b,
// //                         style: { textAlign: "center", width: "40px" },
// //                       }}
// //                     />
// //                   </TableCell>
// //                   <TableCell align="center">
// //                     <TextField
// //                       type="number"
// //                       size="small"
// //                       value={scores[question].c}
// //                       onChange={(e) =>
// //                         handleScoreChange(
// //                           student.id,
// //                           question,
// //                           "c",
// //                           Number(e.target.value)
// //                         )
// //                       }
// //                       inputProps={{
// //                         min: 0,
// //                         max: DEFAULT_MAX_MARKS[question].c,
// //                         style: { textAlign: "center", width: "40px" },
// //                       }}
// //                     />
// //                   </TableCell>
// //                   <TableCell align="center">
// //                     <TextField
// //                       type="number"
// //                       size="small"
// //                       value={scores[question].d}
// //                       onChange={(e) =>
// //                         handleScoreChange(
// //                           student.id,
// //                           question,
// //                           "d",
// //                           Number(e.target.value)
// //                         )
// //                       }
// //                       inputProps={{
// //                         min: 0,
// //                         max: DEFAULT_MAX_MARKS[question].d,
// //                         style: { textAlign: "center", width: "40px" },
// //                       }}
// //                     />
// //                   </TableCell>
// //                   <TableCell align="center">{scores[question].total}</TableCell>

// //                   {/* Only show total scores in the last question row */}
// //                   {qIndex === 4 && (
// //                     <>
// //                       <TableCell align="center" rowSpan={5}>
// //                         {scores.outOf50}
// //                       </TableCell>
// //                       <TableCell
// //                         align="center"
// //                         rowSpan={5}
// //                         sx={{
// //                           color: scores.outOf20 >= 8 ? "green" : "red",
// //                           fontWeight: "bold",
// //                         }}
// //                       >
// //                         {scores.outOf20}
// //                       </TableCell>
// //                       <TableCell align="center" rowSpan={5}>
// //                         {numberToWords(scores.outOf20)}
// //                       </TableCell>
// //                     </>
// //                   )}
// //                 </TableRow>
// //               ));
// //             })}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>
// //     </Box>
// //   );
// // };

// // export default CAScoreEntryComponent;

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
//   Tooltip,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Student } from "../types";

// interface QuestionPart {
//   part: string; // 'a', 'b', 'c', etc.
//   maxMarks: number;
//   obtainedMarks: number;
// }

// interface Question {
//   number: string; // 'I', 'II', 'III', etc.
//   parts: QuestionPart[];
//   totalMarks: number;
// }

// interface StudentScores {
//   questions: Question[];
//   outOf50: number;
//   outOf20: number;
// }

// interface DetailedScores {
//   [studentId: string]: StudentScores;
// }

// interface CAScoreEntryComponentProps {
//   students: Student[];
//   componentName: string; // e.g., "CA1", "CA2", "CA3"
//   onScoresChange: (scores: DetailedScores) => void;
//   initialScores?: DetailedScores;
// }

// // Define question structure with default max marks
// const DEFAULT_QUESTION_STRUCTURE = [
//   {
//     number: "I",
//     parts: [
//       { part: "a", maxMarks: 3, obtainedMarks: 0 },
//       { part: "b", maxMarks: 3, obtainedMarks: 0 },
//       { part: "c", maxMarks: 2, obtainedMarks: 0 },
//       { part: "d", maxMarks: 2, obtainedMarks: 0 },
//     ],
//     totalMarks: 0,
//   },
//   {
//     number: "II",
//     parts: [
//       { part: "a", maxMarks: 4, obtainedMarks: 0 },
//       { part: "b", maxMarks: 4, obtainedMarks: 0 },
//       { part: "c", maxMarks: 1, obtainedMarks: 0 },
//       { part: "d", maxMarks: 1, obtainedMarks: 0 },
//     ],
//     totalMarks: 0,
//   },
//   {
//     number: "III",
//     parts: [
//       { part: "a", maxMarks: 3, obtainedMarks: 0 },
//       { part: "b", maxMarks: 3, obtainedMarks: 0 },
//       { part: "c", maxMarks: 2, obtainedMarks: 0 },
//       { part: "d", maxMarks: 2, obtainedMarks: 0 },
//     ],
//     totalMarks: 0,
//   },
//   {
//     number: "IV",
//     parts: [
//       { part: "a", maxMarks: 3, obtainedMarks: 0 },
//       { part: "b", maxMarks: 2, obtainedMarks: 0 },
//       { part: "c", maxMarks: 3, obtainedMarks: 0 },
//       { part: "d", maxMarks: 2, obtainedMarks: 0 },
//     ],
//     totalMarks: 0,
//   },
//   {
//     number: "V",
//     parts: [
//       { part: "a", maxMarks: 4, obtainedMarks: 0 },
//       { part: "b", maxMarks: 3, obtainedMarks: 0 },
//       { part: "c", maxMarks: 2, obtainedMarks: 0 },
//       { part: "d", maxMarks: 1, obtainedMarks: 0 },
//     ],
//     totalMarks: 0,
//   },
// ];

// // Function to convert number to words
// const numberToWords = (num: number): string => {
//   if (num === 0) return "Zero";

//   const units = [
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

//   if (num < 20) return units[num];

//   const digit = num % 10;
//   return tens[Math.floor(num / 10)] + (digit > 0 ? ` ${units[digit]}` : "");
// };

// const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   onScoresChange,
//   initialScores,
// }) => {
//   const [testDate, setTestDate] = useState<Date | null>(new Date());
//   const [scores, setScores] = useState<DetailedScores>({});

//   // Initialize student scores
//   useEffect(() => {
//     if (initialScores) {
//       setScores(initialScores);
//     } else {
//       const newScores: DetailedScores = {};

//       students.forEach((student) => {
//         // Deep clone the default structure
//         const questionStructure = JSON.parse(
//           JSON.stringify(DEFAULT_QUESTION_STRUCTURE)
//         );

//         newScores[student._id] = {
//           questions: questionStructure,
//           outOf50: 0,
//           outOf20: 0,
//         };
//       });

//       setScores(newScores);
//     }
//   }, [students, initialScores]);

//   // Handle score change for a specific question part
//   const handleScoreChange = (
//     studentId: string,
//     questionIndex: number,
//     partIndex: number,
//     value: number
//   ) => {
//     setScores((prevScores) => {
//       const updatedScores = { ...prevScores };

//       if (!updatedScores[studentId]) {
//         // If student doesn't exist in scores, initialize their structure
//         const questionStructure = JSON.parse(
//           JSON.stringify(DEFAULT_QUESTION_STRUCTURE)
//         );
//         updatedScores[studentId] = {
//           questions: questionStructure,
//           outOf50: 0,
//           outOf20: 0,
//         };
//       }

//       // Ensure value is within bounds
//       const maxMarks =
//         updatedScores[studentId].questions[questionIndex].parts[partIndex]
//           .maxMarks;
//       const validValue = Math.max(0, Math.min(maxMarks, value));

//       // Update the specific part score
//       updatedScores[studentId].questions[questionIndex].parts[
//         partIndex
//       ].obtainedMarks = validValue;

//       // Recalculate question total
//       updatedScores[studentId].questions[questionIndex].totalMarks =
//         updatedScores[studentId].questions[questionIndex].parts.reduce(
//           (sum, part) => sum + part.obtainedMarks,
//           0
//         );

//       // Recalculate out of 50
//       updatedScores[studentId].outOf50 = updatedScores[
//         studentId
//       ].questions.reduce((sum, q) => sum + q.totalMarks, 0);

//       // Scale to out of 20
//       updatedScores[studentId].outOf20 = Math.round(
//         (updatedScores[studentId].outOf50 * 20) / 50
//       );

//       // Notify parent component
//       onScoresChange(updatedScores);

//       return updatedScores;
//     });
//   };

//   return (
//     <Box sx={{ width: "100%", overflow: "auto" }}>
//       <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
//         <Grid item xs={12} sm={6} md={4}>
//           <Typography variant="h6">{componentName} Score Entry</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Test Date"
//               value={testDate}
//               onChange={(newDate) => setTestDate(newDate)}
//             />
//           </LocalizationProvider>
//         </Grid>
//       </Grid>

//       <TableContainer
//         component={Paper}
//         sx={{ maxWidth: "100%", overflowX: "auto" }}
//       >
//         <Table size="small" sx={{ minWidth: 1200 }}>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableCell align="center" rowSpan={2}>
//                 SNo.
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Academic Year
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Program
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Enrollment No.
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Name
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Semester
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Q.No.
//               </TableCell>
//               <TableCell align="center" colSpan={4}>
//                 Parts
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Total
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Out of 50
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Out of 20 (pass 8)
//               </TableCell>
//               <TableCell align="center" rowSpan={2}>
//                 Marks in Words
//               </TableCell>
//             </TableRow>
//             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableCell align="center" width="60px">
//                 a
//               </TableCell>
//               <TableCell align="center" width="60px">
//                 b
//               </TableCell>
//               <TableCell align="center" width="60px">
//                 c
//               </TableCell>
//               <TableCell align="center" width="60px">
//                 d
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student, studentIndex) => {
//               const studentScores = scores[student._id] || {
//                 questions: DEFAULT_QUESTION_STRUCTURE,
//                 outOf50: 0,
//                 outOf20: 0,
//               };

//               return DEFAULT_QUESTION_STRUCTURE.map(
//                 (question, questionIndex) => (
//                   <TableRow key={`${student._id}-${question.number}`}>
//                     {/* Student info only in first row */}
//                     {questionIndex === 0 && (
//                       <>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                         >
//                           {studentIndex + 1}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                         >
//                           {student.academicYear}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                         >
//                           {student.program}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                         >
//                           {student.registrationNumber}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                         >
//                           {student.name}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                         >
//                           {student.semester}
//                         </TableCell>
//                       </>
//                     )}

//                     <TableCell align="center">{question.number}</TableCell>

//                     {/* Part scores */}
//                     {question.parts.map((part, partIndex) => (
//                       <TableCell
//                         key={`${student._id}-${question.number}-${part.part}`}
//                         align="center"
//                       >
//                         <Tooltip
//                           title={`Max: ${part.maxMarks}`}
//                           placement="top"
//                         >
//                           <TextField
//                             type="number"
//                             size="small"
//                             value={
//                               studentScores.questions[questionIndex]?.parts?.[
//                                 partIndex
//                               ]?.obtainedMarks || 0
//                             }
//                             onChange={(e) =>
//                               handleScoreChange(
//                                 student._id,
//                                 questionIndex,
//                                 partIndex,
//                                 Number(e.target.value)
//                               )
//                             }
//                             inputProps={{
//                               min: 0,
//                               max: part.maxMarks,
//                               style: { textAlign: "center", width: "40px" },
//                             }}
//                           />
//                         </Tooltip>
//                       </TableCell>
//                     ))}

//                     {/* Question total */}
//                     <TableCell align="center">
//                       {studentScores.questions[questionIndex]?.totalMarks || 0}
//                     </TableCell>

//                     {/* Course totals in last question row */}
//                     {questionIndex ===
//                       DEFAULT_QUESTION_STRUCTURE.length - 1 && (
//                       <>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                         >
//                           {studentScores.outOf50}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                           sx={{
//                             color: studentScores.outOf20 >= 8 ? "green" : "red",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {studentScores.outOf20}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={DEFAULT_QUESTION_STRUCTURE.length}
//                         >
//                           {numberToWords(studentScores.outOf20)}
//                         </TableCell>
//                       </>
//                     )}
//                   </TableRow>
//                 )
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default CAScoreEntryComponent;

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
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Student } from "../../types";

interface DetailedScore {
  [studentId: string]: {
    I: { a: number; b: number; c: number; d: number; total: number };
    II: { a: number; b: number; c: number; d: number; total: number };
    III: { a: number; b: number; c: number; d: number; total: number };
    IV: { a: number; b: number; c: number; d: number; total: number };
    V: { a: number; b: number; c: number; d: number; total: number };
    outOf50: number;
    outOf20: number;
  };
}

interface CAScoreEntryComponentProps {
  students: Student[];
  componentName: string; // e.g., "CA1", "CA2", "CA3"
  onScoresChange: (scores: DetailedScore) => void;
  initialScores?: DetailedScore;
}

// Convert number to words function
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

  if (num < 100) {
    return (
      tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
    );
  }

  return "Number too large";
};

const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
  students,
  componentName,
  onScoresChange,
  initialScores = {},
}) => {
  const [testDate, setTestDate] = useState<Date | null>(new Date());
  const [scores, setScores] = useState<DetailedScore>(initialScores);
  const [error, setError] = useState<string | null>(null);

  // Initialize student scores if none provided
  useEffect(() => {
    if (Object.keys(initialScores).length > 0) {
      setScores(initialScores);
    } else {
      const newScores: DetailedScore = {};

      students.forEach((student) => {
        newScores[student._id] = {
          I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          outOf50: 0,
          outOf20: 0,
        };
      });

      setScores(newScores);
    }
  }, [students, initialScores]);

  // Handle score change for a specific question part
  const handleScoreChange = (
    studentId: string,
    question: "I" | "II" | "III" | "IV" | "V",
    part: "a" | "b" | "c" | "d",
    value: number
  ) => {
    try {
      // Validate input value
      const numValue = Number(value);

      if (isNaN(numValue) || numValue < 0) {
        setError("Please enter a valid positive number");
        return;
      }

      setScores((prev) => {
        // Make deep copies to avoid mutation issues
        const studentScores = { ...prev[studentId] } || {
          I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
          outOf50: 0,
          outOf20: 0,
        };

        // Update the specific question part score
        studentScores[question] = {
          ...studentScores[question],
          [part]: numValue,
        };

        // Recalculate the total for this question
        studentScores[question].total =
          studentScores[question].a +
          studentScores[question].b +
          studentScores[question].c +
          studentScores[question].d;

        // Calculate the total out of 50
        studentScores.outOf50 =
          studentScores.I.total +
          studentScores.II.total +
          studentScores.III.total +
          studentScores.IV.total +
          studentScores.V.total;

        // Convert to out of 20
        studentScores.outOf20 = Math.round((studentScores.outOf50 * 20) / 50);

        // Create a new scores object
        const newScores = { ...prev, [studentId]: studentScores };

        // Notify parent component
        onScoresChange(newScores);

        return newScores;
      });

      setError(null);
    } catch (err) {
      console.error("Error updating score:", err);
      setError("Failed to update score");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{componentName} Score Entry</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Test Date"
              value={testDate}
              onChange={(newDate) => setTestDate(newDate)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", width: "100%" }}
      >
        <Table size="small" sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Enrollment No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Q.No.</TableCell>
              <TableCell align="center">a</TableCell>
              <TableCell align="center">b</TableCell>
              <TableCell align="center">c</TableCell>
              <TableCell align="center">d</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Out of 50</TableCell>
              <TableCell align="center">Out of 20 (pass 8)</TableCell>
              <TableCell>Marks in Words</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, studentIndex) => {
              // Generate rows for each question (I, II, III, IV, V)
              const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
                "I",
                "II",
                "III",
                "IV",
                "V",
              ];

              return questions.map((questionNo, questionIndex) => {
                const studentScore = scores[student._id] || {
                  I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
                  outOf50: 0,
                  outOf20: 0,
                };

                return (
                  <TableRow key={`${student._id}-${questionNo}`}>
                    {/* Student information - only shown in the first row for each student */}
                    {questionIndex === 0 && (
                      <>
                        <TableCell rowSpan={5}>{studentIndex + 1}</TableCell>
                        <TableCell rowSpan={5}>
                          {student.academicYear}
                        </TableCell>
                        <TableCell rowSpan={5}>{student.program}</TableCell>
                        <TableCell rowSpan={5}>
                          {student.registrationNumber}
                        </TableCell>
                        <TableCell rowSpan={5}>{student.name}</TableCell>
                        <TableCell rowSpan={5}>{student.semester}</TableCell>
                      </>
                    )}

                    {/* Question number */}
                    <TableCell>{questionNo}</TableCell>

                    {/* Score input cells for each part */}
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={studentScore[questionNo].a}
                        onChange={(e) =>
                          handleScoreChange(
                            student._id,
                            questionNo,
                            "a",
                            Number(e.target.value)
                          )
                        }
                        inputProps={{
                          min: 0,
                          style: { textAlign: "center" },
                        }}
                        size="small"
                        sx={{ width: 60 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={studentScore[questionNo].b}
                        onChange={(e) =>
                          handleScoreChange(
                            student._id,
                            questionNo,
                            "b",
                            Number(e.target.value)
                          )
                        }
                        inputProps={{
                          min: 0,
                          style: { textAlign: "center" },
                        }}
                        size="small"
                        sx={{ width: 60 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={studentScore[questionNo].c}
                        onChange={(e) =>
                          handleScoreChange(
                            student._id,
                            questionNo,
                            "c",
                            Number(e.target.value)
                          )
                        }
                        inputProps={{
                          min: 0,
                          style: { textAlign: "center" },
                        }}
                        size="small"
                        sx={{ width: 60 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={studentScore[questionNo].d}
                        onChange={(e) =>
                          handleScoreChange(
                            student._id,
                            questionNo,
                            "d",
                            Number(e.target.value)
                          )
                        }
                        inputProps={{
                          min: 0,
                          style: { textAlign: "center" },
                        }}
                        size="small"
                        sx={{ width: 60 }}
                      />
                    </TableCell>

                    {/* Question total */}
                    <TableCell align="center">
                      {studentScore[questionNo].total}
                    </TableCell>

                    {/* Total scores - only shown in the last row for each student */}
                    {questionIndex === 4 && (
                      <>
                        <TableCell align="center" rowSpan={5}>
                          {studentScore.outOf50}
                        </TableCell>
                        <TableCell
                          align="center"
                          rowSpan={5}
                          sx={{
                            color: studentScore.outOf20 >= 8 ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {studentScore.outOf20}
                        </TableCell>
                        <TableCell rowSpan={5}>
                          {numberToWords(studentScore.outOf20)}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              });
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CAScoreEntryComponent;

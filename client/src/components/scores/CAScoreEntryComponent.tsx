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
//   FormControl,
//   InputLabel,
//   Alert,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Student } from "../../types";

// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number;
//   };
// }

// interface CAScoreEntryComponentProps {
//   students: Student[];
//   componentName: string; // e.g., "CA1", "CA2", "CA3"
//   onScoresChange: (scores: DetailedScore) => void;
//   initialScores?: DetailedScore;
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

// const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   const [testDate, setTestDate] = useState<Date | null>(new Date());
//   const [scores, setScores] = useState<DetailedScore>(initialScores);
//   const [error, setError] = useState<string | null>(null);

//   // Initialize student scores if none provided
//   useEffect(() => {
//     if (Object.keys(initialScores).length > 0) {
//       setScores(initialScores);
//     } else {
//       const newScores: DetailedScore = {};

//       students.forEach((student) => {
//         newScores[student._id] = {
//           I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
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
//     question: "I" | "II" | "III" | "IV" | "V",
//     part: "a" | "b" | "c" | "d",
//     value: number
//   ) => {
//     try {
//       // Validate input value
//       const numValue = Number(value);

//       if (isNaN(numValue) || numValue < 0) {
//         setError("Please enter a valid positive number");
//         return;
//       }

//       setScores((prev) => {
//         // Make deep copies to avoid mutation issues
//         const studentScores = { ...prev[studentId] } || {
//           I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           outOf50: 0,
//           outOf20: 0,
//         };

//         // Update the specific question part score
//         studentScores[question] = {
//           ...studentScores[question],
//           [part]: numValue,
//         };

//         // Recalculate the total for this question
//         studentScores[question].total =
//           studentScores[question].a +
//           studentScores[question].b +
//           studentScores[question].c +
//           studentScores[question].d;

//         // Calculate the total out of 50
//         studentScores.outOf50 =
//           studentScores.I.total +
//           studentScores.II.total +
//           studentScores.III.total +
//           studentScores.IV.total +
//           studentScores.V.total;

//         // Convert to out of 20
//         studentScores.outOf20 = Math.round((studentScores.outOf50 * 20) / 50);

//         // Create a new scores object
//         const newScores = { ...prev, [studentId]: studentScores };

//         // Notify parent component
//         onScoresChange(newScores);

//         return newScores;
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error updating score:", err);
//       setError("Failed to update score");
//     }
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">{componentName} Score Entry</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Test Date"
//               value={testDate}
//               onChange={(newDate) => setTestDate(newDate)}
//             />
//           </LocalizationProvider>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <TableContainer
//         component={Paper}
//         sx={{ overflowX: "auto", width: "100%" }}
//       >
//         <Table size="small" sx={{ minWidth: 1200 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>Enrollment No.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>
//               <TableCell>Q.No.</TableCell>
//               <TableCell align="center">a</TableCell>
//               <TableCell align="center">b</TableCell>
//               <TableCell align="center">c</TableCell>
//               <TableCell align="center">d</TableCell>
//               <TableCell align="center">Total</TableCell>
//               <TableCell align="center">Out of 50</TableCell>
//               <TableCell align="center">Out of 20 (pass 8)</TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student, studentIndex) => {
//               // Generate rows for each question (I, II, III, IV, V)
//               const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
//                 "I",
//                 "II",
//                 "III",
//                 "IV",
//                 "V",
//               ];

//               return questions.map((questionNo, questionIndex) => {
//                 const studentScore = scores[student._id] || {
//                   I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   outOf50: 0,
//                   outOf20: 0,
//                 };

//                 return (
//                   <TableRow key={`${student._id}-${questionNo}`}>
//                     {/* Student information - only shown in the first row for each student */}
//                     {questionIndex === 0 && (
//                       <>
//                         <TableCell rowSpan={5}>{studentIndex + 1}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.academicYear}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.program}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.registrationNumber}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.name}</TableCell>
//                         <TableCell rowSpan={5}>{student.semester}</TableCell>
//                       </>
//                     )}

//                     {/* Question number */}
//                     <TableCell>{questionNo}</TableCell>

//                     {/* Score input cells for each part */}
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].a}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "a",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].b}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "b",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].c}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "c",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].d}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "d",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>

//                     {/* Question total */}
//                     <TableCell align="center">
//                       {studentScore[questionNo].total}
//                     </TableCell>

//                     {/* Total scores - only shown in the last row for each student */}
//                     {questionIndex === 4 && (
//                       <>
//                         <TableCell align="center" rowSpan={5}>
//                           {studentScore.outOf50}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={5}
//                           sx={{
//                             color: studentScore.outOf20 >= 8 ? "green" : "red",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {studentScore.outOf20}
//                         </TableCell>
//                         <TableCell rowSpan={5}>
//                           {numberToWords(studentScore.outOf20)}
//                         </TableCell>
//                       </>
//                     )}
//                   </TableRow>
//                 );
//               });
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default CAScoreEntryComponent;

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
//   FormControl,
//   InputLabel,
//   Alert,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Student, Course, CourseType } from "../../types";
// import { getComponentScale, convertCAScore } from "../../utils/scoreUtils";

// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number; // This will be renamed to outOfX based on course type
//   };
// }

// interface CAScoreEntryComponentProps {
//   students: Student[];
//   componentName: string; // e.g., "CA1", "CA2", "CA3"
//   courseType: CourseType; // Add course type to props
//   onScoresChange: (scores: DetailedScore) => void;
//   initialScores?: DetailedScore;
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

// const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   courseType,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   const [testDate, setTestDate] = useState<Date | null>(new Date());
//   const [scores, setScores] = useState<DetailedScore>(initialScores);
//   const [error, setError] = useState<string | null>(null);

//   // Get scale configuration based on course type
//   const scaleConfig = getComponentScale(courseType, componentName);
//   const maxMarks = scaleConfig.maxMarks;
//   const passingMarks = scaleConfig.passingMarks;
//   const conversionFactor = scaleConfig.conversionFactor || 0.4; // Default to 0.4 if not specified

//   // Initialize student scores if none provided
//   useEffect(() => {
//     if (Object.keys(initialScores).length > 0) {
//       setScores(initialScores);
//     } else {
//       const newScores: DetailedScore = {};

//       students.forEach((student) => {
//         newScores[student._id] = {
//           I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
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
//     question: "I" | "II" | "III" | "IV" | "V",
//     part: "a" | "b" | "c" | "d",
//     value: number
//   ) => {
//     try {
//       // Validate input value
//       const numValue = Number(value);

//       if (isNaN(numValue) || numValue < 0) {
//         setError("Please enter a valid positive number");
//         return;
//       }

//       setScores((prev) => {
//         // Make deep copies to avoid mutation issues
//         const studentScores = { ...prev[studentId] } || {
//           I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           outOf50: 0,
//           outOf20: 0,
//         };

//         // Update the specific question part score
//         studentScores[question] = {
//           ...studentScores[question],
//           [part]: numValue,
//         };

//         // Recalculate the total for this question
//         studentScores[question].total =
//           studentScores[question].a +
//           studentScores[question].b +
//           studentScores[question].c +
//           studentScores[question].d;

//         // Calculate the total out of 50
//         studentScores.outOf50 =
//           studentScores.I.total +
//           studentScores.II.total +
//           studentScores.III.total +
//           studentScores.IV.total +
//           studentScores.V.total;

//         // Convert to outOfX based on course type
//         studentScores.outOf20 = convertCAScore(
//           studentScores.outOf50,
//           courseType,
//           componentName
//         );

//         // Create a new scores object
//         const newScores = { ...prev, [studentId]: studentScores };

//         // Notify parent component
//         onScoresChange(newScores);

//         return newScores;
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error updating score:", err);
//       setError("Failed to update score");
//     }
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">{componentName} Score Entry</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Test Date"
//               value={testDate}
//               onChange={(newDate) => setTestDate(newDate)}
//             />
//           </LocalizationProvider>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <TableContainer
//         component={Paper}
//         sx={{ overflowX: "auto", width: "100%" }}
//       >
//         <Table size="small" sx={{ minWidth: 1200 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>Enrollment No.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>
//               <TableCell>Q.No.</TableCell>
//               <TableCell align="center">a</TableCell>
//               <TableCell align="center">b</TableCell>
//               <TableCell align="center">c</TableCell>
//               <TableCell align="center">d</TableCell>
//               <TableCell align="center">Total</TableCell>
//               <TableCell align="center">Out of 50</TableCell>
//               <TableCell align="center">
//                 Out of {maxMarks} (pass {passingMarks})
//               </TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {students.map((student, studentIndex) => {
//               // Generate rows for each question (I, II, III, IV, V)
//               const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
//                 "I",
//                 "II",
//                 "III",
//                 "IV",
//                 "V",
//               ];

//               return questions.map((questionNo, questionIndex) => {
//                 const studentScore = scores[student._id] || {
//                   I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   outOf50: 0,
//                   outOf20: 0,
//                 };

//                 const scaledScore = studentScore.outOf20;
//                 const isPassing = scaledScore >= passingMarks;

//                 return (
//                   <TableRow key={`${student._id}-${questionNo}`}>
//                     {/* Student information - only shown in the first row for each student */}
//                     {questionIndex === 0 && (
//                       <>
//                         <TableCell rowSpan={5}>{studentIndex + 1}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.academicYear}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.program}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.registrationNumber}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.name}</TableCell>
//                         <TableCell rowSpan={5}>{student.semester}</TableCell>
//                       </>
//                     )}

//                     {/* Question number */}
//                     <TableCell>{questionNo}</TableCell>

//                     {/* Score input cells for each part */}
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].a}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "a",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].b}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "b",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].c}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "c",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].d}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "d",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>

//                     {/* Question total */}
//                     <TableCell align="center">
//                       {studentScore[questionNo].total}
//                     </TableCell>

//                     {/* Total scores - only shown in the last row for each student */}
//                     {questionIndex === 4 && (
//                       <>
//                         <TableCell align="center" rowSpan={5}>
//                           {studentScore.outOf50}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={5}
//                           sx={{
//                             color: isPassing ? "green" : "red",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {scaledScore}
//                         </TableCell>
//                         <TableCell rowSpan={5}>
//                           {numberToWords(scaledScore)}
//                         </TableCell>
//                       </>
//                     )}
//                   </TableRow>
//                 );
//               });
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default CAScoreEntryComponent;

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
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { getComponentScale, convertCAScore } from "../../utils/scoreUtils";

// // Define the Student interface if not already imported
// interface Student {
//   _id: string;
//   registrationNumber: string;
//   name: string;
//   program: string;
//   semester: number;
//   academicYear: string;
// }

// // Define CourseType if not already imported
// type CourseType =
//   | "PG"
//   | "PG-Integrated"
//   | "UG"
//   | "UG-Integrated"
//   | "UG-Lab-Only"
//   | "PG-Lab-Only";

// // Score structure for a single question
// interface QuestionScore {
//   a: number;
//   b: number;
//   c: number;
//   d: number;
//   total: number;
// }

// // Student's complete CA score
// interface StudentCAScore {
//   I: QuestionScore;
//   II: QuestionScore;
//   III: QuestionScore;
//   IV: QuestionScore;
//   V: QuestionScore;
//   outOf50: number;
//   outOf20: number;
// }

// // Complete scores for all students
// interface DetailedScore {
//   [studentId: string]: StudentCAScore;
// }

// interface CAScoreEntryComponentProps {
//   students: Student[];
//   componentName: string;
//   courseType: CourseType;
//   onScoresChange: (scores: DetailedScore) => void;
//   initialScores?: DetailedScore;
// }

// // Convert number to words - digit by digit
// const numberToWords = (num: number): string => {
//   // Safety check
//   if (isNaN(num)) return "ZERO";

//   // Convert the number to a string to handle each digit
//   const numStr = num.toString();
//   const digits = numStr.split("");

//   // Map each digit to its word representation
//   const words = digits.map((digit) => {
//     switch (digit) {
//       case "0":
//         return "ZERO";
//       case "1":
//         return "ONE";
//       case "2":
//         return "TWO";
//       case "3":
//         return "THREE";
//       case "4":
//         return "FOUR";
//       case "5":
//         return "FIVE";
//       case "6":
//         return "SIX";
//       case "7":
//         return "SEVEN";
//       case "8":
//         return "EIGHT";
//       case "9":
//         return "NINE";
//       default:
//         return "";
//     }
//   });

//   // Join with spaces
//   return words.join(" ");
// };

// // Create an empty question score
// const createEmptyQuestionScore = (): QuestionScore => ({
//   a: 0,
//   b: 0,
//   c: 0,
//   d: 0,
//   total: 0,
// });

// // Create an empty student score
// const createEmptyStudentScore = (): StudentCAScore => ({
//   I: createEmptyQuestionScore(),
//   II: createEmptyQuestionScore(),
//   III: createEmptyQuestionScore(),
//   IV: createEmptyQuestionScore(),
//   V: createEmptyQuestionScore(),
//   outOf50: 0,
//   outOf20: 0,
// });

// const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
//   students = [],
//   componentName = "CA1",
//   courseType = "PG",
//   onScoresChange,
//   initialScores = {},
// }) => {
//   const [testDate, setTestDate] = useState<Date | null>(new Date());
//   const [scores, setScores] = useState<DetailedScore>({});
//   const [error, setError] = useState<string | null>(null);

//   // Get scale configuration based on course type
//   const scaleConfig = getComponentScale(courseType, componentName);
//   const maxMarks = scaleConfig.maxMarks;
//   const passingMarks = scaleConfig.passingMarks;

//   // Initialize scores when component mounts or props change
//   useEffect(() => {
//     try {
//       const newScores: DetailedScore = {};

//       // Process initial scores if provided
//       if (initialScores && typeof initialScores === "object") {
//         // Copy initial scores
//         Object.keys(initialScores).forEach((studentId) => {
//           if (studentId) {
//             // Create a default score structure
//             const defaultScore = createEmptyStudentScore();

//             // Copy from initial scores if they exist
//             if (initialScores[studentId]) {
//               // Copy each question
//               ["I", "II", "III", "IV", "V"].forEach((q) => {
//                 const question = q as keyof StudentCAScore;
//                 if (initialScores[studentId][question]) {
//                   defaultScore[question] = {
//                     a: Number(initialScores[studentId][question].a) || 0,
//                     b: Number(initialScores[studentId][question].b) || 0,
//                     c: Number(initialScores[studentId][question].c) || 0,
//                     d: Number(initialScores[studentId][question].d) || 0,
//                     total:
//                       Number(initialScores[studentId][question].total) || 0,
//                   };
//                 }
//               });

//               // Copy total scores
//               defaultScore.outOf50 =
//                 Number(initialScores[studentId].outOf50) || 0;
//               defaultScore.outOf20 =
//                 Number(initialScores[studentId].outOf20) || 0;
//             }

//             newScores[studentId] = defaultScore;
//           }
//         });
//       }

//       // Initialize scores for all students (even if not in initialScores)
//       if (Array.isArray(students)) {
//         students.forEach((student) => {
//           if (student && student._id && !newScores[student._id]) {
//             newScores[student._id] = createEmptyStudentScore();
//           }
//         });
//       }

//       setScores(newScores);
//     } catch (err) {
//       console.error("Error initializing scores:", err);
//       setError("Failed to initialize scores. Please refresh the page.");
//     }
//   }, [students, initialScores]);

//   // Handle score change for a question part
//   const handleScoreChange = (
//     studentId: string,
//     question: keyof StudentCAScore,
//     part: keyof QuestionScore,
//     value: string
//   ) => {
//     if (!studentId || !question || !part) return;

//     try {
//       // Parse and validate input
//       let numValue = parseInt(value);
//       if (isNaN(numValue)) numValue = 0;
//       if (numValue < 0) numValue = 0;

//       setScores((prevScores) => {
//         // Create a deep copy of the previous state
//         const newScores = { ...prevScores };

//         // Ensure the student exists in scores
//         if (!newScores[studentId]) {
//           newScores[studentId] = createEmptyStudentScore();
//         }

//         // Update the specific question part value
//         if (newScores[studentId][question] && typeof part === "string") {
//           newScores[studentId][question] = {
//             ...newScores[studentId][question],
//             [part]: numValue,
//           };

//           // Recalculate the question total
//           newScores[studentId][question].total =
//             Number(newScores[studentId][question].a) +
//             Number(newScores[studentId][question].b) +
//             Number(newScores[studentId][question].c) +
//             Number(newScores[studentId][question].d);

//           // Recalculate outOf50
//           newScores[studentId].outOf50 =
//             Number(newScores[studentId].I.total) +
//             Number(newScores[studentId].II.total) +
//             Number(newScores[studentId].III.total) +
//             Number(newScores[studentId].IV.total) +
//             Number(newScores[studentId].V.total);

//           // Convert to the appropriate scale based on course type
//           newScores[studentId].outOf20 = convertCAScore(
//             newScores[studentId].outOf50,
//             courseType,
//             componentName
//           );
//         }

//         return newScores;
//       });

//       // Clear any previous errors
//       setError(null);
//     } catch (err) {
//       console.error("Error updating score:", err);
//       setError("Failed to update score. Please try again.");
//     }
//   };

//   // Notify parent component when scores change
//   useEffect(() => {
//     if (Object.keys(scores).length > 0) {
//       onScoresChange(scores);
//     }
//   }, [scores, onScoresChange]);

//   // Define question names for rendering
//   const questionNames: (keyof StudentCAScore)[] = ["I", "II", "III", "IV", "V"];

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">{componentName} Score Entry</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Test Date"
//               value={testDate}
//               onChange={(newDate) => setTestDate(newDate)}
//             />
//           </LocalizationProvider>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <TableContainer
//         component={Paper}
//         sx={{ overflowX: "auto", width: "100%" }}
//       >
//         <Table size="small" sx={{ minWidth: 1200 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic_Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>Enrollment No.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>
//               <TableCell>Q.No.</TableCell>
//               <TableCell align="center">a</TableCell>
//               <TableCell align="center">b</TableCell>
//               <TableCell align="center">c</TableCell>
//               <TableCell align="center">d</TableCell>
//               <TableCell align="center">Total</TableCell>
//               <TableCell align="center">Out_of_50</TableCell>
//               <TableCell align="center">
//                 Out_of_{maxMarks} (pass {passingMarks})
//               </TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {Array.isArray(students) &&
//               students.map((student, studentIndex) => {
//                 if (!student || !student._id) return null;

//                 return questionNames.map((questionName, questionIndex) => {
//                   // Get or create student score
//                   const studentScore =
//                     scores[student._id] || createEmptyStudentScore();
//                   const scaledScore = studentScore.outOf20;
//                   const isPassing = scaledScore >= passingMarks;

//                   return (
//                     <TableRow key={`${student._id}-${questionName}`}>
//                       {/* Student information - only shown in the first row for each student */}
//                       {questionIndex === 0 && (
//                         <>
//                           <TableCell rowSpan={5}>{studentIndex + 1}</TableCell>
//                           <TableCell rowSpan={5}>
//                             {student.academicYear || "-"}
//                           </TableCell>
//                           <TableCell rowSpan={5}>
//                             {student.program || "-"}
//                           </TableCell>
//                           <TableCell rowSpan={5}>
//                             {student.registrationNumber || "-"}
//                           </TableCell>
//                           <TableCell rowSpan={5}>
//                             {student.name || "-"}
//                           </TableCell>
//                           <TableCell rowSpan={5}>
//                             {student.semester || "-"}
//                           </TableCell>
//                         </>
//                       )}

//                       {/* Question number */}
//                       <TableCell>{questionName}</TableCell>

//                       {/* Score input cells for parts a, b, c, d */}
//                       {["a", "b", "c", "d"].map((partName) => (
//                         <TableCell
//                           key={`${student._id}-${questionName}-${partName}`}
//                           align="center"
//                         >
//                           <TextField
//                             type="number"
//                             value={
//                               studentScore[questionName][
//                                 partName as keyof QuestionScore
//                               ]
//                             }
//                             onChange={(e) =>
//                               handleScoreChange(
//                                 student._id,
//                                 questionName,
//                                 partName as keyof QuestionScore,
//                                 e.target.value
//                               )
//                             }
//                             inputProps={{
//                               min: 0,
//                               style: { textAlign: "center" },
//                             }}
//                             size="small"
//                             sx={{ width: 60 }}
//                           />
//                         </TableCell>
//                       ))}

//                       {/* Question total */}
//                       <TableCell align="center">
//                         {studentScore[questionName].total}
//                       </TableCell>

//                       {/* Total scores - only shown in the last row for each student */}
//                       {questionIndex === 4 && (
//                         <>
//                           <TableCell align="center" rowSpan={5}>
//                             {studentScore.outOf50}
//                           </TableCell>
//                           <TableCell
//                             align="center"
//                             rowSpan={5}
//                             sx={{
//                               color: isPassing ? "success.main" : "error.main",
//                               fontWeight: "bold",
//                             }}
//                           >
//                             {scaledScore}
//                           </TableCell>
//                           <TableCell rowSpan={5}>
//                             {numberToWords(scaledScore)}
//                           </TableCell>
//                         </>
//                       )}
//                     </TableRow>
//                   );
//                 });
//               })}

//             {(!Array.isArray(students) || students.length === 0) && (
//               <TableRow>
//                 <TableCell colSpan={15} align="center">
//                   No students found for this course
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default CAScoreEntryComponent;

// // CAScoreEntryComponent.tsx
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
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Student } from "../../types";
// import { CourseType } from "../../types";
// import { getComponentScale, convertCAScore } from "../../utils/scoreUtils";

// // Convert number to words function
// const numberToWords = (num: number): string => {
//   // Convert the number to a string to handle each digit
//   const numStr = num.toString();
//   const digits = numStr.split("");

//   // Map each digit to its word representation
//   const words = digits.map((digit) => {
//     switch (digit) {
//       case "0":
//         return "ZERO";
//       case "1":
//         return "ONE";
//       case "2":
//         return "TWO";
//       case "3":
//         return "THREE";
//       case "4":
//         return "FOUR";
//       case "5":
//         return "FIVE";
//       case "6":
//         return "SIX";
//       case "7":
//         return "SEVEN";
//       case "8":
//         return "EIGHT";
//       case "9":
//         return "NINE";
//       default:
//         return "";
//     }
//   });

//   // Join with spaces
//   return words.join(" ");
// };

// // Define the structure for each question
// interface QuestionScore {
//   a: number;
//   b: number;
//   c: number;
//   d: number;
//   total: number;
// }

// // Define the structure for student scores
// interface StudentScore {
//   I: QuestionScore;
//   II: QuestionScore;
//   III: QuestionScore;
//   IV: QuestionScore;
//   V: QuestionScore;
//   outOf50: number;
//   outOf20: number;
// }

// // Define the overall scores interface
// interface DetailedScore {
//   [studentId: string]: StudentScore;
// }

// interface CAScoreEntryComponentProps {
//   students: Student[];
//   componentName: string; // e.g., "CA1", "CA2", "CA3"
//   courseType: CourseType;
//   onScoresChange: (scores: DetailedScore) => void;
//   initialScores?: DetailedScore;
// }

// const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   courseType,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   const [testDate, setTestDate] = useState<Date | null>(new Date());
//   const [scores, setScores] = useState<DetailedScore>({});
//   const [error, setError] = useState<string | null>(null);

//   // Get scale configuration based on course type
//   const scaleConfig = getComponentScale(courseType, componentName);
//   const maxMarks = scaleConfig.maxMarks;
//   const passingMarks = scaleConfig.passingMarks;

//   // Create a default question structure
//   const defaultQuestion: QuestionScore = {
//     a: 0,
//     b: 0,
//     c: 0,
//     d: 0,
//     total: 0,
//   };

//   // Create a default student score structure
//   const createDefaultStudentScore = (): StudentScore => ({
//     I: { ...defaultQuestion },
//     II: { ...defaultQuestion },
//     III: { ...defaultQuestion },
//     IV: { ...defaultQuestion },
//     V: { ...defaultQuestion },
//     outOf50: 0,
//     outOf20: 0,
//   });

//   // Initialize student scores
//   useEffect(() => {
//     try {
//       const newScores: DetailedScore = {};

//       // Iterate through students and create a score entry for each
//       (students || []).forEach((student) => {
//         if (student && student._id) {
//           // If we have initial scores for this student, use them
//           if (initialScores && initialScores[student._id]) {
//             const initialStudentScore = initialScores[student._id];

//             // Create a safe copy with default values for missing properties
//             newScores[student._id] = {
//               I: initialStudentScore.I || { ...defaultQuestion },
//               II: initialStudentScore.II || { ...defaultQuestion },
//               III: initialStudentScore.III || { ...defaultQuestion },
//               IV: initialStudentScore.IV || { ...defaultQuestion },
//               V: initialStudentScore.V || { ...defaultQuestion },
//               outOf50: initialStudentScore.outOf50 || 0,
//               outOf20: initialStudentScore.outOf20 || 0,
//             };
//           } else {
//             // Otherwise create a new default entry
//             newScores[student._id] = createDefaultStudentScore();
//           }
//         }
//       });

//       setScores(newScores);

//       // Notify parent component of the scores
//       onScoresChange(newScores);
//     } catch (err) {
//       console.error("Error initializing scores:", err);
//       setError("Failed to initialize scores");
//     }
//   }, [students, initialScores]);

//   // Handle score change for a specific question part
//   const handleScoreChange = (
//     studentId: string,
//     question: "I" | "II" | "III" | "IV" | "V",
//     part: "a" | "b" | "c" | "d",
//     value: number
//   ) => {
//     try {
//       // Validate input
//       if (!studentId) {
//         console.error("Missing studentId in handleScoreChange");
//         return;
//       }

//       // Validate input value
//       let numValue = Number(value);
//       if (isNaN(numValue)) {
//         numValue = 0;
//       }

//       // Ensure non-negative
//       numValue = Math.max(0, numValue);

//       setScores((prev) => {
//         // Create a deep copy of the current scores
//         const newScores = { ...prev };

//         // Ensure we have an entry for this student
//         if (!newScores[studentId]) {
//           newScores[studentId] = createDefaultStudentScore();
//         }

//         // Ensure we have an entry for this question
//         if (!newScores[studentId][question]) {
//           newScores[studentId][question] = { ...defaultQuestion };
//         }

//         // Update the specific part value
//         newScores[studentId][question] = {
//           ...newScores[studentId][question],
//           [part]: numValue,
//         };

//         // Calculate the total for this question
//         const questionTotal =
//           (newScores[studentId][question].a || 0) +
//           (newScores[studentId][question].b || 0) +
//           (newScores[studentId][question].c || 0) +
//           (newScores[studentId][question].d || 0);

//         newScores[studentId][question].total = questionTotal;

//         // Calculate outOf50 total
//         const outOf50 =
//           (newScores[studentId].I?.total || 0) +
//           (newScores[studentId].II?.total || 0) +
//           (newScores[studentId].III?.total || 0) +
//           (newScores[studentId].IV?.total || 0) +
//           (newScores[studentId].V?.total || 0);

//         newScores[studentId].outOf50 = outOf50;

//         // Calculate outOf20 based on course type
//         newScores[studentId].outOf20 = convertCAScore(
//           outOf50,
//           courseType,
//           componentName
//         );

//         // Notify parent component
//         onScoresChange(newScores);

//         return newScores;
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error updating score:", err);
//       setError("Failed to update score");
//     }
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">{componentName} Score Entry</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Test Date"
//               value={testDate}
//               onChange={(newDate) => setTestDate(newDate)}
//             />
//           </LocalizationProvider>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <TableContainer
//         component={Paper}
//         sx={{ overflowX: "auto", width: "100%" }}
//       >
//         <Table size="small" sx={{ minWidth: 1200 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic_Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>Enrollment No.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>
//               <TableCell>Q.No.</TableCell>
//               <TableCell align="center">a</TableCell>
//               <TableCell align="center">b</TableCell>
//               <TableCell align="center">c</TableCell>
//               <TableCell align="center">d</TableCell>
//               <TableCell align="center">Total</TableCell>
//               <TableCell align="center">Out_of_50</TableCell>
//               <TableCell align="center">
//                 Out_of_{maxMarks} (pass {passingMarks})
//               </TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(students || []).map((student, studentIndex) => {
//               if (!student || !student._id) {
//                 return null;
//               }

//               // Generate rows for each question (I, II, III, IV, V)
//               const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
//                 "I",
//                 "II",
//                 "III",
//                 "IV",
//                 "V",
//               ];

//               return questions.map((questionNo, questionIndex) => {
//                 // Get the student's scores, using a default if not available
//                 const studentScore =
//                   scores[student._id] || createDefaultStudentScore();

//                 // Get the scaled score for the student
//                 const scaledScore = studentScore.outOf20 || 0;
//                 const isPassing = scaledScore >= passingMarks;

//                 // Safe access to question data
//                 const questionData = studentScore[questionNo] || {
//                   ...defaultQuestion,
//                 };

//                 return (
//                   <TableRow key={`${student._id}-${questionNo}`}>
//                     {/* Student information - only shown in the first row for each student */}
//                     {questionIndex === 0 && (
//                       <>
//                         <TableCell rowSpan={5}>{studentIndex + 1}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.academicYear}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.program}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.registrationNumber}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.name}</TableCell>
//                         <TableCell rowSpan={5}>{student.semester}</TableCell>
//                       </>
//                     )}

//                     {/* Question number */}
//                     <TableCell>{questionNo}</TableCell>

//                     {/* Score input cells for each part */}
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={questionData.a || 0}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "a",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={questionData.b || 0}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "b",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={questionData.c || 0}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "c",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={questionData.d || 0}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "d",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>

//                     {/* Question total */}
//                     <TableCell align="center">
//                       {questionData.total || 0}
//                     </TableCell>

//                     {/* Total scores - only shown in the last row for each student */}
//                     {questionIndex === 4 && (
//                       <>
//                         <TableCell align="center" rowSpan={5}>
//                           {studentScore.outOf50 || 0}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={5}
//                           sx={{
//                             color: isPassing ? "success.main" : "error.main",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {scaledScore}
//                         </TableCell>
//                         <TableCell rowSpan={5}>
//                           {numberToWords(scaledScore)}
//                         </TableCell>
//                       </>
//                     )}
//                   </TableRow>
//                 );
//               });
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default CAScoreEntryComponent;

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
//   FormControl,
//   InputLabel,
//   Alert,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Student } from "../../types";
// import { CourseType } from "../../types";
// import { getComponentScale, convertCAScore } from "../../utils/scoreUtils";

// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number; // Keep the original name for compatibility
//   };
// }

// interface CAScoreEntryComponentProps {
//   students: Student[];
//   componentName: string; // e.g., "CA1", "CA2", "CA3"
//   courseType: CourseType; // Add course type to props
//   onScoresChange: (scores: DetailedScore) => void;
//   initialScores?: DetailedScore;
// }

// // Convert number to words function
// const numberToWords = (num: number): string => {
//   // Convert the number to a string to handle each digit
//   const numStr = num.toString();
//   const digits = numStr.split("");

//   // Map each digit to its word representation
//   const words = digits.map((digit) => {
//     switch (digit) {
//       case "0":
//         return "ZERO";
//       case "1":
//         return "ONE";
//       case "2":
//         return "TWO";
//       case "3":
//         return "THREE";
//       case "4":
//         return "FOUR";
//       case "5":
//         return "FIVE";
//       case "6":
//         return "SIX";
//       case "7":
//         return "SEVEN";
//       case "8":
//         return "EIGHT";
//       case "9":
//         return "NINE";
//       default:
//         return "";
//     }
//   });

//   // Join with spaces
//   return words.join(" ");
// };

// const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   courseType,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   const [testDate, setTestDate] = useState<Date | null>(new Date());
//   const [scores, setScores] = useState<DetailedScore>(initialScores);
//   const [error, setError] = useState<string | null>(null);

//   // Get scale configuration based on course type
//   const scaleConfig = getComponentScale(courseType, componentName);
//   const maxMarks = scaleConfig.maxMarks;
//   const passingMarks = scaleConfig.passingMarks;
//   const conversionFactor = scaleConfig.conversionFactor || 0.4; // Default to 0.4 if not specified

//   // Initialize student scores if none provided
//   useEffect(() => {
//     if (initialScores && Object.keys(initialScores).length > 0) {
//       // Ensure initialScores has the right structure
//       const formattedScores: DetailedScore = {};

//       Object.keys(initialScores).forEach((studentId) => {
//         const studentScore = initialScores[studentId];
//         formattedScores[studentId] = {
//           I: studentScore.I || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           II: studentScore.II || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           III: studentScore.III || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           IV: studentScore.IV || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           V: studentScore.V || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           outOf50: studentScore.outOf50 || 0,
//           outOf20: studentScore.outOf20 || 0,
//         };
//       });

//       setScores(formattedScores);
//     } else {
//       const newScores: DetailedScore = {};

//       (students || []).forEach((student) => {
//         if (student && student._id) {
//           newScores[student._id] = {
//             I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             outOf50: 0,
//             outOf20: 0,
//           };
//         }
//       });

//       setScores(newScores);
//     }
//   }, [students, initialScores]);

//   // Handle score change for a specific question part
//   const handleScoreChange = (
//     studentId: string,
//     question: "I" | "II" | "III" | "IV" | "V",
//     part: "a" | "b" | "c" | "d",
//     value: number
//   ) => {
//     if (!studentId) {
//       console.error("Missing studentId in handleScoreChange");
//       return;
//     }
//     try {
//       // Validate input value
//       const numValue = Number(value);

//       if (isNaN(numValue) || numValue < 0) {
//         setError("Please enter a valid positive number");
//         return;
//       }

//       // No upper limit validation - faculty can enter any positive value

//       setScores((prev) => {
//         // Make deep copies to avoid mutation issues
//         const studentScores = { ...prev[studentId] } || {
//           I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           outOf50: 0,
//           outOf20: 0,
//         };

//         // Update the specific question part score
//         studentScores[question] = {
//           ...studentScores[question],
//           [part]: numValue,
//         };

//         // Recalculate the total for this question
//         studentScores[question].total =
//           studentScores[question].a +
//           studentScores[question].b +
//           studentScores[question].c +
//           studentScores[question].d;

//         // Calculate the total out of 50
//         studentScores.outOf50 =
//           studentScores.I.total +
//           studentScores.II.total +
//           studentScores.III.total +
//           studentScores.IV.total +
//           studentScores.V.total;

//         // Convert to outOf20 based on course type
//         studentScores.outOf20 = convertCAScore(
//           studentScores.outOf50,
//           courseType,
//           componentName
//         );

//         // Create a new scores object
//         const newScores = { ...prev, [studentId]: studentScores };

//         // Notify parent component
//         onScoresChange(newScores);

//         return newScores;
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error updating score:", err);
//       setError("Failed to update score");
//     }
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">{componentName} Score Entry</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Test Date"
//               value={testDate}
//               onChange={(newDate) => setTestDate(newDate)}
//             />
//           </LocalizationProvider>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <TableContainer
//         component={Paper}
//         sx={{ overflowX: "auto", width: "100%" }}
//       >
//         <Table size="small" sx={{ minWidth: 1200 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic_Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>Enrollment No.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>
//               <TableCell>Q.No.</TableCell>
//               <TableCell align="center">a</TableCell>
//               <TableCell align="center">b</TableCell>
//               <TableCell align="center">c</TableCell>
//               <TableCell align="center">d</TableCell>
//               <TableCell align="center">Total</TableCell>
//               <TableCell align="center">Out_of_50</TableCell>
//               <TableCell align="center">
//                 Out_of_{maxMarks} (pass {passingMarks})
//               </TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(students || []).map((student, studentIndex) => {
//               if (!student || !student._id) {
//                 return null;
//               }

//               // Generate rows for each question (I, II, III, IV, V)
//               const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
//                 "I",
//                 "II",
//                 "III",
//                 "IV",
//                 "V",
//               ];

//               return questions.map((questionNo, questionIndex) => {
//                 const studentScore = scores[student._id] || {
//                   I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   outOf50: 0,
//                   outOfX: 0,
//                 };

//                 const scaledScore = studentScore.outOf20;
//                 const isPassing = scaledScore >= passingMarks;

//                 return (
//                   <TableRow key={`${student._id}-${questionNo}`}>
//                     {/* Student information - only shown in the first row for each student */}
//                     {questionIndex === 0 && (
//                       <>
//                         <TableCell rowSpan={5}>{studentIndex + 1}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.academicYear}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.program}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.registrationNumber}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.name}</TableCell>
//                         <TableCell rowSpan={5}>{student.semester}</TableCell>
//                       </>
//                     )}

//                     {/* Question number */}
//                     <TableCell>{questionNo}</TableCell>

//                     {/* Score input cells for each part */}
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].a}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "a",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].b}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "b",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].c}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "c",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].d}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "d",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>

//                     {/* Question total */}
//                     <TableCell align="center">
//                       {studentScore[questionNo].total}
//                     </TableCell>

//                     {/* Total scores - only shown in the last row for each student */}
//                     {questionIndex === 4 && (
//                       <>
//                         <TableCell align="center" rowSpan={5}>
//                           {studentScore.outOf50}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={5}
//                           sx={{
//                             color: isPassing ? "success.main" : "error.main",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {scaledScore}
//                         </TableCell>
//                         <TableCell rowSpan={5}>
//                           {numberToWords(scaledScore)}
//                         </TableCell>
//                       </>
//                     )}
//                   </TableRow>
//                 );
//               });
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default CAScoreEntryComponent;

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
//   FormControl,
//   InputLabel,
//   Alert,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { Student } from "../../types";
// import { CourseType } from "../../types";
// import { getComponentScale, convertCAScore } from "../../utils/scoreUtils";

// interface DetailedScore {
//   [studentId: string]: {
//     I: { a: number; b: number; c: number; d: number; total: number };
//     II: { a: number; b: number; c: number; d: number; total: number };
//     III: { a: number; b: number; c: number; d: number; total: number };
//     IV: { a: number; b: number; c: number; d: number; total: number };
//     V: { a: number; b: number; c: number; d: number; total: number };
//     outOf50: number;
//     outOf20: number; // Keep the original name for compatibility
//   };
// }

// interface CAScoreEntryComponentProps {
//   students: Student[];
//   componentName: string; // e.g., "CA1", "CA2", "CA3"
//   courseType: CourseType; // Add course type to props
//   onScoresChange: (scores: DetailedScore) => void;
//   initialScores?: DetailedScore;
// }

// // Convert number to words function
// const numberToWords = (num: number): string => {
//   // Convert the number to a string to handle each digit
//   const numStr = num.toString();
//   const digits = numStr.split("");

//   // Map each digit to its word representation
//   const words = digits.map((digit) => {
//     switch (digit) {
//       case "0":
//         return "ZERO";
//       case "1":
//         return "ONE";
//       case "2":
//         return "TWO";
//       case "3":
//         return "THREE";
//       case "4":
//         return "FOUR";
//       case "5":
//         return "FIVE";
//       case "6":
//         return "SIX";
//       case "7":
//         return "SEVEN";
//       case "8":
//         return "EIGHT";
//       case "9":
//         return "NINE";
//       default:
//         return "";
//     }
//   });

//   // Join with spaces
//   return words.join(" ");
// };

// const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = ({
//   students,
//   componentName,
//   courseType,
//   onScoresChange,
//   initialScores = {},
// }) => {
//   const [testDate, setTestDate] = useState<Date | null>(new Date());
//   const [scores, setScores] = useState<DetailedScore>(initialScores);
//   const [error, setError] = useState<string | null>(null);

//   // Get scale configuration based on course type
//   const scaleConfig = getComponentScale(courseType, componentName);
//   const maxMarks = scaleConfig.maxMarks;
//   const passingMarks = scaleConfig.passingMarks;
//   const conversionFactor = scaleConfig.conversionFactor || 0.4; // Default to 0.4 if not specified

//   // Initialize student scores if none provided
//   useEffect(() => {
//     if (initialScores && Object.keys(initialScores).length > 0) {
//       // Ensure initialScores has the right structure
//       const formattedScores: DetailedScore = {};

//       Object.keys(initialScores).forEach((studentId) => {
//         const studentScore = initialScores[studentId];
//         formattedScores[studentId] = {
//           I: studentScore.I || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           II: studentScore.II || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           III: studentScore.III || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           IV: studentScore.IV || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           V: studentScore.V || { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           outOf50: studentScore.outOf50 || 0,
//           outOf20: studentScore.outOf20 || 0,
//         };
//       });

//       setScores(formattedScores);
//     } else {
//       const newScores: DetailedScore = {};

//       (students || []).forEach((student) => {
//         if (student && student._id) {
//           newScores[student._id] = {
//             I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//             outOf50: 0,
//             outOf20: 0,
//           };
//         }
//       });

//       setScores(newScores);
//     }
//   }, [students, initialScores]);

//   // Handle score change for a specific question part
//   const handleScoreChange = (
//     studentId: string,
//     question: "I" | "II" | "III" | "IV" | "V",
//     part: "a" | "b" | "c" | "d",
//     value: number
//   ) => {
//     if (!studentId) {
//       console.error("Missing studentId in handleScoreChange");
//       return;
//     }
//     try {
//       // Validate input value
//       const numValue = Number(value);

//       if (isNaN(numValue) || numValue < 0) {
//         setError("Please enter a valid positive number");
//         return;
//       }

//       // No upper limit validation - faculty can enter any positive value

//       setScores((prev) => {
//         // Make deep copies to avoid mutation issues
//         const studentScores = { ...prev[studentId] } || {
//           I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//           outOf50: 0,
//           outOf20: 0,
//         };

//         // Update the specific question part score
//         studentScores[question] = {
//           ...studentScores[question],
//           [part]: numValue,
//         };

//         // Recalculate the total for this question
//         studentScores[question].total =
//           studentScores[question].a +
//           studentScores[question].b +
//           studentScores[question].c +
//           studentScores[question].d;

//         // Calculate the total out of 50
//         studentScores.outOf50 =
//           studentScores.I.total +
//           studentScores.II.total +
//           studentScores.III.total +
//           studentScores.IV.total +
//           studentScores.V.total;

//         // Convert to outOf20 based on course type
//         studentScores.outOf20 = convertCAScore(
//           studentScores.outOf50,
//           courseType,
//           componentName
//         );

//         // Create a new scores object
//         const newScores = { ...prev, [studentId]: studentScores };

//         // Notify parent component
//         onScoresChange(newScores);

//         return newScores;
//       });

//       setError(null);
//     } catch (err) {
//       console.error("Error updating score:", err);
//       setError("Failed to update score");
//     }
//   };

//   return (
//     <Box sx={{ width: "100%" }}>
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h6">{componentName} Score Entry</Typography>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Test Date"
//               value={testDate}
//               onChange={(newDate) => setTestDate(newDate)}
//             />
//           </LocalizationProvider>
//         </Grid>
//       </Grid>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       )}

//       <TableContainer
//         component={Paper}
//         sx={{ overflowX: "auto", width: "100%" }}
//       >
//         <Table size="small" sx={{ minWidth: 1200 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell>SNo.</TableCell>
//               <TableCell>Academic_Year</TableCell>
//               <TableCell>Program</TableCell>
//               <TableCell>Enrollment No.</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Semester</TableCell>
//               <TableCell>Q.No.</TableCell>
//               <TableCell align="center">a</TableCell>
//               <TableCell align="center">b</TableCell>
//               <TableCell align="center">c</TableCell>
//               <TableCell align="center">d</TableCell>
//               <TableCell align="center">Total</TableCell>
//               <TableCell align="center">Out_of_50</TableCell>
//               <TableCell align="center">
//                 Out_of_{maxMarks} (pass {passingMarks})
//               </TableCell>
//               <TableCell>Marks in Words</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {(students || []).map((student, studentIndex) => {
//               if (!student || !student._id) {
//                 return null;
//               }

//               // Generate rows for each question (I, II, III, IV, V)
//               const questions: ("I" | "II" | "III" | "IV" | "V")[] = [
//                 "I",
//                 "II",
//                 "III",
//                 "IV",
//                 "V",
//               ];

//               return questions.map((questionNo, questionIndex) => {
//                 const studentScore = scores[student._id] || {
//                   I: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   II: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   III: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   IV: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   V: { a: 0, b: 0, c: 0, d: 0, total: 0 },
//                   outOf50: 0,
//                   outOfX: 0,
//                 };

//                 const scaledScore = studentScore.outOf20;
//                 const isPassing = scaledScore >= passingMarks;

//                 return (
//                   <TableRow key={`${student._id}-${questionNo}`}>
//                     {/* Student information - only shown in the first row for each student */}
//                     {questionIndex === 0 && (
//                       <>
//                         <TableCell rowSpan={5}>{studentIndex + 1}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.academicYear}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.program}</TableCell>
//                         <TableCell rowSpan={5}>
//                           {student.registrationNumber}
//                         </TableCell>
//                         <TableCell rowSpan={5}>{student.name}</TableCell>
//                         <TableCell rowSpan={5}>{student.semester}</TableCell>
//                       </>
//                     )}

//                     {/* Question number */}
//                     <TableCell>{questionNo}</TableCell>

//                     {/* Score input cells for each part */}
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].a}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "a",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].b}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "b",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].c}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "c",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>
//                     <TableCell align="center">
//                       <TextField
//                         type="number"
//                         value={studentScore[questionNo].d}
//                         onChange={(e) =>
//                           handleScoreChange(
//                             student._id,
//                             questionNo,
//                             "d",
//                             Number(e.target.value)
//                           )
//                         }
//                         inputProps={{
//                           min: 0,
//                           style: { textAlign: "center" },
//                         }}
//                         size="small"
//                         sx={{ width: 60 }}
//                       />
//                     </TableCell>

//                     {/* Question total */}
//                     <TableCell align="center">
//                       {studentScore[questionNo].total}
//                     </TableCell>

//                     {/* Total scores - only shown in the last row for each student */}
//                     {questionIndex === 4 && (
//                       <>
//                         <TableCell align="center" rowSpan={5}>
//                           {studentScore.outOf50}
//                         </TableCell>
//                         <TableCell
//                           align="center"
//                           rowSpan={5}
//                           sx={{
//                             color: isPassing ? "success.main" : "error.main",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {scaledScore}
//                         </TableCell>
//                         <TableCell rowSpan={5}>
//                           {numberToWords(scaledScore)}
//                         </TableCell>
//                       </>
//                     )}
//                   </TableRow>
//                 );
//               });
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
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getComponentScale, convertCAScore } from "../../utils/scoreUtils";
import ErrorBoundary from "./ErrorBoundary";

// Define types clearly
export interface Student {
  _id: string;
  registrationNumber: string;
  name: string;
  program: string;
  semester: number;
  academicYear: string;
}

export type CourseType =
  | "PG"
  | "PG-Integrated"
  | "UG"
  | "UG-Integrated"
  | "UG-Lab-Only"
  | "PG-Lab-Only";

interface QuestionScore {
  a: number;
  b: number;
  c: number;
  d: number;
  total: number;
}

interface StudentScore {
  I: QuestionScore;
  II: QuestionScore;
  III: QuestionScore;
  IV: QuestionScore;
  V: QuestionScore;
  outOf50: number;
  outOf20: number;
}

interface DetailedScore {
  [studentId: string]: StudentScore;
}

interface CAScoreEntryComponentProps {
  students: Student[];
  componentName: string; // e.g., "CA1", "CA2", "CA3"
  courseType: CourseType;
  onScoresChange: (scores: DetailedScore) => void;
  initialScores?: DetailedScore;
}

// Create a default question score object
const createDefaultQuestionScore = (): QuestionScore => ({
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  total: 0,
});

// Create a default student score object
const createDefaultStudentScore = (): StudentScore => ({
  I: createDefaultQuestionScore(),
  II: createDefaultQuestionScore(),
  III: createDefaultQuestionScore(),
  IV: createDefaultQuestionScore(),
  V: createDefaultQuestionScore(),
  outOf50: 0,
  outOf20: 0,
});

// Convert number to words (digit by digit)
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

// Main component wrapped in error boundary
const CAScoreEntryComponent: React.FC<CAScoreEntryComponentProps> = (props) => {
  return (
    <ErrorBoundary>
      <CAScoreEntryComponentInner {...props} />
    </ErrorBoundary>
  );
};

// Inner component with all the logic
const CAScoreEntryComponentInner: React.FC<CAScoreEntryComponentProps> = ({
  students = [],
  componentName = "CA1",
  courseType = "PG",
  onScoresChange = () => {},
  initialScores = {},
}) => {
  // Debugging log
  console.log("CAScoreEntryComponent rendering with:", {
    studentCount: students.length,
    componentName,
    courseType,
    hasInitialScores: Object.keys(initialScores || {}).length > 0,
  });

  const [testDate, setTestDate] = useState<Date | null>(new Date());
  const [scores, setScores] = useState<DetailedScore>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get scale configuration based on course type
  const scaleConfig = getComponentScale(courseType, componentName);
  const maxMarks = scaleConfig.maxMarks;
  const passingMarks = scaleConfig.passingMarks;

  // Initialize student scores
  useEffect(() => {
    console.log("Initializing scores...");
    setLoading(true);
    try {
      // Create a new scores object
      const newScores: DetailedScore = {};

      // Process each student
      students.forEach((student) => {
        if (!student || !student._id) {
          console.warn("Student missing or has no ID");
          return;
        }

        // Get existing score or create default
        const existingScore = initialScores && initialScores[student._id];

        // Create a new student score with defaults
        const studentScore = createDefaultStudentScore();

        // If we have initial scores, copy them over
        if (existingScore) {
          // Copy question scores
          ["I", "II", "III", "IV", "V"].forEach((q) => {
            const questionKey = q as keyof StudentScore;
            if (existingScore[questionKey]) {
              studentScore[questionKey] = { ...existingScore[questionKey] };
            }
          });

          // Copy totals
          studentScore.outOf50 = existingScore.outOf50 || 0;
          studentScore.outOf20 = existingScore.outOf20 || 0;
        }

        // Add to scores object
        newScores[student._id] = studentScore;
      });

      // Update scores state
      setScores(newScores);

      // Notify parent component
      onScoresChange(newScores);
    } catch (err) {
      console.error("Error initializing scores:", err);
      setError("Failed to initialize scores");
    } finally {
      setLoading(false);
    }
  }, [students, initialScores]);

  // Handle score change for a question part
  const handleScoreChange = (
    studentId: string,
    question: keyof StudentScore,
    part: keyof QuestionScore,
    value: number
  ) => {
    try {
      if (!studentId) {
        console.error("Student ID is missing");
        return;
      }

      // Parse value as number and ensure it's not negative
      const numValue = Math.max(0, Number(value) || 0);

      setScores((prevScores) => {
        // Create a deep copy of the previous scores
        const newScores = { ...prevScores };

        // Ensure student exists in scores
        if (!newScores[studentId]) {
          newScores[studentId] = createDefaultStudentScore();
        }

        // Update the specific question part score
        if (question !== "outOf50" && question !== "outOf20") {
          // Ensure question exists
          if (!newScores[studentId][question]) {
            newScores[studentId][question] = createDefaultQuestionScore();
          }

          // Update part score
          newScores[studentId][question][part] = numValue;

          // Recalculate question total
          newScores[studentId][question].total =
            newScores[studentId][question].a +
            newScores[studentId][question].b +
            newScores[studentId][question].c +
            newScores[studentId][question].d;

          // Recalculate outOf50
          newScores[studentId].outOf50 =
            newScores[studentId].I.total +
            newScores[studentId].II.total +
            newScores[studentId].III.total +
            newScores[studentId].IV.total +
            newScores[studentId].V.total;

          // Convert to appropriate scale based on course type
          newScores[studentId].outOf20 = convertCAScore(
            newScores[studentId].outOf50,
            courseType,
            componentName
          );
        }

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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render component
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
              <TableCell>Academic_Year</TableCell>
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
              <TableCell align="center">Out_of_50</TableCell>
              <TableCell align="center">
                Out_of_{maxMarks} (pass {passingMarks})
              </TableCell>
              <TableCell>Marks in Words</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, studentIndex) => {
              if (!student || !student._id) {
                return null;
              }

              // Define questions array
              const questionRows: Array<keyof StudentScore> = [
                "I",
                "II",
                "III",
                "IV",
                "V",
              ];

              // Get student score or use default
              const studentScore =
                scores[student._id] || createDefaultStudentScore();

              // Get scaled score and determine if passing
              const scaledScore = studentScore.outOf20;
              const isPassing = scaledScore >= passingMarks;

              return questionRows.map((questionNo, questionIndex) => {
                if (questionNo === "outOf50" || questionNo === "outOf20") {
                  return null;
                }

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
                    {["a", "b", "c", "d"].map((part) => (
                      <TableCell
                        key={`${student._id}-${questionNo}-${part}`}
                        align="center"
                      >
                        <TextField
                          type="number"
                          value={
                            studentScore[questionNo][
                              part as keyof QuestionScore
                            ]
                          }
                          onChange={(e) =>
                            handleScoreChange(
                              student._id,
                              questionNo,
                              part as keyof QuestionScore,
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
                    ))}

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
                            color: isPassing ? "success.main" : "error.main",
                            fontWeight: "bold",
                          }}
                        >
                          {scaledScore}
                        </TableCell>
                        <TableCell rowSpan={5}>
                          {numberToWords(scaledScore)}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              });
            })}

            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={15} align="center">
                  No students available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CAScoreEntryComponent;
